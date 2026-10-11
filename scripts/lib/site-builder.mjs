import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {
  parse,
  serialize,
  localizedDocument,
  factSignature,
  outputDirectory,
  checkCoverage,
  sourceInventory,
} from "./localization.mjs";
import { readJson } from "./terminology.mjs";
import {
  validateManifest,
  localeUi,
  localeData,
  decorateEdition,
} from "./locale-delivery.mjs";

export function sharedFiles() {
  const files = new Map();
  function visit(directory) {
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      const file = `${directory}/${entry.name}`;
      assert.ok(!entry.isSymbolicLink(), `Symlink forbidden: ${file}`);
      if (file.startsWith("assets/data/locales/") && !entry.isDirectory())
        assert.equal(
          file,
          "assets/data/locales/en/ui.json",
          "Generated locale data must not be copied into source assets",
        );
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

export function generateSite({
  preview,
  segment,
  catalogs = {},
  manifest = readJson("localization/manifest.json"),
  baseUrl = manifest.baseUrl,
} = {}) {
  validateManifest(manifest, baseUrl);
  const html = fs.readFileSync("index.html", "utf8");
  const source = parse(html);
  checkCoverage(source);
  assert.deepEqual(
    readJson("localization/source.json"),
    { schema: 1, messages: sourceInventory(source) },
    "Source inventory is stale",
  );
  const files = sharedFiles();
  localeUi("en");
  const enabled = manifest.locales.filter((locale) => locale.enabled);
  const editions = [...enabled];
  if (preview) {
    assert.ok(
      ["zh-CN", "de", "ja"].includes(preview),
      "Unknown preview locale",
    );
    assert.ok(!segment || /^[A-F]$/.test(segment), "Unknown segment");
    if (!editions.some((locale) => locale.id === preview))
      editions.push(manifest.locales.find((locale) => locale.id === preview));
  }
  for (const edition of editions) {
    let document;
    if (edition.id === "en") document = parse(html);
    else {
      let catalog =
        catalogs[edition.id] ||
        readJson(`localization/catalogs/${edition.id}.json`);
      if (segment && edition.id === preview)
        catalog = {
          ...catalog,
          messages: catalog.messages.filter((m) =>
            m.id.startsWith(`${segment.toLowerCase()}.`),
          ),
        };
      document = localizedDocument(html, edition.id, catalog, {
        partial: edition.id === preview,
      });
      for (const [name, data] of Object.entries(localeData(edition.id)))
        files.set(
          `assets/data/locales/${edition.id}/${name}`,
          Buffer.from(JSON.stringify(data, null, 2) + "\n"),
        );
    }
    assert.deepEqual(
      factSignature(document),
      factSignature(source),
      "Localized factual objects differ",
    );
    decorateEdition(document, edition, enabled, baseUrl, !!preview);
    files.set(`${edition.path}index.html`, Buffer.from(serialize(document)));
  }
  if (preview) {
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
