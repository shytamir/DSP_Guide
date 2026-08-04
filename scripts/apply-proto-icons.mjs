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

const itemById = new Map(map.items.map(item => [Number(item.id), item]));
const technologyById = new Map(map.technologies.map(technology => [Number(technology.id), technology]));
if (itemById.size !== map.items.length) throw new Error("Duplicate item ID in asset map.");
if (technologyById.size !== map.technologies.length) throw new Error("Duplicate technology ID in asset map.");

const toWebPath = value => value.replaceAll("\\", "/").replace(/^\.\//, "");
const itemAsset = item => toWebPath(`${map.assetRoots.items}/${item.asset}`);
const technologyAsset = technology => toWebPath(`${map.assetRoots.technologies}/${technology.asset}`);
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeAttribute = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

for (const item of map.items) {
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
for (const item of map.items) {
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
  ["photon", { kind: "item", id: 1122 }],
  ["white", { kind: "item", id: 6006 }],
  ["warp", { kind: "item", id: 1210 }],
  ["logistics", { kind: "item", id: 2103 }],
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
const skippedClasses = new Set(["proto-ref", "tech-ref", "production-arrow"]);

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

function transform(html) {
  const arrows = materializeProductionArrows(html);
  let transformed = addStructuralIcons(arrows.html);
  transformed = addTechnologyIcons(transformed);
  transformed = addItemIcons(transformed);
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
    assert(Boolean(rail?.[1].includes('class="phase-icon phase-icon-rail"')), `Phase ${phase} rail icon is missing.`);
  }

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
