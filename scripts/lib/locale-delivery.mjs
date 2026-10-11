import assert from "node:assert/strict";
import { parseFragment } from "parse5";
import { parse, walk, attr, setAttr } from "./localization.mjs";
import {
  readJson,
  sha256,
  rankPatterns,
  qualifiedName,
} from "./terminology.mjs";

export function validateManifest(manifest, baseUrl = manifest.baseUrl) {
  assert.equal(manifest.schema, 1);
  assert.deepEqual(
    manifest.locales.map((l) => [l.id, l.path, l.label]),
    [
      ["en", "", "English"],
      ["zh-CN", "zh-CN/", "简体中文"],
      ["de", "de/", "Deutsch"],
      ["ja", "ja/", "日本語"],
    ],
  );
  assert.ok(
    manifest.locales.every((l) => typeof l.enabled === "boolean") &&
      manifest.locales[0].enabled,
  );
  const base = new URL(baseUrl);
  assert.ok(
    /^https?:$/.test(base.protocol) &&
      !base.search &&
      !base.hash &&
      !base.username &&
      !base.password &&
      base.pathname.endsWith("/"),
    "Base URL must be an explicit HTTP(S) directory URL",
  );
  return base;
}

export function localeUi(locale) {
  const english = readJson("assets/data/locales/en/ui.json");
  assert.equal(english.schema, 1);
  assert.equal(english.locale, "en");
  assert.deepEqual(
    Object.keys(english.strings).sort(),
    [
      "saved",
      "unavailable",
      "reset",
      "resetUnavailable",
      "required",
      "implicit",
      "unlocks",
      "rank",
    ].sort(),
  );
  assert.ok(
    Object.values(english.strings).every(
      (value) => typeof value === "string" && value.trim(),
    ),
  );
  if (locale === "en") return english;
  const target = readJson(`localization/ui/${locale}.json`);
  assert.equal(target.schema, 1);
  assert.equal(target.locale, locale);
  assert.equal(
    target.sourceHash,
    sha256(JSON.stringify(english.strings)),
    `Stale UI: ${locale}`,
  );
  assert.deepEqual(
    Object.keys(target.strings).sort(),
    Object.keys(english.strings).sort(),
    `UI coverage: ${locale}`,
  );
  for (const value of Object.values(target.strings))
    assert.ok(
      typeof value === "string" &&
        value.trim() &&
        !/[<>\u0000-\u001f]/.test(value),
    );
  assert.equal(target.strings.rank, rankPatterns[locale]);
  return { schema: 1, locale, strings: target.strings };
}

export function localeData(locale) {
  const terms = readJson(`localization/terminology/${locale}.json`).terms;
  const sourceTech = readJson("assets/data/tech-reference.json");
  const sourceDetails = readJson("assets/data/tech-tooltip-details.json");
  function name(record) {
    const term = terms[`tech:${record.id}`];
    assert.ok(term, `Missing technology name: ${record.id}`);
    return {
      ...record,
      name: term.native,
      displayName: qualifiedName(term, locale),
    };
  }
  const tech = Object.fromEntries(
    Object.entries(sourceTech).map(([id, record]) => [
      id,
      {
        ...name(record),
        required: record.required.map(name),
        implicitRequired: record.implicitRequired.map(name),
      },
    ]),
  );
  const itemName = (id) => {
    assert.ok(terms[`item:${id}`], `Missing item name: ${id}`);
    return terms[`item:${id}`].native;
  };
  const details = structuredClone(sourceDetails);
  for (const record of Object.values(details)) {
    if (record.cube) record.cube.label = itemName(record.cube.itemId);
    for (const unlock of record.unlocks || [])
      unlock.label = itemName(unlock.itemId);
  }
  // Only display fields may differ: keep arrays/order, IDs, ranks and facts.
  const facts = (value) => {
    if (Array.isArray(value)) return value.map(facts);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !["name", "displayName", "label"].includes(key))
          .map(([key, child]) => [key, facts(child)]),
      );
    return value;
  };
  assert.deepEqual(facts(tech), facts(sourceTech));
  assert.deepEqual(facts(details), facts(sourceDetails));
  return {
    "ui.json": localeUi(locale),
    "tech-reference.json": tech,
    "tech-tooltip-details.json": details,
  };
}

export function decorateEdition(
  document,
  locale,
  editions,
  baseUrl,
  preview = false,
) {
  const prefix = locale.id === "en" ? "" : "../";
  const nodes = walk(document);
  const head = nodes.find((n) => n.tagName === "head");
  head.childNodes = head.childNodes.filter(
    (n) => attr(n, "rel") !== "alternate",
  );
  const absolute = new URL(locale.path, baseUrl).href;
  for (const node of nodes) {
    for (const key of ["src", "href"]) {
      const value = attr(node, key);
      if (value && !/^(?:[a-z]+:|#|\/)/i.test(value))
        setAttr(node, key, `${prefix}${value}`);
    }
    const srcset = attr(node, "srcset");
    if (srcset)
      setAttr(
        node,
        "srcset",
        srcset
          .split(",")
          .map((candidate) => {
            const [url, ...descriptors] = candidate.trim().split(/\s+/);
            return [
              !/^(?:[a-z]+:|#|\/)/i.test(url) ? `${prefix}${url}` : url,
              ...descriptors,
            ].join(" ");
          })
          .join(", "),
      );
    if (attr(node, "rel") === "canonical") setAttr(node, "href", absolute);
    const meta = attr(node, "property") || attr(node, "name");
    if (meta === "og:url") setAttr(node, "content", absolute);
    if (["og:image", "twitter:image"].includes(meta))
      setAttr(
        node,
        "content",
        new URL("assets/images/link-preview.png", baseUrl).href,
      );
  }
  const add = (markup, parent) => {
    const children = parseFragment(markup).childNodes;
    for (const child of children) {
      child.parentNode = parent;
      parent.childNodes.push(child);
    }
  };
  // URLs/labels are constrained by validateManifest, never supplied by catalogs.
  if (preview) add('<meta name="robots" content="noindex,nofollow">', head);
  else
    for (const edition of editions)
      add(
        `<link rel="alternate" hreflang="${edition.id}" href="${new URL(edition.path, baseUrl).href.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}">`,
        head,
      );
  const selector = nodes.find((n) => attr(n, "id") === "language-selector");
  assert.ok(selector, "Missing language selector host");
  selector.childNodes = [];
  setAttr(selector, "hidden", "");
  if (!preview && editions.length > 1) {
    selector.attrs = selector.attrs.filter((a) => a.name !== "hidden");
    for (const edition of editions)
      add(
        `<a href="${prefix}${edition.path || "./"}" lang="${edition.id}" hreflang="${edition.id}"${edition.id === locale.id ? ' aria-current="page"' : ""}>${edition.label}</a>`,
        selector,
      );
  }
  return document;
}

export function validateEditions(files, manifest, baseUrl) {
  const base = validateManifest(manifest, baseUrl);
  const editions = manifest.locales.filter((locale) => locale.enabled);
  const anchors = new Map();
  for (const edition of editions) {
    const filename = `${edition.path}index.html`;
    const document = parse(files.get(filename).toString());
    const nodes = walk(document);
    const pageUrl = new URL(edition.path, base);
    assert.equal(
      attr(
        nodes.find((n) => n.tagName === "html"),
        "lang",
      ),
      edition.id,
    );
    assert.equal(
      attr(
        nodes.find((n) => attr(n, "rel") === "canonical"),
        "href",
      ),
      pageUrl.href,
    );
    const alternates = nodes.filter((n) => attr(n, "rel") === "alternate");
    assert.deepEqual(
      alternates.map((n) => [attr(n, "hreflang"), attr(n, "href")]),
      editions.map((l) => [l.id, new URL(l.path, base).href]),
    );
    const selector = nodes.find((n) => attr(n, "id") === "language-selector");
    assert.equal(
      walk(selector).filter((n) => n.tagName === "a").length,
      editions.length > 1 ? editions.length : 0,
    );
    const links = walk(selector).filter((n) => n.tagName === "a");
    assert.deepEqual(
      links.map((n) => [
        attr(n, "hreflang"),
        attr(n, "lang"),
        n.childNodes.map((child) => child.value || "").join(""),
        new URL(attr(n, "href"), pageUrl).href,
        attr(n, "aria-current"),
      ]),
      editions.length > 1
        ? editions.map((l) => [
            l.id,
            l.id,
            l.label,
            new URL(l.path, base).href,
            l.id === edition.id ? "page" : undefined,
          ])
        : [],
      "Language selector must match the enabled editions",
    );
    if (editions.length > 1) assert.equal(attr(selector, "hidden"), undefined);
    for (const node of nodes) {
      assert.ok(
        !(node.tagName === "script" && !attr(node, "src")),
        "Inline script is forbidden",
      );
      const references = ["src", "href"].map((name) => [
        name,
        attr(node, name),
      ]);
      if (attr(node, "srcset"))
        for (const candidate of attr(node, "srcset").split(","))
          references.push(["srcset", candidate.trim().split(/\s+/)[0]]);
      for (const [name, value] of references) {
        if (!value) continue;
        const url = new URL(value, pageUrl);
        const resource =
          name !== "href" || ["stylesheet", "icon"].includes(attr(node, "rel"));
        if (url.origin !== base.origin) {
          assert.ok(!resource, `Remote runtime dependency: ${value}`);
          continue;
        }
        if (["canonical", "alternate"].includes(attr(node, "rel"))) continue;
        assert.ok(
          url.pathname.startsWith(base.pathname),
          `Escaped deployment prefix: ${value}`,
        );
        let target = decodeURIComponent(
          url.pathname.slice(base.pathname.length),
        );
        if (!target || target.endsWith("/")) target += "index.html";
        assert.ok(files.has(target), `Broken ${edition.id} link: ${value}`);
        if (url.hash && target.endsWith(".html")) {
          if (!anchors.has(target))
            anchors.set(
              target,
              walk(parse(files.get(target).toString())).map((n) =>
                attr(n, "id"),
              ),
            );
          const ids = anchors.get(target);
          assert.ok(
            ids.includes(decodeURIComponent(url.hash.slice(1))),
            `Missing anchor: ${value}`,
          );
        }
      }
    }
  }
}
