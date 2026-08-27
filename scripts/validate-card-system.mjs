import fs from "node:fs";
import vm from "node:vm";
import {
  components,
  findElementsByClass,
  getAttribute,
  hasAttribute,
  isNativeComponent,
  stripMarkup,
} from "./lib/markup-contracts.mjs";

const html = fs.readFileSync("index.html", "utf8");
const authoritativeRecipes = JSON.parse(
  fs.readFileSync(
    "dsp_universal_end_product_dag_v1_0/dsp_universal_recipe_hyperedges_v1_0.json",
    "utf8",
  ),
).recipes;
const authoritativeFormalEdges = fs.readFileSync(
  "dsp_universal_end_product_dag_v1_0/dsp_universal_formal_edges_v1_0.csv",
  "utf8",
);
const authoritativeGraph = JSON.parse(
  fs.readFileSync(
    "dsp_universal_end_product_dag_v1_0/dsp_universal_end_product_graph_v1_0.json",
    "utf8",
  ),
);
const technologyReference = JSON.parse(
  fs.readFileSync("assets/data/tech-reference.json", "utf8"),
);
const errors = [];
const tooltipLabelContext = {
  URL,
  document: {
    baseURI: "http://localhost/index.html",
    currentScript: null,
    getElementById() {
      return null;
    },
  },
  window: {},
};
vm.runInNewContext(
  fs.readFileSync("assets/js/tech-tooltips.js", "utf8"),
  tooltipLabelContext,
);
const displayTechnologyName =
  tooltipLabelContext.window.DspTechnologyLabels?.displayName;
if (typeof displayTechnologyName !== "function") {
  errors.push("Technology tooltip rank formatter is unavailable");
}

const authoritativeTechnologyNodes = new Map(
  authoritativeGraph.nodes
    .filter(({ node_type: nodeType }) => nodeType === "tech_proto")
    .map((node) => [String(node.game_id), node]),
);
const upgradeTechnologyNodes = [
  ...authoritativeTechnologyNodes.values(),
].filter(
  (node) =>
    node.ui_partition_inferred === "upgrade_tree_inferred" &&
    technologyReference[node.game_id],
);
const previouslyAmbiguousUpgradeNodes = upgradeTechnologyNodes.filter(
  (node) =>
    node.level > 1 &&
    !new RegExp(`\\bLv${node.level}\\b`).test(
      technologyReference[node.game_id].name,
    ),
);
if (upgradeTechnologyNodes.length !== 206) {
  errors.push(
    `Retained upgrade inventory has ${upgradeTechnologyNodes.length} records instead of 206`,
  );
}
if (previouslyAmbiguousUpgradeNodes.length !== 163) {
  errors.push(
    `Rank-qualification threshold covers ${previouslyAmbiguousUpgradeNodes.length} records instead of 163`,
  );
}

const formalTechnologyPrerequisites = new Map();
for (const line of authoritativeFormalEdges.split(/\r?\n/)) {
  const match = line.match(
    /^\d+,tech:(\d+),tech:(\d+),pretech_(explicit|implicit),/,
  );
  if (!match) continue;
  const [, prerequisiteId, technologyId, kind] = match;
  const prerequisites = formalTechnologyPrerequisites.get(technologyId) || {
    explicit: [],
    implicit: [],
  };
  prerequisites[kind].push(prerequisiteId);
  formalTechnologyPrerequisites.set(technologyId, prerequisites);
}
const sortedIds = (values) =>
  values.map(String).sort((left, right) => left - right);
const sameIds = (left, right) =>
  JSON.stringify(sortedIds(left)) === JSON.stringify(sortedIds(right));

for (const node of upgradeTechnologyNodes) {
  const technologyId = String(node.game_id);
  const reference = technologyReference[technologyId];
  if (reference.level !== node.level) {
    errors.push(
      `Upgrade technology ${technologyId} has level ${reference.level} instead of ${node.level}`,
    );
  }
  const displayedName =
    typeof displayTechnologyName === "function"
      ? displayTechnologyName(reference)
      : reference.name;
  if (!new RegExp(`\\bLv${node.level}\\b`).test(displayedName)) {
    errors.push(
      `Upgrade technology ${technologyId} does not display its authoritative Lv${node.level} rank`,
    );
  }

  const formalPrerequisites = formalTechnologyPrerequisites.get(
    technologyId,
  ) || {
    explicit: [],
    implicit: [],
  };
  const referenceExplicit = (reference.required || []).map(({ id }) => id);
  const referenceImplicit = (reference.implicitRequired || []).map(
    ({ id }) => id,
  );
  if (!sameIds(referenceExplicit, formalPrerequisites.explicit)) {
    errors.push(
      `Upgrade technology ${technologyId} has invalid required edges`,
    );
  }
  if (!sameIds(referenceImplicit, formalPrerequisites.implicit)) {
    errors.push(
      `Upgrade technology ${technologyId} has invalid implicit edges`,
    );
  }

  for (const prerequisiteId of [...referenceExplicit, ...referenceImplicit]) {
    const prerequisite = technologyReference[prerequisiteId];
    const prerequisiteNode = authoritativeTechnologyNodes.get(
      String(prerequisiteId),
    );
    if (
      prerequisiteNode?.ui_partition_inferred === "upgrade_tree_inferred" &&
      typeof displayTechnologyName === "function" &&
      !new RegExp(`\\bLv${prerequisiteNode.level}\\b`).test(
        displayTechnologyName(prerequisite),
      )
    ) {
      errors.push(
        `Upgrade technology ${technologyId} mislabels prerequisite ${prerequisiteId}`,
      );
    }
  }
}

for (const node of previouslyAmbiguousUpgradeNodes) {
  const reference = technologyReference[node.game_id];
  if (
    typeof displayTechnologyName !== "function" ||
    displayTechnologyName(reference) !== `${reference.name} Lv${node.level}`
  ) {
    errors.push(
      `Previously ambiguous technology ${node.game_id} is not rank-qualified`,
    );
  }
}

const guideText = stripMarkup(html);
for (const requiredOpeningText of [
  "The route above is the simplest way through the game, but it isn't the only useful project this guide supports.",
  "The default route uses a Solar Sail swarm to reach photon production and white science.",
  "Permanent Sphere construction is an optional path you can open when you want a lasting structure; it is never required to move forward.",
  "If you're playing with Dark Fog, RED shows you a simple way to defend your first planet and clear a Dark Fog base.",
  "You don't need to understand or choose them now.",
  "Jump to where you are in the route.",
  "Scan the short summary.",
  "Open a build card only when you want to see how a useful product comes together.",
  "You aren't expected to remember how every factory line fits together.",
]) {
  if (!guideText.includes(requiredOpeningText)) {
    errors.push(`Approved opening guidance is missing: ${requiredOpeningText}`);
  }
}
const cards = findElementsByClass(html, components.buildCard.className)
  .filter((element) => isNativeComponent(element, components.buildCard))
  .map((element) => ({
    ...element,
    id: getAttribute(element.openingTag, "id"),
  }));
const ids = cards.map((card) => card.id);
const uniqueIds = new Set(ids);

const expectedCards = new Set([
  "card-bootstrap-mall-logistics",
  "card-bootstrap-mall-industry",
  "card-bootstrap-mall-storage",
  "card-bootstrap-mall-power",
  "card-blue-blue-cubes",
  "card-red-red-cubes",
  "card-red-security-mall",
  "card-yellow-yellow-cubes",
  "card-purple-processors",
  "card-purple-particle-broadband",
  "card-green-quantum-chips",
  "card-green-graviton-lenses",
  "card-dyson-solar-sails",
  "card-dyson-em-rail-ejectors",
  "card-sphere-dyson-components",
  "card-sphere-deuteron-fuel-rods",
  "card-logistics-distribution-kit",
  "card-logistics-planetary-kit",
  "card-logistics-interstellar-kit",
]);

if (ids.length !== uniqueIds.size)
  errors.push(`Duplicate build-card IDs: ${ids.length - uniqueIds.size}`);
if (cards.length !== expectedCards.size)
  errors.push(`Expected ${expectedCards.size} cards; found ${cards.length}`);

for (const id of expectedCards)
  if (!cards.some((card) => card.id === id))
    errors.push(`Missing required card: ${id}`);
for (const id of ids)
  if (!expectedCards.has(id)) errors.push(`Unexpected card: ${id}`);

const references = findElementsByClass(
  html,
  components.productionReference.className,
)
  .filter((element) =>
    isNativeComponent(element, components.productionReference),
  )
  .map((element) => ({
    ...element,
    id: getAttribute(element.openingTag, "id"),
  }));
const expectedReferences = new Set([
  "reference-electromagnetic-turbines",
  "reference-graphene",
]);
if (references.length !== expectedReferences.size) {
  errors.push(
    `Expected ${expectedReferences.size} reusable references; found ${references.length}`,
  );
}
for (const id of expectedReferences) {
  if (!references.some((reference) => reference.id === id))
    errors.push(`Missing reusable reference: ${id}`);
}

const allDocumentIds = new Set(
  [...html.matchAll(/\bid="([^\"]+)"/g)].map((match) => match[1]),
);
const links = [
  ...html.matchAll(/<a class="card-crossref-link" href="#([^\"]+)"/g),
].map((match) => match[1]);
for (const target of links) {
  if (!allDocumentIds.has(target))
    errors.push(`Broken production-map reference: #${target}`);
  const targetStart =
    html.match(new RegExp(`<[^>]+\\bid="${target}"[^>]*>`))?.[0] || "";
  if (!/(?:build-card|production-reference|route-row)/.test(targetStart)) {
    errors.push(
      `Reference does not land on a card, reusable line, or final route: #${target}`,
    );
  }
}

let operatingNoteCount = 0;
let recipeTransitionCount = 0;

function isAuthoritativeTransition(inputIds, outputId) {
  const inputs = new Set(inputIds.map(Number));
  const output = Number(outputId);
  return authoritativeRecipes.some((recipe) => {
    const producesOutput = recipe.outputs.some(
      (candidate) => candidate.item_id === output,
    );
    const sharesDisplayedInput = recipe.inputs.some((candidate) =>
      inputs.has(candidate.item_id),
    );
    return producesOutput && sharesDisplayedInput;
  });
}

function validateRecipeTransitions(id, routeRows) {
  routeRows.forEach((row, rowIndex) => {
    const chain = findElementsByClass(row.inner, "route-chain")[0];
    if (!chain) return;
    const tokens = [
      ...findElementsByClass(
        chain.inner,
        components.itemReference.className,
      ).map((item) => ({
        index: item.index,
        itemId: getAttribute(
          item.openingTag,
          components.itemReference.idAttribute,
        ),
        type: "item",
      })),
      ...findElementsByClass(
        chain.inner,
        components.productionArrow.className,
      ).map((arrow) => ({
        index: arrow.index,
        type: "arrow",
      })),
    ].sort((left, right) => left.index - right.index);
    const arrowIndexes = tokens.flatMap((token, index) =>
      token.type === "arrow" ? [index] : [],
    );
    arrowIndexes.forEach((arrowIndex, transitionIndex) => {
      const previousArrowIndex =
        transitionIndex === 0 ? -1 : arrowIndexes[transitionIndex - 1];
      const nextArrowIndex =
        transitionIndex + 1 < arrowIndexes.length
          ? arrowIndexes[transitionIndex + 1]
          : tokens.length;
      const inputIds = tokens
        .slice(previousArrowIndex + 1, arrowIndex)
        .filter((token) => token.type === "item")
        .map((token) => token.itemId);
      const outputIds = tokens
        .slice(arrowIndex + 1, nextArrowIndex)
        .filter((token) => token.type === "item")
        .map((token) => token.itemId);
      recipeTransitionCount += 1;
      const outputId = outputIds[0];
      if (
        !inputIds.length ||
        !outputId ||
        !isAuthoritativeTransition(inputIds, outputId)
      ) {
        errors.push(
          `${id} route row ${rowIndex + 1} contains a transformation not supported by runtime recipe data: ${inputIds.join(" + ")} → ${outputId || "missing output"}`,
        );
      }
    });
  });
}

function validateMap(id, body) {
  const required = ["map-supplies", "map-pipeline", "map-destination"];
  const sections = required.map(
    (className) => findElementsByClass(body, className)[0],
  );
  const positions = sections.map((section) => section?.index ?? -1);
  required.forEach((className, index) => {
    if (!sections[index])
      errors.push(`${id} is missing its ${className} section`);
  });
  if (
    !positions.every(
      (position, index) => index === 0 || position > positions[index - 1],
    )
  ) {
    errors.push(
      `${id} does not follow Supplies → Production Map → Destination`,
    );
  }

  const supplies = sections[0]?.inner || "";
  const pipeline = sections[1]?.inner || "";
  const destination = sections[2]?.inner || "";
  const visible = (value) => value.replace(/<[^>]+>/g, " ");

  for (const [surface, markup] of [
    ["Supplies", supplies],
    ["Production Map", pipeline],
    ["Destination", destination],
  ]) {
    if (!markup.includes('class="proto-icon proto-icon-item"')) {
      errors.push(`${id} ${surface} lost its approved item icon treatment`);
    }
  }
  if (!pipeline.includes('class="proto-icon proto-icon-producer"')) {
    errors.push(`${id} Production Map lost its approved producer icons`);
  }

  const operatingNotes = findElementsByClass(body, "map-note");
  operatingNoteCount += operatingNotes.length;
  for (const note of operatingNotes) {
    if (/<(?:img|svg)\b/i.test(note.inner)) {
      errors.push(`${id} Operating Note contains an icon`);
    }
  }

  if (
    /\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|machines?|assemblers?|smelters?|plants?|labs?|belts?)\b/i.test(
      visible(supplies),
    )
  ) {
    errors.push(`${id} puts exact internal arithmetic in Supplies`);
  }
  if (
    /\b\d+(?:\.\d+)?\s*(?:\/min|per minute|minutes?|hours?|machines?|assemblers?|smelters?|plants?|labs?|belts?)\b/i.test(
      visible(pipeline),
    )
  ) {
    errors.push(`${id} puts exact internal arithmetic in Production Map`);
  }
  const routeRows = findElementsByClass(
    pipeline,
    components.routeRow.className,
  );
  if (routeRows.length === 0) errors.push(`${id} has no production-map routes`);
  if (routeRows.some((row) => !isNativeComponent(row, components.routeRow))) {
    errors.push(
      `${id} contains a production-map route that is not a native list item`,
    );
  }
  validateRecipeTransitions(id, routeRows);
  const rowLimit = id === "card-red-security-mall" ? 12 : 8;
  if (routeRows.length > rowLimit)
    errors.push(
      `${id} exceeds its ${rowLimit}-row complexity limit (${routeRows.length})`,
    );
  const routeGroups = [...pipeline.matchAll(/class="route-group"/g)].length;
  if (routeGroups > 3)
    errors.push(
      `${id} exceeds the three-group complexity limit (${routeGroups})`,
    );
  for (const row of routeRows) {
    const arrowCount = (row.full.match(/→/g) || []).length;
    if (arrowCount > 3)
      errors.push(`${id} has a route row with ${arrowCount} transformations`);
  }

  const tailStages = [
    ...body.matchAll(/class="map-footer-section (map-surplus|map-note)"/g),
  ].map((match) => match[1]);
  if (new Set(tailStages).size !== tailStages.length)
    errors.push(`${id} duplicates a permitted footer section`);
}

for (const card of cards) {
  validateMap(card.id, card.inner);
  if (/\sopen(?:\s|>)/.test(card.openingTag))
    errors.push(`${card.id} is open by default`);
}
for (const reference of references) validateMap(reference.id, reference.inner);

const expectedNumberedPhaseIds = [
  "blue",
  "red",
  "ils",
  "yellow",
  "purple",
  "green",
  "dyson",
  "photon",
  "white",
];
const expectedOptionalPhaseIds = ["sphere", "warp", "logistics"];
const expectedPhaseIds = [
  ...expectedNumberedPhaseIds,
  ...expectedOptionalPhaseIds,
];
const phaseIds = [
  ...html.matchAll(/<section class="phase-section[^>]*" id="([^"]+)">/g),
].map((match) => match[1]);
if (JSON.stringify(phaseIds) !== JSON.stringify(expectedPhaseIds)) {
  errors.push(`Unexpected phase structure: ${phaseIds.join(" → ")}`);
}
const rail = findElementsByClass(html, "phase-rail")[0];
if (!rail) {
  errors.push("The route and optional-capability navigation rail is missing");
} else {
  const railMarkup = rail.inner;
  const railPhaseIds = [...railMarkup.matchAll(/data-phase="([^"]+)"/g)].map(
    (match) => match[1],
  );
  if (JSON.stringify(railPhaseIds) !== JSON.stringify(expectedPhaseIds)) {
    errors.push(`Unexpected navigation order: ${railPhaseIds.join(" → ")}`);
  }
  const dividerIndex = railMarkup.indexOf(
    'class="rail-label rail-label-optional"',
  );
  const whiteIndex = railMarkup.indexOf('data-phase="white"');
  const sphereIndex = railMarkup.indexOf('data-phase="sphere"');
  if (!(
    whiteIndex >= 0 &&
    whiteIndex < dividerIndex &&
    dividerIndex < sphereIndex
  )) {
    errors.push("Optional navigation is not grouped after the numbered route");
  }
  for (const capability of expectedOptionalPhaseIds) {
    const optionalControl = railMarkup.match(
      new RegExp(
        `<a(?=[^>]*class="[^"]*\\brail-tab-optional\\b[^"]*")(?=[^>]*data-phase="${capability}")[^>]*>`,
      ),
    );
    if (!optionalControl)
      errors.push(
        `Optional navigation control is missing for ${capability.toUpperCase()}`,
      );
  }
}
for (const id of expectedOptionalPhaseIds) {
  const section = findElementsByClass(html, `phase-section-${id}`)[0];
  const heading =
    section?.inner.match(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "";
  if (!findElementsByClass(heading, "capability-kicker").length) {
    errors.push(
      `${id.toUpperCase()} heading is not visibly labeled as an optional entry`,
    );
  }
  if (id === "sphere" && !heading.includes("OPTIONAL PATH")) {
    errors.push("SPHERE heading is not visibly labeled as an optional path");
  }
}
const sphereSection = findElementsByClass(html, "phase-section-sphere")[0];
const sphereMarkup = sphereSection?.inner || "";
if (!sphereMarkup) {
  errors.push("SPHERE optional-path guidance is missing");
} else {
  if (!sphereMarkup.includes('href="#receiver-antimatter-bridge"')) {
    errors.push("SPHERE does not return to the Receiver and Antimatter bridge");
  }
  if (
    /(?:Move on when|Ready to move on when|task-list-item-checkbox)/.test(
      sphereMarkup,
    )
  ) {
    errors.push(
      "SPHERE still contains a progression gate or completion checklist",
    );
  }
  if (
    /(?:7\.5\/min|5 launches\/min|1\.655 GW|16\.875\/min|30\/min)/.test(
      sphereMarkup,
    )
  ) {
    errors.push("SPHERE still contains former PHOTON-gate sizing figures");
  }
  const sphereResearchIds = [
    ...sphereMarkup.matchAll(
      /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
    ),
  ].map((match) => match[1]);
  if (
    JSON.stringify([...new Set(sphereResearchIds)]) !==
    JSON.stringify(["1522", "1523"])
  ) {
    errors.push(
      `SPHERE research ownership is invalid: ${[...new Set(sphereResearchIds)].join(", ")}`,
    );
  }

  const requiredTechnologyEdges = new Map([
    ["1522", ["1521"]],
    ["1523", ["1522"]],
  ]);
  for (const [technologyId, requiredIds] of requiredTechnologyEdges) {
    const actualRequiredIds = new Set(
      (technologyReference[technologyId]?.required || []).map(({ id }) =>
        String(id),
      ),
    );
    for (const requiredId of requiredIds) {
      if (!actualRequiredIds.has(requiredId)) {
        errors.push(
          `Technology ${technologyId} is missing required prerequisite ${requiredId}`,
        );
      }
    }
  }
}
const dysonSection = findElementsByClass(html, "phase-section-dyson")[0];
const dysonSphereLinks = dysonSection?.inner.match(/href="#sphere"/g) || [];
if (dysonSphereLinks.length !== 1) {
  errors.push(
    `DYSON must contain one optional SPHERE handoff; found ${dysonSphereLinks.length}`,
  );
}
const greenSection = findElementsByClass(html, "phase-section-green")[0];
if (greenSection?.inner.includes('href="#sphere"')) {
  errors.push("GREEN bypasses DYSON with a coequal SPHERE handoff");
}
const greenSupportingResearch = findElementsByClass(
  greenSection?.inner || "",
  "green-supporting-research",
)[0];
const greenSupportingResearchIds = [
  ...(greenSupportingResearch?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(greenSupportingResearchIds) !==
  JSON.stringify(["1142", "1134", "1416", "1143", "1704"])
) {
  errors.push(
    `GREEN supporting research order is invalid: ${greenSupportingResearchIds.join(", ")}`,
  );
}

const expectedGreenPrerequisites = new Map([
  ["1142", { required: ["1124"], implicit: [] }],
  ["1134", { required: ["1412", "1102"], implicit: [] }],
  ["1416", { required: ["1134"], implicit: ["1414"] }],
  ["1143", { required: ["1142"], implicit: [] }],
  ["1704", { required: ["1143", "1703"], implicit: [] }],
  ["1502", { required: ["1501"], implicit: [] }],
  ["1503", { required: ["1502"], implicit: ["1711"] }],
  ["1521", { required: ["1503"], implicit: ["1132"] }],
]);
for (const [technologyId, expected] of expectedGreenPrerequisites) {
  const technology = technologyReference[technologyId] || {};
  const requiredIds = (technology.required || []).map(({ id }) => id);
  const implicitIds = (technology.implicitRequired || []).map(({ id }) => id);
  if (!sameIds(requiredIds, expected.required)) {
    errors.push(`GREEN technology ${technologyId} has invalid required edges`);
  }
  if (!sameIds(implicitIds, expected.implicit)) {
    errors.push(`GREEN technology ${technologyId} has invalid implicit edges`);
  }
}

const colliderRecipe = authoritativeRecipes.find((recipe) =>
  recipe.outputs.some(({ item_id: itemId }) => itemId === 2310),
);
const colliderInputIds = new Set(
  (colliderRecipe?.inputs || []).map(({ item_id: itemId }) => itemId),
);
for (const requiredMaterialId of [1125, 1205]) {
  if (!colliderInputIds.has(requiredMaterialId)) {
    errors.push(
      `Miniature Particle Collider material proof is missing item ${requiredMaterialId}`,
    );
  }
}
const colliderDeuteriumRecipe = authoritativeRecipes.find(
  (recipe) =>
    recipe.recipe_type === "Particle" &&
    recipe.inputs.some(({ item_id: itemId }) => itemId === 1120) &&
    recipe.outputs.some(({ item_id: itemId }) => itemId === 1121) &&
    recipe.unlocking_technologies.some(
      ({ tech_id: technologyId }) => technologyId === 1142,
    ),
);
if (!colliderDeuteriumRecipe) {
  errors.push("GREEN Collider route does not prove Hydrogen to Deuterium");
}
const strangeMatterRecipe = authoritativeRecipes.find(
  (recipe) =>
    recipe.recipe_type === "Particle" &&
    recipe.outputs.some(({ item_id: itemId }) => itemId === 1127) &&
    recipe.unlocking_technologies.some(
      ({ tech_id: technologyId }) => technologyId === 1143,
    ),
);
if (!strangeMatterRecipe) {
  errors.push("GREEN Strange Matter does not prove Collider production");
}
const fusionUnlockOutputs = new Set(
  authoritativeRecipes
    .filter((recipe) =>
      recipe.unlocking_technologies.some(
        ({ tech_id: technologyId }) => technologyId === 1416,
      ),
    )
    .flatMap((recipe) => recipe.outputs.map(({ item_id: itemId }) => itemId)),
);
for (const fusionOutputId of [1802, 2211]) {
  if (!fusionUnlockOutputs.has(fusionOutputId)) {
    errors.push(
      `Mini Fusion Power Generation does not unlock item ${fusionOutputId}`,
    );
  }
}
const materialProofUnlocks = new Map([
  [1125, 1521],
  [1205, 1711],
]);
for (const [materialId, technologyId] of materialProofUnlocks) {
  const materialRecipe = authoritativeRecipes.find((recipe) =>
    recipe.outputs.some(({ item_id: itemId }) => itemId === materialId),
  );
  const unlockingTechnologyIds = new Set(
    (materialRecipe?.unlocking_technologies || []).map(
      ({ tech_id: techId }) => techId,
    ),
  );
  if (!unlockingTechnologyIds.has(technologyId)) {
    errors.push(
      `Material ${materialId} is not authoritatively unlocked by technology ${technologyId}`,
    );
  }
}

const greenText = stripMarkup(greenSection?.inner || "");
for (const requiredGreenText of [
  "Deuterium Fractionation is only a prerequisite for fusion here; this guide still makes Deuterium with Colliders.",
  "This guide uses Miniature Particle Colliders because they make Deuterium through one compact, predictable line.",
  "Colliders are the simplest route to build and understand. Their tradeoff is heavy Hydrogen and power use, so the line below turns its spare Deuterium into fuel for its own expansion.",
]) {
  if (!greenText.includes(requiredGreenText)) {
    errors.push(`GREEN research ownership is missing: ${requiredGreenText}`);
  }
}
for (const staleGreenText of [
  "If you choose Fractionators:",
  "Pick the one that fits the factory you built",
  "This material chain is part of GREEN's proof",
  "DYSON and SPHERE inherit that completed research",
]) {
  if (greenText.includes(staleGreenText)) {
    errors.push(
      `GREEN still contains coequal Deuterium routes: ${staleGreenText}`,
    );
  }
}

const greenDeuteriumOptions = findElementsByClass(
  greenSection?.inner || "",
  "green-deuterium-options",
)[0];
const greenDeuteriumOptionsText = stripMarkup(
  greenDeuteriumOptions?.inner || "",
);
const greenDeuteriumOptionRows =
  greenDeuteriumOptions?.inner.match(/<tr\b/g) || [];
if (greenDeuteriumOptionRows.length !== 4) {
  errors.push("GREEN Deuterium alternatives table must contain three routes");
}
for (const requiredOptionText of [
  "Miniature Particle Colliders — guide route",
  "Compact and predictable.",
  "Consume more Hydrogen and power.",
  "Use Hydrogen and power more efficiently.",
  "Require a larger circulating-belt system whose flow and stacking need more attention.",
  "Move supply away from the home factory.",
  "Require a substantial Collector buildout and provide output that depends on the gas giant and the number deployed.",
]) {
  if (!greenDeuteriumOptionsText.includes(requiredOptionText)) {
    errors.push(
      `GREEN Deuterium alternatives are missing: ${requiredOptionText}`,
    );
  }
}

const greenFuelLoop = findElementsByClass(
  greenSection?.inner || "",
  "green-fuel-loop",
)[0];
const greenFuelLoopText = stripMarkup(greenFuelLoop?.inner || "");
for (const requiredLoopText of [
  "Grow Deuterium, Strange Matter, and power together",
  "If the tank keeps falling, strengthen the Hydrogen supply before adding more Colliders.",
  "Send the produced Deuterium to Strange Matter first.",
  "Continue the same belt into one Deuteron Fuel Rod line so only the leftovers become fuel.",
  "If the buffer is falling, add more Deuterium production.",
  "If the buffer is growing quickly and you want more green production, add another Strange Matter Collider.",
  "return unused Deuterium to a Storage Tank that feeds the line",
  "Existing grid capacity may make immediate fusion construction unnecessary",
]) {
  if (!greenFuelLoopText.includes(requiredLoopText)) {
    errors.push(`GREEN fuel loop is missing: ${requiredLoopText}`);
  }
}
const greenFuelSteps = findElementsByClass(
  greenFuelLoop?.inner || "",
  "green-fuel-loop-steps",
)[0];
if ((greenFuelSteps?.inner.match(/<li\b/g) || []).length !== 5) {
  errors.push(
    "GREEN fuel loop must contain the approved five observable steps",
  );
}
if (/\b(?:MW|GW|\/min|per minute)\b/i.test(greenFuelLoopText)) {
  errors.push(
    "GREEN fuel loop contains prohibited throughput or power calculations",
  );
}

const greenFuelMap = findElementsByClass(
  greenFuelLoop?.inner || "",
  "green-fuel-map",
)[0];
const greenFuelMapItemIds = [
  ...(greenFuelMap?.inner || "").matchAll(/data-item-id="(\d+)"/g),
].map((match) => match[1]);
if (
  JSON.stringify(greenFuelMapItemIds) !==
  JSON.stringify([
    "1120",
    "1121",
    "1121",
    "1206",
    "1102",
    "1127",
    "1121",
    "1107",
    "1205",
    "1802",
    "2211",
  ])
) {
  errors.push(
    `GREEN fuel map item sequence is invalid: ${greenFuelMapItemIds.join(", ")}`,
  );
}
const greenFuelMapProducerIds = [
  ...(greenFuelMap?.inner || "").matchAll(/data-producer-item-id="(\d+)"/g),
].map((match) => match[1]);
if (
  JSON.stringify(greenFuelMapProducerIds) !==
  JSON.stringify(["2310", "2310", "2303"])
) {
  errors.push(
    `GREEN fuel map producer sequence is invalid: ${greenFuelMapProducerIds.join(", ")}`,
  );
}

const deuteronFuelRodRecipe = authoritativeRecipes.find(
  (recipe) =>
    recipe.outputs.some(({ item_id: itemId }) => itemId === 1802) &&
    recipe.unlocking_technologies.some(
      ({ tech_id: technologyId }) => technologyId === 1416,
    ),
);
const deuteronFuelRodInputIds = (deuteronFuelRodRecipe?.inputs || []).map(
  ({ item_id: itemId }) => itemId,
);
if (!sameIds(deuteronFuelRodInputIds, [1121, 1107, 1205])) {
  errors.push("GREEN Deuteron Fuel Rod recipe inputs are not authoritative");
}

const inheritedDysonResearch = findElementsByClass(
  dysonSection?.inner || "",
  "dyson-inherited-research",
);
const ownedDysonResearch = findElementsByClass(
  dysonSection?.inner || "",
  "dyson-owned-research",
);
for (const block of ownedDysonResearch) {
  const ids = [...block.inner.matchAll(/data-tech-id="(\d+)"/g)].map(
    (match) => match[1],
  );
  if (JSON.stringify(ids) !== JSON.stringify(["3101", "3102"])) {
    errors.push(`DYSON-owned research is invalid: ${ids.join(", ")}`);
  }
}
if (inheritedDysonResearch.length !== 0 || ownedDysonResearch.length !== 2) {
  errors.push("DYSON must show only its owned research in dashboard and prose");
}
const dysonText = stripMarkup(dysonSection?.inner || "");
for (const rejectedGreenRecap of [
  "Completed in GREEN:",
  "GREEN proved this solar-orbit branch",
  "DYSON does not research it again.",
]) {
  if (dysonText.includes(rejectedGreenRecap)) {
    errors.push(`DYSON repeats GREEN research: ${rejectedGreenRecap}`);
  }
}
const expectedDysonPrerequisites = new Map([
  ["3101", { required: [], implicit: ["1503"] }],
  ["3102", { required: ["3101"], implicit: [] }],
]);
for (const [technologyId, expected] of expectedDysonPrerequisites) {
  const technology = technologyReference[technologyId] || {};
  const requiredIds = (technology.required || []).map(({ id }) => id);
  const implicitIds = (technology.implicitRequired || []).map(({ id }) => id);
  if (!sameIds(requiredIds, expected.required)) {
    errors.push(`DYSON technology ${technologyId} has invalid required edges`);
  }
  if (!sameIds(implicitIds, expected.implicit)) {
    errors.push(`DYSON technology ${technologyId} has invalid implicit edges`);
  }
}
for (const requiredDysonText of [
  "This guide assumes Solar Sail Life Lv1 → Lv2 before the launch network reaches full scale.",
  "You can skip them and compensate with more sail production and more successful launches, but this guide does not plan that route.",
  "With both Solar Sail Life upgrades, the reference swarm uses",
  "405 Solar Sails/min",
  "about 383 successful launches/min",
  "Sixty Ejectors averaging 32% firing time provide about 384 launches/min.",
  "This is a planning reference, not a finish line: placed Ejectors matter only when their orbit and firing window let them launch.",
  "Treat the reference as a starting point. The factory and star you actually built will decide what is enough.",
  "Reaching 2,000 stored Antimatter later is the midpoint used to enter WHITE; it is not a requirement for leaving DYSON.",
]) {
  if (!dysonText.includes(requiredDysonText)) {
    errors.push(`DYSON chosen-route guidance is missing: ${requiredDysonText}`);
  }
}
for (const rejectedDysonText of [
  "1.655 GW",
  "511 launches/min",
  "517.5 sails/min",
  "base-life planning case",
  "4,000 Antimatter",
]) {
  if (dysonText.includes(rejectedDysonText)) {
    errors.push(
      `DYSON retains rejected parallel guidance: ${rejectedDysonText}`,
    );
  }
}
const dysonReceiverBridgeLinks =
  dysonSection?.inner.match(/href="#receiver-antimatter-bridge"/g) || [];
if (dysonReceiverBridgeLinks.length !== 1) {
  errors.push(
    `DYSON must contain one prescribed Receiver bridge handoff; found ${dysonReceiverBridgeLinks.length}`,
  );
}
const dysonAntimatterHandoff = findElementsByClass(
  dysonSection?.inner || "",
  "dyson-antimatter-handoff",
)[0];
if (
  (stripMarkup(dysonAntimatterHandoff?.inner || "").match(/2,000/g) || [])
    .length !== 1
) {
  errors.push("DYSON Antimatter midpoint is missing or duplicated");
}
const oneScreenChecklist = html.slice(html.indexOf('id="ref-checklist"'));
for (const chosenRouteChecklistText of [
  "405/min installed capacity",
  "60-Ejector deployment buffer",
]) {
  if (!stripMarkup(oneScreenChecklist).includes(chosenRouteChecklistText)) {
    errors.push(`One-Screen Checklist is missing: ${chosenRouteChecklistText}`);
  }
}
for (const rejectedChecklistText of [
  "517.5/min installed capacity",
  "80-Ejector deployment buffer",
]) {
  if (stripMarkup(oneScreenChecklist).includes(rejectedChecklistText)) {
    errors.push(`One-Screen Checklist retains: ${rejectedChecklistText}`);
  }
}
const blueSection = findElementsByClass(html, "phase-section-blue")[0];
const blueText = stripMarkup(blueSection?.inner || "");
for (const requiredBlueGoalText of [
  "Your first proper phase has two jobs, and they belong together.",
  "The mall already makes the blue cube ingredients so use the same growing factory to keep blue research running on its own.",
  "You need both before you move on.",
  "Don't get stuck in this phase for too long automating every recipe you have.",
]) {
  if (!blueText.includes(requiredBlueGoalText)) {
    errors.push(`Approved BLUE Goal is missing: ${requiredBlueGoalText}`);
  }
}
const quickProcesses = findElementsByClass(html, "quick-process");
const expectedQuickProcesses = [
  {
    section: blueSection,
    summary: "Quick process — Capture a reusable branch",
    steps: 3,
  },
  {
    section: findElementsByClass(html, "phase-section-red")[0],
    summary: "Quick process — Split refinery outputs",
    steps: 4,
  },
];
if (quickProcesses.length !== expectedQuickProcesses.length) {
  errors.push(
    `Expected ${expectedQuickProcesses.length} Quick processes; found ${quickProcesses.length}`,
  );
}
for (const [index, expected] of expectedQuickProcesses.entries()) {
  const process = quickProcesses[index];
  if (!process) continue;
  const summary = stripMarkup(
    process.inner.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)?.[1] || "",
  );
  if (process.tag !== "details" || hasAttribute(process.openingTag, "open")) {
    errors.push(`${expected.summary} is not a collapsed native disclosure`);
  }
  if (summary !== expected.summary) {
    errors.push(`Quick-process summary is invalid: ${summary}`);
  }
  if (!expected.section?.full.includes(process.full)) {
    errors.push(`${expected.summary} is outside its owning phase`);
  }
  if ((process.inner.match(/<li\b/g) || []).length !== expected.steps) {
    errors.push(`${expected.summary} has an invalid step count`);
  }
}
const progressIndex = findElementsByClass(html, "progress-index")[0];
const progressIndexMarkup = progressIndex?.inner || "";
if (!progressIndexMarkup) {
  errors.push("Quick Progress Index is missing");
} else {
  const numberedRows = [
    ...progressIndexMarkup.matchAll(/<tr>\s*<td>\s*(\d+)\s*<\/td>/g),
  ].map((match) => Number(match[1]));
  if (
    JSON.stringify(numberedRows) !== JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9])
  ) {
    errors.push(
      `Quick Progress Index numbered route is invalid: ${numberedRows.join(", ")}`,
    );
  }
  const optionalRows = findElementsByClass(
    progressIndexMarkup,
    "progress-optional-row",
  );
  const optionalIds = optionalRows.map(
    (row) => row.inner.match(/href="#([^"]+)"/)?.[1] || "",
  );
  if (
    JSON.stringify(optionalIds) !== JSON.stringify(expectedOptionalPhaseIds)
  ) {
    errors.push(
      `Quick Progress Index optional paths are invalid: ${optionalIds.join(", ")}`,
    );
  }
}
for (const compatibilityId of [
  "flight",
  "titanium",
  "ils-automate",
  "bootstrap",
]) {
  if (
    (html.match(new RegExp(`id="${compatibilityId}"`, "g")) || []).length !== 1
  ) {
    errors.push(
      `Compatibility anchor must appear exactly once: #${compatibilityId}`,
    );
  }
}

const ilsSection = findElementsByClass(html, "phase-section-ils")[0];
const ilsResearchBlocks = findElementsByClass(
  ilsSection?.inner || "",
  "stage-research",
);
const expectedIlsResearchIds = [
  ["4101", "4102", "1805", "2901", "2102", "2902", "1413"],
  [
    "1121",
    "1131",
    "1311",
    "1302",
    "1122",
    "1123",
    "1124",
    "1701",
    "1702",
    "1703",
    "1112",
    "1113",
    "1114",
    "1602",
    "1603",
    "3701",
    "1604",
  ],
  ["1414", "1605"],
];
if (ilsResearchBlocks.length !== expectedIlsResearchIds.length) {
  errors.push(
    `ILS must contain exactly three chronological research blocks; found ${ilsResearchBlocks.length}`,
  );
}
for (const [index, expectedIds] of expectedIlsResearchIds.entries()) {
  const actualIds = [
    ...(ilsResearchBlocks[index]?.inner || "").matchAll(
      /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
    ),
  ].map((match) => match[1]);
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    errors.push(
      `ILS Stage ${index + 1} research ownership is invalid: ${actualIds.join(", ")}`,
    );
  }
}

const expectedIlsPrerequisiteEdges = new Map([
  ["4102", ["4101"]],
  ["2902", ["2102"]],
  ["1131", ["1121"]],
  ["1302", ["1311"]],
  ["1123", ["1122"]],
  ["1124", ["1123"]],
  ["1702", ["1701"]],
  ["1703", ["1702"]],
  ["1113", ["1112"]],
  ["1114", ["1113"]],
  ["1603", ["1602"]],
  ["1605", ["1414"]],
]);
for (const [technologyId, prerequisiteIds] of expectedIlsPrerequisiteEdges) {
  const technology = technologyReference[technologyId] || {};
  const actualPrerequisiteIds = new Set(
    [
      ...(technology.required || []),
      ...(technology.implicitRequired || []),
    ].map(({ id }) => String(id)),
  );
  for (const prerequisiteId of prerequisiteIds) {
    if (!actualPrerequisiteIds.has(prerequisiteId)) {
      errors.push(
        `ILS prerequisite arrow ${prerequisiteId} -> ${technologyId} is not authoritative`,
      );
    }
  }
}
if (
  !authoritativeFormalEdges.includes(
    ",item:1407,tech:2901,research_input,formal_game_data,runtime:LDB.techs,exact,",
  )
) {
  errors.push(
    "Drive Engine Lv1 is missing its authoritative Engine research input",
  );
}

const redSection = findElementsByClass(html, "phase-section-red")[0];
const redResearchMarkup =
  redSection?.inner.match(/<h2>Research first<\/h2>([\s\S]*?)<h2[^>]*>/)?.[1] ||
  "";
const redSmeltingPurificationIndex = redResearchMarkup.indexOf(
  'data-tech-id="1402"',
);
const redCrystalSmeltingIndex = redResearchMarkup.indexOf(
  'data-tech-id="1403"',
);
const redSignalTowerIndex = redResearchMarkup.indexOf("Signal Towers");
if (
  redSmeltingPurificationIndex < 0 ||
  redCrystalSmeltingIndex <= redSmeltingPurificationIndex ||
  redSignalTowerIndex <= redCrystalSmeltingIndex
) {
  errors.push(
    "RED does not assign Crystal Smelting after Smelting Purification and before Signal Tower guidance",
  );
}
const crystalSmeltingPrerequisites = new Set(
  (technologyReference["1403"]?.required || []).map(({ id }) => Number(id)),
);
if (!crystalSmeltingPrerequisites.has(1402)) {
  errors.push(
    "Crystal Smelting is not authoritatively gated by Smelting Purification",
  );
}
const signalTowerRecipe = authoritativeRecipes.find((recipe) =>
  recipe.outputs.some(({ item_id: itemId }) => itemId === 3007),
);
if (!signalTowerRecipe?.inputs.some(({ item_id: itemId }) => itemId === 1113)) {
  errors.push(
    "Signal Tower recipe is missing its authoritative Crystal Silicon input",
  );
}
const standardCrystalSiliconRecipe = authoritativeRecipes.find(
  (recipe) =>
    recipe.outputs.some(({ item_id: itemId }) => itemId === 1113) &&
    recipe.inputs.some(({ item_id: itemId }) => itemId === 1105),
);
if (
  !standardCrystalSiliconRecipe?.unlocking_technologies.some(
    ({ tech_id: techId }) => techId === 1403,
  )
) {
  errors.push(
    "Crystal Smelting does not unlock the standard Crystal Silicon recipe",
  );
}

for (const staleIlsClaim of [
  "Basic Chemical Engineering is assumed",
  "start making yellow cubes early",
  "They can pile up quietly",
  "yellow cubes should already be waiting",
]) {
  if (guideText.includes(staleIlsClaim)) {
    errors.push(
      `ILS still contains pre-haulback research language: ${staleIlsClaim}`,
    );
  }
}
for (const requiredStageThreeText of [
  "Build the transport package",
  "Transport package checkpoint:",
  "complete pair of ILS towers and all five Logistics Vessels",
  "Put the route to work",
]) {
  if (!guideText.includes(requiredStageThreeText)) {
    errors.push(`ILS Stage III is missing: ${requiredStageThreeText}`);
  }
}

const yellowSection = findElementsByClass(html, "phase-section-yellow")[0];
const yellowResearchDashboard = findElementsByClass(
  yellowSection?.inner || "",
  "yellow-research-dashboard",
)[0];
const expectedYellowDashboardIds = [
  "2203",
  "2302",
  "2403",
  "2602",
  "2703",
  "1608",
  "3601",
];
const yellowDashboardIds = [
  ...(yellowResearchDashboard?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(yellowDashboardIds) !==
  JSON.stringify(expectedYellowDashboardIds)
) {
  errors.push(
    `YELLOW dashboard research groups are invalid: ${yellowDashboardIds.join(", ")}`,
  );
}
const yellowDashboardText = stripMarkup(yellowResearchDashboard?.inner || "");
const yellowDashboardGroupIndexes = [
  "Buildout:",
  "Mall access:",
  "Resource horizon:",
].map((label) => yellowDashboardText.indexOf(label));
if (
  yellowDashboardGroupIndexes.some((index) => index < 0) ||
  yellowDashboardGroupIndexes.some(
    (index, position) =>
      position > 0 && index <= yellowDashboardGroupIndexes[position - 1],
  )
) {
  errors.push("YELLOW dashboard research groups are missing or out of order");
}
if (/[→+]/.test(yellowDashboardText)) {
  errors.push("YELLOW dashboard falsely joins independent research groups");
}

const yellowPrescription = findElementsByClass(
  yellowSection?.inner || "",
  "yellow-research-prescription",
)[0];
const yellowPrescriptionIds = [
  ...(yellowPrescription?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(yellowPrescriptionIds) !==
  JSON.stringify(["2102", ...expectedYellowDashboardIds])
) {
  errors.push(
    `YELLOW prescribed stopping ranks are invalid: ${yellowPrescriptionIds.join(", ")}`,
  );
}
const yellowFiller = findElementsByClass(
  yellowSection?.inner || "",
  "yellow-research-filler",
)[0];
const yellowFillerIds = [
  ...(yellowFiller?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(yellowFillerIds) !== JSON.stringify(["1501", "1711", "1511"])
) {
  errors.push(`YELLOW filler chain is invalid: ${yellowFillerIds.join(", ")}`);
}

const expectedYellowPrerequisites = new Map([
  ["2203", ["2202", "2102"]],
  ["2302", ["2301", "2101"]],
  ["2403", ["2402", "2102"]],
  ["2602", ["2601", "2102"]],
  ["2703", ["2702", "2102"]],
  ["1608", ["1602", "1702"]],
  ["3601", ["1001"]],
  ["1511", ["1403", "1501", "1711"]],
]);
for (const [technologyId, prerequisiteIds] of expectedYellowPrerequisites) {
  const technology = technologyReference[technologyId] || {};
  const actualPrerequisiteIds = new Set(
    [
      ...(technology.required || []),
      ...(technology.implicitRequired || []),
    ].map(({ id }) => String(id)),
  );
  for (const prerequisiteId of prerequisiteIds) {
    if (!actualPrerequisiteIds.has(prerequisiteId)) {
      errors.push(
        `YELLOW technology ${technologyId} is missing prerequisite ${prerequisiteId}`,
      );
    }
  }
}

const researchInputPoints = new Map();
for (const line of authoritativeFormalEdges.split(/\r?\n/)) {
  const match = line.match(
    /^\d+,item:(600[1-6]),tech:(\d+),research_input,[^,]+,[^,]+,exact,,(\d+),/,
  );
  if (!match) continue;
  const [, itemId, technologyId, points] = match;
  const inputs = researchInputPoints.get(technologyId) || [];
  inputs.push({ itemId, points: Number(points) });
  researchInputPoints.set(technologyId, inputs);
}
const graphTechnologyNodes = new Map(
  authoritativeGraph.nodes
    .filter(({ node_type: nodeType }) => nodeType === "tech_proto")
    .map((node) => [String(node.game_id), node]),
);
const rejectedYellowStoppingIds = [
  "2103",
  "2204",
  "2303",
  "2404",
  "2603",
  "2704",
];
const rejectedYellowCubeTotal = rejectedYellowStoppingIds.reduce(
  (total, technologyId) => {
    const hashNeeded = graphTechnologyNodes.get(technologyId)?.hash_needed;
    const inputPoints = researchInputPoints.get(technologyId) || [];
    if (!Number.isFinite(hashNeeded) || !inputPoints.length) {
      errors.push(
        `YELLOW rejected-stop cost data is missing for technology ${technologyId}`,
      );
      return total;
    }
    return (
      total +
      inputPoints.reduce(
        (technologyTotal, { points }) =>
          technologyTotal + (hashNeeded * points) / 3600,
        0,
      )
    );
  },
  0,
);
if (rejectedYellowCubeTotal !== 10500) {
  errors.push(
    `YELLOW rejected stopping point costs ${rejectedYellowCubeTotal} cubes instead of 10500`,
  );
}

const yellowText = stripMarkup(yellowSection?.inner || "");
for (const requiredYellowText of [
  "The next shared stopping point, including Mecha Core Lv3, would consume 10,500 cubes in total, which is too expensive for a YELLOW buildout detour before PURPLE.",
  "These are useful jobs for the research queue while yellow settles, not requirements for leaving the phase.",
  "The only phase gate is three continuously supplied yellow-cube Labs.",
  "As soon as the three-Lab gate is satisfied, abandon any unfinished recommendation—including the filler chain—and move to PURPLE.",
  "Accumulators can absorb surplus generation and cushion the charging shock from logistics stations",
]) {
  if (!yellowText.includes(requiredYellowText)) {
    errors.push(
      `YELLOW bounded research guidance is missing: ${requiredYellowText}`,
    );
  }
}
for (const staleYellowText of [
  "Integrated Logistics System",
  "take every affordable rank",
  "Take it when stacked-belt tools sound useful",
]) {
  if (yellowText.includes(staleYellowText)) {
    errors.push(
      `YELLOW still contains stale research guidance: ${staleYellowText}`,
    );
  }
}

const purpleSection = findElementsByClass(html, "phase-section-purple")[0];
const purpleResearchDashboard = findElementsByClass(
  purpleSection?.inner || "",
  "purple-research-dashboard",
)[0];
const expectedPurpleDashboardIds = [
  "1132",
  "1133",
  "1312",
  "2103",
  "2204",
  "2404",
  "2603",
  "2502",
  "2704",
  "3402",
  "3502",
];
const purpleDashboardIds = [
  ...(purpleResearchDashboard?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(purpleDashboardIds) !==
  JSON.stringify(expectedPurpleDashboardIds)
) {
  errors.push(
    `PURPLE dashboard research groups are invalid: ${purpleDashboardIds.join(", ")}`,
  );
}
const purpleDashboardText = stripMarkup(purpleResearchDashboard?.inner || "");
const purpleDashboardGroupIndexes = [
  "Purple gate:",
  "Buildout:",
  "Logistics:",
].map((label) => purpleDashboardText.indexOf(label));
if (
  purpleDashboardGroupIndexes.some((index) => index < 0) ||
  purpleDashboardGroupIndexes.some(
    (index, position) =>
      position > 0 && index <= purpleDashboardGroupIndexes[position - 1],
  )
) {
  errors.push("PURPLE dashboard research groups are missing or out of order");
}
if (purpleDashboardText.includes("Resource horizon:")) {
  errors.push("PURPLE dashboard has an unapproved fourth research group");
}

const purplePrescription = findElementsByClass(
  purpleSection?.inner || "",
  "purple-research-prescription",
)[0];
const purplePrescriptionIds = [
  ...(purplePrescription?.inner || "").matchAll(
    /class="[^"]*\btech-ref\b[^"]*"[^>]*data-tech-id="(\d+)"/g,
  ),
].map((match) => match[1]);
if (
  JSON.stringify(purplePrescriptionIds) !==
  JSON.stringify([
    "2103",
    "2204",
    "2404",
    "2603",
    "2502",
    "2704",
    "3402",
    "3502",
    "3601",
    "3602",
  ])
) {
  errors.push(
    `PURPLE prescribed stopping ranks are invalid: ${purplePrescriptionIds.join(", ")}`,
  );
}

const expectedPurplePrerequisites = new Map([
  ["1132", ["1131"]],
  ["1133", ["1132"]],
  ["1312", ["1302", "1133"]],
  ["2103", ["2102"]],
  ["2204", ["2203", "2102"]],
  ["2404", ["2403", "2103"]],
  ["2603", ["2602", "2103"]],
  ["2502", ["2501", "2102"]],
  ["2704", ["2703", "2103"]],
  ["3402", ["3401"]],
  ["3502", ["3501"]],
  ["3602", ["3601"]],
]);
for (const [technologyId, prerequisiteIds] of expectedPurplePrerequisites) {
  const technology = technologyReference[technologyId] || {};
  const actualPrerequisiteIds = new Set(
    [
      ...(technology.required || []),
      ...(technology.implicitRequired || []),
    ].map(({ id }) => String(id)),
  );
  for (const prerequisiteId of prerequisiteIds) {
    if (!actualPrerequisiteIds.has(prerequisiteId)) {
      errors.push(
        `PURPLE technology ${technologyId} is missing prerequisite ${prerequisiteId}`,
      );
    }
  }
}

function cubeCostForTechnology(technologyId, phase) {
  const hashNeeded = graphTechnologyNodes.get(technologyId)?.hash_needed;
  const inputPoints = researchInputPoints.get(technologyId) || [];
  if (!Number.isFinite(hashNeeded) || !inputPoints.length) {
    errors.push(`${phase} cost data is missing for technology ${technologyId}`);
    return 0;
  }
  return inputPoints.reduce(
    (total, { points }) => total + (hashNeeded * points) / 3600,
    0,
  );
}
const rejectedPurpleBuildoutTotal = [
  "2104",
  "2205",
  "2405",
  "2604",
  "2503",
  "2705",
].reduce(
  (total, technologyId) =>
    total + cubeCostForTechnology(technologyId, "PURPLE rejected buildout"),
  0,
);
if (rejectedPurpleBuildoutTotal !== 20800) {
  errors.push(
    `PURPLE rejected buildout costs ${rejectedPurpleBuildoutTotal} cubes instead of 20800`,
  );
}
const rejectedPurpleCarrierTotal = ["3403", "3503"].reduce(
  (total, technologyId) =>
    total + cubeCostForTechnology(technologyId, "PURPLE rejected carrier"),
  0,
);
if (rejectedPurpleCarrierTotal !== 4800) {
  errors.push(
    `PURPLE rejected carrier ranks cost ${rejectedPurpleCarrierTotal} cubes instead of 4800`,
  );
}
if (
  !(researchInputPoints.get("3603") || []).some(
    ({ itemId }) => itemId === "6004",
  )
) {
  errors.push(
    "Vein Utilization Lv3 does not prove the stated purple-cube stop",
  );
}

const purpleText = stripMarkup(purpleSection?.inner || "");
for (const requiredPurpleText of [
  "This three-technology unlock is the only research required before purple-cube production can begin.",
  "The upgrades below give the research queue useful work while the purple district settles. They are not requirements for leaving PURPLE.",
  "Catch up any YELLOW stopping ranks you discarded",
  "Stop there. The next shared buildout stopping point would consume 20,800 cubes in total, including purple cubes needed by GREEN, so the guide rejects it.",
  "The next pair of carrier ranks would consume another 4,800 cubes in total without being required for PURPLE's starter-system routes.",
  "Stop there because the next rank begins consuming purple cubes.",
  "The only phase gate is three continuously supplied purple-cube Labs.",
  "As soon as the three-Lab gate is satisfied, abandon any unfinished filler recommendation and move to GREEN.",
]) {
  if (!purpleText.includes(requiredPurpleText)) {
    errors.push(
      `PURPLE bounded research guidance is missing: ${requiredPurpleText}`,
    );
  }
}
for (const stalePurpleText of [
  "Miniature Particle Collider",
  "fusion-power preparation",
  "take every affordable rank",
]) {
  if (purpleText.includes(stalePurpleText)) {
    errors.push(
      `PURPLE still contains stale research guidance: ${stalePurpleText}`,
    );
  }
}

const openingCardScopes = new Map([
  ["card-bootstrap-mall-logistics", "bootstrap"],
  ["card-bootstrap-mall-industry", "bootstrap"],
  ["card-bootstrap-mall-storage", "bootstrap"],
  ["card-bootstrap-mall-power", "bootstrap"],
  ["card-blue-blue-cubes", "blue"],
]);
for (const [cardId, scope] of openingCardScopes) {
  const card = cards.find((candidate) => candidate.id === cardId);
  if (!card || getAttribute(card.openingTag, "data-card-scope") !== scope)
    errors.push(`${cardId} is missing its opening-phase card scope`);
}

const cardListeners = {};
const bootstrapCard = { dataset: { cardScope: "bootstrap" }, open: false };
const blueCard = { dataset: { cardScope: "blue" }, open: false };
const openingPhase = {
  querySelectorAll(selector) {
    return selector === "details.build-card" ? [bootstrapCard, blueCard] : [];
  },
};
function makeCardButton(scope) {
  const controls = { dataset: { cardScope: scope } };
  return {
    dataset: { cardAction: "open" },
    closest(selector) {
      if (selector === ".phase-section") return openingPhase;
      if (selector === ".card-controls") return controls;
      return null;
    },
  };
}
const cardDocument = {
  addEventListener(type, listener) {
    (cardListeners[type] ||= []).push(listener);
  },
  getElementById() {
    return null;
  },
};
vm.runInNewContext(fs.readFileSync("assets/js/cards.js", "utf8"), {
  document: cardDocument,
  location: { hash: "" },
  requestAnimationFrame() {},
  setTimeout() {},
  window: { addEventListener() {} },
});
function clickCardControl(button) {
  const target = {
    closest(selector) {
      if (selector === ".card-control") return button;
      return null;
    },
  };
  cardListeners.click.forEach((listener) => listener({ target }));
}
clickCardControl(makeCardButton("bootstrap"));
if (!bootstrapCard.open || blueCard.open) {
  errors.push(
    "Mall card controls do not remain isolated inside the merged BLUE phase",
  );
}
bootstrapCard.open = false;
clickCardControl(makeCardButton("blue"));
if (bootstrapCard.open || !blueCard.open) {
  errors.push(
    "Blue-science card controls do not remain isolated inside the merged BLUE phase",
  );
}
if (errors.length) {
  console.error(`Card validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  [
    `Card validation passed: ${cards.length} phase cards,`,
    `${references.length} reusable references,`,
    `${operatingNoteCount} icon-free Operating Notes,`,
    `${links.length} direct links,`,
    `${upgradeTechnologyNodes.length} upgrade ranks including`,
    `${previouslyAmbiguousUpgradeNodes.length} rank-qualified tooltip records,`,
    "textual-map complexity within bounds, and",
    `${recipeTransitionCount} displayed recipe transformations verified.`,
  ].join(" "),
);
