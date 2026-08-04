import fs from "node:fs";
import path from "node:path";

const argumentsList = process.argv.slice(2);
const mode = argumentsList.includes("--write") ? "write" : argumentsList.includes("--check") ? "check" : null;
const mapIndex = argumentsList.indexOf("--asset-map");
const assetMapArgument = mapIndex >= 0 ? argumentsList[mapIndex + 1] : null;

if (!mode || !assetMapArgument) {
  console.error("Usage: node scripts/apply-proto-icons.mjs (--write|--check) --asset-map <recognized-game-assets.json>");
  process.exit(2);
}

const root = process.cwd();
const htmlPath = path.join(root, "index.html");
const assetMapPath = path.resolve(assetMapArgument);
const recipesPath = path.join(root, "dsp_universal_end_product_dag_v1_0", "dsp_universal_recipe_hyperedges_v1_0.json");
const map = JSON.parse(fs.readFileSync(assetMapPath, "utf8"));
const recipes = JSON.parse(fs.readFileSync(recipesPath, "utf8")).recipes;

if (map.schemaVersion !== 2) throw new Error(`Unsupported asset-map schema ${map.schemaVersion}.`);

const itemAssetCorrections = new Map([
  [6001, "t-matrix.png"],
  [6002, "e-matrix.png"],
  [6003, "c-matrix.png"],
  [1105, "silicium-single-crystal.png"],
  [1113, "silicium-high-purity.png"],
  [1127, "strange-matter-generator.png"],
  [1208, "photon-capacitor-full.png"],
]);
const mapAdditions = [
  { id: 2207, name: "Accumulator (full)", asset: "accumulator-full.png", guideAliases: ["charged Accumulator", "charged Accumulators"] },
  { id: 1407, name: "Engine", asset: "engine.png" },
  { id: 2213, name: "Geothermal Power Station", asset: "geothermal-power-station.png" },
];
const effectiveItems = map.items
  .map(item => itemAssetCorrections.has(Number(item.id))
    ? { ...item, asset: itemAssetCorrections.get(Number(item.id)) }
    : item)
  .concat(mapAdditions.filter(addition => !map.items.some(item => Number(item.id) === addition.id)));

const itemById = new Map(effectiveItems.map(item => [Number(item.id), item]));
const technologyById = new Map(map.technologies.map(technology => [Number(technology.id), technology]));
if (itemById.size !== effectiveItems.length) throw new Error("Duplicate item ID in effective asset map.");
if (technologyById.size !== map.technologies.length) throw new Error("Duplicate technology ID in asset map.");

const toWebPath = value => value.replaceAll("\\", "/").replace(/^\.\//, "");
const itemAsset = item => toWebPath(`${map.assetRoots.items}/${item.asset}`);
const technologyAsset = technology => toWebPath(`${map.assetRoots.technologies}/${technology.asset}`);
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeAttribute = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

for (const item of effectiveItems) {
  if (!fs.existsSync(path.join(root, itemAsset(item)))) throw new Error(`Missing mapped item asset: ${itemAsset(item)}`);
}
for (const technology of map.technologies) {
  if (!fs.existsSync(path.join(root, technologyAsset(technology)))) throw new Error(`Missing mapped technology asset: ${technologyAsset(technology)}`);
}

function pluralize(label) {
  const separator = label.lastIndexOf(" ");
  const prefix = separator < 0 ? "" : label.slice(0, separator + 1);
  const word = separator < 0 ? label : label.slice(separator + 1);
  if (!word || /Mk\./i.test(word)) return null;
  if (/matrix$/i.test(word)) return `${prefix}${word.slice(0, -2)}ices`;
  if (/[^aeiou]y$/i.test(word)) return `${prefix}${word.slice(0, -1)}ies`;
  if (/(?:s|x|z|ch|sh)$/i.test(word)) return `${prefix}${word}es`;
  return `${prefix}${word}s`;
}

const itemLabels = new Map();
for (const item of effectiveItems) {
  const labels = [item.name, ...(item.guideAliases || [])];
  const plural = pluralize(item.name);
  if (plural) labels.push(plural);
  for (const label of labels) {
    const key = label.toLocaleLowerCase("en-US");
    const existing = itemLabels.get(key);
    if (existing && existing.id !== item.id) throw new Error(`Ambiguous item label "${label}" in asset map.`);
    itemLabels.set(key, item);
  }
}
const itemPattern = [...itemLabels.keys()]
  .sort((left, right) => right.length - left.length)
  .map(escapeRegExp)
  .join("|");
const makeItemMatcher = () => new RegExp(`(?<![A-Za-z0-9])(?:${itemPattern})(?![A-Za-z0-9])`, "giu");

function itemIdsInText(text) {
  const result = [];
  for (const match of text.matchAll(makeItemMatcher())) {
    const item = itemLabels.get(match[0].toLocaleLowerCase("en-US"));
    if (item && !result.includes(Number(item.id))) result.push(Number(item.id));
  }
  return result;
}

function itemIcon(item, classes = "proto-icon proto-icon-item", lazy = true) {
  return `<img class="${classes}" src="${itemAsset(item)}" width="20" height="20" alt="" aria-hidden="true"${lazy ? ' loading="lazy"' : ""}/>`;
}

function technologyIcon(technology) {
  return `<img class="proto-icon proto-icon-tech" src="${technologyAsset(technology)}" width="20" height="20" alt="" aria-hidden="true" loading="lazy"/>`;
}

function stripGeneratedMarkup(html) {
  return html
    .replace(/<span class="proto-ref" data-item-id="\d+"><img class="proto-icon proto-icon-item"[^>]*\/>([\s\S]*?)<\/span>/g, "$1")
    .replace(/<img class="proto-icon proto-icon-tech"[^>]*\/>/g, "")
    .replace(/<img class="phase-icon phase-icon-(?:rail|tag)"[^>]*\/>/g, "")
    .replace(/<span class="production-arrow"[^>]*><img class="proto-icon proto-icon-producer"[^>]*\/><span class="production-arrow-glyph"[^>]*>→<\/span><\/span>/g, "→");
}

function ensureIconFreeRegions(html) {
  let transformed = html.replace(
    /<li class="task-list-item">(?=<input[^>]*data-checklist-key="bootstrap:(?:iron-copper-magnetic-coils-and-circuit-boards-arrive-continuously|belts-sorters-miners-smelters-assemblers-storage-mk-i-storage-tanks-wind-turbines-and-tesla-towers-replenish-automatically)")/g,
    '<li class="task-list-item icon-free">',
  );
  const startMarker = "<h3>Choose a Deuterium supply</h3>";
  const endMarker = '<h2 class="quick-ref-title">Quick reference — How much is enough</h2>';
  const start = transformed.indexOf(startMarker);
  const end = transformed.indexOf(endMarker, start);
  if (start >= 0 && end > start && !transformed.slice(0, start).endsWith('<div class="icon-free">')) {
    transformed = `${transformed.slice(0, start)}<div class="icon-free">${transformed.slice(start, end)}</div>${transformed.slice(end)}`;
  }
  return transformed;
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replaceAll("&nbsp;", " ").trim();
}

const recipesByOutput = new Map();
const recipeById = new Map();
for (const recipe of recipes) {
  recipeById.set(Number(recipe.recipe_id), recipe);
  for (const output of recipe.outputs) {
    const candidates = recipesByOutput.get(Number(output.item_id)) || [];
    candidates.push(recipe);
    recipesByOutput.set(Number(output.item_id), candidates);
  }
}

const facilityByRecipeType = new Map([
  ["Smelt", { itemId: 2302, producerType: "smelting" }],
  ["Assemble", { itemId: 2303, producerType: "assembly" }],
  ["Research", { itemId: 2901, producerType: "assembly" }],
  ["Refine", { itemId: 2308, producerType: "processing" }],
  ["Chemical", { itemId: 2309, producerType: "processing" }],
  ["Particle", { itemId: 2310, producerType: "processing" }],
  ["Fractionate", { itemId: 2314, producerType: "processing" }],
]);
for (const facility of facilityByRecipeType.values()) {
  if (!itemById.has(facility.itemId)) throw new Error(`Producer ${facility.itemId} is missing from the asset map.`);
}

const routeOverrides = new Map([
  ["Belts → limited storage · Sorters → limited storage", {
    text: "Belts · limited storage; Sorters · limited storage",
    recipeIds: [],
  }],
  ["Solar Sails → storage → EM-Rail Ejectors", {
    text: "Solar Sails · buffer in Storage Mk.I · feed EM-Rail Ejectors",
    recipeIds: [],
  }],
  ["Hydrogen → Miniature Particle Collider → Deuterium", {
    text: "Hydrogen → Deuterium",
    recipeIds: [40],
  }],
  ["Gears + Magnetic Coils → Engines", {
    text: "Copper Ingots + Magnetic Coils → Engines",
    recipeIds: [105],
  }],
  ["Copper Ingots + Magnetic Coils → Engines", {
    text: "Copper Ingots + Magnetic Coils → Engines",
    recipeIds: [105],
  }],
]);

function selectRecipe(inputText, outputText) {
  const inputIds = new Set(itemIdsInText(inputText));
  const outputIds = itemIdsInText(outputText);
  if (!outputIds.length) throw new Error(`No mapped output item found after production arrow: "${outputText}".`);

  const selected = [];
  for (const outputId of outputIds) {
    const candidates = recipesByOutput.get(outputId) || [];
    if (!candidates.length) throw new Error(`No authoritative recipe produces mapped item ${outputId}.`);
    const ranked = candidates.map(recipe => {
      const recipeInputs = recipe.inputs.map(input => Number(input.item_id));
      const overlap = recipeInputs.filter(itemId => inputIds.has(itemId)).length;
      const missing = recipeInputs.filter(itemId => !inputIds.has(itemId)).length;
      return { recipe, score: overlap * 20 - missing * 3 + (missing === 0 ? 1000 : 0) };
    }).sort((left, right) => right.score - left.score || Number(left.recipe.recipe_id) - Number(right.recipe.recipe_id));
    selected.push(ranked[0].recipe);
  }

  const types = new Set(selected.map(recipe => recipe.recipe_type));
  if (types.size !== 1) {
    throw new Error(`Outputs after arrow require different producer types: "${outputText}".`);
  }
  return selected[0];
}

function arrowMarkup(recipe) {
  const facility = facilityByRecipeType.get(recipe.recipe_type);
  if (!facility) throw new Error(`No baseline producer for recipe type ${recipe.recipe_type}.`);
  const producer = itemById.get(facility.itemId);
  const label = escapeAttribute(`Produced in ${producer.name}`);
  return `<span class="production-arrow" data-producer-item-id="${producer.id}" data-producer-type="${facility.producerType}" aria-label="${label}">${itemIcon(producer, "proto-icon proto-icon-producer")}<span class="production-arrow-glyph" aria-hidden="true">→</span></span>`;
}

function materializeProductionArrows(html) {
  if (html.includes('class="production-arrow"')) return { html, sourceArrows: 0, outputArrows: 0, normalizedRoutes: 0 };
  let sourceArrows = 0;
  let outputArrows = 0;
  let normalizedRoutes = 0;
  const transformed = html.replace(/<span class="route-chain">([\s\S]*?)<\/span>/g, (full, originalInner) => {
    const originalText = stripTags(originalInner);
    sourceArrows += (originalText.match(/→/g) || []).length;
    const override = routeOverrides.get(originalText);
    let inner = override ? override.text : originalInner;
    if (override) normalizedRoutes += 1;
    const parts = inner.split("→");
    if (parts.length === 1) return `<span class="route-chain">${inner}</span>`;
    const recipesForArrows = [];
    for (let index = 0; index < parts.length - 1; index += 1) {
      if (override?.recipeIds[index]) {
        const recipe = recipeById.get(override.recipeIds[index]);
        if (!recipe) throw new Error(`Route override recipe ${override.recipeIds[index]} is missing.`);
        recipesForArrows.push(recipe);
        continue;
      }
      const inputText = stripTags(parts[index]).split(/[;·]/).at(-1).trim();
      const outputText = stripTags(parts[index + 1]).split(/[;·]/)[0].trim();
      recipesForArrows.push(selectRecipe(inputText, outputText));
    }
    let result = parts[0];
    for (let index = 0; index < recipesForArrows.length; index += 1) {
      result += arrowMarkup(recipesForArrows[index]);
      result += parts[index + 1];
      outputArrows += 1;
    }
    return `<span class="route-chain">${result}</span>`;
  });
  return { html: transformed, sourceArrows, outputArrows, normalizedRoutes };
}

const phaseBindings = new Map([
  ["blue", { kind: "item", id: 6001 }],
  ["red", { kind: "item", id: 6002 }],
  ["ils", { kind: "technology", id: 1605 }],
  ["yellow", { kind: "item", id: 6003 }],
  ["purple", { kind: "item", id: 6004 }],
  ["green", { kind: "item", id: 6005 }],
  ["dyson", { kind: "item", id: 1501 }],
  ["sphere", { kind: "item", id: 1502 }],
  ["photon", { kind: "item", id: 1208 }],
  ["white", { kind: "item", id: 6006 }],
  ["warp", { kind: "item", id: 1210 }],
  ["logistics", { kind: "item", id: 2104 }],
]);

function phaseIcon(phase, variant) {
  const binding = phaseBindings.get(phase);
  if (!binding) return "";
  const record = binding.kind === "item" ? itemById.get(binding.id) : technologyById.get(binding.id);
  if (!record) throw new Error(`Phase ${phase} binding ${binding.id} is missing from asset map.`);
  const source = binding.kind === "item" ? itemAsset(record) : technologyAsset(record);
  const size = variant === "rail" ? 18 : 20;
  return `<img class="phase-icon phase-icon-${variant}" src="${source}" width="${size}" height="${size}" alt="" aria-hidden="true"/>`;
}

function addStructuralIcons(html) {
  let transformed = html.replace(/<a(?=[^>]*\bclass="[^"]*\brail-tab\b[^"]*")(?=[^>]*\bdata-phase="([^"]+)")[^>]*>/g, (opening, phase, offset, source) => {
    if (source.slice(offset + opening.length).startsWith('<img class="phase-icon phase-icon-rail"')) return opening;
    return `${opening}${phaseIcon(phase, "rail")}`;
  });
  transformed = transformed.replace(/<a(?=[^>]*\bclass="[^"]*\bphase-tag\b[^"]*")(?=[^>]*\bhref="#([^"]+)")[^>]*>/g, (opening, phase, offset, source) => {
    if (!phaseBindings.has(phase)) return opening;
    if (source.slice(offset + opening.length).startsWith('<img class="phase-icon phase-icon-tag"')) return opening;
    return `${opening}${phaseIcon(phase, "tag")}`;
  });
  return transformed;
}

function addTechnologyIcons(html) {
  return html.replace(/<span(?=[^>]*\bclass="[^"]*\btech-ref\b[^"]*")(?=[^>]*\bdata-tech-id="(\d+)")[^>]*>/g, (opening, id, offset, source) => {
    const technology = technologyById.get(Number(id));
    if (!technology) throw new Error(`Technology ${id} is missing from the external asset map.`);
    if (source.slice(offset + opening.length).startsWith('<img class="proto-icon proto-icon-tech"')) return opening;
    return `${opening}${technologyIcon(technology)}`;
  });
}

const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const skippedTags = new Set(["script", "style", "title", "code", "pre", "textarea"]);
const skippedClasses = new Set(["proto-ref", "tech-ref", "production-arrow", "map-note", "icon-free"]);

function transformVisibleText(html, callback) {
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/g;
  const stack = [];
  let cursor = 0;
  let output = "";
  for (const match of html.matchAll(tokenPattern)) {
    const text = html.slice(cursor, match.index);
    const skip = stack.some(entry => skippedTags.has(entry.tag) || entry.classes.some(name => skippedClasses.has(name)));
    output += skip ? text : callback(text);
    const token = match[0];
    output += token;
    if (/^<\//.test(token)) {
      const closing = token.match(/^<\/([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].tag === closing) {
          stack.splice(index, 1);
          break;
        }
      }
    } else if (/^<[A-Za-z]/.test(token)) {
      const tag = token.match(/^<([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      if (tag && !voidElements.has(tag) && !/\/>$/.test(token)) {
        const classes = token.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/).filter(Boolean) || [];
        stack.push({ tag, classes });
      }
    }
    cursor = match.index + token.length;
  }
  const tail = html.slice(cursor);
  const skip = stack.some(entry => skippedTags.has(entry.tag) || entry.classes.some(name => skippedClasses.has(name)));
  output += skip ? tail : callback(tail);
  return output;
}

function addItemIcons(html) {
  return transformVisibleText(html, text => text.replace(makeItemMatcher(), visibleLabel => {
    const item = itemLabels.get(visibleLabel.toLocaleLowerCase("en-US"));
    return `<span class="proto-ref" data-item-id="${item.id}">${itemIcon(item)}${visibleLabel}</span>`;
  }));
}

function itemReference(itemId, label) {
  const item = itemById.get(itemId);
  if (!item) throw new Error(`Required contextual item ${itemId} is missing from the effective asset map.`);
  return `<span class="proto-ref" data-item-id="${item.id}">${itemIcon(item)}${label}</span>`;
}

function addRequiredContextIcons(html) {
  const titles = [
    {
      plain: '<span class="card-summary-title">Mall Logistics — buffer 900 Belts + 400 Sorters</span>',
      icon: `<span class="card-summary-title">Mall Logistics — buffer 900 ${itemReference(2001, "Belts")} + 400 ${itemReference(2011, "Sorters")}</span>`,
      label: "Mall Logistics",
    },
    {
      plain: '<span class="card-summary-title">Mall Industry — buffer 50 Miners + 50 Smelters + 50 Mk.I Assemblers</span>',
      icon: `<span class="card-summary-title">Mall Industry — buffer 50 ${itemReference(2301, "Miners")} + 50 ${itemReference(2302, "Smelters")} + 50 ${itemReference(2303, "Mk.I Assemblers")}</span>`,
      label: "Mall Industry",
    },
  ];
  let transformed = html;
  for (const title of titles) {
    if (!transformed.includes(title.plain)) throw new Error(`${title.label} title could not be normalized.`);
    transformed = transformed.replace(title.plain, title.icon);
  }
  return transformed;
}

function addExternalToolsLogo(html) {
  if (html.includes('class="game-logo section-logo"')) return html;
  const marker = /<hr\/>\s*<h1 id="ref-tools">External Tools and Communities<\/h1>/;
  const logo = '<img class="game-logo section-logo" src="assets/DSP_exported assets/Texture2D/dsp-logo-flat-en.png" width="1280" height="277" alt="Dyson Sphere Program"/>';
  if (!marker.test(html)) throw new Error("External Tools and Communities divider was not found.");
  return html.replace(marker, matched => `${logo}${matched}`);
}

function normalizeStorageBufferInstructions(html) {
  const bufferParagraph = '<p><strong>Buffer with a reason:</strong> mall products, expedition supplies, blocking byproducts, and deliberate phase batches benefit from visible limited storage. Giant buffers behind every line can hide a shortage until the whole factory fails at once; ordinary intermediates only need enough room to keep transport and production moving.</p>';
  const slotParagraph = '<p><strong>Storage limits use slots:</strong> The storage slider enables whole stack slots, not an exact item count. Card destinations state the number of enabled slots and the resulting maximum. If a target is smaller than one stack, pause the producing machine when the target is reached.</p>';
  if (!html.includes(slotParagraph)) {
    if (!html.includes(bufferParagraph)) throw new Error("Build-card buffer guidance could not be located.");
    html = html.replace(bufferParagraph, `${bufferParagraph}${slotParagraph}`);
  }

  const rules = [
    ["Conveyor Belt Mk.I", "limit the buffer to <span class=\"rate\">900 Belts</span>", "enable <span class=\"rate\">3 storage slots</span> (up to 900 Belts)"],
    ["Sorter Mk.I", "limit the buffer to <span class=\"rate\">400 Sorters</span>", "enable <span class=\"rate\">2 storage slots</span> (up to 400 Sorters)"],
    ["Mining Machines", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Arc Smelters", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Assembling Machine Mk.I", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Storage Mk.I", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Storage Tanks", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Wind Turbines", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Tesla Towers", "limit the buffer to <span class=\"rate\">100</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 100)"],
    ["Combustible Units", "limit the buffer to <span class=\"rate\">200</span>", "enable <span class=\"rate\">2 storage slots</span> (up to 200)"],
    ["EM-Rail Ejectors", "limit the deployment buffer to <span class=\"rate\">60 Ejectors</span>", "enable <span class=\"rate\">2 storage slots</span> (up to 60 Ejectors)"],
    ["Logistics Distributors", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
    ["Logistics Bots", "limit the buffer to <span class=\"rate\">200</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 200)"],
    ["Planetary Logistics Stations", "limit the buffer to <span class=\"rate\">10</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 10)"],
    ["Logistics Drones", "limit the buffer to <span class=\"rate\">200</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 200)"],
    ["Interstellar Logistics Stations", "limit the buffer to <span class=\"rate\">10</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 10)"],
    ["Logistics Vessels", "limit the buffer to <span class=\"rate\">50</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 50)"],
  ];
  for (const [label, oldInstruction, newInstruction] of rules) {
    const oldText = `<span class="machine">Storage Mk.I — ${label}</span> — ${oldInstruction}.`;
    const newText = `<span class="machine">Storage Mk.I — ${label}</span> — ${newInstruction}.`;
    if (html.includes(oldText)) html = html.replace(oldText, newText);
    else if (!html.includes(newText)) throw new Error(`Storage-slot instruction could not be verified for ${label}.`);
  }

  const securityRules = [
    ["Missile Turrets", "limit the buffer to <span class=\"rate\">8</span>", "produce <span class=\"rate\">8</span>, then pause the Assembler; enable 1 storage slot only if you prefer automatic replenishment up to a full stack of 50"],
    ["Signal Towers", "limit the buffer to <span class=\"rate\">20</span>", "enable <span class=\"rate\">1 storage slot</span> (up to 20)"],
    ["Missile Sets", "limit the buffer to <span class=\"rate\">200</span>", "enable <span class=\"rate\">2 storage slots</span> (up to 200)"],
  ];
  for (const [label, oldInstruction, newInstruction] of securityRules) {
    const oldText = `Storage Mk.I — ${label} — ${oldInstruction}.`;
    const newText = `Storage Mk.I — ${label} — ${newInstruction}.`;
    if (html.includes(oldText)) html = html.replace(oldText, newText);
    else if (!html.includes(newText)) throw new Error(`Security-mall storage instruction could not be verified for ${label}.`);
  }
  return html;
}

function addRedSecurityMall(html) {
  if (html.includes('id="card-red-security-mall"')) return html;

  const redStart = html.indexOf('<section class="phase-section phase-section-red" id="red">');
  const redEnd = html.indexOf('<section class="phase-section', redStart + 1);
  if (redStart < 0 || redEnd < 0) throw new Error("RED phase could not be located for the security mall.");
  let red = html.slice(redStart, redEnd);

  const researchMarker = "<p>If BLUE already cleared the cheap prerequisites, RED becomes pleasantly direct: build the graphite and oil branches, unlock their convergence, and let the Labs run.</p>";
  if (!red.includes(researchMarker)) throw new Error("RED research insertion point could not be located.");
  const securityResearch = '<p>Once red science is stable, finish <span class="tech-ref" data-tech-id="1806" role="button" tabindex="0">Missile Turret</span> → <span class="tech-ref" data-tech-id="1808" role="button" tabindex="0">Signal Tower</span> and add the Security Mall below. Let its limited boxes fill before starting the ILS rush. This is a stocked tool rather than a new rate target; when the boxes are full, the lines sleep.</p>';
  red = red.replace(researchMarker, `${researchMarker}${securityResearch}`);

  const redCardStart = red.indexOf('<details class="build-card build-card-anchor" id="card-red-red-cubes">');
  const redCardEnd = red.indexOf("</details>", redCardStart);
  if (redCardStart < 0 || redCardEnd < 0) throw new Error("RED cube card could not be located.");
  const insertionPoint = redCardEnd + "</details>".length;
  const securityCard = '<details class="build-card build-card-anchor" id="card-red-security-mall"><summary><span class="card-summary-title">Security Mall — buffer 8 Missile Turrets + 20 Signal Towers + 200 Missile Sets</span><span class="card-summary-meta"><span class="card-badge">MANDATED</span><span class="card-badge">BUFFERED</span></span></summary><div class="card-body"><div class="production-map"><section class="map-supplies"><h4>Supplies</h4><ul><li>Iron Ore.</li><li>Copper Ore.</li><li>Coal.</li><li>Stone.</li><li><a class="card-crossref-link" href="#route-blue-magnetic-coils">Magnetic Coils from BLUE</a>.</li><li><a class="card-crossref-link" href="#route-blue-circuit-boards">Circuit Boards from BLUE</a>.</li><li><a class="card-crossref-link" href="#reference-electromagnetic-turbines">Electric Motors from the reusable Electromagnetic Turbine line</a>.</li><li><a class="card-crossref-link" href="#card-bootstrap-mall-power">Wireless Power Towers from the BLUE mall</a>.</li></ul></section><section class="map-pipeline"><h4>Production Map</h4><div class="route-group"><h5>SUPPORTING BRANCHES</h5><div class="route-map" role="list"><div class="route-row" role="listitem"><span class="route-label">Steel branch</span><span class="route-chain">Iron Ore → Iron Ingots → Steel</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Engine branch</span><span class="route-chain">Copper Ingots + Magnetic Coils → Engines</span></div><div class="route-row" role="listitem"><span class="route-label">Fuel branch</span><span class="route-chain">Coal → Combustible Units</span></div><div class="route-row" role="listitem"><span class="route-label">Crystal branch</span><span class="route-chain">Stone → Silicon Ore → High-Purity Silicon → Crystal Silicon</span></div></div></div><div class="route-group"><h5>BUFFERED OUTPUTS</h5><div class="route-map" role="list"><div class="route-row route-convergence" role="listitem"><span class="route-label">Turret convergence</span><span class="route-chain">Steel + Electric Motors + Circuit Boards + Engines → Missile Turrets</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Missile convergence</span><span class="route-chain">Copper Ingots + Circuit Boards + Combustible Units + Engines → Missile Sets</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Tower convergence</span><span class="route-chain">Wireless Power Towers + Steel + Crystal Silicon → Signal Towers</span></div></div></div></section><section class="map-destination"><h4>Destination</h4><ul><li>Storage Mk.I — Missile Turrets — produce <span class="rate">8</span>, then pause the Assembler; enable 1 storage slot only if you prefer automatic replenishment up to a full stack of 50.</li><li>Storage Mk.I — Signal Towers — enable <span class="rate">1 storage slot</span> (up to 20).</li><li>Storage Mk.I — Missile Sets — enable <span class="rate">2 storage slots</span> (up to 200).</li></ul></section><div class="map-footer"><section class="map-footer-section map-note"><h4>Operating Note</h4><ul><li>Fill these three limited boxes before the ILS rush. The mall can sleep afterward and wake whenever the starter planet needs another battery or tower advance.</li></ul></section></div></div></div></details>';
  red = `${red.slice(0, insertionPoint)}${securityCard}${red.slice(insertionPoint)}`;
  return `${html.slice(0, redStart)}${red}${html.slice(redEnd)}`;
}

function normalizeRedSecurityMallCard(html) {
  const cardStart = html.indexOf('<details class="build-card build-card-anchor" id="card-red-security-mall">');
  const cardEnd = html.indexOf("</details>", cardStart);
  if (cardStart < 0 || cardEnd < 0) throw new Error("Security Mall card could not be normalized.");
  const card = '<details class="build-card build-card-anchor" id="card-red-security-mall"><summary><span class="card-summary-title">Security Mall — buffer 8 Missile Turrets + 20 Signal Towers + 200 Missile Sets</span><span class="card-summary-meta"><span class="card-badge">MANDATED</span><span class="card-badge">BUFFERED</span></span></summary><div class="card-body"><div class="production-map"><section class="map-supplies"><h4>Supplies</h4><ul><li>Iron Ore.</li><li>Copper Ore.</li><li>Coal.</li><li>Stone.</li><li><a class="card-crossref-link" href="#route-blue-magnetic-coils">Magnetic Coils from BLUE</a>.</li><li><a class="card-crossref-link" href="#route-blue-circuit-boards">Circuit Boards from BLUE</a>.</li></ul></section><section class="map-pipeline"><h4>Production Map</h4><div class="route-group"><h5>FOUNDATIONS</h5><div class="route-map" role="list"><div class="route-row" role="listitem"><span class="route-label">Steel branch</span><span class="route-chain">Iron Ore → Iron Ingots → Steel</span></div><div class="route-row" role="listitem"><span class="route-label">Copper branch</span><span class="route-chain">Copper Ore → Copper Ingots</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Engine branch</span><span class="route-chain">Copper Ingots + Magnetic Coils → Engines</span></div><div class="route-row" role="listitem"><span class="route-label">Fuel branch</span><span class="route-chain">Coal → Combustible Units</span></div><div class="route-row" role="listitem"><span class="route-label">Crystal branch</span><span class="route-chain">Stone → Silicon Ore → High-Purity Silicon → Crystal Silicon</span></div></div></div><div class="route-group"><h5>MOTORS AND POWER</h5><div class="route-map" role="list"><div class="route-row route-convergence" role="listitem"><span class="route-label">Motor branch</span><span class="route-chain">Iron Ingots → Gears; Iron Ingots + Gears + Magnetic Coils → Electric Motors</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Tower branch</span><span class="route-chain">Iron Ingots + Magnetic Coils → Tesla Towers</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Exciter branch</span><span class="route-chain">Stone → Glass → Prisms; Magnetic Coils + Prisms → Plasma Exciters</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Wireless convergence</span><span class="route-chain">Tesla Towers + Plasma Exciters → Wireless Power Towers</span></div></div></div><div class="route-group"><h5>BUFFERED OUTPUTS</h5><div class="route-map" role="list"><div class="route-row route-convergence" role="listitem"><span class="route-label">Turret convergence</span><span class="route-chain">Steel + Electric Motors + Circuit Boards + Engines → Missile Turrets</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Missile convergence</span><span class="route-chain">Copper Ingots + Circuit Boards + Combustible Units + Engines → Missile Sets</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Tower convergence</span><span class="route-chain">Wireless Power Towers + Steel + Crystal Silicon → Signal Towers</span></div></div></div></section><section class="map-destination"><h4>Destination</h4><ul><li>Storage Mk.I — Missile Turrets — produce <span class="rate">8</span>, then pause the Assembler; enable 1 storage slot only if you prefer automatic replenishment up to a full stack of 50.</li><li>Storage Mk.I — Signal Towers — enable <span class="rate">1 storage slot</span> (up to 20).</li><li>Storage Mk.I — Missile Sets — enable <span class="rate">2 storage slots</span> (up to 200).</li></ul></section><div class="map-footer"><section class="map-footer-section map-note"><h4>Operating Note</h4><ul><li>Fill these three limited boxes before the ILS rush. The mall can sleep afterward and wake whenever the starter planet needs another battery or tower advance.</li></ul></section></div></div></div></details>';
  return `${html.slice(0, cardStart)}${card}${html.slice(cardEnd + "</details>".length)}`;
}

function applyRedPlanetaryBaseGuidance(html) {
  html = html
    .replace(/<span class="proto-ref" data-item-id="(?:3005|1609|3007)">([^<]+)<\/span>/g, "$1")
    .replace('<a href="#ref-dark-fog">Dark Fog Industry</a>', "")
    .replace(", interstellar power transmission, advanced mining, and Dark Fog industry are optional paths.", ", interstellar power transmission, and advanced mining are optional paths.")
    .replace(/<p><strong>Combat scope:<\/strong>[\s\S]*?<\/p>/, "")
    .replaceAll('alt="Dyson Sphere Program: Rise of the Dark Fog"', 'alt="Dyson Sphere Program"');

  const referenceStart = html.indexOf('<h1 id="ref-dark-fog">');
  if (referenceStart >= 0) {
    const blockStart = html.lastIndexOf("<hr/>", referenceStart);
    const blockEnd = html.indexOf('<img class="game-logo section-logo"', referenceStart);
    if (blockStart < 0 || blockEnd < 0) throw new Error("Legacy Dark Fog reference boundaries could not be located.");
    html = `${html.slice(0, blockStart)}${html.slice(blockEnd)}`;
  }

  const redStart = html.indexOf('<section class="phase-section phase-section-red" id="red">');
  const redEnd = html.indexOf('<section class="phase-section', redStart + 1);
  if (redStart < 0 || redEnd < 0) throw new Error("RED phase could not be located for planetary-base guidance.");
  let red = html.slice(redStart, redEnd);
  const procedure = '<h2 id="red-planetary-base-clearing">Clear the starter planet\'s existing bases</h2><p>If you started a new game by selecting <strong>New Game → Start</strong>, you\'ve already met the neighbors. Here\'s how to get rid of them instead of letting them level up in peace.</p><p>Place one fixed battery of eight Missile Turrets on the established grid, feed it Missile Sets, and confirm every turret is loaded. Once the battery is ready:</p><ol class="diagnostic-steps"><li><strong>Bring power to the edge.</strong> Extend Tesla Towers toward the planetary base and stop just outside its aggro range. If you pull aggro early, fall back and let the missile battery remove the structures that reacted before advancing again.</li><li><strong>Start the barrage.</strong> Place the first powered Signal Tower inside aggro range, but not right on top of the base. Let it draw the response and give the battery time to start landing missiles.</li><li><strong>Move the coverage forward.</strong> While the first Signal Tower is taking the attention, place a second powered tower closer and try to cover the full base in its range.</li><li><strong>Reach the far side.</strong> If structures remain outside coverage, replace or advance the final Signal Tower until the battery can finish them, then recover any forward towers you no longer need.</li></ol><aside class="guide-warning"><strong>⚠ Keep the battery fed.</strong> If the turrets stop firing, check their power and Missile Set supply before changing the plan.</aside>';
  const existingProcedure = red.indexOf('<h2 id="red-planetary-base-clearing">');
  if (existingProcedure >= 0) {
    const procedureEnd = red.indexOf("</aside>", existingProcedure);
    if (procedureEnd < 0) throw new Error("Existing RED planetary-base procedure could not be normalized.");
    red = `${red.slice(0, existingProcedure)}${procedure}${red.slice(procedureEnd + "</aside>".length)}`;
  } else {
    const cardStart = red.indexOf('<details class="build-card build-card-anchor" id="card-red-security-mall">');
    const cardEnd = red.indexOf("</details>", cardStart);
    if (cardStart < 0 || cardEnd < 0) throw new Error("Security Mall card could not be located for planetary-base guidance.");
    const insertionPoint = cardEnd + "</details>".length;
    red = `${red.slice(0, insertionPoint)}${procedure}${red.slice(insertionPoint)}`;
  }
  red = red.replace(
    "If you pull aggro early, fall back and let the missile battery remove the structures that reacted before advancing again.",
    "If you pull aggro early, fall back and shoot down any chasing units, then make sure you have not left a Tesla Tower inside aggro range.",
  );
  red = red.replace(
    "then recover any forward towers you no longer need.</li></ol>",
    "then recover any forward towers you no longer need.</li><li><strong>Claim the free power.</strong> Cap the exposed core-drill site with a Geothermal Power Station. It turns the cleared base into steady generation without paying a Foundation or Soil Pile tax.</li></ol>",
  );
  html = `${html.slice(0, redStart)}${red}${html.slice(redEnd)}`;

  const ilsStart = html.indexOf('<section class="phase-section phase-section-ils" id="ils">');
  const ilsEnd = html.indexOf('<section class="phase-section', ilsStart + 1);
  if (ilsStart < 0 || ilsEnd < 0) throw new Error("ILS phase could not be located for the RED reminder.");
  let ils = html.slice(ilsStart, ilsEnd);
  ils = ils.replace(
    "Add local defenses when Dark Fog makes an unattended mining world a bad neighborhood.",
    'If the destination is occupied, reuse the <a href="#red-planetary-base-clearing">RED missile-battery and Signal Tower pattern</a> before leaving the outpost unattended.',
  );
  ils = ils.replace('<li class="task-list-item"><input class="task-list-item-checkbox" disabled="disabled" type="checkbox"/>Dark Fog defenses, if needed, can protect the outpost without Icarus standing guard.</li>', "");
  if ((ils.match(/href="#red-planetary-base-clearing"/g) || []).length !== 1) throw new Error("ILS must contain one RED defense reminder.");
  html = `${html.slice(0, ilsStart)}${ils}${html.slice(ilsEnd)}`;

  const warpStart = html.indexOf('<section class="phase-section phase-section-warp" id="warp">');
  const warpEnd = html.indexOf('<section class="phase-section', warpStart + 1);
  if (warpStart < 0 || warpEnd < 0) throw new Error("WARP phase could not be located for the RED reminder.");
  let warp = html.slice(warpStart, warpEnd);
  const legacySecurity = warp.indexOf("Basic outpost security;");
  if (legacySecurity >= 0) {
    const rowStart = warp.lastIndexOf("<tr>", legacySecurity);
    const rowEnd = warp.indexOf("</tr>", legacySecurity);
    if (rowStart < 0 || rowEnd < 0) throw new Error("WARP security row boundaries could not be located.");
    const reminderRow = '<tr><td><strong>8 Missile Turrets + 200 Missile Sets + Signal Towers</strong></td><td>One carried copy of the <a href="#red-planetary-base-clearing">RED planetary-base-clearing setup</a> when the destination needs it</td></tr>';
    warp = `${warp.slice(0, rowStart)}${reminderRow}${warp.slice(rowEnd + "</tr>".length)}`;
  }
  if ((warp.match(/href="#red-planetary-base-clearing"/g) || []).length !== 1) throw new Error("WARP must contain one RED defense reminder.");
  html = `${html.slice(0, warpStart)}${warp}${html.slice(warpEnd)}`;
  return html;
}

function alignIlsBootstrapMap(html) {
  const start = html.indexOf(
    '<div class="inline-production-map',
    html.indexOf("Build the temporary component lines."),
  );
  const closing = "</div></li>";
  const end = html.indexOf(closing, start);
  if (start < 0 || end < 0) throw new Error("ILS bootstrap production map could not be located.");

  const map = '<div class="inline-production-map production-map" aria-label="ILS bootstrap production map"><p class="inline-map-intro">Use the reusable <a class="card-crossref-link" href="#reference-electromagnetic-turbines">Electromagnetic Turbine line</a> for the shared turbine supply, then split the protected batch between Particle Containers and Reinforced Thrusters as shown below.</p><div class="route-group"><h5>TITANIUM ALLOY</h5><div class="route-map" role="list"><div class="route-row" role="listitem"><span class="route-label">Acid branch</span><span class="route-chain">Crude Oil → Refined Oil; Refined Oil + Stone + Water → Sulfuric Acid</span></div><div class="route-row" role="listitem"><span class="route-label">Steel branch</span><span class="route-chain">Iron Ore → Iron Ingots → Steel</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Alloy convergence</span><span class="route-chain">Reserved Titanium Ingots + Steel + Sulfuric Acid → Titanium Alloy</span></div></div></div><div class="route-group"><h5>PROCESSORS</h5><div class="route-map" role="list"><div class="route-row" role="listitem"><span class="route-label">Microcrystalline branch</span><span class="route-chain">High-Purity Silicon + Copper Ingots → Microcrystalline Components</span></div><div class="route-row" role="listitem"><span class="route-label">Circuit branch</span><span class="route-chain">Iron Ingots + Copper Ingots → Circuit Boards</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Processor convergence</span><span class="route-chain">Microcrystalline Components + Circuit Boards → Processors</span></div></div></div><div class="route-group"><h5>SHARED TURBINE OUTPUTS</h5><div class="route-map" role="list"><div class="route-row route-convergence" role="listitem"><span class="route-label">Particle Containers</span><span class="route-chain">Electromagnetic Turbines + <a class="card-crossref-link" href="#reference-graphene">Graphene</a> → Particle Containers</span></div><div class="route-row route-convergence" role="listitem"><span class="route-label">Reinforced Thrusters</span><span class="route-chain">Titanium Alloy + Electromagnetic Turbines → Reinforced Thrusters</span></div></div></div></div>';
  return `${html.slice(0, start)}${map}</li>${html.slice(end + closing.length)}`;
}

function transform(html) {
  const prepared = ensureIconFreeRegions(alignIlsBootstrapMap(applyRedPlanetaryBaseGuidance(normalizeStorageBufferInstructions(normalizeRedSecurityMallCard(addRedSecurityMall(stripGeneratedMarkup(html)))))));
  const arrows = materializeProductionArrows(prepared);
  let transformed = addStructuralIcons(arrows.html);
  transformed = addTechnologyIcons(transformed);
  transformed = addItemIcons(transformed);
  transformed = addRequiredContextIcons(transformed);
  transformed = addExternalToolsLogo(transformed);
  return { html: transformed, arrows };
}

function count(pattern, value) {
  return [...value.matchAll(pattern)].length;
}

function bareRouteArrows(html) {
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/g;
  const stack = [];
  const failures = [];
  let cursor = 0;
  for (const match of html.matchAll(tokenPattern)) {
    const text = html.slice(cursor, match.index);
    const inRoute = stack.some(entry => entry.classes.includes("route-chain"));
    const inGlyph = stack.some(entry => entry.classes.includes("production-arrow-glyph"));
    if (inRoute && !inGlyph && text.includes("→")) failures.push(text.trim());
    const token = match[0];
    if (/^<\//.test(token)) {
      const closing = token.match(/^<\/([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].tag === closing) {
          stack.splice(index, 1);
          break;
        }
      }
    } else if (/^<[A-Za-z]/.test(token)) {
      const tag = token.match(/^<([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      if (tag && !voidElements.has(tag) && !/\/>$/.test(token)) {
        const classes = token.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/).filter(Boolean) || [];
        stack.push({ tag, classes });
      }
    }
    cursor = match.index + token.length;
  }
  return failures;
}

function validate(html) {
  const failures = [];
  const assert = (condition, message) => { if (!condition) failures.push(message); };
  const techRefs = [...html.matchAll(/<span(?=[^>]*\bclass="[^"]*\btech-ref\b[^"]*")(?=[^>]*\bdata-tech-id="(\d+)")[^>]*>([\s\S]*?)<\/span>/g)];
  for (const reference of techRefs) {
    const technology = technologyById.get(Number(reference[1]));
    assert(Boolean(technology), `Technology ${reference[1]} is not mapped.`);
    if (technology) assert(reference[2].includes(`src="${technologyAsset(technology)}"`), `Technology ${reference[1]} has the wrong icon.`);
  }

  const protoRefs = [...html.matchAll(/<span class="proto-ref" data-item-id="(\d+)">([\s\S]*?)<\/span>/g)];
  for (const reference of protoRefs) {
    const item = itemById.get(Number(reference[1]));
    assert(Boolean(item), `Item ${reference[1]} is not mapped.`);
    if (item) assert(reference[2].includes(`src="${itemAsset(item)}"`), `Item ${reference[1]} has the wrong icon.`);
  }

  const arrows = [...html.matchAll(/<span class="production-arrow" data-producer-item-id="(\d+)" data-producer-type="([^"]+)"[^>]*>(<img[^>]+>)<span class="production-arrow-glyph" aria-hidden="true">→<\/span><\/span>/g)];
  for (const arrow of arrows) {
    const producer = itemById.get(Number(arrow[1]));
    assert(Boolean(producer), `Producer ${arrow[1]} is not mapped.`);
    if (producer) assert(arrow[3].includes(`src="${itemAsset(producer)}"`), `Producer ${arrow[1]} has the wrong icon.`);
  }

  const unwrappedArrows = bareRouteArrows(html);
  assert(unwrappedArrows.length === 0, `Bare production arrows remain in routes: ${unwrappedArrows.join(" | ")}`);

  for (const [phase] of phaseBindings) {
    const rail = html.match(new RegExp(`<a(?=[^>]*class="[^"]*\\brail-tab\\b[^"]*")(?=[^>]*data-phase="${phase}")[^>]*>([\\s\\S]*?)<\\/a>`));
    const binding = phaseBindings.get(phase);
    const record = binding.kind === "item" ? itemById.get(binding.id) : technologyById.get(binding.id);
    const expectedSource = binding.kind === "item" ? itemAsset(record) : technologyAsset(record);
    assert(Boolean(rail?.[1].includes('class="phase-icon phase-icon-rail"')), `Phase ${phase} rail icon is missing.`);
    assert(Boolean(rail?.[1].includes(`src="${expectedSource}"`)), `Phase ${phase} rail icon is wrong.`);
    const phaseLinks = [...html.matchAll(new RegExp(`<a(?=[^>]*class="[^"]*\\bphase-tag\\b[^"]*")(?=[^>]*href="#${phase}")[^>]*>([\\s\\S]*?)<\\/a>`, "g"))];
    for (const link of phaseLinks) assert(link[1].includes(`src="${expectedSource}"`), `Phase ${phase} tag icon is wrong.`);
  }

  const iconFreeRegions = [...html.matchAll(/<(?:div|li)[^>]*class="[^"]*\bicon-free\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|li)>/g)];
  assert(iconFreeRegions.every(region => !region[1].includes("proto-icon")), "An icon-free guide region contains a prototype icon.");
  const operatingNotes = [...html.matchAll(/<section class="map-footer-section map-note[^"]*">([\s\S]*?)<\/section>/g)];
  assert(operatingNotes.every(note => !note[1].includes("proto-icon")), "A card Operating Note contains a prototype icon.");
  const mallTitle = html.match(/<span class="card-summary-title">Mall Industry([\s\S]*?)<\/span><span class="card-summary-meta">/);
  assert(Boolean(mallTitle), "Mall Industry card title is missing.");
  for (const itemId of [2301, 2302, 2303]) assert(Boolean(mallTitle?.[1].includes(`data-item-id="${itemId}"`)), `Mall Industry title is missing item ${itemId}.`);
  const logisticsTitle = html.match(/<span class="card-summary-title">Mall Logistics([\s\S]*?)<\/span><span class="card-summary-meta">/);
  assert(Boolean(logisticsTitle), "Mall Logistics card title is missing.");
  for (const itemId of [2001, 2011]) assert(Boolean(logisticsTitle?.[1].includes(`data-item-id="${itemId}"`)), `Mall Logistics title is missing item ${itemId}.`);
  assert(count(/class="game-logo(?: |")/g, html) === 2, "The guide must display the game logo at the title and External Tools sections.");

  const localImages = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].map(match => match[1]);
  for (const source of localImages) {
    assert(source.startsWith("assets/"), `Non-local image source found: ${source}`);
    assert(fs.existsSync(path.join(root, source)), `Referenced image is missing: ${source}`);
  }

  if (failures.length) throw new Error(`Prototype icon validation failed:\n- ${failures.join("\n- ")}`);
  return {
    technologyReferences: techRefs.length,
    itemReferences: protoRefs.length,
    producerArrows: arrows.length,
    phaseIcons: count(/class="phase-icon /g, html),
    imageReferences: localImages.length,
  };
}

const source = fs.readFileSync(htmlPath, "utf8");
const result = transform(source);

if (mode === "write") {
  fs.writeFileSync(htmlPath, result.html, "utf8");
  const summary = validate(result.html);
  console.log(JSON.stringify({
    status: "WRITTEN",
    sourceArrows: result.arrows.sourceArrows,
    producerArrows: result.arrows.outputArrows,
    normalizedRoutes: result.arrows.normalizedRoutes,
    ...summary,
  }, null, 2));
} else {
  if (result.html !== source) throw new Error("Prototype icon markup is incomplete or not idempotent. Run with --write.");
  console.log(JSON.stringify({ status: "PASS", ...validate(source) }, null, 2));
}
