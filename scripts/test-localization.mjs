import assert from "node:assert/strict";
import fs from "node:fs";
import {
  parse,
  serialize,
  walk,
  attr,
  collect,
  termHash,
  checkCatalog,
  localizedDocument,
  factSignature,
  renderMessage,
  factDisplay,
  checkFactDisplay,
} from "./lib/localization.mjs";
import { readJson } from "./lib/terminology.mjs";
import { generateSite } from "./lib/site-builder.mjs";
import { completeFixtures } from "./lib/localization-fixtures.mjs";
import {
  validateEditions,
  localeData,
  localeUi,
} from "./lib/locale-delivery.mjs";

const html = fs.readFileSync("index.html", "utf8");
const doc = parse(html);
const messages = collect(doc);
for (const [source, german] of [
  ["10,500", "10.500"],
  ["20,800", "20.800"],
  ["22.5/min", "22,5/min"],
  ["7.5", "7,5"],
  ["1.655 GW", "1,655 GW"],
  ["1,200–2,000", "1.200–2.000"],
  ["1.80 MW", "1,80 MW"],
  ["15–20 MW", "15–20 MW"],
  ["40/min", "40/min"],
  ["3.2.191", "3.2.191"],
  ["https://example.test/3.2/", "https://example.test/3.2/"],
  ["Mk.I", "Mk.I"],
  ["→", "→"],
]) {
  assert.equal(factDisplay(source, "de"), german);
  checkFactDisplay(source, german, "de");
  for (const locale of ["en", "zh-CN", "ja"]) {
    assert.equal(factDisplay(source, locale), source);
    checkFactDisplay(source, source, locale);
  }
}
for (const displayed of [
  "1.655 GW",
  "1655 GW",
  "1,655 MW",
  "1,6550 GW",
  "1,65 GW",
])
  assert.throws(() => checkFactDisplay("1.655 GW", displayed, "de"), /fact/);
assert.throws(() => checkFactDisplay("40/min", "40/s", "de"), /fact/);
assert.deepEqual(
  collect(parse(html.replace(/\r?\n/g, " "))).map((m) => m.sourceHash),
  messages.map((m) => m.sourceHash),
  "Whitespace-only formatting invalidates translations",
);
for (const locale of ["zh-CN", "de", "ja"]) {
  const terms = readJson(`localization/terminology/${locale}.json`).terms;
  const catalog = {
    schema: 1,
    locale,
    messages: messages.map((m) => ({
      id: m.id,
      sourceHash: m.sourceHash,
      termHash: termHash(m, terms),
      text: m.source,
    })),
  };
  checkCatalog(catalog, messages, locale, terms);
  const localized = localizedDocument(html, locale, catalog);
  assert.deepEqual(factSignature(localized), factSignature(doc));
  const bad = (change, pattern) => {
    const copy = structuredClone(catalog);
    change(copy);
    assert.throws(() => checkCatalog(copy, messages, locale, terms), pattern);
  };
  bad((c) => c.messages.pop(), /Missing message/);
  bad((c) => c.messages.push(c.messages[0]), /Duplicate/);
  bad((c) => (c.messages[0].id = "unknown"), /Unknown/);
  bad((c) => (c.messages[0].sourceHash = "stale"), /Stale source/);
  bad((c) => (c.messages[0].termHash = "stale"), /Stale terminology/);
  bad((c) => (c.messages[0].text = "<script>bad</script>"), /HTML/);
  bad((c) => (c.messages[0].text = "changed 999"), /unprotected number/);
  bad((c) => (c.messages[0].text = "{{unknown}}"), /placeholder/);
  bad((c) => (c.messages[0].text = null), /string/);
  const rich = catalog.messages.find((m) => m.text.includes("{{strong_1}}"));
  bad(
    (c) =>
      (c.messages.find((m) => m.id === rich.id).text = rich.text.replace(
        "{{strong_1}}",
        "",
      )),
    /nesting|placeholder/,
  );
  bad(
    (c) => (c.messages.find((m) => m.id === rich.id).text += "{{strong_1}}"),
    /duplicate/,
  );
  const numeric = catalog.messages.find((m) => m.text.includes("{{fact_1}}"));
  bad(
    (c) =>
      (c.messages.find((m) => m.id === numeric.id).text = numeric.text.replace(
        "{{fact_1}}",
        "",
      )),
    /missing placeholder/,
  );
  const attribute = catalog.messages.find(
    (m) => m.id === "a.opening.attr.001.content",
  );
  attribute.text = 'Quoted "word" & apostrophe\'s';
  const escaped = serialize(localizedDocument(html, locale, catalog));
  assert.equal(
    attr(
      walk(parse(escaped)).find((n) => attr(n, "name") === "description"),
      "content",
    ),
    attribute.text,
  );
  assert.ok(escaped.includes("&quot;word&quot; &amp;"));
  const movement = messages.find(
    (m) =>
      m.source.includes("{{fact_1}}") &&
      Object.values(m.objects).some((o) => o.term) &&
      Object.values(m.objects).every((o) =>
        ["term", "fact", "node"].includes(o.kind),
      ),
  );
  assert.ok(movement, "No reordering fixture found");
  const tokens = movement.source.match(/\{\{[a-z0-9_]+\}\}/g);
  // Reorder independent factual/name atoms; paired markup keeps its nesting.
  renderMessage(movement, tokens.reverse().join(" "), terms, locale);
  console.log(
    `${locale}: complete synthetic catalog, facts, escaping, stale/duplicate/missing/unsafe negative cases passed`,
  );
}
const first = generateSite();
const second = generateSite();
assert.deepEqual([...first.keys()], [...second.keys()]);
for (const [file, bytes] of first)
  assert.ok(bytes.equals(second.get(file)), file);
assert.ok(
  ![...first.keys()].some((p) => /^(localization|node_modules)\//.test(p)),
);
const disabledManifest = readJson("localization/manifest.json");
for (const locale of disabledManifest.locales)
  locale.enabled = locale.id === "en";
assert.ok(
  ![...generateSite({ manifest: disabledManifest }).keys()].some((p) =>
    /^(zh-CN|de|ja)\//.test(p),
  ),
);
assert.ok(generateSite({ preview: "ja" }).has("PREVIEW-ONLY.txt"));
console.log(
  `Deterministic generation passed: ${first.size} files; disabled locales excluded`,
);
const fixtures = completeFixtures();
const incomplete = structuredClone(fixtures);
incomplete.catalogs.ja.messages.pop();
assert.throws(() => generateSite(incomplete), /Missing message/);
for (const baseUrl of [
  "https://example.test/",
  "https://example.test/guide/",
]) {
  const files = generateSite({ ...fixtures, baseUrl });
  validateEditions(files, fixtures.manifest, baseUrl);
  for (const locale of ["zh-CN", "de", "ja"]) {
    const data = localeData(locale);
    assert.equal(data["ui.json"].strings.rank, localeUi(locale).strings.rank);
    assert.equal(Object.keys(data["tech-reference.json"]).length, 314);
    for (const tech of Object.values(data["tech-reference.json"])) {
      assert.ok(tech.displayName);
      assert.ok(tech.required.every((r) => r.displayName));
      assert.ok(tech.implicitRequired.every((r) => r.displayName));
    }
  }
}
console.log(
  "Delivery fixtures passed: incomplete activation fails closed; complete four-edition root/prefix links, metadata, localized names/UI and factual parity",
);
