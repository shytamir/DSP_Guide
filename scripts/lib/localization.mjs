import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { parse, serialize, serializeOuter } from "parse5";
import { sha256, readJson, qualifiedName, nativeBase } from "./terminology.mjs";

export { parse, serialize };
export const walk = (node) => [node, ...(node.childNodes || []).flatMap(walk)];
export const attr = (node, name) =>
  node?.attrs?.find((a) => a.name === name)?.value;
export const setAttr = (node, name, value) => {
  const old = node.attrs.find((a) => a.name === name);
  if (old) old.value = value;
  else node.attrs.push({ name, value });
};
export const text = (node) =>
  node.nodeName === "#text"
    ? node.value
    : (node.childNodes || []).map(text).join("");
export const normalize = (value) => value.replace(/\s+/g, " ").trim();
const numberPattern =
  /\d+(?:[,.]\d+)*(?:[–−-]\d+(?:[,.]\d+)*)?(?:\s*(?:%|°|MW|GW|kW|MJ|GJ|kJ|m\/s|\/min|\/s|rpm|AU|ly))?|\/min\b|\/s\b|\b(?:MW|GW|kW|MJ|GJ|kJ|rpm|AU|ly|Mk\.(?:III|II|I))\b|[≥≤×→←°%]/g;
const quantityPattern =
  /^\d+(?:,\d{3})*(?:\.\d+)?(?:[–−-]\d+(?:,\d{3})*(?:\.\d+)?)?(?:\s*(?:%|°|MW|GW|kW|MJ|GJ|kJ|m\/s|\/min|\/s|rpm|AU|ly))?$/;
const swapSeparators = (value) =>
  value.replace(/[.,]/g, (separator) => (separator === "." ? "," : "."));
const designations = { de: { "Mk.I": "Typ I" } };

export function factDisplay(value, locale) {
  if (designations[locale]?.[value]) return designations[locale][value];
  return locale === "de" && quantityPattern.test(value)
    ? swapSeparators(value)
    : value;
}

export function checkFactDisplay(source, displayed, locale) {
  const designation = designations[locale]?.[source];
  if (designation) {
    assert.equal(displayed, designation, "Rendered fact designation differs");
    return;
  }
  // Reverse only a source-classified quantity, never names, ranks or URLs.
  const canonical =
    locale === "de" && quantityPattern.test(source)
      ? swapSeparators(displayed)
      : displayed;
  assert.equal(
    canonical,
    source,
    "Rendered fact value, precision or unit differs",
  );
}

const clone = (node) => {
  const copy = { ...node, attrs: node.attrs?.map((a) => ({ ...a })) };
  delete copy.parentNode;
  delete copy.sourceCodeLocation;
  copy.childNodes = (node.childNodes || []).map(clone);
  for (const child of copy.childNodes) child.parentNode = copy;
  return copy;
};
const txt = (value) => ({ nodeName: "#text", value });

export function message(node, attribute) {
  const id = attribute
    ? `${attr(node, "data-i18n-attrs")}.${attribute}`
    : attr(node, "data-i18n");
  const objects = {};
  const counts = {};
  const token = (kind, object) => {
    const key = `${kind}_${(counts[kind] = (counts[kind] || 0) + 1)}`;
    objects[key] = object;
    return `{{${key}}}`;
  };
  const plain = (value) =>
    value
      .replace(/\s+/g, " ")
      .replace(numberPattern, (value) =>
        token("fact", { kind: "fact", value }),
      );
  const visit = (child) => {
    if (child.nodeName === "#text") return plain(child.value);
    if (!child.tagName) return "";
    const item = attr(child, "data-item-id");
    const tech = attr(child, "data-tech-id");
    if (item || tech)
      return token(`${item ? "item" : "tech"}_${item || tech}`, {
        kind: "term",
        term: `${item ? "item" : "tech"}:${item || tech}`,
        ...(tech ? { rankInside: /\bLv\d+\b/.test(text(child)) } : {}),
        node: child,
      });
    if (child.tagName === "kbd")
      return token("key", { kind: "node", node: child });
    if (!(child.childNodes || []).length)
      return token(child.tagName, { kind: "node", node: child });
    const open = token(child.tagName, { kind: "open", node: child });
    const key = open.slice(2, -2);
    objects[`end_${key}`] = { kind: "close", open: key };
    return `${open}${child.childNodes.map(visit).join("")}{{end_${key}}}`;
  };
  const source = normalize(
    attribute
      ? plain(attr(node, attribute))
      : node.childNodes.map(visit).join(""),
  );
  const descriptors = Object.fromEntries(
    Object.entries(objects).map(([key, object]) => [
      key,
      {
        ...object,
        ...(object.node
          ? {
              node: serializeOuter(object.node)
                .replace(/\s+/g, " ")
                .replace(/\sdata-i18n(?:-attrs)?="[^"]*"/g, ""),
            }
          : {}),
      },
    ]),
  );
  // Whitespace-only author formatting does not invalidate translations.
  const sourceHash = sha256(
    JSON.stringify({ source, objects: descriptors }).replace(/\s+/g, " "),
  );
  return {
    id,
    segment: id.split(".")[0].toUpperCase(),
    source,
    sourceHash,
    objects,
    node,
    attribute,
  };
}

export function collect(document) {
  const messages = [];
  for (const node of walk(document)) {
    if (attr(node, "data-i18n")) messages.push(message(node));
    if (attr(node, "data-i18n-attrs")) {
      for (const name of ["title", "aria-label", "alt", "content"])
        if (attr(node, name)) messages.push(message(node, name));
    }
  }
  const ids = messages.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, "Duplicate source message ID");
  return messages;
}

export function termHash(msg, terms) {
  return sha256(
    JSON.stringify(
      Object.values(msg.objects)
        .filter((o) => o.term)
        .map((o) => [o.term, terms[o.term]]),
    ),
  );
}

export function checkCatalog(
  catalog,
  messages,
  locale,
  terms,
  complete = true,
) {
  assert.equal(catalog.schema, 1);
  assert.equal(catalog.locale, locale);
  assert.ok(
    Array.isArray(catalog.messages),
    "Catalog messages must be an array",
  );
  const byId = new Map();
  const source = new Map(messages.map((m) => [m.id, m]));
  for (const entry of catalog.messages) {
    assert.ok(!byId.has(entry.id), `Duplicate catalog message: ${entry.id}`);
    const msg = source.get(entry.id);
    assert.ok(msg, `Unknown message: ${entry.id}`);
    assert.equal(entry.sourceHash, msg.sourceHash, `Stale source: ${entry.id}`);
    assert.equal(
      entry.termHash,
      termHash(msg, terms),
      `Stale terminology: ${entry.id}`,
    );
    renderMessage(msg, entry.text, terms, locale);
    byId.set(entry.id, entry);
  }
  if (complete)
    for (const msg of messages)
      assert.ok(byId.has(msg.id), `Missing message: ${msg.id}`);
  return byId;
}

export function renderMessage(msg, value, terms, locale) {
  assert.equal(typeof value, "string", `${msg.id}: text must be a string`);
  assert.ok(value.trim(), `${msg.id}: empty message`);
  assert.doesNotMatch(
    value,
    /[<>\u0000-\u0008]/,
    `${msg.id}: HTML/control characters forbidden`,
  );
  const used = new Set();
  const facts = new Map();
  const root = { childNodes: [] };
  const stack = [{ key: null, node: root }];
  const append = (node) => {
    node.parentNode = stack.at(-1).node;
    stack.at(-1).node.childNodes.push(node);
  };
  for (const part of value.split(/(\{\{[a-z0-9_]+\}\})/g).filter(Boolean)) {
    if (!part.startsWith("{{")) {
      assert.doesNotMatch(
        part,
        /[{}\d]/,
        `${msg.id}: invalid placeholder or unprotected number`,
      );
      append(txt(part));
      continue;
    }
    const key = part.slice(2, -2);
    const object = msg.objects[key];
    assert.ok(
      object && !used.has(key),
      `${msg.id}: unknown/duplicate placeholder ${key}`,
    );
    used.add(key);
    if (object.kind === "close") {
      assert.equal(
        stack.at(-1).key,
        object.open,
        `${msg.id}: invalid inline nesting`,
      );
      stack.pop();
    } else if (object.kind === "fact") {
      const node = txt(factDisplay(object.value, locale));
      facts.set(node, object.value);
      append(node);
    } else {
      const node = clone(object.node);
      if (object.kind === "term") {
        assert.ok(terms[object.term], `Missing native name ${object.term}`);
        node.childNodes = node.childNodes.filter((n) => n.tagName === "img");
        const record = terms[object.term];
        const name = object.rankInside
          ? qualifiedName(record, locale)
          : nativeBase(record.native, record.level);
        node.childNodes.push(txt(name));
        for (const child of node.childNodes) child.parentNode = node;
      }
      if (object.kind === "open") node.childNodes = [];
      append(node);
      if (object.kind === "open") stack.push({ key, node });
    }
  }
  assert.equal(stack.length, 1, `${msg.id}: unclosed inline object`);
  assert.equal(
    used.size,
    Object.keys(msg.objects).length,
    `${msg.id}: missing placeholder`,
  );
  const numbers = (value) => (value.match(/\d+(?:[.,]\d+)*/g) || []).sort();
  const canonicalText = (node) => {
    if (facts.has(node)) {
      const source = facts.get(node);
      checkFactDisplay(source, node.value, locale);
      return source;
    }
    return node.nodeName === "#text"
      ? node.value
      : (node.childNodes || []).map(canonicalText).join("");
  };
  assert.deepEqual(
    numbers(canonicalText(root)),
    numbers(msg.attribute ? attr(msg.node, msg.attribute) : text(msg.node)),
    `${msg.id}: rendered numerical facts differ`,
  );
  return root.childNodes;
}

export function sourceInventory(document) {
  return collect(document).map(
    ({ id, segment, source, sourceHash, objects }) => ({
      id,
      segment,
      source,
      sourceHash,
      placeholders: Object.fromEntries(
        Object.entries(objects).map(([key, o]) => [
          key,
          o.term
            ? {
                term: o.term,
                ...(o.rankInside !== undefined
                  ? { rankInside: o.rankInside }
                  : {}),
              }
            : o.kind === "fact"
              ? o.value
              : o.kind,
        ]),
      ),
    }),
  );
}

export function checkCoverage(document) {
  for (const node of walk(document)) {
    if (node.nodeName === "#text" && normalize(node.value)) {
      let parent = node.parentNode;
      while (
        parent &&
        !attr(parent, "data-i18n") &&
        !["script", "style"].includes(parent.tagName)
      )
        parent = parent.parentNode;
      assert.ok(
        parent,
        `Unannotated text: ${normalize(node.value).slice(0, 80)}`,
      );
    }
    for (const name of ["title", "aria-label", "alt"])
      if (attr(node, name))
        assert.ok(attr(node, "data-i18n-attrs"), `Unannotated ${name}`);
    if (
      node.tagName === "meta" &&
      /^(description|og:(site_name|title|description|image:alt)|twitter:(title|description|image:alt))$/.test(
        attr(node, "name") || attr(node, "property"),
      )
    )
      assert.ok(attr(node, "data-i18n-attrs"), "Unannotated metadata");
  }
}

export function localizedDocument(
  html,
  locale,
  catalog,
  { partial = false } = {},
) {
  const document = parse(html);
  checkCoverage(document);
  const messages = collect(document);
  const terms = readJson(`localization/terminology/${locale}.json`).terms;
  const entries = checkCatalog(catalog, messages, locale, terms, !partial);
  // Attributes first: inline clones retain translated accessible names.
  for (const msg of [...messages].sort(
    (a, b) => Number(!!b.attribute) - Number(!!a.attribute),
  )) {
    if (!entries.has(msg.id)) continue;
    const children = renderMessage(
      msg,
      entries.get(msg.id).text,
      terms,
      locale,
    );
    if (msg.attribute)
      setAttr(msg.node, msg.attribute, children.map(text).join(""));
    else {
      msg.node.childNodes = children;
      for (const child of children) child.parentNode = msg.node;
    }
  }
  setAttr(
    walk(document).find((n) => n.tagName === "html"),
    "lang",
    locale,
  );
  return document;
}

export function outputDirectory(directory) {
  const output = path.resolve(directory);
  const root = path.resolve(".");
  const relative = path.relative(root, output).replaceAll(path.sep, "/");
  assert.ok(
    relative.startsWith("artifacts/") ||
      relative === "_site" ||
      relative === "_package-verification",
    "Output must be ignored staging or the CI site directory",
  );
  assert.ok(
    !fs.existsSync(output) || fs.readdirSync(output).length === 0,
    "Use a new or empty output directory; no implicit deletion",
  );
  return output;
}

export function factSignature(document) {
  return walk(document)
    .flatMap((n) =>
      (n.attrs || [])
        .filter((a) => /^(id|href|src|data-(?!i18n))/.test(a.name))
        .map(
          (a) => `${n.tagName}:${a.name}:${a.value.replace(/^(\.\.\/)+/, "")}`,
        ),
    )
    .sort();
}
