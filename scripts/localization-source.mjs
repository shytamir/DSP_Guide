import fs from "node:fs";
import assert from "node:assert/strict";
import { parse, checkCoverage, sourceInventory } from "./lib/localization.mjs";
const document = parse(fs.readFileSync("index.html", "utf8"));
checkCoverage(document);
const inventory = { schema: 1, messages: sourceInventory(document) };
const file = "localization/source.json";
if (process.argv.includes("--write"))
  fs.writeFileSync(file, JSON.stringify(inventory, null, 2) + "\n");
else
  assert.deepEqual(
    JSON.parse(fs.readFileSync(file, "utf8")),
    inventory,
    "Source inventory stale; review source changes then run with --write",
  );
console.log(
  `Source inventory: ${inventory.messages.length} messages; all text, accessible attributes and metadata covered`,
);
