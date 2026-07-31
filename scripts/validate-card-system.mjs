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

if (ids.length !== uniqueIds.size) {
  errors.push(`Duplicate build-card IDs: ${ids.length - uniqueIds.size}`);
}

const links = [...html.matchAll(/<a class="card-crossref-link" href="#([^"]+)"/g)].map(
  match => match[1],
);
for (const target of links) {
  if (!uniqueIds.has(target)) errors.push(`Broken card reference: #${target}`);
}

const indirectCardTargets = new Map([
  ["card-purple-processors", "card-yellow-processors"],
]);

for (const [sourceId, body] of cards.map(([, id, cardBody]) => [id, cardBody])) {
  for (const match of body.matchAll(/<a class="card-crossref-link" href="#([^"]+)"/g)) {
    const finalTarget = indirectCardTargets.get(match[1]);
    if (finalTarget) {
      errors.push(
        `${sourceId} links through #${match[1]}; link directly to #${finalTarget}`,
      );
    }
  }
}

const rebuiltPrefixes = ["card-"];
const rateTitleExceptions = new Set([
  "card-bootstrap-mall-industry",
  "card-bootstrap-mall-storage",
  "card-bootstrap-mall-power",
  "card-bootstrap-mall-tech-bound",
]);

for (const [fullMatch, id, body] of cards) {
  if (!rebuiltPrefixes.some(prefix => id.startsWith(prefix))) continue;
  for (const required of [
    'card-stage-input"><h4>Input</h4>',
    'card-stage-pipeline"><h4>Pipeline</h4>',
    'card-stage-output"><h4>Output</h4>',
    'card-stage-totals"><h4>Total draw and output</h4>',
  ]) {
    if (!body.includes(required)) errors.push(`${id} is missing ${required}`);
  }
  const stagePositions = [
    body.indexOf('card-stage-input"><h4>Input</h4>'),
    body.indexOf('card-stage-pipeline"><h4>Pipeline</h4>'),
    body.indexOf('card-stage-output"><h4>Output</h4>'),
    body.indexOf('card-stage-totals"><h4>Total draw and output</h4>'),
  ];
  if (!stagePositions.every((position, index) => index === 0 || position > stagePositions[index - 1])) {
    errors.push(`${id} does not follow Input → Pipeline → Output → footer totals`);
  }
  const title = body.match(/card-summary-title">([^<]+)</)?.[1] || "";
  if (!/\d/.test(title) && !rateTitleExceptions.has(id)) {
    errors.push(`${id} title does not state a numeric output or approved mall objective`);
  }
  const outputStage = body.match(
    /card-stage-output"><h4>Output<\/h4><ul>([\s\S]*?)<\/ul>/,
  )?.[1] || "";
  if (!/(?:Storage|ILS slot|Provider ILS|Receiver ILS)/.test(outputStage)) {
    errors.push(`${id} output stage has no persistent output destination`);
  }
  if (/<details class="build-card[^>]*\sopen(?:\s|>)/.test(fullMatch)) {
    errors.push(`${id} is open by default`);
  }
  const totalsAt = fullMatch.lastIndexOf("card-stage-totals");
  const noteAt = fullMatch.lastIndexOf("card-stage-note");
  const surplusAt = fullMatch.lastIndexOf("card-stage-surplus");
  if (totalsAt < noteAt || totalsAt < surplusAt) {
    errors.push(`${id} does not place totals last in the footer`);
  }
  for (const stageName of ["input", "pipeline"]) {
    const stageMatch = body.match(
      new RegExp(`card-stage-${stageName}"><h4>[^<]+<\\/h4><ul>([\\s\\S]*?)<\\/ul>`),
    );
    if (!stageMatch) continue;
    for (const li of stageMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)) {
      if ((li[1].match(/class="machine"/g) || []).length > 1) {
        errors.push(`${id} ${stageName} bullet contains multiple machine lines`);
      }
      if ((li[1].match(/class="card-crossref-link"/g) || []).length > 1) {
        errors.push(`${id} ${stageName} bullet contains multiple card references`);
      }
      const plain = li[1].replace(/<[^>]+>/g, " ");
      if (
        /\b(?:from|scaling|based on)\b[\s\S]*\bcard\b/i.test(plain) &&
        !li[1].includes('class="card-crossref-link"')
      ) {
        errors.push(`${id} ${stageName} bullet contains an unlinked card reference`);
      }
    }
  }
}

for (const [, id, body] of cards) {
  for (const li of body.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const plain = li[1].replace(/<[^>]+>/g, " ");
    if (
      /\b(?:from|scaling|based on)\b[\s\S]*\bcard\b/i.test(plain) &&
      !li[1].includes('class="card-crossref-link"')
    ) {
      errors.push(`${id} contains an unlinked card reference`);
    }
  }
}

const recipeChecks = new Map([
  [1, ["1001x1", "->", "1101x1"]],
  [2, ["1001x1", "->", "1102x1"]],
  [3, ["1002x1", "->", "1104x1"]],
  [4, ["1005x1", "->", "1108x1"]],
  [5, ["1101x1", "->", "1201x1"]],
  [6, ["1102x2", "1104x1", "->", "1202x2"]],
  [7, ["1101x6", "1201x1", "1202x3", "->", "2203x1"]],
  [8, ["1101x2", "1202x1", "->", "2201x1"]],
  [9, ["1202x1", "1301x1", "->", "6001x1"]],
  [11, ["1110x3", "->", "1111x2"]],
  [12, ["1111x2", "1202x4", "->", "1401x1"]],
  [16, ["1007x2", "->", "1114x2", "1120x1"]],
  [17, ["1006x2", "->", "1109x1"]],
  [20, ["1103x2", "1104x3", "->", "1405x1"]],
  [21, ["1107x5", "1204x5", "->", "1406x1"]],
  [23, ["1109x1", "1114x2", "->", "1115x1"]],
  [25, ["1000x1", "1114x1", "1115x2", "->", "1117x1"]],
  [26, ["1106x3", "1117x1", "->", "1118x1"]],
  [28, ["1118x1", "1120x12", "1123x2", "->", "1126x1"]],
  [29, ["1014x8", "1120x12", "1123x2", "->", "1126x1"]],
  [30, ["1000x2", "1106x2", "1110x2", "->", "1119x2"]],
  [31, ["1109x3", "1116x1", "->", "1123x2"]],
  [32, ["1011x2", "->", "1120x1", "1123x2"]],
  [33, ["1106x1", "1123x3", "->", "1124x2"]],
  [35, ["1015x6", "->", "1124x2"]],
  [37, ["1105x1", "->", "1113x1"]],
  [38, ["1119x2", "1126x1", "->", "1304x1"]],
  [40, ["1120x10", "->", "1121x5"]],
  [41, ["1107x1", "1121x20", "1205x1", "->", "1802x2"]],
  [45, ["1101x4", "1201x8", "1301x4", "->", "2303x1"]],
  [48, ["1101x4", "1201x2", "1202x2", "1301x2", "->", "2301x1"]],
  [50, ["1101x2", "1104x1", "->", "1301x2"]],
  [52, ["1303x2", "1304x2", "->", "1305x1"]],
  [56, ["1101x4", "1108x2", "1202x2", "1301x4", "->", "2302x1"]],
  [61, ["1012x1", "->", "1112x2"]],
  [62, ["1013x1", "->", "1113x2"]],
  [68, ["1111x2", "1301x1", "->", "1404x1"]],
  [69, ["1014x1", "1301x1", "->", "1404x1"]],
  [70, ["1123x1", "1404x1", "->", "1501x2"]],
  [74, ["1208x2", "->", "1120x2", "1122x2"]],
  [75, ["1122x1", "6001x1", "6002x1", "6003x1", "6004x1", "6005x1", "->", "6006x1"]],
  [79, ["6005x1", "->", "1210x8"]],
  [80, ["1105x1", "1107x1", "1124x4", "->", "1125x1"]],
  [81, ["1125x3", "1303x3", "1501x3", "->", "1502x1"]],
  [83, ["1305x2", "1502x2", "1802x4", "->", "1503x1"]],
  [84, ["1101x2", "1201x1", "->", "2001x3"]],
  [85, ["1101x1", "1301x1", "->", "2011x1"]],
  [86, ["1101x4", "1108x4", "->", "2101x1"]],
  [93, ["1103x40", "1106x40", "1206x20", "1303x40", "->", "2103x1"]],
  [94, ["1101x5", "1303x2", "1405x2", "->", "5001x1"]],
  [95, ["1107x40", "1206x20", "2103x1", "->", "2104x1"]],
  [96, ["1107x10", "1303x10", "1406x2", "->", "5002x1"]],
  [99, ["1104x2", "1123x2", "1204x2", "->", "1206x1"]],
  [100, ["1016x10", "1104x2", "->", "1206x1"]],
  [101, ["1112x4", "1127x1", "->", "1209x1"]],
  [102, ["1209x1", "1305x1", "->", "6005x2"]],
  [103, ["1102x3", "1109x1", "1204x2", "->", "1205x1"]],
  [104, ["1101x2", "1121x10", "1206x2", "->", "1127x1"]],
  [105, ["1104x2", "1202x1", "->", "1407x1"]],
  [112, ["1103x1", "1108x3", "->", "1131x1"]],
  [114, ["1101x8", "1108x4", "1110x4", "->", "2106x1"]],
  [122, ["1101x8", "1303x4", "1401x4", "->", "2107x1"]],
  [123, ["1101x2", "1303x1", "1407x1", "->", "5003x1"]],
  [133, ["1006x3", "->", "1128x1"]],
  [136, ["1104x3", "->", "1601x1"]],
  [144, ["1104x6", "1128x2", "1301x3", "1407x1", "->", "1609x1"]],
]);

for (const [recipeId, expected] of recipeChecks) {
  const recipe = authoritativeRecipes.find(candidate => candidate.recipe_id === recipeId);
  if (!recipe) {
    errors.push(`Authoritative recipe ${recipeId} is missing`);
    continue;
  }
  const actual = [
    ...recipe.inputs.map(item => `${item.item_id}x${item.quantity}`).sort(),
    "->",
    ...recipe.outputs.map(item => `${item.item_id}x${item.quantity}`).sort(),
  ];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(`Authoritative recipe ${recipeId} no longer matches the card dependency fixture`);
  }
}

const recipeTimeChecks = new Map([
  [1, 60],
  [2, 90],
  [3, 60],
  [4, 60],
  [5, 60],
  [6, 60],
  [7, 240],
  [8, 60],
  [9, 180],
  [11, 120],
  [12, 120],
  [25, 360],
  [30, 300],
  [40, 150],
  [41, 720],
  [45, 120],
  [48, 180],
  [50, 60],
  [52, 360],
  [56, 180],
  [68, 180],
  [69, 180],
  [74, 120],
  [75, 900],
  [80, 360],
  [81, 480],
  [83, 360],
  [84, 60],
  [85, 60],
  [86, 120],
  [93, 1200],
  [94, 240],
  [95, 1800],
  [96, 360],
  [101, 360],
  [102, 1440],
  [103, 180],
  [104, 480],
  [105, 180],
  [112, 60],
  [114, 120],
  [122, 480],
  [123, 120],
  [133, 180],
  [136, 60],
  [144, 120],
]);

for (const [recipeId, expectedRawTime] of recipeTimeChecks) {
  const recipe = authoritativeRecipes.find(candidate => candidate.recipe_id === recipeId);
  if (!recipe) {
    errors.push(`Authoritative recipe ${recipeId} is missing for its time fixture`);
  } else if (recipe.time_spend_raw !== expectedRawTime) {
    errors.push(`Authoritative recipe ${recipeId} no longer matches its time fixture`);
  }
}

const authoritativeCardExpectations = [
  ["RED full refinery output", "3 Oil Refineries — Plasma Refining</span> → <span class=\"rate\">45 Hydrogen/min</span> and <span class=\"rate\">90 Refined Oil/min"],
  ["TITANIUM expedition reserve", "Remote Titanium Ingots — 120/min; first reserve 860"],
  ["TITANIUM silicon reserve", "Remote High-Purity Silicon — 120/min; first reserve 520"],
  ["ILS Processor reserve", "Processors — 45/min; first batch 130"],
  ["ILS Particle Container reserve", "Particle Containers — 11.25/min; first batch 80"],
  ["BOOTSTRAP Mall Logistics iron draw", "1 six-vein Mining Machine — Iron Ore</span> → <span class=\"rate\">180/min"],
  ["BOOTSTRAP Mall Industry coil draw", "180 Circuit Boards/min</span>, and <span class=\"rate\">127.5 Magnetic Coils/min"],
  ["WARP Fractal Silicon machines", "3 Arc Smelters — Fractal Crystal Silicon</span> → <span class=\"rate\">240/min"],
  ["WARP Kimberlite draw", "120 Kimberlite Ore/min"],
  ["WARP Optical Photon Combiner output", "12 Mk.I Assemblers — Optical Photon Combiners</span> → <span class=\"rate\">180/min"],
  ["WARP Unipolar receiving input", "1 normalized belt from a receiving ILS — Unipolar Magnets"],
  ["GREEN Deuterium collider output", "1 Miniature Particle Collider — Deuterium</span> → <span class=\"rate\">120/min"],
  ["SPHERE Deuteron Fuel Rod machines", "4 Mk.I Assemblers — Deuteron Fuel Rods</span> → <span class=\"rate\">30/min"],
  ["SPHERE Rocket output", "1 Mk.I Assembler — Small Carrier Rockets</span> → <span class=\"rate\">7.5/min"],
  ["LOGISTICS Bot engine output", "2 Mk.I Assemblers — Engines</span> → <span class=\"rate\">30/min"],
  ["LOGISTICS Vessel output", "1 Mk.I Assembler — Logistics Vessels</span> → <span class=\"rate\">7.5/min"],
];
for (const [label, expected] of authoritativeCardExpectations) {
  if (!html.includes(expected)) errors.push(`${label} is missing from the rebuilt guide`);
}

const forbiddenCardText = [
  ["stale SPHERE sail support warning", "initial <span class=\"rate\">60/min supported output"],
  ["incorrect Kimberlite raw draw", "Total raw draw:</strong> <span class=\"rate\">180 Kimberlite Ore/min"],
  ["incorrect mall logistics draw", "Total direct draw:</strong> <span class=\"rate\">315 Iron Ingots/min"],
  ["incorrect mall industry coil draw", "180 Circuit Boards/min</span>, and <span class=\"rate\">60 Magnetic Coils/min"],
];
for (const [label, forbidden] of forbiddenCardText) {
  if (html.includes(forbidden)) errors.push(`${label} remains in the guide`);
}

if (errors.length) {
  console.error(`Card validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Card validation passed: ${ids.length} cards, ${links.length} linked dependencies, unique anchors, consistent rebuilt-card stages, ${recipeChecks.size} authoritative recipe fixtures, and ${recipeTimeChecks.size} authoritative time fixtures.`,
);
