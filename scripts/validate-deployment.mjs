import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";
import {
  components,
  findElementsByClass,
  getAttribute,
  hasAttribute,
  isNativeComponent,
  stripMarkup,
} from "./lib/markup-contracts.mjs";

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

const phaseSection = id => findElementsByClass(html, `phase-section-${id}`)[0]?.full || "";
const redSection = phaseSection("red");
check(redSection.includes('id="red-planetary-base-clearing"'), "The RED planetary-base-clearing procedure is missing.");
const outsideRed = redSection ? html.replace(redSection, "") : html;
check(!/Dark Fog/i.test(outsideRed), "Dark Fog guidance appears outside RED.");
check(!/(Dark Fog (?:levels?|farming|drops?|industry)|space combat|Relay Stations?|\bhives?\b|concealed technolog)/i.test(html), "Prohibited Dark Fog subject remains in the guide.");

const localAssetOccurrences = [
  ...html.matchAll(/(?:href|src|srcset)="(assets\/[^"]+)"/g)
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
  "assets/images/guide-trademark-animated.png",
  "assets/images/guide-trademark-static.png",
  "assets/images/mod/dsp-guide-check-icon.png",
]) {
  check(localAssets.includes(required), `Required static asset is not referenced: ${required}`);
}
check(localAssets.every(asset => fs.existsSync(path.join(siteRoot, asset))), "A referenced static asset is missing.");
check(!actual.some(file => /recognized-game-assets\.json$/i.test(file)), "The external authoritative asset map entered the deployment package.");

const imageSources = [
  ...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g),
  ...html.matchAll(/<source\b[^>]*\bsrcset="([^"]+)"[^>]*>/g),
].map(match => match[1]);
const approvedImageRoots = ["assets/DSP_exported assets/Texture2D/", "assets/images/"];
check(imageSources.every(source => approvedImageRoots.some(root => source.startsWith(root))), "An image source falls outside the approved local image directories.");

const companionDocks = findElementsByClass(html, "companion-dock");
check(companionDocks.length === 1, "The guide must contain exactly one companion dock.");
const companionDock = companionDocks[0];
if (companionDock) {
  check(companionDock.tag === "aside", "The companion dock must use semantic aside markup.");
  check(getAttribute(companionDock.openingTag, "aria-labelledby") === "companion-dock-title", "The companion dock heading relationship is missing.");
  check(/<h2\b[^>]*id="companion-dock-title"[^>]*>DSP Guide Check<\/h2>/.test(companionDock.inner), "The companion dock heading is malformed.");
  check(companionDock.inner.includes("Optional companion"), "The companion dock does not identify the mod as optional.");
  check(companionDock.inner.includes("Install with Mod Manager"), "The companion dock is missing the manager installation step.");
  check(companionDock.inner.includes("press <strong>F8</strong>"), "The companion dock is missing the F8 setup step.");
  const companionLinks = findElementsByClass(companionDock.inner, "companion-dock-link");
  check(companionLinks.length === 1 && companionLinks[0].tag === "a", "The companion dock must contain one explicit link.");
  check(getAttribute(companionLinks[0]?.openingTag || "", "href") === "https://thunderstore.io/c/dyson-sphere-program/p/DSPGuideCheckMod/DSPGuideCheck/", "The companion dock link does not use the canonical Thunderstore URL.");
  check(!hasAttribute(companionLinks[0]?.openingTag || "", "target"), "The companion dock link must preserve normal same-tab navigation.");
  check(/<img\b[^>]*src="assets\/images\/mod\/dsp-guide-check-icon\.png"[^>]*alt=""[^>]*aria-hidden="true"[^>]*>/.test(companionDock.inner), "The companion dock icon is missing or not decorative.");
  check(!/<(?:iframe|script|video)\b/.test(companionDock.inner), "The companion dock contains prohibited embedded or active content.");
}

const guideCss = fs.readFileSync(path.join(siteRoot, "assets/css/guide.css"), "utf8");
check(/\.companion-dock\{[^}]*z-index:19[^}]*display:none[^}]*width:216px[^}]*max-height:calc\(100vh - 32px\)[^}]*overflow-y:auto/.test(guideCss), "The companion dock base geometry or hidden state changed.");
check(guideCss.includes("@media(min-width:1480px){.companion-dock{display:block}}"), "The companion dock activation boundary changed.");
check(guideCss.includes("@media print{.companion-dock{display:none!important}}"), "The companion dock is not excluded from print.");

const itemIconReferenceTablePattern = /^(?:rate|allocation|rare-resource|reference|comparison)-table$/;
const itemIconCalloutClassPattern = /(?:legend|callout|warning|choice|contract)$|^orbital-process$/;
const itemIconVoidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

function itemIconAncestorStack(offset) {
  const tokens = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>/g;
  const stack = [];
  for (const match of html.slice(0, offset).matchAll(tokens)) {
    const token = match[0];
    if (!/^<[A-Za-z/]/.test(token)) continue;
    const tag = token.match(/^<\/?([A-Za-z0-9]+)/)?.[1]?.toLowerCase();
    if (/^<\//.test(token)) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].tag === tag) {
          stack.splice(index, 1);
          break;
        }
      }
    } else if (tag && !itemIconVoidElements.has(tag) && !/\/>$/.test(token)) {
      const classes = token.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/).filter(Boolean) || [];
      stack.push({ tag, classes });
    }
  }
  return stack;
}

const itemIconStackHasClass = (stack, className) =>
  stack.some(entry => entry.classes.includes(className));
const isItemIconCardOrMapSurface = stack => {
  const inCard = stack.some(entry => entry.classes.some(className =>
    ["build-card", "production-reference"].includes(className),
  ));
  return (inCard && stack.some(entry => entry.tag === "summary")) ||
    stack.some(entry => entry.classes.some(className => [
      "card-summary-title",
      "production-map",
      "map-supplies",
      "route-chain",
      "map-destination",
      "map-surplus",
    ].includes(className)));
};
const isItemIconReferenceTableSurface = stack =>
  stack.some(entry => entry.tag === "table" && entry.classes.some(className => itemIconReferenceTablePattern.test(className)));
const isItemIconDesignedCalloutSurface = stack =>
  stack.some(entry => entry.tag === "blockquote" || entry.classes.some(className => itemIconCalloutClassPattern.test(className)));
const allowsItemIcon = stack => {
  if (itemIconStackHasClass(stack, "map-note")) return false;
  if (stack.some(entry => /^h[1-6]$/.test(entry.tag))) return false;
  return isItemIconCardOrMapSurface(stack) || isItemIconReferenceTableSurface(stack) || isItemIconDesignedCalloutSurface(stack);
};
const allowsRetainedItemIcon = stack =>
  itemIconStackHasClass(stack, "map-note") || stack.some(entry => entry.tag === "nav");

const protoReferences = findElementsByClass(html, components.itemReference.className);
for (const reference of protoReferences) {
  const itemId = getAttribute(reference.openingTag, components.itemReference.idAttribute);
  const hasIcon = /class="proto-icon proto-icon-item"/.test(reference.inner);
  const stack = itemIconAncestorStack(reference.index);
  const requiresIcon = allowsItemIcon(stack);
  check(!requiresIcon || hasIcon, `Item ${itemId} is missing an icon on an approved surface.`);
  check(requiresIcon || allowsRetainedItemIcon(stack) || !hasIcon, `Item ${itemId} retains an icon outside approved surfaces.`);
}
const requiredItemAssets = new Map([
  [6001, "t-matrix.png"],
  [6002, "e-matrix.png"],
  [6003, "c-matrix.png"],
  [1105, "silicium-single-crystal.png"],
  [1113, "silicium-high-purity.png"],
  [1127, "strange-matter-generator.png"],
  [1208, "photon-capacitor-full.png"],
  [2207, "accumulator-full.png"],
]);
for (const [itemId, asset] of requiredItemAssets) {
  const references = protoReferences.filter(reference => Number(getAttribute(reference.openingTag, components.itemReference.idAttribute)) === itemId);
  const iconReferences = references.filter(reference => /class="proto-icon proto-icon-item"/.test(reference.inner));
  check(references.length > 0, `Required item ${itemId} is not represented in the guide.`);
  check(iconReferences.every(reference => reference.inner.includes(`/${asset}"`)), `Item ${itemId} uses the wrong asset.`);
}
const iconFreeRegions = [...html.matchAll(/<(?:div|li)[^>]*class="[^"]*\bicon-free\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|li)>/g)];
check(iconFreeRegions.every(region => !region[1].includes("proto-icon")), "An icon-free guide region contains a prototype icon.");
const operatingNotes = [...html.matchAll(/<section class="map-footer-section map-note[^"]*">([\s\S]*?)<\/section>/g)];
check(operatingNotes.every(note => !note[1].includes("proto-icon")), "A card Operating Note contains a prototype icon.");
const requiredPhaseAssets = new Map([
  ["blue", "t-matrix.png"],
  ["red", "e-matrix.png"],
  ["yellow", "c-matrix.png"],
  ["photon", "photon-capacitor-full.png"],
  ["logistics", "interstellar-logistic-station.png"],
]);
for (const [phase, asset] of requiredPhaseAssets) {
  const rail = html.match(new RegExp(`<a(?=[^>]*class="[^"]*\\brail-tab\\b[^"]*")(?=[^>]*data-phase="${phase}")[^>]*>([\\s\\S]*?)<\\/a>`));
  check(Boolean(rail?.[1].includes(`/${asset}"`)), `Phase ${phase} rail icon is wrong.`);
  const tags = [...html.matchAll(new RegExp(`<a(?=[^>]*class="[^"]*\\bphase-tag\\b[^"]*")(?=[^>]*href="#${phase}")[^>]*>([\\s\\S]*?)<\\/a>`, "g"))];
  check(tags.length > 0, `Phase ${phase} has no phase-tag references.`);
  check(tags.every(tag => tag[1].includes(`/${asset}"`)), `Phase ${phase} tag icon is wrong.`);
}
const productionArrows = findElementsByClass(html, components.productionArrow.className);
check(productionArrows.length > 0, "No static production arrows were found.");
check(productionArrows.every(arrow => {
  const type = getAttribute(arrow.openingTag, "data-producer-type");
  const producerIcon = findElementsByClass(arrow.inner, "proto-icon-producer")[0];
  const glyph = findElementsByClass(arrow.inner, "production-arrow-glyph")[0];
  const description = findElementsByClass(arrow.inner, "visually-hidden")[0];
  return /^\d+$/.test(getAttribute(arrow.openingTag, components.productionArrow.idAttribute) || "")
    && ["smelting", "assembly", "processing"].includes(type)
    && producerIcon?.tag === "img"
    && getAttribute(glyph?.openingTag || "", "aria-hidden") === "true"
    && stripMarkup(glyph?.inner || "") === "→"
    && /^Produced in \S/.test(stripMarkup(description?.inner || ""));
}), "A static production arrow is malformed.");

const technologyTriggers = findElementsByClass(html, components.technologyReference.className);
check(technologyTriggers.length > 0, "No native technology triggers were found.");
check(technologyTriggers.every(trigger => isNativeComponent(trigger, components.technologyReference)), "A technology trigger does not use its native component element.");
check(technologyTriggers.every(trigger => (getAttribute(trigger.openingTag, "type") || "button").toLowerCase() === "button"), "A technology trigger has a non-button type.");
check(technologyTriggers.every(trigger => !hasAttribute(trigger.openingTag, "role") && !hasAttribute(trigger.openingTag, "tabindex")), "A native technology trigger retains pseudo-button attributes.");
const routeMaps = findElementsByClass(html, components.routeMap.className);
const routeRows = findElementsByClass(html, components.routeRow.className);
check(routeMaps.length > 0 && routeMaps.every(map => isNativeComponent(map, components.routeMap)), "A production map does not use a native list.");
check(routeRows.length > 0 && routeRows.every(row => isNativeComponent(row, components.routeRow)), "A production route does not use a native list item.");
check(routeMaps.every(map => !hasAttribute(map.openingTag, "role")), "A native production map retains an ARIA list role.");
check(routeRows.every(row => !hasAttribute(row.openingTag, "role")), "A native production route retains an ARIA list-item role.");
const genericAriaLabels = [...html.matchAll(/<(div|span)\b([^>]*\baria-label="[^"]+"[^>]*)>/g)];
check(genericAriaLabels.every(match => /\brole="(?:group|img)"/.test(match[2])), "A generic element uses aria-label without a nameable role.");

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
  for (const trigger of technologyTriggers) {
    const techId = getAttribute(trigger.openingTag, components.technologyReference.idAttribute);
    const visibleLabel = stripMarkup(trigger.inner);
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
