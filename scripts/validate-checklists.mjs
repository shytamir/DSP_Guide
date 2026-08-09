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
assert.equal(aliased.checked, true, "legacy checklist alias was not restored after editorial consolidation");

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
assert.equal("blue:former-opening-power-objective" in saved, false, "legacy checklist alias was not removed after an update");

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
const finiteBillMarker = html.lastIndexOf("<strong>First yellow batch</strong>");
const finiteBillStart = html.lastIndexOf('<table class="allocation-table">', finiteBillMarker);
const finiteBillEnd = html.indexOf("</table>", finiteBillMarker) + "</table>".length;
assert.ok(finiteBillMarker >= 0 && finiteBillStart >= 0 && finiteBillEnd > finiteBillStart, "ILS finite production bill is missing");
const finiteBill = html.slice(finiteBillStart, finiteBillEnd);
const visibleText = value => value
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .replace(/\s+([),.;:])/g, "$1")
  .trim();
function supportingReserve(label) {
  const labelIndex = finiteBill.indexOf(`<strong>${label}</strong>`);
  const rowStart = finiteBill.lastIndexOf("<tr>", labelIndex);
  const rowEnd = finiteBill.indexOf("</tr>", labelIndex) + "</tr>".length;
  assert.ok(labelIndex >= 0 && rowStart >= 0 && rowEnd > rowStart, `ILS finite production row is missing: ${label}`);
  const cells = [...finiteBill.slice(rowStart, rowEnd).matchAll(/<td(?: [^>]*)?>([\s\S]*?)<\/td>/g)];
  assert.equal(cells.length, 4, `ILS finite production row must have four cells: ${label}`);
  return visibleText(cells[3][1]);
}
const expectedSupportingReserves = new Map([
  ["First yellow batch", "600 Titanium Ingots for the 200 Titanium Crystals"],
  ["ILS pair", "80 Steel + 160 Titanium Ingots (80 for the two embedded PLS components + 80 for the 80 Titanium Alloy) + 160 Electromagnetic Turbines for the Particle Containers"],
  ["Protected total", "80 Steel + 860 Titanium Ingots (600 for Titanium Crystals + 180 for all Titanium Alloy + 80 for the two embedded PLS components) + 210 Electromagnetic Turbines"],
]);
for (const [label, expected] of expectedSupportingReserves) {
  assert.equal(supportingReserve(label), expected, `ILS supporting reserve changed: ${label}`);
}
const vesselReserve = supportingReserve("Vessel fleet");
assert.match(vesselReserve, /100 Titanium Ingots for the 100 Titanium Alloy/, "Vessel fleet lost its 100-Alloy reserve");
assert.match(vesselReserve, /50 Alloy for 10 Reinforced Thrusters/, "Vessel fleet lost the thruster Alloy allocation");
assert.match(vesselReserve, /50 Alloy directly for 5 Logistics Vessels/, "Vessel fleet lost the direct Vessel Alloy allocation");
assert.match(vesselReserve, /50 Electromagnetic Turbines for the Reinforced Thrusters/, "Vessel fleet lost the thruster Turbine reserve");
assert.doesNotMatch(html, /Protect the Turbine reserve/, "ILS still warns about a nonexistent Turbine reserve");
assert.match(
  html,
  /<strong>⚠ Watch the charging spike\.<\/strong>[\s\S]*?<strong>Lower its charging-power setting<\/strong>/,
  "ILS charging-spike warning lost its emphasized corrective action",
);
const returnChecklistStart = html.indexOf("<h3>Before flying home</h3>");
const returnChecklistEnd = html.indexOf("</ul>", returnChecklistStart);
assert.ok(returnChecklistStart >= 0 && returnChecklistEnd > returnChecklistStart, "ILS return checklist is missing");
assert.match(
  visibleText(html.slice(returnChecklistStart, returnChecklistEnd)),
  /860 Titanium Ingots and 520 High-Purity Silicon/,
  "ILS return checklist no longer matches the protected Titanium Ingot total",
);
const glossaryStart = html.indexOf('<details class="guide-glossary">');
const contextParagraph = html.indexOf("remember why half the belts exist.");
const progressIndex = html.indexOf("<h1>Quick Progress Index</h1>");
assert.ok(contextParagraph < glossaryStart && glossaryStart < progressIndex, "glossary is not in the required location");
assert.equal((html.match(/<dt>/g) || []).length, 10, "glossary must contain exactly ten terms");
assert.equal((html.match(/task-list-item-checkbox/g) || []).length, 82, "checklist coverage changed unexpectedly");
assert.match(html, /assets\/js\/checklists\.js/, "checklist script is not referenced by the guide");

console.log("Checklist validation passed: coverage, persistence, duplicate keys, reset, storage denial, glossary placement, and ILS reserve reconciliation verified.");
