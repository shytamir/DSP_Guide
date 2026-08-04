(() => {
  const STORAGE_KEY = "dsp-guide:checklist-state:v1";
  const checkboxes = [...document.querySelectorAll(".task-list-item-checkbox")];
  const resetButton = document.getElementById("reset-checklist-progress");
  const status = document.getElementById("checklist-save-status");

  if (!checkboxes.length) return;

  function slug(value) {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item";
  }

  let storageAvailable = false;
  try {
    const probe = `${STORAGE_KEY}:probe`;
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }

  let saved = {};
  if (storageAvailable) {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) saved = parsed;
    } catch {
      saved = {};
    }
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function persist() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setStatus("Checklist progress is saved only in this browser.");
    } catch {
      storageAvailable = false;
      setStatus("Local saving is unavailable; checkmarks will last for this page only.");
    }
  }

  const duplicates = new Map();
  checkboxes.forEach(checkbox => {
    const item = checkbox.closest(".task-list-item");
    const phase = checkbox.closest(".phase-section[id]")?.id || "reference";
    const baseKey = checkbox.dataset.checklistKey || `${phase}:${slug(item?.textContent || "item")}`;
    const aliases = (checkbox.dataset.checklistAliases || "").split(/\s+/).filter(Boolean);
    const occurrence = (duplicates.get(baseKey) || 0) + 1;
    duplicates.set(baseKey, occurrence);
    const key = occurrence === 1 ? baseKey : `${baseKey}:${occurrence}`;

    checkbox.dataset.checklistKey = key;
    checkbox.disabled = false;
    checkbox.checked = saved[key] === true || aliases.some(alias => saved[alias] === true);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) saved[key] = true;
      else delete saved[key];
      aliases.forEach(alias => delete saved[alias]);
      persist();
    });
  });

  if (storageAvailable) {
    setStatus("Checklist progress is saved only in this browser.");
  } else {
    setStatus("Local saving is unavailable; checkmarks will last for this page only.");
  }

  resetButton?.addEventListener("click", () => {
    saved = {};
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    if (storageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        setStatus("Checklist progress reset.");
      } catch {
        storageAvailable = false;
        setStatus("Checkmarks cleared for this page; local saving is unavailable.");
      }
    } else {
      setStatus("Checkmarks cleared for this page; local saving is unavailable.");
    }
  });
})();
