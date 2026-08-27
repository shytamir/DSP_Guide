import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { findElementsByClass, stripMarkup } from "./lib/markup-contracts.mjs";

function makeCheckbox(phaseId, label) {
  const listeners = {};
  const item = { textContent: label };
  const phase = phaseId ? { id: phaseId } : null;
  return {
    checked: false,
    dataset: {},
    disabled: true,
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    closest(selector) {
      if (selector === ".task-list-item") return item;
      if (selector === ".phase-section[id]") return phase;
      return null;
    },
    trigger(type) {
      listeners[type]?.();
    },
  };
}

const first = makeCheckbox("blue", "Blue runs continuously.");
const second = makeCheckbox("red", "Red runs continuously.");
const duplicate = makeCheckbox("blue", "Blue runs continuously.");
const stable = makeCheckbox("blue", "Relocated opening objective.");
stable.dataset.checklistKey = "bootstrap:relocated-opening-objective";
const aliased = makeCheckbox("blue", "Updated opening power objective.");
aliased.dataset.checklistKey = "bootstrap:updated-opening-power-objective";
aliased.dataset.checklistAliases = "blue:former-opening-power-objective";
const resetListeners = {};
const resetButton = {
  addEventListener(type, listener) {
    resetListeners[type] = listener;
  },
  trigger(type) {
    resetListeners[type]?.();
  },
};
const status = { textContent: "" };
const values = new Map([
  [
    "dsp-guide:checklist-state:v1",
    JSON.stringify({
      "blue:blue-runs-continuously": true,
      "bootstrap:relocated-opening-objective": true,
      "blue:former-opening-power-objective": true,
    }),
  ],
]);
const localStorage = {
  getItem(key) {
    return values.has(key) ? values.get(key) : null;
  },
  removeItem(key) {
    values.delete(key);
  },
  setItem(key, value) {
    values.set(key, String(value));
  },
};
const document = {
  getElementById(id) {
    if (id === "reset-checklist-progress") return resetButton;
    if (id === "checklist-save-status") return status;
    return null;
  },
  querySelectorAll(selector) {
    return selector === ".task-list-item-checkbox"
      ? [first, second, duplicate, stable, aliased]
      : [];
  },
};

vm.runInNewContext(fs.readFileSync("assets/js/checklists.js", "utf8"), {
  document,
  localStorage,
});

assert.equal(first.disabled, false, "persisted checklist was not enabled");
assert.equal(second.disabled, false, "new checklist was not enabled");
assert.equal(first.checked, true, "saved checklist state was not restored");
assert.equal(second.checked, false, "unsaved checklist should begin unchecked");
assert.equal(
  duplicate.dataset.checklistKey,
  "blue:blue-runs-continuously:2",
  "duplicate key was not disambiguated",
);
assert.equal(
  stable.checked,
  true,
  "explicit checklist identity was not restored after relocation",
);
assert.equal(
  stable.dataset.checklistKey,
  "bootstrap:relocated-opening-objective",
  "explicit checklist identity changed",
);
assert.equal(
  aliased.checked,
  true,
  "checklist alias was not restored after editorial consolidation",
);

second.checked = true;
second.trigger("change");
let saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal(
  saved["red:red-runs-continuously"],
  true,
  "checked state was not saved",
);

first.checked = false;
first.trigger("change");
saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal(
  "blue:blue-runs-continuously" in saved,
  false,
  "unchecked state was not removed",
);

aliased.checked = false;
aliased.trigger("change");
saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal(
  "blue:former-opening-power-objective" in saved,
  false,
  "checklist alias was not removed after an update",
);

resetButton.trigger("click");
assert.equal(first.checked, false, "reset did not clear the first checkbox");
assert.equal(second.checked, false, "reset did not clear the second checkbox");
assert.equal(
  duplicate.checked,
  false,
  "reset did not clear the duplicate checkbox",
);
assert.equal(
  stable.checked,
  false,
  "reset did not clear the relocated checkbox",
);
assert.equal(
  aliased.checked,
  false,
  "reset did not clear the aliased checkbox",
);
assert.equal(
  values.has("dsp-guide:checklist-state:v1"),
  false,
  "reset did not remove saved guide state",
);
assert.equal(status.textContent, "Checklist progress reset.");

const unavailableBox = makeCheckbox("green", "Green runs continuously.");
const unavailableStatus = { textContent: "" };
const unavailableResetListeners = {};
const unavailableReset = {
  addEventListener(type, listener) {
    unavailableResetListeners[type] = listener;
  },
  trigger(type) {
    unavailableResetListeners[type]?.();
  },
};
const unavailableStorage = {
  getItem() {
    throw new Error("blocked");
  },
  removeItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};
vm.runInNewContext(fs.readFileSync("assets/js/checklists.js", "utf8"), {
  document: {
    getElementById(id) {
      if (id === "reset-checklist-progress") return unavailableReset;
      if (id === "checklist-save-status") return unavailableStatus;
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".task-list-item-checkbox" ? [unavailableBox] : [];
    },
  },
  localStorage: unavailableStorage,
});
assert.equal(
  unavailableBox.disabled,
  false,
  "storage denial left the checkbox disabled",
);
unavailableBox.checked = true;
unavailableBox.trigger("change");
unavailableReset.trigger("click");
assert.equal(
  unavailableBox.checked,
  false,
  "session reset failed without storage",
);
assert.match(unavailableStatus.textContent, /local saving is unavailable/i);

const html = fs.readFileSync("index.html", "utf8");
const glossary = findElementsByClass(html, "guide-glossary")[0];
const progressIndex = findElementsByClass(html, "progress-index")[0];
assert.ok(
  glossary && progressIndex && glossary.index < progressIndex.index,
  "glossary must precede the progress index",
);
assert.ok(
  (glossary.inner.match(/<dt>/g) || []).length > 0,
  "glossary contains no terms",
);
const referenceChecklistStart = html.search(
  /<h1\b[^>]*\bid="ref-checklist"[^>]*>/,
);
const referenceChecklistEnd = html.search(
  /<h1\b[^>]*\bid="ref-troubleshoot"[^>]*>/,
);
assert.ok(
  referenceChecklistStart >= 0 &&
    referenceChecklistEnd > referenceChecklistStart,
  "one-screen checklist is missing",
);
const referenceChecklist = html.slice(
  referenceChecklistStart,
  referenceChecklistEnd,
);
const optionalChecklist = findElementsByClass(
  referenceChecklist,
  "checklist-optional-group",
)[0];
assert.ok(optionalChecklist, "one-screen optional-capability group is missing");
const mainChecklist = referenceChecklist.slice(0, optionalChecklist.index);
assert.doesNotMatch(
  mainChecklist,
  /href="#(?:sphere|warp|logistics)"/,
  "optional capabilities appear in the numbered checklist route",
);
const defaultChecklistGroups = findElementsByClass(
  mainChecklist,
  "default-checklist-group",
);
const expectedDefaultChecklist = [
  {
    phase: "blue",
    keys: [
      "reference:blue-materials-continuous",
      "reference:blue-mall-hardware-replenishes",
      "reference:blue-cubes-continuous",
      "reference:blue-research-without-hand-feeding",
      "reference:blue-opening-power",
    ],
    facts: [
      "Iron, Copper, Magnetic Coils, and Circuit Boards arrive continuously",
      "Belts, Sorters, Miners, Smelters, Assemblers, Storage Mk.I, Storage Tanks, Wind Turbines, and Tesla Towers replenish automatically",
      "Blue cubes are produced continuously at 20/min or better",
      "Research continues without hand-feeding",
      "The grid provides roughly 15–20 MW for the mall, blue science, and the coming oil district",
    ],
  },
  {
    phase: "red",
    keys: ["reference:red-sustainable-refining"],
    facts: [
      "Two Matrix Labs sustain 20 red cubes /min while Hydrogen and Refined Oil both keep leaving the Refineries",
    ],
  },
  {
    phase: "ils",
    keys: [
      "reference:ils-transport-package-deployed",
      "reference:ils-materials-arrive-without-icarus",
    ],
    facts: [
      "Two ILS towers and five Logistics Vessels are deployed",
      "Titanium Ingots and High-Purity Silicon arrive at home without Icarus",
    ],
  },
  {
    phase: "yellow",
    keys: ["reference:yellow-cubes-continuous"],
    facts: ["Three yellow-cube Labs produce continuously"],
  },
  {
    phase: "purple",
    keys: ["reference:purple-cubes-continuous"],
    facts: ["Three purple-cube Labs produce continuously"],
  },
  {
    phase: "green",
    keys: [
      "reference:green-cubes-continuous",
      "reference:green-late-components-stored",
    ],
    facts: [
      "Two green-cube Labs produce continuously",
      "Quantum Chips and Graviton Lenses each have visible storage",
    ],
  },
  {
    phase: "dyson",
    keys: [
      "reference:dyson-sails-automated",
      "reference:dyson-ejectors-operating",
      "reference:dyson-generation-useful",
    ],
    facts: [
      "The chosen-route Solar Sail line is automated and operating",
      "EM-Rail Ejector launch infrastructure is automated and operating",
      "Live Dyson generation is useful enough to proceed to the Receiver bridge",
    ],
  },
  {
    phase: "receiver-bridge",
    keys: ["reference:receiver-antimatter-bridge"],
    facts: [
      "Critical Photons are becoming Antimatter reliably and that Antimatter reaches the science district without Icarus",
    ],
  },
  {
    phase: "photon",
    keys: [
      "reference:photon-all-inputs-at-white-pace",
      "reference:photon-antimatter-reserve",
    ],
    facts: [
      "Blue, red, yellow, purple, green, and Antimatter each sustain at least 40/min",
      "At least 2,000 Antimatter is stored",
    ],
  },
  {
    phase: "white",
    keys: [
      "reference:white-universe-matrix-researched",
      "reference:white-inputs-continuous",
      "reference:white-cubes-at-40-per-minute",
      "reference:white-mission-completed",
    ],
    facts: [
      "Universe Matrix research is complete",
      "All six inputs reach the white Labs continuously",
      "Ten Matrix Labs sustain 40 white cubes /min",
      "Mission Completed is consuming or has consumed 4,000 white cubes",
    ],
  },
];
assert.equal(
  defaultChecklistGroups.length,
  expectedDefaultChecklist.length,
  "default checklist has an invalid phase-group count",
);
for (const [index, expected] of expectedDefaultChecklist.entries()) {
  const group = defaultChecklistGroups[index];
  const phase =
    group?.openingTag.match(/data-checklist-phase="([^"]+)"/)?.[1] || "";
  const keys = [
    ...(group?.inner || "").matchAll(/data-checklist-key="([^"]+)"/g),
  ].map((match) => match[1]);
  const text = stripMarkup(group?.inner || "");
  assert.equal(
    phase,
    expected.phase,
    `default checklist group ${index + 1} is out of order`,
  );
  assert.deepEqual(
    keys,
    expected.keys,
    `${expected.phase} checklist keys changed`,
  );
  assert.equal(
    (group?.inner.match(/task-list-item-checkbox/g) || []).length,
    expected.facts.length,
    `${expected.phase} checklist does not use the approved minimum check count`,
  );
  for (const fact of expected.facts) {
    assert.ok(
      text.includes(fact),
      `${expected.phase} checklist is missing: ${fact}`,
    );
  }
}
const mainChecklistKeys = [
  ...mainChecklist.matchAll(/data-checklist-key="([^"]+)"/g),
].map((match) => match[1]);
assert.equal(
  new Set(mainChecklistKeys).size,
  mainChecklistKeys.length,
  "default checklist contains duplicate storage keys",
);
assert.equal(
  mainChecklistKeys.length,
  22,
  "default checklist must contain 22 final gate checks",
);
assert.equal(
  (mainChecklist.match(/data-checklist-aliases="[^"]+"/g) || []).length,
  19,
  "default checklist must retain the 19 safe state aliases",
);
for (const forbiddenFigure of [
  "405/min",
  "517.5/min",
  "60-Ejector",
  "80-Ejector",
]) {
  assert.ok(
    !mainChecklist.includes(forbiddenFigure),
    `default checklist retains reference-only figure: ${forbiddenFigure}`,
  );
}
assert.equal(
  (mainChecklist.match(/href="#receiver-antimatter-bridge"/g) || []).length,
  1,
  "Receiver and Antimatter bridge must appear exactly once in the default checklist",
);
assert.match(optionalChecklist.inner, /href="#warp"/);
assert.match(optionalChecklist.inner, /href="#logistics"/);
assert.ok(
  (optionalChecklist.inner.match(/task-list-item-checkbox/g) || []).length > 0,
  "optional capabilities contain no checklist items",
);
assert.ok(
  (html.match(/task-list-item-checkbox/g) || []).length > 0,
  "guide contains no checklist items",
);
const photonStart = html.indexOf(
  '<section class="phase-section phase-section-photon" id="photon">',
);
const whiteStart = html.indexOf(
  '<section class="phase-section phase-section-white" id="white">',
);
assert.ok(
  photonStart >= 0 && whiteStart > photonStart,
  "PHOTON checklist scope is missing",
);
const photonMarkup = html.slice(photonStart, whiteStart);
for (const checklistClass of [
  "photon-ready-checklist",
  "photon-next-checklist",
]) {
  const checklist = findElementsByClass(photonMarkup, checklistClass)[0];
  const text = stripMarkup(checklist?.inner || "");
  assert.ok(checklist, `${checklistClass} is missing`);
  assert.equal(
    (checklist.inner.match(/task-list-item-checkbox/g) || []).length,
    2,
    `${checklistClass} must contain exactly two conditions`,
  );
  assert.match(
    text,
    /Blue, red, yellow, purple, green, and Antimatter each sustain at least 40\/min\./,
    `${checklistClass} is missing the sustained-rate condition`,
  );
  assert.match(
    text,
    /At least 2,000 Antimatter is stored\./,
    `${checklistClass} is missing the stored-reserve condition`,
  );
}
assert.match(
  html,
  /assets\/js\/checklists\.js/,
  "checklist script is not referenced by the guide",
);

console.log(
  "Checklist validation passed: persistence, duplicate keys, reset, storage denial, glossary, route grouping, and PHOTON gate synchronization verified.",
);
