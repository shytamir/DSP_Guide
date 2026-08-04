import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";

const [siteArgument, sourceArgument = "."] = process.argv.slice(2);
if (!siteArgument) {
  console.error("Usage: node scripts/validate-deployment.mjs <site-directory> [source-directory]");
  process.exit(2);
}

const siteRoot = path.resolve(siteArgument);
const sourceRoot = path.resolve(sourceArgument);
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const toRelative = value => path.relative(value.root, value.file).replaceAll(path.sep, "/");

function listFiles(root) {
  const files = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        failures.push(`Symbolic links are not permitted: ${path.relative(root, absolute)}`);
      } else if (entry.isDirectory()) {
        visit(absolute);
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }
  };
  visit(root);
  return files;
}

const sourceFiles = [
  path.join(sourceRoot, "index.html"),
  ...listFiles(path.join(sourceRoot, "assets"))
];
const expected = sourceFiles.map(file => toRelative({ root: sourceRoot, file })).sort();
const deployedFiles = listFiles(siteRoot);
const actual = deployedFiles.map(file => toRelative({ root: siteRoot, file })).sort();
check(JSON.stringify(actual) === JSON.stringify(expected), "Package contents differ from index.html plus assets/.");

for (const relative of expected) {
  const source = path.join(sourceRoot, relative);
  const deployed = path.join(siteRoot, relative);
  check(fs.existsSync(deployed), `Missing deployment file: ${relative}`);
  if (fs.existsSync(deployed)) {
    check(fs.readFileSync(deployed).equals(fs.readFileSync(source)), `Deployment file changed: ${relative}`);
  }
}

const htmlPath = path.join(siteRoot, "index.html");
check(fs.existsSync(htmlPath), "index.html is missing.");
const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
check(!/<style\b/.test(html), "Inline CSS found in index.html.");
check(!/<script(?![^>]*\bsrc=)/.test(html), "Inline JavaScript or JSON found in index.html.");

const ids = [...html.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
check(ids.length === new Set(ids).size, "Duplicate HTML id found.");
check(anchors.every(anchor => ids.includes(anchor)), "Broken internal anchor found.");

const localAssetOccurrences = [
  ...html.matchAll(/(?:href|src)="(assets\/[^"]+)"/g)
].map(match => match[1]);
const localAssets = [...new Set(localAssetOccurrences)];
for (const required of [
  "assets/css/guide.css",
  "assets/js/navigation.js",
  "assets/js/tech-tooltips.js",
  "assets/js/producer-types.js",
  "assets/js/cards.js",
  "assets/js/checklists.js",
  "assets/DSP_exported assets/Texture2D/dsp-logo-flat-en.png",
]) {
  check(localAssets.includes(required), `Required static asset is not referenced: ${required}`);
}
check(localAssets.every(asset => fs.existsSync(path.join(siteRoot, asset))), "A referenced static asset is missing.");
check(!actual.some(file => /recognized-game-assets\.json$/i.test(file)), "The external authoritative asset map entered the deployment package.");

const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].map(match => match[1]);
check(imageSources.every(source => source.startsWith("assets/DSP_exported assets/Texture2D/")), "An image source falls outside the authorized game-asset directory.");

const protoReferences = [...html.matchAll(/<span class="proto-ref" data-item-id="(\d+)">([\s\S]*?)<\/span>/g)];
check(protoReferences.every(match => /class="proto-icon proto-icon-item"/.test(match[2])), "An item reference is missing its static icon.");
const productionArrows = [...html.matchAll(/<span class="production-arrow" data-producer-item-id="(\d+)" data-producer-type="(smelting|assembly|processing)"[^>]*><img class="proto-icon proto-icon-producer"[^>]*><span class="production-arrow-glyph" aria-hidden="true">→<\/span><\/span>/g)];
check(productionArrows.length > 0, "No static production arrows were found.");

function countRouteArrowText() {
  const tokens = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/g;
  const stack = [];
  let cursor = 0;
  let total = 0;
  for (const match of html.matchAll(tokens)) {
    const text = html.slice(cursor, match.index);
    if (stack.some(entry => entry.classes.includes("route-chain"))) total += (text.match(/→/g) || []).length;
    const token = match[0];
    if (/^<\//.test(token)) {
      const closing = token.match(/^<\/([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].tag === closing) {
          stack.splice(index, 1);
          break;
        }
      }
    } else if (/^<[A-Za-z]/.test(token) && !/\/>$/.test(token)) {
      const tag = token.match(/^<([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
      const classes = token.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/).filter(Boolean) || [];
      if (tag && !["br", "hr", "img", "input", "link", "meta"].includes(tag)) stack.push({ tag, classes });
    }
    cursor = match.index + token.length;
  }
  return total;
}
check(countRouteArrowText() === productionArrows.length, "A production-map arrow is bare or malformed.");

for (const relative of actual.filter(file => file.endsWith(".js"))) {
  try {
    new vm.Script(fs.readFileSync(path.join(siteRoot, relative), "utf8"), { filename: relative });
  } catch (error) {
    failures.push(`${relative} does not parse: ${error.message}`);
  }
}

const technologyDataPath = path.join(siteRoot, "assets", "data", "tech-reference.json");
const tooltipDetailsPath = path.join(siteRoot, "assets", "data", "tech-tooltip-details.json");
try {
  const technologyData = JSON.parse(fs.readFileSync(technologyDataPath, "utf8"));
  const tooltipDetails = JSON.parse(fs.readFileSync(tooltipDetailsPath, "utf8"));
  check(Object.keys(technologyData).length === 314, "Technology reference data does not contain 314 records.");
  check([...html.matchAll(/data-tech-id="(\d+)"/g)].every(match => technologyData[match[1]]), "Unresolved technology reference found.");

  const allowedTechnologyAliases = new Map([
    ["1002", new Set(["blue cube"])],
    ["1111", new Set(["red cube"])],
    ["1124", new Set(["yellow cube"])],
    ["1312", new Set(["purple cube"])],
    ["1507", new Set(["white cube"])],
    ["1705", new Set(["green cube"])],
    ["1508", new Set(["Mission Completed"])],
    ["1606", new Set(["Gas Giant Exploitation"])],
  ]);
  for (const match of html.matchAll(/<span\s+class="[^"]*\btech-ref\b[^"]*"\s+data-tech-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/g)) {
    const [, techId, inner] = match;
    const visibleLabel = inner.replace(/<[^>]+>/g, "").trim();
    const authoritativeName = technologyData[techId]?.name;
    const aliases = allowedTechnologyAliases.get(techId) || new Set();
    check(
      visibleLabel === authoritativeName || aliases.has(visibleLabel),
      `Technology label "${visibleLabel}" does not match runtime technology ${techId} (${authoritativeName}).`,
    );
  }

  const authoritativeRecipes = JSON.parse(fs.readFileSync(
    path.join(sourceRoot, "dsp_universal_end_product_dag_v1_0", "dsp_universal_recipe_hyperedges_v1_0.json"),
    "utf8"
  )).recipes;
  const unlockedItems = new Map();
  for (const recipe of authoritativeRecipes) {
    for (const technology of recipe.unlocking_technologies) {
      const itemIds = unlockedItems.get(String(technology.tech_id)) || new Set();
      recipe.outputs.forEach(output => itemIds.add(output.item_id));
      unlockedItems.set(String(technology.tech_id), itemIds);
    }
  }

  for (const [techId, details] of Object.entries(tooltipDetails)) {
    check(Boolean(technologyData[techId]), `Tooltip details reference unknown technology ${techId}.`);
    const itemIds = unlockedItems.get(techId) || new Set();
    const unlocks = details.unlocks || [];
    check(unlocks.every(unlock => /^\S+$/.test(unlock.label)), `Technology ${techId} has a non-atomic unlock label.`);
    check(unlocks.every(unlock => itemIds.has(unlock.itemId)), `Technology ${techId} has an unlock not supported by runtime recipe data.`);
    if (details.cube) {
      check(/^(BLUE|RED|YELLOW|PURPLE|GREEN|WHITE) CUBE$/.test(details.cube.label), `Technology ${techId} has an invalid cube label.`);
      check(itemIds.has(details.cube.itemId), `Technology ${techId} has a cube label not supported by runtime recipe data.`);
    }
  }
  for (const techId of new Set([...html.matchAll(/data-tech-id="(\d+)"/g)].map(match => match[1]))) {
    if ((unlockedItems.get(techId) || new Set()).size) {
      check(Boolean(tooltipDetails[techId]), `Recipe-unlocking guide technology ${techId} has no tooltip details.`);
    }
  }
  check(
    JSON.stringify(tooltipDetails["1604"].unlocks.map(unlock => unlock.label)) === JSON.stringify(["belt3", "PLS", "Drone"]),
    "Planetary Logistics System tooltip unlocks changed."
  );
} catch (error) {
  failures.push(`Technology tooltip data is invalid: ${error.message}`);
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};
const server = http.createServer((request, response) => {
  const relative = request.url === "/" ? "index.html" : decodeURIComponent(request.url.slice(1));
  const resolved = path.resolve(siteRoot, relative);
  if (!resolved.startsWith(`${siteRoot}${path.sep}`) && resolved !== path.join(siteRoot, "index.html")) {
    response.writeHead(403).end();
    return;
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "Content-Type": contentTypes[path.extname(resolved)] || "application/octet-stream" });
  fs.createReadStream(resolved).pipe(response);
});

async function request(relative, port) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/${relative}`, response => {
      response.resume();
      response.on("end", () => resolve(response.statusCode));
    }).on("error", reject);
  });
}

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
try {
  for (const relative of ["index.html", ...localAssets, "assets/data/tech-reference.json", "assets/data/tech-tooltip-details.json"]) {
    check(await request(relative, port) === 200, `${relative} was not served successfully.`);
  }
} finally {
  await new Promise(resolve => server.close(resolve));
}

if (failures.length) {
  console.error(JSON.stringify({ status: "FAIL", failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  deployment_files: actual.length,
  unique_direct_asset_references: localAssets.length,
  image_reference_occurrences: imageSources.length,
  item_references: protoReferences.length,
  production_arrows: productionArrows.length,
  internal_anchors: anchors.length,
  technology_references: [...html.matchAll(/data-tech-id="(\d+)"/g)].length
}, null, 2));
