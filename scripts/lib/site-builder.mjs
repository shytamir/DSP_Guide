import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {
  parse,
  serialize,
  walk,
  attr,
  setAttr,
  localizedDocument,
  factSignature,
  outputDirectory,
  checkCoverage,
  sourceInventory,
} from "./localization.mjs";
import { readJson } from "./terminology.mjs";

export function sharedFiles() {
  const files = new Map();
  function visit(directory) {
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      const file = `${directory}/${entry.name}`;
      assert.ok(!entry.isSymbolicLink(), `Symlink forbidden: ${file}`);
      if (entry.isDirectory()) visit(file);
      else files.set(file, fs.readFileSync(file));
    }
  }
  visit("assets");
  for (const file of [
    "LICENSE",
    "docs/management/game-asset-use-permission-sanitized.md",
  ])
    files.set(file, fs.readFileSync(file));
  return files;
}

export function generateSite({ preview, segment, catalogs = {} } = {}) {
  const html = fs.readFileSync("index.html", "utf8");
  const source = parse(html);
  checkCoverage(source);
  assert.deepEqual(
    readJson("localization/source.json"),
    { schema: 1, messages: sourceInventory(source) },
    "Source inventory is stale",
  );
  const files = sharedFiles();
  files.set("index.html", Buffer.from(html));
  if (preview) {
    assert.ok(
      ["zh-CN", "de", "ja"].includes(preview),
      "Unknown preview locale",
    );
    assert.ok(!segment || /^[A-F]$/.test(segment), "Unknown segment");
    let catalog =
      catalogs[preview] || readJson(`localization/catalogs/${preview}.json`);
    if (segment)
      catalog = {
        ...catalog,
        messages: catalog.messages.filter((m) =>
          m.id.startsWith(`${segment.toLowerCase()}.`),
        ),
      };
    const document = localizedDocument(html, preview, catalog, {
      partial: true,
    });
    assert.deepEqual(
      factSignature(document),
      factSignature(parse(html)),
      "Localized factual objects differ",
    );
    for (const node of walk(document))
      for (const name of ["src", "href"]) {
        const value = attr(node, name);
        if (value && !/^(?:[a-z]+:|#|\/)/i.test(value))
          setAttr(node, name, `../${value}`);
      }
    const head = walk(document).find((n) => n.tagName === "head");
    const marker = parse(
      '<!doctype html><html><head><meta name="robots" content="noindex,nofollow"></head></html>',
    );
    head.childNodes.push(walk(marker).find((n) => n.tagName === "meta"));
    files.set(`${preview}/index.html`, Buffer.from(serialize(document)));
    files.set(
      "PREVIEW-ONLY.txt",
      Buffer.from(
        `PRIVATE ${preview} ${segment || "all"} preview; incomplete English text remains. Never package or publish.\n`,
      ),
    );
  }
  return files;
}

export function writeSite(directory, files) {
  const output = outputDirectory(directory);
  fs.mkdirSync(output, { recursive: true });
  for (const [relative, bytes] of files) {
    const file = path.join(output, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
  }
  return output;
}
