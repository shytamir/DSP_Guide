(() => {
  const scriptUrl = document.currentScript && document.currentScript.src;
  const dataUrl = new URL("../data/tech-reference.json", scriptUrl || document.baseURI);
  const tip = document.getElementById("tech-tooltip");
  if (!tip) return;

  const escapeHtml = value => String(value).replace(/[&<>\"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
  const names = values => values && values.length
    ? values.map(value => escapeHtml(value.name)).join(", ")
    : "None";

  function attachTooltips(techData) {
    let active = null;

    function render(reference) {
      const data = techData[reference.dataset.techId];
      if (!data) return false;
      tip.classList.toggle("milestone", Boolean(data.milestone));
      tip.innerHTML = `${data.milestone ? '<div class="tech-tooltip-badge">MILESTONE</div>' : ""}` +
        `<div class="tech-tooltip-name">${escapeHtml(data.name)}</div>` +
        `<div class="tech-tooltip-row"><div class="tech-tooltip-label">Required</div><div>${names(data.required)}</div></div>` +
        `<div class="tech-tooltip-row"><div class="tech-tooltip-label">Implicit required</div><div>${names(data.implicitRequired)}</div></div>` +
        `${data.pretechsMax ? '<div class="tech-tooltip-row"><div class="tech-tooltip-label">Requirement note</div><div>Direct prerequisites must be completed to their maximum level.</div></div>' : ""}` +
        `${data.milestone && data.milestoneLabel && data.milestoneLabel !== data.name ? `<div class="tech-tooltip-milestone">${escapeHtml(data.milestoneLabel)}</div>` : ""}`;
      return true;
    }

    function place(reference) {
      const referenceRect = reference.getBoundingClientRect();
      tip.classList.remove("is-hidden");
      const tooltipRect = tip.getBoundingClientRect();
      const left = Math.min(window.innerWidth - tooltipRect.width - 12, Math.max(12, referenceRect.left));
      let top = referenceRect.bottom + 10;
      if (top + tooltipRect.height > window.innerHeight - 12) {
        top = Math.max(12, referenceRect.top - tooltipRect.height - 10);
      }
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    }

    function show(reference) {
      if (!render(reference)) return;
      active = reference;
      tip.classList.add("visible");
      place(reference);
    }

    function hide(reference) {
      if (reference && active !== reference) return;
      active = null;
      tip.classList.remove("visible");
      tip.classList.add("is-hidden");
    }

    document.querySelectorAll(".tech-ref").forEach(reference => {
      reference.addEventListener("mouseenter", () => show(reference));
      reference.addEventListener("mouseleave", () => hide(reference));
      reference.addEventListener("focus", () => show(reference));
      reference.addEventListener("blur", () => hide(reference));
      reference.addEventListener("click", event => {
        event.preventDefault();
        active === reference ? hide(reference) : show(reference);
      });
      reference.addEventListener("keydown", event => {
        if (event.key === "Escape") hide(reference);
      });
    });

    window.addEventListener("scroll", () => {
      if (active) place(active);
    }, { passive: true });
    window.addEventListener("resize", () => {
      if (active) place(active);
    });
    document.addEventListener("click", event => {
      if (active && !event.target.closest(".tech-ref")) hide(active);
    });
  }

  fetch(dataUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Technology data request failed with status ${response.status}.`);
      return response.json();
    })
    .then(attachTooltips)
    .catch(error => console.error("Technology reference data could not be loaded.", error));
})();
