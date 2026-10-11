import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  parse,
  collect,
  checkCoverage,
  sourceInventory,
  checkCatalog,
  factSignature,
  localizedDocument,
} from "./lib/localization.mjs";
import { readJson, localeFolders } from "./lib/terminology.mjs";
import { generateSite } from "./lib/site-builder.mjs";
import {
  localeUi,
  localeData,
  validateEditions,
} from "./lib/locale-delivery.mjs";

const html = fs.readFileSync("index.html", "utf8");
const doc = parse(html);
checkCoverage(doc);
const messages = collect(doc);
assert.deepEqual(readJson("localization/source.json"), {
  schema: 1,
  messages: sourceInventory(doc),
});
for (const locale of Object.keys(localeFolders)) {
  localeUi(locale);
  localeData(locale);
  const terms = readJson(`localization/terminology/${locale}.json`).terms;
  const catalog = readJson(`localization/catalogs/${locale}.json`);
  checkCatalog(catalog, messages, locale, terms, false);
  assert.deepEqual(
    factSignature(localizedDocument(html, locale, catalog, { partial: true })),
    factSignature(doc),
  );
  console.log(
    `${locale}: ${catalog.messages.length}/${messages.length} messages current; private only`,
  );
}
const site = process.argv[2];
if (site) {
  const manifest = readJson("localization/manifest.json");
  const baseUrl = process.argv[3] || manifest.baseUrl;
  const expected = generateSite({ baseUrl });
  const list = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      assert.ok(!entry.isSymbolicLink(), "No symlinks in output");
      const file = path.join(directory, entry.name);
      return entry.isDirectory()
        ? list(file)
        : [path.relative(site, file).replaceAll(path.sep, "/")];
    });
  assert.deepEqual(
    list(site).sort(),
    [...expected.keys()].sort(),
    "Release allowlist mismatch (private previews are not deployable)",
  );
  for (const [file, bytes] of expected)
    assert.ok(
      fs.readFileSync(path.join(site, file)).equals(bytes),
      `Non-deterministic output: ${file}`,
    );
  validateEditions(expected, manifest, baseUrl);
  console.log(
    `Generated release: ${expected.size} files byte-identical; no private catalogs or dependencies`,
  );
}
