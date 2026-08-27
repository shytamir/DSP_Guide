(() => {
  const scriptUrl = document.currentScript && document.currentScript.src;
  const dataUrl = new URL(
    "../data/tech-reference.json",
    scriptUrl || document.baseURI,
  );
  const detailsUrl = new URL(
    "../data/tech-tooltip-details.json",
    scriptUrl || document.baseURI,
  );
  const tip = document.getElementById("tech-tooltip");
  if (!tip) return;

  function attachTooltips(techData, tooltipDetails) {
    let active = null;
    let pinned = false;

    function render(reference) {
      const data = techData[reference.dataset.techId];
      const details = tooltipDetails[reference.dataset.techId] || {};
      if (!data) return false;

      tip.replaceChildren();
      const phase = reference.closest(".phase-section");
      const phaseRgb = phase
        ? getComputedStyle(phase).getPropertyValue("--phase-rgb").trim()
        : "145,164,183";
      tip.style.setProperty("--tooltip-phase-rgb", phaseRgb || "145,164,183");

      const nameLine = document.createElement("div");
      nameLine.className = "tech-tooltip-line tech-tooltip-name";
      nameLine.append(document.createTextNode(data.name));
      if (details.cube) {
        const cube = document.createElement("span");
        cube.className = "tech-tooltip-cube";
        cube.style.color = details.cube.color;
        cube.textContent = ` [${details.cube.label}]`;
        nameLine.append(cube);
      }
      tip.append(nameLine);

      const addLine = (label, values) => {
        if (!values || !values.length) return;
        const line = document.createElement("div");
        line.className = "tech-tooltip-line";
        const key = document.createElement("span");
        key.className = "tech-tooltip-key";
        key.textContent = `${label}:`;
        line.append(key, document.createTextNode(values.join(", ")));
        tip.append(line);
      };

      addLine(
        "Required",
        data.required && data.required.map((value) => value.name),
      );
      addLine(
        "Implicit",
        data.implicitRequired &&
          data.implicitRequired.map((value) => value.name),
      );
      addLine(
        "Unlocks",
        details.unlocks && details.unlocks.map((value) => value.label),
      );
      return true;
    }

    function place(reference) {
      const referenceRect = reference.getBoundingClientRect();
      tip.classList.remove("is-hidden");
      const tooltipRect = tip.getBoundingClientRect();
      const left = Math.min(
        window.innerWidth - tooltipRect.width - 6,
        Math.max(6, referenceRect.left),
      );
      let top = referenceRect.bottom + 6;
      if (top + tooltipRect.height > window.innerHeight - 6) {
        top = Math.max(6, referenceRect.top - tooltipRect.height - 6);
      }
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    }

    function show(reference, shouldPin = false) {
      if (!render(reference)) return;
      if (active && active !== reference)
        active.removeAttribute("aria-describedby");
      active = reference;
      pinned = shouldPin;
      reference.setAttribute("aria-describedby", tip.id);
      tip.classList.add("visible");
      place(reference);
    }

    function hide(reference) {
      if (reference && active !== reference) return;
      if (active) active.removeAttribute("aria-describedby");
      active = null;
      pinned = false;
      tip.classList.remove("visible");
      tip.classList.add("is-hidden");
    }

    document.querySelectorAll(".tech-ref").forEach((reference) => {
      reference.addEventListener("mouseenter", () => show(reference));
      reference.addEventListener("mouseleave", () => {
        if (!pinned && document.activeElement !== reference) hide(reference);
      });
      reference.addEventListener("focus", () => show(reference));
      reference.addEventListener("blur", () => {
        if (!pinned) hide(reference);
      });
      reference.addEventListener("click", (event) => {
        event.preventDefault();
        active === reference && pinned
          ? hide(reference)
          : show(reference, true);
      });
      reference.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hide(reference);
      });
    });

    window.addEventListener(
      "scroll",
      () => {
        if (active) place(active);
      },
      { passive: true },
    );
    window.addEventListener("resize", () => {
      if (active) place(active);
    });
    document.addEventListener("click", (event) => {
      if (active && !event.target.closest(".tech-ref")) hide(active);
    });
  }

  Promise.all(
    [dataUrl, detailsUrl].map((url) =>
      fetch(url).then((response) => {
        if (!response.ok)
          throw new Error(
            `Technology data request failed with status ${response.status}.`,
          );
        return response.json();
      }),
    ),
  )
    .then(([techData, tooltipDetails]) =>
      attachTooltips(techData, tooltipDetails),
    )
    .catch((error) =>
      console.error("Technology reference data could not be loaded.", error),
    );
})();
