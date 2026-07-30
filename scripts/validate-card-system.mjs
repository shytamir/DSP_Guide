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

const rebuiltPrefixes = [
  "card-red-",
  "card-yellow-plastic",
  "card-yellow-organic-crystals",
  "card-yellow-titanium-crystals",
  "card-yellow-diamonds",
  "card-yellow-yellow-cubes",
  "card-yellow-graphene",
  "card-yellow-particle-containers",
  "card-purple-",
  "card-green-",
  "card-dyson-",
  "card-sphere-casimir-crystals",
  "card-sphere-quantum-chips",
  "card-photon-",
  "card-white-",
];

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
  [16, ["1007x2", "->", "1114x2", "1120x1"]],
  [17, ["1006x2", "->", "1109x1"]],
  [23, ["1109x1", "1114x2", "->", "1115x1"]],
  [26, ["1106x3", "1117x1", "->", "1118x1"]],
  [28, ["1118x1", "1120x12", "1123x2", "->", "1126x1"]],
  [31, ["1109x3", "1116x1", "->", "1123x2"]],
  [33, ["1106x1", "1123x3", "->", "1124x2"]],
  [37, ["1105x1", "->", "1113x1"]],
  [38, ["1119x2", "1126x1", "->", "1304x1"]],
  [52, ["1303x2", "1304x2", "->", "1305x1"]],
  [68, ["1111x2", "1301x1", "->", "1404x1"]],
  [70, ["1123x1", "1404x1", "->", "1501x2"]],
  [99, ["1104x2", "1123x2", "1204x2", "->", "1206x1"]],
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

if (errors.length) {
  console.error(`Card validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Card validation passed: ${ids.length} cards, ${links.length} linked dependencies, unique anchors, consistent rebuilt-card stages, and ${recipeChecks.size} authoritative recipe fixtures.`,
);
