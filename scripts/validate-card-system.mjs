import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const authoritativeRecipes = JSON.parse(
  fs.readFileSync(
    "dsp_universal_end_product_dag_v1_0/dsp_universal_recipe_hyperedges_v1_0.json",
    "utf8",
  ),
).recipes;
const errors = [];
const cards = [...html.matchAll(/<details class="build-card[^\"]*" id="([^\"]+)">([\s\S]*?)<\/details>/g)];
const ids = cards.map(match => match[1]);
const uniqueIds = new Set(ids);

const expectedCards = new Map([
  ["card-bootstrap-mall-logistics", "Mall Logistics — buffer 900 Belts + 400 Sorters"],
  ["card-bootstrap-mall-industry", "Mall Industry — buffer 50 Miners + 50 Smelters + 50 Mk.I Assemblers"],
  ["card-bootstrap-mall-storage", "Mall Storage — buffer 50 Storage Mk.I + 50 Storage Tanks"],
  ["card-bootstrap-mall-power", "Mall Power — buffer 50 Wind Turbines + 100 Tesla Towers + 200 Combustible Units"],
  ["card-blue-blue-cubes", "Blue Cubes — 40/min"],
  ["card-red-red-cubes", "Red Cubes — 20/min"],
  ["card-titanium-first-outpost", "First Off-World Smelting Outpost — 860 Titanium Ingots + 520 High-Purity Silicon"],
  ["card-yellow-yellow-cubes", "Yellow Cubes — three Labs’ worth"],
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

if (ids.length !== uniqueIds.size) errors.push(`Duplicate build-card IDs: ${ids.length - uniqueIds.size}`);
if (cards.length !== expectedCards.size) errors.push(`Expected ${expectedCards.size} cards; found ${cards.length}`);

for (const [id, expectedTitle] of expectedCards) {
  const card = cards.find(match => match[1] === id);
  if (!card) {
    errors.push(`Missing planned card: ${id}`);
    continue;
  }
  const title = card[2].match(/card-summary-title">([^<]+)</)?.[1] || "";
  if (title !== expectedTitle) errors.push(`${id} title changed: "${title}"`);
}
for (const id of ids) if (!expectedCards.has(id)) errors.push(`Unplanned card remains: ${id}`);

const references = [...html.matchAll(/<details class="production-reference build-card-anchor" id="([^\"]+)">([\s\S]*?)<\/details>/g)];
const expectedReferences = new Set(["reference-electromagnetic-turbines", "reference-graphene"]);
if (references.length !== expectedReferences.size) {
  errors.push(`Expected ${expectedReferences.size} reusable references; found ${references.length}`);
}
for (const id of expectedReferences) {
  if (!references.some(match => match[1] === id)) errors.push(`Missing reusable reference: ${id}`);
}

const allDocumentIds = new Set([...html.matchAll(/\bid="([^\"]+)"/g)].map(match => match[1]));
const links = [...html.matchAll(/<a class="card-crossref-link" href="#([^\"]+)"/g)].map(match => match[1]);
for (const target of links) {
  if (!allDocumentIds.has(target)) errors.push(`Broken production-map reference: #${target}`);
  const targetStart = html.match(new RegExp(`<[^>]+\\bid="${target}"[^>]*>`))?.[0] || "";
  if (!/(?:build-card|production-reference|route-row)/.test(targetStart)) {
    errors.push(`Reference does not land on a card, reusable line, or final route: #${target}`);
  }
}

function validateMap(id, body, requireExactDestination) {
  const required = [
    'class="map-supplies"><h4>Supplies</h4>',
    'class="map-pipeline"><h4>Production Map</h4>',
    'class="map-destination"><h4>Destination</h4>',
  ];
  const positions = required.map(section => body.indexOf(section));
  required.forEach((section, index) => {
    if (positions[index] < 0) errors.push(`${id} is missing ${section}`);
  });
  if (!positions.every((position, index) => index === 0 || position > positions[index - 1])) {
    errors.push(`${id} does not follow Supplies → Production Map → Destination`);
  }

  const supplies = body.match(/class="map-supplies"><h4>Supplies<\/h4>([\s\S]*?)<\/section>/)?.[1] || "";
  const pipeline = body.match(/class="map-pipeline"><h4>Production Map<\/h4>([\s\S]*?)<\/section>/)?.[1] || "";
  const destination = body.match(/class="map-destination"><h4>Destination<\/h4>([\s\S]*?)<\/section>/)?.[1] || "";
  const visible = value => value.replace(/<[^>]+>/g, " ");

  if (/\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|machines?|assemblers?|smelters?|plants?|labs?|belts?)\b/i.test(visible(supplies))) {
    errors.push(`${id} puts exact internal arithmetic in Supplies`);
  }
  if (/\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|machines?|assemblers?|smelters?|plants?|labs?|belts?)\b/i.test(visible(pipeline))) {
    errors.push(`${id} puts exact internal arithmetic in Production Map`);
  }
  if (requireExactDestination && !/\d/.test(visible(destination)) && !/three Labs[’'] worth/i.test(visible(destination))) {
    errors.push(`${id} Destination does not restate its exact end-product target`);
  }

  const routeRows = [...pipeline.matchAll(/class="route-row[^\"]*"[^>]*>[\s\S]*?<\/div>/g)];
  if (routeRows.length === 0) errors.push(`${id} has no production-map routes`);
  if (routeRows.length > 8) errors.push(`${id} exceeds the eight-row complexity limit (${routeRows.length})`);
  const routeGroups = [...pipeline.matchAll(/class="route-group"/g)].length;
  if (routeGroups > 3) errors.push(`${id} exceeds the three-group complexity limit (${routeGroups})`);
  for (const row of routeRows) {
    const arrowCount = (row[0].match(/→/g) || []).length;
    if (arrowCount > 3) errors.push(`${id} has a route row with ${arrowCount} transformations`);
  }

  const tailStages = [...body.matchAll(/class="map-footer-section (map-surplus|map-note)"/g)].map(match => match[1]);
  if (new Set(tailStages).size !== tailStages.length) errors.push(`${id} duplicates a permitted footer section`);
  if (/card-stage-(?:input|pipeline|output|totals|pickup)/.test(body)) {
    errors.push(`${id} retains legacy column-card markup`);
  }
}

for (const [fullMatch, id, body] of cards) {
  validateMap(id, body, true);
  if (/<details class="build-card[^>]*\sopen(?:\s|>)/.test(fullMatch)) errors.push(`${id} is open by default`);
}
for (const [, id, body] of references) validateMap(id, body, false);

for (const phaseId of ["ils", "warp", "photon", "white"]) {
  const start = html.search(new RegExp(`<section class="phase-section[^>]*" id="${phaseId}">`));
  const end = html.indexOf('<section class="phase-section', start + 1);
  const phase = html.slice(start, end < 0 ? html.length : end);
  if (phase.includes('<details class="build-card')) errors.push(`${phaseId.toUpperCase()} still contains a build card`);
}

for (const retired of [
  "Minimal pickup interval",
  "Total draw and output",
  "card-green-green-cubes",
  "card-photon-critical-photons",
  "card-photon-antimatter",
  "card-white-white-cubes",
  '<h4>Input</h4>',
  '<h4>Pipeline</h4>',
  '<h4>Output</h4>',
]) {
  if (html.includes(retired)) errors.push(`Retired card-system text remains: ${retired}`);
}

for (const required of [
  "Organic Crystal (mined)",
  "Sulfuric Acid ocean",
  "Fire Ice",
  "Kimberlite Ore",
  "Fractal Silicon",
  "Optical Grating Crystal",
  "Spiniform Stalagmite Crystal",
  "Unipolar Magnet",
  "The finite 200-yellow-cube research batch is complete",
  "Three yellow-cube Labs produce continuously",
  "Three Matrix Labs sustain 18 purple cubes/min",
  "Two Matrix Labs sustain 10 green cubes/min",
]) {
  if (!html.includes(required)) errors.push(`Required consistency text is missing: ${required}`);
}

for (const required of [
  'class="producer-legend"',
  "producer-smelting",
  "producer-assembly",
  "producer-processing",
  'src="assets/js/producer-types.js"',
]) {
  if (!html.includes(required)) errors.push(`Producer-type presentation is missing: ${required}`);
}

const greenStart = html.indexOf('<section class="phase-section phase-section-green" id="green">');
const greenEnd = html.indexOf('<section class="phase-section', greenStart + 1);
const greenPhase = html.slice(greenStart, greenEnd);
if (!greenPhase.includes('id="card-warp-space-warpers"')) {
  errors.push("The Space Warper card is not housed in GREEN");
}

const recipeOutputs = new Map([
  [84, 2001], [85, 2011], [45, 2303], [56, 2302], [48, 2301], [86, 2101],
  [114, 2106], [7, 2203], [8, 2201], [133, 1128], [9, 6001], [18, 6002],
  [27, 6003], [51, 1303], [36, 1402], [79, 1210], [52, 1305], [101, 1209],
  [70, 1501], [81, 1502], [41, 1802], [122, 2107], [123, 5003], [93, 2103],
  [94, 5001], [95, 2104], [96, 5002],
]);
for (const [recipeId, outputId] of recipeOutputs) {
  const recipe = authoritativeRecipes.find(candidate => candidate.recipe_id === recipeId);
  if (!recipe) errors.push(`Authoritative recipe ${recipeId} is missing`);
  else if (!recipe.outputs.some(output => output.item_id === outputId)) {
    errors.push(`Authoritative recipe ${recipeId} no longer produces item ${outputId}`);
  }
}

if (errors.length) {
  console.error(`Card validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Card validation passed: ${cards.length} phase cards, ${references.length} reusable references, ${links.length} direct links, textual-map complexity within bounds, and ${recipeOutputs.size} authoritative output recipes verified.`);
