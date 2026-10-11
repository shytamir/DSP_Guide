import fs from "node:fs";
import path from "node:path";
import {
  localeFolders,
  requiredTerms,
  sha256,
  graphFile,
} from "./lib/terminology.mjs";

const [directory, steamBuild] = process.argv.slice(2);
if (!directory || !/^\d+$/.test(steamBuild || ""))
  throw Error(
    "Usage: node scripts/extract-terminology.mjs <game-Locale-directory> <Steam-build-id> (read-only source; writes retained snapshots)",
  );
const required = requiredTerms();
const snapshots = {};
for (const [locale, folder] of Object.entries(localeFolders)) {
  const table = new Map();
  const files = {};
  for (const file of fs
    .readdirSync(path.join(directory, folder))
    .filter((f) => f.endsWith(".txt"))
    .sort()) {
    const bytes = fs.readFileSync(path.join(directory, folder, file));
    if (bytes[0] !== 255 || bytes[1] !== 254)
      throw Error(`Expected UTF-16LE BOM: ${folder}/${file}`);
    for (const row of bytes
      .toString("utf16le")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter(Boolean)) {
      const [key, flag, status, ...parts] = row.split("\t");
      const value = parts.join("\t");
      if (!Object.values(required).some((record) => record.key === key))
        continue;
      if (flag || !status || !value.trim())
        throw Error(`Flagged/empty required name: ${locale}/${key}`);
      if (table.has(key) && table.get(key).value !== value)
        throw Error(`Conflicting key: ${locale}/${key}`);
      table.set(key, { value, file });
      files[`${folder}/${file}`] = sha256(bytes);
    }
  }
  const terms = Object.fromEntries(
    Object.entries(required).map(([id, record]) => {
      const match = table.get(record.key);
      if (!match) throw Error(`Missing ${locale}/${id}/${record.key}`);
      return [
        id,
        { ...record, native: match.value, source: `${folder}/${match.file}` },
      ];
    }),
  );
  snapshots[locale] = {
    schema: 1,
    locale,
    provenance: {
      steamBuild,
      headerSha256: sha256(fs.readFileSync(path.join(directory, "Header.txt"))),
      graphSha256: sha256(fs.readFileSync(graphFile)),
      files,
    },
    terms,
  };
}
fs.mkdirSync("localization/terminology", { recursive: true });
for (const [locale, snapshot] of Object.entries(snapshots)) {
  fs.writeFileSync(
    `localization/terminology/${locale}.json`,
    JSON.stringify(snapshot, null, 2) + "\n",
  );
  console.log(
    `${locale}: retained ${Object.keys(snapshot.terms).length} names; ${Object.keys(snapshot.provenance.files).length} source files, no missing/conflicting keys`,
  );
}
