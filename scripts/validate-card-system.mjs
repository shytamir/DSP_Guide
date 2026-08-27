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
const technologyReference = JSON.parse(
  fs.readFileSync("assets/data/tech-reference.json", "utf8"),
);
const errors = [];
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
    ["1502", ["1501"]],
    ["1503", ["1502"]],
    ["1521", ["1503"]],
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
for (const compatibilityId of ["flight", "titanium", "bootstrap"]) {
  if (
    (html.match(new RegExp(`id="${compatibilityId}"`, "g")) || []).length !== 1
  ) {
    errors.push(
      `Compatibility anchor must appear exactly once: #${compatibilityId}`,
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
  `Card validation passed: ${cards.length} phase cards, ${references.length} reusable references, ${operatingNoteCount} icon-free Operating Notes, ${links.length} direct links, textual-map complexity within bounds, and ${recipeTransitionCount} displayed recipe transformations verified.`,
);
