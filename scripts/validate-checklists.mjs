import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

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
    return selector === ".task-list-item-checkbox" ? [first, second, duplicate, stable] : [];
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

second.checked = true;
second.trigger("change");
let saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal(saved["red:red-runs-continuously"], true, "checked state was not saved");

first.checked = false;
first.trigger("change");
saved = JSON.parse(values.get("dsp-guide:checklist-state:v1"));
assert.equal("blue:blue-runs-continuously" in saved, false, "unchecked state was not removed");

resetButton.trigger("click");
assert.equal(first.checked, false, "reset did not clear the first checkbox");
assert.equal(second.checked, false, "reset did not clear the second checkbox");
assert.equal(duplicate.checked, false, "reset did not clear the duplicate checkbox");
assert.equal(stable.checked, false, "reset did not clear the relocated checkbox");
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
const glossaryStart = html.indexOf('<details class="guide-glossary">');
const contextParagraph = html.indexOf("remember why half the belts exist.");
const progressIndex = html.indexOf("<h1>Quick Progress Index</h1>");
assert.ok(contextParagraph < glossaryStart && glossaryStart < progressIndex, "glossary is not in the required location");
assert.equal((html.match(/<dt>/g) || []).length, 10, "glossary must contain exactly ten terms");
assert.equal((html.match(/task-list-item-checkbox/g) || []).length, 84, "existing checklist coverage changed");
assert.match(html, /assets\/js\/checklists\.js/, "checklist script is not referenced by the guide");

console.log("Checklist validation passed: coverage, persistence, duplicate keys, reset, storage denial, and glossary placement verified.");
