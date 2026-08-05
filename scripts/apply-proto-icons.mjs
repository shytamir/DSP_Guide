import fs from "node:fs";
import path from "node:path";
import {
  components,
  elementTextByClass,
  findElementsByClass,
  getAttribute,
  hasAttribute,
  isNativeComponent,
  replaceElementsByClass,
} from "./lib/markup-contracts.mjs";

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
const steamStoreUrl = "https://store.steampowered.com/app/1366540/Dyson_Sphere_Program/";
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
  const withoutItemReferences = replaceElementsByClass(html, components.itemReference.className, reference =>
    reference.inner.replace(/<img class="proto-icon proto-icon-item"[^>]*\/>/, ""),
  );
  const withoutProductionArrows = replaceElementsByClass(withoutItemReferences, components.productionArrow.className, () => "→");
  return withoutProductionArrows
    .replace(/<img class="proto-icon proto-icon-tech"[^>]*\/>/g, "")
    .replace(/<img class="phase-icon phase-icon-(?:rail|tag)"[^>]*\/>/g, "");
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
  return `<span class="production-arrow" data-producer-item-id="${producer.id}" data-producer-type="${facility.producerType}">${itemIcon(producer, "proto-icon proto-icon-producer")}<span class="production-arrow-glyph" aria-hidden="true">→</span><span class="visually-hidden">${label}</span></span>`;
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
  return replaceElementsByClass(html, components.technologyReference.className, reference => {
    const id = getAttribute(reference.openingTag, components.technologyReference.idAttribute);
    const technology = technologyById.get(Number(id));
    if (!technology) throw new Error(`Technology ${id} is missing from the external asset map.`);
    if (reference.inner.startsWith('<img class="proto-icon proto-icon-tech"')) return reference.full;
    return reference.full.replace(reference.openingTag, `${reference.openingTag}${technologyIcon(technology)}`);
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
  const logo = `<a href="${steamStoreUrl}"><img class="game-logo section-logo" src="assets/DSP_exported assets/Texture2D/dsp-logo-flat-en.png" width="1280" height="277" alt="Dyson Sphere Program"/></a>`;
  if (!marker.test(html)) throw new Error("External Tools and Communities divider was not found.");
  return html.replace(marker, matched => `${logo}${matched}`);
}

function transform(html) {
  const prepared = ensureIconFreeRegions(stripGeneratedMarkup(html));
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
  const techRefs = findElementsByClass(html, components.technologyReference.className);
  for (const reference of techRefs) {
    const id = getAttribute(reference.openingTag, components.technologyReference.idAttribute);
    const technology = technologyById.get(Number(id));
    assert(Boolean(technology), `Technology ${id} is not mapped.`);
    if (technology) assert(reference.inner.includes(`src="${technologyAsset(technology)}"`), `Technology ${id} has the wrong icon.`);
  }

  const protoRefs = findElementsByClass(html, components.itemReference.className);
  for (const reference of protoRefs) {
    const id = getAttribute(reference.openingTag, components.itemReference.idAttribute);
    const item = itemById.get(Number(id));
    assert(Boolean(item), `Item ${id} is not mapped.`);
    if (item) assert(reference.inner.includes(`src="${itemAsset(item)}"`), `Item ${id} has the wrong icon.`);
  }

  const arrows = findElementsByClass(html, components.productionArrow.className);
  for (const arrow of arrows) {
    const id = getAttribute(arrow.openingTag, components.productionArrow.idAttribute);
    const producer = itemById.get(Number(id));
    assert(Boolean(producer), `Producer ${id} is not mapped.`);
    if (producer) {
      assert(arrow.inner.includes(`src="${itemAsset(producer)}"`), `Producer ${id} has the wrong icon.`);
      assert(elementTextByClass(arrow.inner, "visually-hidden") === `Produced in ${producer.name}`, `Producer ${id} has the wrong accessible description.`);
    }
  }

  const unwrappedArrows = bareRouteArrows(html);
  assert(unwrappedArrows.length === 0, `Bare production arrows remain in routes: ${unwrappedArrows.join(" | ")}`);

  const routeMaps = findElementsByClass(html, components.routeMap.className);
  const routeRows = findElementsByClass(html, components.routeRow.className);
  assert(routeMaps.length > 0 && routeMaps.every(map => isNativeComponent(map, components.routeMap) && !hasAttribute(map.openingTag, "role")), "A production map is not a native list.");
  assert(routeRows.length > 0 && routeRows.every(row => isNativeComponent(row, components.routeRow) && !hasAttribute(row.openingTag, "role")), "A production route is not a native list item.");

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
  const gameLogos = findElementsByClass(html, "game-logo");
  assert(gameLogos.length === 2, "The guide must display the game logo at the title and External Tools sections.");
  const steamLogoLinks = [...html.matchAll(new RegExp(`<a\\b(?=[^>]*\\bhref="${escapeRegExp(steamStoreUrl)}")[^>]*>([\\s\\S]*?)<\\/a>`, "g"))];
  assert(steamLogoLinks.length === 2 && steamLogoLinks.every(link => findElementsByClass(link[1], "game-logo").length === 1), "Both game logos must link to the Dyson Sphere Program Steam store page.");

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
