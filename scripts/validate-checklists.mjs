import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { findElementsByClass } from "./lib/markup-contracts.mjs";

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
  ["dsp-guide:checklist-state:v1", JSON.stringify({
    "blue:blue-runs-continuously": true,
    "bootstrap:relocated-opening-objective": true,
    "blue:former-opening-power-objective": true,
  })],
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
    return selector === ".task-list-item-checkbox" ? [first, second, duplicate, stable, aliased] : [];
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
assert.equal(duplicate.dataset.checklistKey, "blue:blue-runs-continuously:2", "duplicate key was not disambiguated");
assert.equal(stable.checked, true, "explicit checklist identity was not restored after relocation");
assert.equal(stable.dataset.checklistKey, "bootstrap:relocated-opening-objective", "explicit checklist identity changed");
assert.equal(aliased.checked, true, "checklist alias was not restored after editorial consolidation");

second.checked = true;
second.trigger("change");
let saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal(saved["red:red-runs-continuously"], true, "checked state was not saved");

first.checked = false;
first.trigger("change");
saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal("blue:blue-runs-continuously" in saved, false, "unchecked state was not removed");

aliased.checked = false;
aliased.trigger("change");
saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal("blue:former-opening-power-objective" in saved, false, "checklist alias was not removed after an update");

resetButton.trigger("click");
assert.equal(first.checked, false, "reset did not clear the first checkbox");
assert.equal(second.checked, false, "reset did not clear the second checkbox");
assert.equal(duplicate.checked, false, "reset did not clear the duplicate checkbox");
assert.equal(stable.checked, false, "reset did not clear the relocated checkbox");
assert.equal(aliased.checked, false, "reset did not clear the aliased checkbox");
assert.equal(values.has("dsp-guide:checklist-state:v1"), false, "reset did not remove saved guide state");
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
  getItem() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
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
assert.equal(unavailableBox.disabled, false, "storage denial left the checkbox disabled");
unavailableBox.checked = true;
unavailableBox.trigger("change");
unavailableReset.trigger("click");
assert.equal(unavailableBox.checked, false, "session reset failed without storage");
assert.match(unavailableStatus.textContent, /local saving is unavailable/i);

const html = fs.readFileSync("index.html", "utf8");
const glossary = findElementsByClass(html, "guide-glossary")[0];
const progressIndex = findElementsByClass(html, "progress-index")[0];
assert.ok(glossary && progressIndex && glossary.index < progressIndex.index, "glossary must precede the progress index");
assert.ok((glossary.inner.match(/<dt>/g) || []).length > 0, "glossary contains no terms");
const referenceChecklistStart = html.search(/<h1\b[^>]*\bid="ref-checklist"[^>]*>/);
const referenceChecklistEnd = html.search(/<h1\b[^>]*\bid="ref-troubleshoot"[^>]*>/);
assert.ok(
  referenceChecklistStart >= 0 &&
    referenceChecklistEnd > referenceChecklistStart,
  "one-screen checklist is missing",
);
const referenceChecklist = html.slice(
  referenceChecklistStart,
  referenceChecklistEnd,
);
const optionalChecklist = findElementsByClass(referenceChecklist, "checklist-optional-group")[0];
assert.ok(optionalChecklist, "one-screen optional-capability group is missing");
const mainChecklist = referenceChecklist.slice(0, optionalChecklist.index);
assert.doesNotMatch(mainChecklist, /href="#(?:warp|logistics)"/, "optional capabilities appear in the numbered checklist route");
assert.match(optionalChecklist.inner, /href="#warp"/);
assert.match(optionalChecklist.inner, /href="#logistics"/);
assert.ok((optionalChecklist.inner.match(/task-list-item-checkbox/g) || []).length > 0, "optional capabilities contain no checklist items");
assert.ok((html.match(/task-list-item-checkbox/g) || []).length > 0, "guide contains no checklist items");
assert.match(html, /assets\/js\/checklists\.js/, "checklist script is not referenced by the guide");

console.log("Checklist validation passed: persistence, duplicate keys, reset, storage denial, glossary, and route grouping verified.");
