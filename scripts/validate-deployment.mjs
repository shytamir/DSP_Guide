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
const steamStoreUrl = "https://store.steampowered.com/app/1366540/Dyson_Sphere_Program/";
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
const guideCssPath = path.join(siteRoot, "assets", "css", "guide.css");
const guideCss = fs.existsSync(guideCssPath) ? fs.readFileSync(guideCssPath, "utf8") : "";
const hostedModReadmeImages = new Map([
  ["assets/images/mod/see-the-problem-and-know-what-to-do-without-leaving-the-game.png", [2560, 1440]],
  ["assets/images/mod/know-when-your-photon-array-is-truly-sustained.png", [2880, 1620]],
]);
for (const [relative, [expectedWidth, expectedHeight]] of hostedModReadmeImages) {
  const source = path.join(sourceRoot, relative);
  const deployed = path.join(siteRoot, relative);
  check(fs.existsSync(source), `Required hosted mod README image is missing from the source package: ${relative}`);
  check(actual.includes(relative) && fs.existsSync(deployed), `Required hosted mod README image is missing from deployment: ${relative}`);
  if (fs.existsSync(source) && fs.existsSync(deployed)) {
    const contents = fs.readFileSync(deployed);
    const isPng = contents.length >= 24
      && contents.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      && contents.subarray(12, 16).toString("ascii") === "IHDR";
    check(isPng, `Hosted mod README image is not a valid PNG: ${relative}`);
    if (isPng) {
      check(
        contents.readUInt32BE(16) === expectedWidth && contents.readUInt32BE(20) === expectedHeight,
        `Hosted mod README image has unexpected dimensions: ${relative}`,
      );
    }
  }
}
check(!/<style\b/.test(html), "Inline CSS found in index.html.");
check(!/<script(?![^>]*\bsrc=)/.test(html), "Inline JavaScript or JSON found in index.html.");
check(
  /url\("\.\.\/images\/guide-space-background-v1\.png"\)/.test(guideCss)
    && fs.existsSync(path.join(siteRoot, "assets", "images", "guide-space-background-v1.png")),
  "The guide's space background is missing or not referenced by the stylesheet.",
);
check(
  guideCss.includes("@media(min-width:1921px),(min-width:1200px) and (min-height:1081px),(min-width:1200px) and (min-resolution:1.5dppx)")
    && /url\("\.\.\/images\/guide-space-background-4k\.webp"\)/.test(guideCss)
    && guideCss.includes(".phase-rail{transform:translateY(-50%) scale(2);transform-origin:right center}")
    && fs.existsSync(path.join(siteRoot, "assets", "images", "guide-space-background-4k.webp")),
  "The high-resolution background or doubled navigation rail is missing from the high-resolution display rule.",
);
check(
  /\.game-logo\{display:block;width:min\(100%,720px\);height:auto;margin:\.75rem auto 1\.75rem\}/.test(guideCss),
  "The two game logos are not centered in the reading pane.",
);
check(/p,li\{max-width:none\}/.test(guideCss), "Paragraphs or list items retain a narrowed right edge.");
check(
  /\.allocation-table-compact\{width:100%;max-width:none\}/.test(guideCss),
  "The compact allocation table does not reach its container's right edge.",
);
check(
  /\.production-reference\{margin:\.7rem 0 \.7rem \.9rem;/.test(guideCss)
    && /\.production-reference\{margin:\.6rem 0 \.6rem \.6rem\}/.test(guideCss),
  "Reusable reference cards do not preserve left-only indentation.",
);
check(
  /table\{display:block;max-width:100%;overflow-x:auto\}/.test(guideCss),
  "Wide tables can force narrow page overflow.",
);

const ids = [...html.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(match => match[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
check(ids.length === new Set(ids).size, "Duplicate HTML id found.");
check(anchors.every(anchor => ids.includes(anchor)), "Broken internal anchor found.");

const redStart = html.indexOf('<section class="phase-section phase-section-red" id="red">');
const redEnd = html.indexOf('<section class="phase-section', redStart + 1);
const redSection = redStart >= 0 && redEnd > redStart ? html.slice(redStart, redEnd) : "";
const ilsStart = html.indexOf('<section class="phase-section phase-section-ils" id="ils">');
const ilsEnd = html.indexOf('<section class="phase-section', ilsStart + 1);
const ilsSection = ilsStart >= 0 && ilsEnd > ilsStart ? html.slice(ilsStart, ilsEnd) : "";
const purpleStart = html.indexOf('<section class="phase-section phase-section-purple" id="purple">');
const purpleEnd = html.indexOf('<section class="phase-section', purpleStart + 1);
const purpleSection = purpleStart >= 0 && purpleEnd > purpleStart ? html.slice(purpleStart, purpleEnd) : "";
const greenStart = html.indexOf('<section class="phase-section phase-section-green" id="green">');
const greenEnd = html.indexOf('<section class="phase-section', greenStart + 1);
const greenSection = greenStart >= 0 && greenEnd > greenStart ? html.slice(greenStart, greenEnd) : "";
const warpStart = html.indexOf('<section class="phase-section phase-section-warp" id="warp">');
const warpEnd = html.indexOf('<section class="phase-section', warpStart + 1);
const warpSection = warpStart >= 0 && warpEnd > warpStart ? html.slice(warpStart, warpEnd) : "";
check(redSection.includes('id="red-planetary-base-clearing"'), "The RED planetary-base-clearing procedure is missing.");
check(redSection.includes("eight") && redSection.includes("Missile Turret") && redSection.includes("Signal Tower"), "The RED procedure lost its eight-turret or Signal Tower instructions.");
const procedureStart = redSection.indexOf('<h2 id="red-planetary-base-clearing">');
const procedureEnd = redSection.indexOf("</div>", procedureStart);
const procedureText = procedureStart >= 0 && procedureEnd > procedureStart
  ? redSection.slice(procedureStart, procedureEnd).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
  : "";
for (const required of ["New Game → Start", "outside its aggro range", "chasing units", "Tesla Tower inside aggro range", "first powered Signal Tower", "second powered tower", "far side", "Geothermal Power Station", "Foundation or Soil Pile tax"]) {
  check(procedureText.includes(required), `The RED base-clearing procedure is missing: ${required}.`);
}
check((ilsSection.match(/href="#red-planetary-base-clearing"/g) || []).length === 1, "ILS must contain exactly one linked RED defense reminder.");
check((warpSection.match(/href="#red-planetary-base-clearing"/g) || []).length === 1, "WARP must contain exactly one linked RED defense reminder.");
check(!html.includes('id="ref-dark-fog"') && !html.includes('href="#ref-dark-fog"'), "The legacy Dark Fog industry reference remains in the guide.");
const outsideRed = redStart >= 0 && redEnd > redStart ? `${html.slice(0, redStart)}${html.slice(redEnd)}` : html;
check(!/Dark Fog/i.test(outsideRed), "Dark Fog guidance appears outside RED.");
check(!/(Dark Fog (?:levels?|farming|drops?|industry)|space combat|Relay Stations?|\bhives?\b|concealed technolog)/i.test(html), "Prohibited Dark Fog subject remains in the guide.");

const visiblePhaseText = value => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const techIds = value => [...value.matchAll(/data-tech-id="(\d+)"/g)].map(match => Number(match[1]));
const sameIds = (actual, expected) => actual.length === expected.length && actual.every((id, index) => id === expected[index]);
const ilsGrapheneStart = ilsSection.indexOf("Complete the Graphene prerequisite separately:");
const ilsGrapheneEnd = ilsSection.indexOf("</p>", ilsGrapheneStart);
const ilsGrapheneInstruction = ilsGrapheneStart >= 0 && ilsGrapheneEnd > ilsGrapheneStart
  ? ilsSection.slice(ilsGrapheneStart, ilsGrapheneEnd)
  : "";
const ilsComponentBuildIndex = ilsSection.indexOf("Build the temporary component lines.");
check(
  ilsGrapheneStart >= 0 && ilsGrapheneStart < ilsComponentBuildIndex,
  "ILS must introduce Applied Superconductor before the temporary Particle Container build.",
);
check(
  techIds(ilsGrapheneInstruction).slice(0, 2).join(",") === "1121,1131",
  "ILS must present Basic Chemical Engineering and Applied Superconductor as the separate Graphene prerequisite.",
);
check(
  /<a class="card-crossref-link" href="#reference-graphene">[\s\S]*?data-item-id="1123"[\s\S]*?<\/a>/.test(ilsGrapheneInstruction)
    && ilsGrapheneInstruction.includes('data-item-id="1206"')
    && visiblePhaseText(ilsGrapheneInstruction).includes("build the standard Graphene line before assembling Particle Containers"),
  "ILS lost the linked standard Graphene instruction before Particle Container assembly.",
);

const purpleDashboardStart = purpleSection.indexOf('<tr><td><strong>Research first</strong>');
const purpleDashboardEnd = purpleSection.indexOf("</tr>", purpleDashboardStart) + "</tr>".length;
const purpleDashboard = purpleDashboardStart >= 0 && purpleDashboardEnd > purpleDashboardStart
  ? purpleSection.slice(purpleDashboardStart, purpleDashboardEnd)
  : "";
const purpleBodyStart = purpleSection.indexOf("<h2>Research first</h2>");
const purpleFirstParagraphStart = purpleSection.indexOf("<p>", purpleBodyStart);
const purpleFirstParagraphEnd = purpleSection.indexOf("</p>", purpleFirstParagraphStart) + "</p>".length;
const purpleFirstParagraph = purpleFirstParagraphStart >= 0 && purpleFirstParagraphEnd > purpleFirstParagraphStart
  ? purpleSection.slice(purpleFirstParagraphStart, purpleFirstParagraphEnd)
  : "";
const purpleHandoffStart = purpleFirstParagraphEnd;
const purpleHandoffEnd = purpleSection.indexOf("</p>", purpleHandoffStart) + "</p>".length;
const purpleHandoff = purpleHandoffStart >= 0 && purpleHandoffEnd > purpleHandoffStart
  ? purpleSection.slice(purpleHandoffStart, purpleHandoffEnd)
  : "";
check(
  techIds(purpleDashboard).slice(0, 3).join(",") === "1132,1133,1312"
    && purpleDashboard.indexOf('data-tech-id="1131"') > purpleDashboard.indexOf('data-tech-id="1312"')
    && visiblePhaseText(purpleDashboard).includes("Already complete from ILS: Applied Superconductor"),
  "PURPLE dashboard must begin with new research and identify Applied Superconductor as completed ILS work.",
);
check(
  sameIds(techIds(purpleFirstParagraph), [1132, 1133, 1312])
    && techIds(purpleHandoff)[0] === 1131
    && visiblePhaseText(purpleHandoff).includes("during the ILS bridge")
    && visiblePhaseText(purpleHandoff).includes("begin PURPLE with High-Strength Material"),
  "PURPLE expanded research must begin with High-Strength Material and explain the completed ILS handoff.",
);

const greenDashboardStart = greenSection.indexOf('<tr><td><strong>Research next</strong>');
const greenDashboardEnd = greenSection.indexOf("</tr>", greenDashboardStart) + "</tr>".length;
const greenBodyStart = greenSection.indexOf("<h2>Research first</h2>");
const greenBodyEnd = greenSection.indexOf('<div class="icon-free">', greenBodyStart);
const greenResearchBlocks = [
  ["dashboard", greenDashboardStart >= 0 && greenDashboardEnd > greenDashboardStart ? greenSection.slice(greenDashboardStart, greenDashboardEnd) : ""],
  ["expanded section", greenBodyStart >= 0 && greenBodyEnd > greenBodyStart ? greenSection.slice(greenBodyStart, greenBodyEnd) : ""],
];
for (const [label, block] of greenResearchBlocks) {
  const text = visiblePhaseText(block);
  const quantumIndex = text.indexOf("Quantum branch:");
  const frameIndex = text.indexOf("Frame branch:");
  const gravityIndex = text.indexOf("Gravity branch:");
  const convergenceIndex = text.indexOf("Both branches (Quantum + Gravity) → Gravity Matrix");
  const quantumBlockStart = block.indexOf("<strong>Quantum branch:</strong>");
  const frameBlockStart = block.indexOf("<strong>Frame branch:</strong>");
  const gravityBlockStart = block.indexOf("<strong>Gravity branch:</strong>");
  const convergenceBlockStart = block.indexOf("<strong>Both branches (Quantum + Gravity)</strong>");
  check(
    quantumIndex >= 0 && quantumIndex < frameIndex && frameIndex < gravityIndex && gravityIndex < convergenceIndex,
    `GREEN ${label} lost the Quantum, Frame, Gravity, convergence order.`,
  );
  check(
    sameIds(techIds(block.slice(quantumBlockStart, frameBlockStart)), [1125, 1126, 1141, 1303]),
    `GREEN ${label} lost the Quantum branch technology chain.`,
  );
  const frameBranch = visiblePhaseText(block.slice(frameBlockStart, gravityBlockStart));
  check(
    sameIds(techIds(block.slice(frameBlockStart, gravityBlockStart)), [1501, 1502, 1502, 1711, 1503, 1521])
      && frameBranch.includes("Solar Collection → Photon Frequency Conversion then Photon Frequency Conversion + Super Magnetic Field Generator → Solar Sail Orbit System"),
    `GREEN ${label} lost the Frame branch parallel-prerequisite structure.`,
  );
  check(
    sameIds(techIds(block.slice(gravityBlockStart, convergenceBlockStart)), [1142, 1143, 1704]),
    `GREEN ${label} lost the Gravity branch technology chain.`,
  );
  check(
    frameBranch.indexOf("Frame Material") >= 0
      && frameBranch.indexOf("Frame Material") < frameBranch.indexOf("→ build the Miniature Particle Collider")
      && frameBranch.includes("used by the Gravity branch"),
    `GREEN ${label} no longer distinguishes Frame Material construction support for the Gravity branch.`,
  );
  check(
    text.slice(convergenceIndex).startsWith("Both branches (Quantum + Gravity) → Gravity Matrix")
      && techIds(block.slice(convergenceBlockStart))[0] === 1705,
    `GREEN ${label} no longer identifies Quantum and Gravity as the converging branches.`,
  );
}
check(
  visiblePhaseText(greenResearchBlocks[1][1]).includes("Research it after Quantum Chip and Gravitational Wave Refraction are complete"),
  "GREEN expanded research lost the explicit Gravity Matrix completion condition.",
);

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

const protoReferences = findElementsByClass(html, components.itemReference.className);
check(protoReferences.every(reference => /class="proto-icon proto-icon-item"/.test(reference.inner)), "An item reference is missing its static icon.");
const correctedItemAssets = new Map([
  [6001, "t-matrix.png"],
  [6002, "e-matrix.png"],
  [6003, "c-matrix.png"],
  [1105, "silicium-single-crystal.png"],
  [1113, "silicium-high-purity.png"],
  [1127, "strange-matter-generator.png"],
  [1208, "photon-capacitor-full.png"],
  [2207, "accumulator-full.png"],
]);
for (const [itemId, asset] of correctedItemAssets) {
  const references = protoReferences.filter(reference => Number(getAttribute(reference.openingTag, components.itemReference.idAttribute)) === itemId);
  check(references.length > 0, `Corrected item ${itemId} is not represented in the guide.`);
  check(references.every(reference => reference.inner.includes(`/${asset}"`)), `Corrected item ${itemId} uses the wrong asset.`);
}
const iconFreeRegions = [...html.matchAll(/<(?:div|li)[^>]*class="[^"]*\bicon-free\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|li)>/g)];
check(iconFreeRegions.every(region => !region[1].includes("proto-icon")), "An icon-free guide region contains a prototype icon.");
const operatingNotes = [...html.matchAll(/<section class="map-footer-section map-note[^"]*">([\s\S]*?)<\/section>/g)];
check(operatingNotes.every(note => !note[1].includes("proto-icon")), "A card Operating Note contains a prototype icon.");
const mallTitle = html.match(/<span class="card-summary-title">Mall Industry([\s\S]*?)<\/span><span class="card-summary-meta">/);
for (const itemId of [2301, 2302, 2303]) check(Boolean(mallTitle?.[1].includes(`data-item-id="${itemId}"`)), `Mall Industry title is missing item ${itemId}.`);
const logisticsTitle = html.match(/<span class="card-summary-title">Mall Logistics([\s\S]*?)<\/span><span class="card-summary-meta">/);
for (const itemId of [2001, 2011]) check(Boolean(logisticsTitle?.[1].includes(`data-item-id="${itemId}"`)), `Mall Logistics title is missing item ${itemId}.`);
const gameLogos = findElementsByClass(html, "game-logo");
check(gameLogos.length === 2, "The guide must display the game logo at the title and External Tools sections.");
const escapedSteamStoreUrl = steamStoreUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const steamLogoLinks = [...html.matchAll(new RegExp(`<a\\b(?=[^>]*\\bhref="${escapedSteamStoreUrl}")[^>]*>([\\s\\S]*?)<\\/a>`, "g"))];
check(steamLogoLinks.length === 2 && steamLogoLinks.every(link => findElementsByClass(link[1], "game-logo").length === 1), "Both game logos must link to the Dyson Sphere Program Steam store page.");
const correctedPhaseAssets = new Map([
  ["blue", "t-matrix.png"],
  ["red", "e-matrix.png"],
  ["yellow", "c-matrix.png"],
  ["photon", "photon-capacitor-full.png"],
  ["logistics", "interstellar-logistic-station.png"],
]);
for (const [phase, asset] of correctedPhaseAssets) {
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
check(!/<aside\b/.test(html), "A repeated callout still creates a complementary landmark.");
const routeMaps = findElementsByClass(html, components.routeMap.className);
const routeRows = findElementsByClass(html, components.routeRow.className);
check(routeMaps.length > 0 && routeMaps.every(map => isNativeComponent(map, components.routeMap)), "A production map does not use a native list.");
check(routeRows.length > 0 && routeRows.every(row => isNativeComponent(row, components.routeRow)), "A production route does not use a native list item.");
check(routeMaps.every(map => !hasAttribute(map.openingTag, "role")), "A native production map retains an ARIA list role.");
check(routeRows.every(row => !hasAttribute(row.openingTag, "role")), "A native production route retains an ARIA list-item role.");
const genericAriaLabels = [...html.matchAll(/<(div|span)\b([^>]*\baria-label="[^"]+"[^>]*)>/g)];
check(genericAriaLabels.every(match => /\brole="(?:group|img)"/.test(match[2])), "A generic element uses aria-label without a nameable role.");

const ilsMapStart = html.indexOf('<div class="inline-production-map production-map" role="group" aria-label="ILS bootstrap production map">');
const ilsMapEnd = html.indexOf("</div></li>", ilsMapStart);
const ilsMap = ilsMapStart >= 0 && ilsMapEnd > ilsMapStart ? html.slice(ilsMapStart, ilsMapEnd) : "";
const ilsMapText = ilsMap.replace(/<[^>]+>/g, "");
check(Boolean(ilsMap), "The aligned ILS bootstrap production map is missing.");
check(findElementsByClass(ilsMap, "route-group").length === 3, "The ILS bootstrap map must contain three focused groups.");
check(findElementsByClass(ilsMap, components.routeRow.className).length === 8, "The ILS bootstrap map must contain eight transformation rows.");
for (const heading of ["TITANIUM ALLOY", "PROCESSORS", "SHARED TURBINE OUTPUTS"]) {
  check(ilsMapText.includes(heading), `The ILS bootstrap map is missing its ${heading} group.`);
}
check(ilsMap.includes('href="#reference-electromagnetic-turbines"'), "The ILS bootstrap map lost its reusable turbine-line link.");
check(ilsMap.includes('href="#reference-graphene"'), "The ILS bootstrap map lost its reusable Graphene-line link.");
check(!ilsMap.includes('<span class="route-label">Turbines</span>'), "The ILS bootstrap map still contains the legacy prose-only Turbines row.");

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
