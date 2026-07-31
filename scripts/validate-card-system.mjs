import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const authoritativeRecipes = JSON.parse(
  fs.readFileSync(
    "dsp_universal_end_product_dag_v1_0/dsp_universal_recipe_hyperedges_v1_0.json",
    "utf8",
  ),
).recipes;
const errors = [];
const cards = [...html.matchAll(/<details class="build-card[^"]*" id="([^"]+)">([\s\S]*?)<\/details>/g)];
const ids = cards.map(match => match[1]);
const uniqueIds = new Set(ids);

const expectedCards = new Map([
  ["card-bootstrap-mall-logistics", "Mall Logistics — buffer 600 Belts + 400 Sorters"],
  ["card-bootstrap-mall-industry", "Mall Industry — buffer 50 Miners + 50 Smelters + 50 Mk.I Assemblers"],
  ["card-bootstrap-mall-storage", "Mall Storage — buffer 50 Storage Mk.I + 50 Storage Tanks"],
  ["card-bootstrap-mall-power", "Mall Power — buffer 50 Wind Turbines + 100 Tesla Towers + 200 Combustible Units"],
  ["card-blue-blue-cubes", "Blue Cubes — 40/min"],
  ["card-red-red-cubes", "Red Cubes — 20/min"],
  ["card-titanium-first-outpost", "First Off-World Smelting Outpost — 860 Titanium Ingots + 520 High-Purity Silicon"],
  ["card-yellow-yellow-cubes", "Yellow Cubes — 22.5/min"],
  ["card-purple-processors", "Processors — 45/min"],
  ["card-purple-particle-broadband", "Particle Broadband — 22.5/min"],
  ["card-warp-space-warpers", "Space Warpers — 36/min from green cubes"],
  ["card-green-quantum-chips", "Quantum Chips — 7.5/min"],
  ["card-green-graviton-lenses", "Graviton Lenses — 7.5/min"],
  ["card-dyson-solar-sails", "Solar Sails — 517.5/min installed capacity"],
  ["card-sphere-dyson-components", "Dyson Sphere Components — 16.875/min"],
  ["card-sphere-deuteron-fuel-rods", "Deuteron Fuel Rods — 30/min"],
  ["card-logistics-distribution-kit", "Distribution Logistics Kit — buffer 50 Distributors + 200 Bots"],
  ["card-logistics-planetary-kit", "Planetary Logistics Kit — buffer 10 PLS + 200 Drones"],
  ["card-logistics-interstellar-kit", "Interstellar Logistics Kit — buffer 10 ILS + 50 Vessels"],
]);

if (ids.length !== uniqueIds.size) {
  errors.push(`Duplicate build-card IDs: ${ids.length - uniqueIds.size}`);
}
if (cards.length !== expectedCards.size) {
  errors.push(`Expected ${expectedCards.size} cards; found ${cards.length}`);
}

for (const [id, expectedTitle] of expectedCards) {
  const card = cards.find(match => match[1] === id);
  if (!card) {
    errors.push(`Missing planned card: ${id}`);
    continue;
  }
  const title = card[2].match(/card-summary-title">([^<]+)</)?.[1] || "";
  if (title !== expectedTitle) {
    errors.push(`${id} title changed: "${title}"`);
  }
}

for (const id of ids) {
  if (!expectedCards.has(id)) errors.push(`Unplanned card remains: ${id}`);
}

const links = [...html.matchAll(/<a class="card-crossref-link" href="#([^"]+)"/g)].map(
  match => match[1],
);
for (const target of links) {
  if (!uniqueIds.has(target)) errors.push(`Broken card reference: #${target}`);
}

for (const [fullMatch, id, body] of cards) {
  const requiredStages = [
    'card-stage-input"><h4>Input</h4>',
    'card-stage-pipeline"><h4>Pipeline</h4>',
    'card-stage-output"><h4>Output</h4>',
  ];
  for (const required of requiredStages) {
    if (!body.includes(required)) errors.push(`${id} is missing ${required}`);
  }
  const positions = requiredStages.map(stage => body.indexOf(stage));
  if (!positions.every((position, index) => index === 0 || position > positions[index - 1])) {
    errors.push(`${id} does not follow Input → Pipeline → Output`);
  }
  if (/<details class="build-card[^>]*\sopen(?:\s|>)/.test(fullMatch)) {
    errors.push(`${id} is open by default`);
  }
  if (/card-stage-(?:totals|pickup)/.test(body)) {
    errors.push(`${id} contains a retired mathematical footer`);
  }

  const input = body.match(/card-stage-input"><h4>Input<\/h4><ul>([\s\S]*?)<\/ul>/)?.[1] || "";
  const pipeline = body.match(/card-stage-pipeline"><h4>Pipeline<\/h4><ul>([\s\S]*?)<\/ul>/)?.[1] || "";
  const output = body.match(/card-stage-output"><h4>Output<\/h4><ul>([\s\S]*?)<\/ul>/)?.[1] || "";
  const visible = value => value.replace(/<[^>]+>/g, " ");

  if (/\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|items?)\b/i.test(visible(input))) {
    errors.push(`${id} puts exact internal arithmetic in Input`);
  }
  if (/\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|machines?|assemblers?|smelters?|plants?|labs?|belts?)\b/i.test(visible(pipeline))) {
    errors.push(`${id} puts exact internal arithmetic in Pipeline`);
  }
  if (!/\d/.test(visible(output))) {
    errors.push(`${id} Output does not restate its exact end-product target`);
  }

  const tailStages = [...body.matchAll(/card-stage-(surplus|note)"><h4>/g)].map(match => match[1]);
  if (new Set(tailStages).size !== tailStages.length) {
    errors.push(`${id} duplicates a permitted footer section`);
  }
}

for (const phaseId of ["ils", "photon", "white"]) {
  const start = html.search(new RegExp(`<section class="phase-section[^>]*" id="${phaseId}">`));
  const end = html.indexOf('<section class="phase-section', start + 1);
  const phase = html.slice(start, end < 0 ? html.length : end);
  if (phase.includes('<details class="build-card')) {
    errors.push(`${phaseId.toUpperCase()} still contains a build card`);
  }
}

for (const retired of [
  "Minimal pickup interval",
  "Total draw and output",
  "card-green-green-cubes",
  "card-photon-critical-photons",
  "card-photon-antimatter",
  "card-white-white-cubes",
]) {
  if (html.includes(retired)) errors.push(`Retired card-system text remains: ${retired}`);
}

const recipeOutputs = new Map([
  [84, 2001],
  [85, 2011],
  [45, 2303],
  [56, 2302],
  [48, 2301],
  [86, 2101],
  [114, 2106],
  [7, 2203],
  [8, 2201],
  [133, 1128],
  [9, 6001],
  [18, 6002],
  [27, 6003],
  [51, 1303],
  [36, 1402],
  [79, 1210],
  [52, 1305],
  [101, 1209],
  [70, 1501],
  [81, 1502],
  [41, 1802],
  [122, 2107],
  [123, 5003],
  [93, 2103],
  [94, 5001],
  [95, 2104],
  [96, 5002],
]);

for (const [recipeId, outputId] of recipeOutputs) {
  const recipe = authoritativeRecipes.find(candidate => candidate.recipe_id === recipeId);
  if (!recipe) {
    errors.push(`Authoritative recipe ${recipeId} is missing`);
  } else if (!recipe.outputs.some(output => output.item_id === outputId)) {
    errors.push(`Authoritative recipe ${recipeId} no longer produces item ${outputId}`);
  }
}

if (errors.length) {
  console.error(`Card validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Card validation passed: ${cards.length} planned cards, ${links.length} direct card links, no cards in ILS/PHOTON/WHITE, reader-facing stages intact, and ${recipeOutputs.size} authoritative output recipes verified.`,
);
