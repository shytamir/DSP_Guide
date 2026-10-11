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
} from "./lib/localization.mjs";
import { readJson } from "./lib/terminology.mjs";
import { generateSite } from "./lib/site-builder.mjs";

const html = fs.readFileSync("index.html", "utf8");
const doc = parse(html);
const messages = collect(doc);
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
  ![...first.keys()].some((p) =>
    /^(zh-CN|de|ja|localization|node_modules)\//.test(p),
  ),
);
assert.ok(generateSite({ preview: "ja" }).has("PREVIEW-ONLY.txt"));
console.log(
  `Deterministic generation passed: ${first.size} files; incomplete locales excluded`,
);
