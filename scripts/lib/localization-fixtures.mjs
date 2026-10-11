import fs from "node:fs";
import { parse, collect, termHash } from "./localization.mjs";
import { readJson } from "./terminology.mjs";

// Complete synthetic catalogs exercise delivery, not linguistic acceptance.
// This helper is used only by tests; the build CLI cannot select these fixtures.
export function completeFixtures() {
  const manifest = readJson("localization/manifest.json");
  const messages = collect(parse(fs.readFileSync("index.html", "utf8")));
  const catalogs = {};
  for (const locale of manifest.locales) {
    locale.enabled = true;
    if (locale.id === "en") continue;
    const terms = readJson(`localization/terminology/${locale.id}.json`).terms;
    catalogs[locale.id] = {
      schema: 1,
      locale: locale.id,
      messages: messages.map((msg) => ({
        id: msg.id,
        sourceHash: msg.sourceHash,
        termHash: termHash(msg, terms),
        text: `⟦${locale.label}⟧ ${msg.source}`,
      })),
    };
  }
  return { manifest, catalogs };
}
