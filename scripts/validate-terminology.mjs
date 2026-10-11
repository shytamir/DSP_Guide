import assert from "node:assert/strict";
import fs from "node:fs";
import {
  localeFolders,
  requiredTerms,
  sha256,
  graphFile,
  readJson,
  nativeBase,
  qualifiedName,
} from "./lib/terminology.mjs";

const required = requiredTerms();
for (const locale of Object.keys(localeFolders)) {
  const snapshot = readJson(`localization/terminology/${locale}.json`);
  assert.equal(snapshot.schema, 1);
  assert.equal(snapshot.locale, locale);
  assert.deepEqual(
    Object.keys(snapshot.terms).sort(),
    Object.keys(required).sort(),
  );
  assert.equal(
    snapshot.provenance.graphSha256,
    sha256(fs.readFileSync(graphFile)),
  );
  assert.match(snapshot.provenance.headerSha256, /^[a-f0-9]{64}$/);
  assert.match(snapshot.provenance.steamBuild, /^\d+$/);
  const keys = new Map();
  let ranked = 0;
  for (const [id, expected] of Object.entries(required)) {
    const { native, source, ...identity } = snapshot.terms[id];
    assert.deepEqual(
      identity,
      expected,
      `${locale}/${id}: source identity changed`,
    );
    assert.equal(typeof native, "string");
    assert.ok(
      native.trim().length && native === native.trim(),
      `${locale}/${id}: empty/untrimmed name`,
    );
    assert.doesNotMatch(native, /[<>\r\n\t{}\u0000-\u001f]/);
    assert.match(snapshot.provenance.files[source] || "", /^[a-f0-9]{64}$/);
    if (keys.has(expected.key))
      assert.equal(
        native,
        keys.get(expected.key),
        `${locale}: conflicting repeated key`,
      );
    keys.set(expected.key, native);
    const display = qualifiedName(snapshot.terms[id], locale);
    if (expected.level) {
      ranked++;
      assert.equal(
        nativeBase(display, expected.level),
        nativeBase(native, expected.level),
      );
      assert.equal(
        qualifiedName({ native: display, level: expected.level }, locale),
        display,
        "rank duplicated",
      );
    } else assert.equal(display, native);
  }
  console.log(
    `${locale}: ${Object.keys(required).length} identities, ${keys.size} native keys and ${ranked} ranks verified; no game access`,
  );
}
