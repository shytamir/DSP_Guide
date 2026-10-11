import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { generateSite, committedSite, writeSite } from "./lib/site-builder.mjs";

const [mode, directory, ...extra] = process.argv.slice(2);
assert.ok(
  !extra.length &&
    ((!mode && !directory) ||
      (mode === "--write" && !directory) ||
      (mode === "--stage" && directory)),
  "Usage: node scripts/sync-static-editions.mjs [--write | --stage <empty-directory>]",
);
if (mode === "--write") {
  const generated = generateSite();
  for (const [file, bytes] of generated) {
    if (
      !/^(zh-CN|de|ja)\/index\.html$|^assets\/data\/locales\/(zh-CN|de|ja)\//.test(
        file,
      )
    )
      continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
  }
}
const files = committedSite();
if (mode === "--stage") writeSite(directory, files);
console.log(
  `Committed static site: ${files.size} current files${directory ? ` -> ${directory}` : ""}`,
);
