(() => {
  const rail = document.querySelector(".phase-rail");
  const trigger = document.getElementById("phone-route-trigger");
  const sheet = document.getElementById("route-sheet");
  const current = document.getElementById("phone-current-phase");
  const referenceMenu = document.querySelector(".reference-menu");
  const narrow = window.matchMedia(
    "(max-width: 900px), (max-height: 500px) and (pointer: coarse)",
  );
  const tabs = [...document.querySelectorAll(".rail-tab")];
  const sections = tabs
    .map((tab) => document.getElementById(tab.dataset.phase))
    .filter(Boolean);
  const stageGroups = new Map(
    [...document.querySelectorAll(".stage-rail[data-stage-phase]")].map(
      (group) => [
        group.dataset.stagePhase,
        [...group.querySelectorAll(".stage-tab[data-stage]")]
          .map((link) => ({
            link,
            heading: document.getElementById(link.dataset.stage),
          }))
          .filter((stage) => stage.heading),
      ],
    ),
  );
  let activePhase = null;
  let stageFrame = null;

  function closeRoute() {
    if (sheet.open) sheet.close();
  }

  function arrangeRoute() {
    closeRoute();
    if (narrow.matches) {
      document.getElementById("phone-route-content").append(rail);
      trigger.hidden = false;
      document.documentElement.classList.add("phone-nav-ready");
    } else {
      trigger.before(rail);
      trigger.hidden = true;
      document.documentElement.classList.remove("phone-nav-ready");
    }
  }

  trigger.addEventListener("click", () => {
    referenceMenu.open = false;
    sheet.showModal();
  });
  sheet
    .querySelector(".phone-sheet-close")
    .addEventListener("click", closeRoute);
  sheet.addEventListener("close", () => {
    if (narrow.matches) trigger.focus({ preventScroll: true });
  });
  sheet.addEventListener("click", (event) => {
    const rect = sheet.getBoundingClientRect();
    if (
      event.target === sheet &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      closeRoute();
  });
  rail.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) closeRoute();
  });
  referenceMenu.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) referenceMenu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && referenceMenu.open) {
      referenceMenu.open = false;
      referenceMenu.querySelector("summary").focus();
    }
  });
  narrow.addEventListener("change", arrangeRoute);
  arrangeRoute();

  function setActiveStage(activeStage) {
    stageGroups.forEach((stages) =>
      stages.forEach(({ link, heading }) => {
        const isActive = heading.id === activeStage;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      }),
    );
  }

  function updateActiveStage() {
    stageFrame = null;
    if (
      activePhase &&
      sections[0]?.getBoundingClientRect().top >
        Math.max(20, innerHeight * 0.24)
    ) {
      setActive(null);
      return;
    }
    const stages = stageGroups.get(activePhase);
    if (!stages?.length) {
      setActiveStage(null);
      return;
    }

    const readingLine = Math.max(20, window.innerHeight * 0.24);
    let activeStage = stages[0].heading.id;
    for (const { heading } of stages) {
      if (heading.getBoundingClientRect().top > readingLine) break;
      activeStage = heading.id;
    }
    setActiveStage(activeStage);
  }

  function requestStageUpdate() {
    if (stageFrame !== null) return;
    stageFrame = window.requestAnimationFrame(updateActiveStage);
  }

  function setActive(id) {
    activePhase = id;
    current.textContent =
      tabs.find((tab) => tab.dataset.phase === id)?.querySelector("span")
        ?.textContent || "Start";
    tabs.forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.phase === id),
    );
    requestStageUpdate();
  }

  function activateHashTarget() {
    if (!window.location.hash) return;
    if (window.location.hash === "#top") setActive(null);
    const target = document.getElementById(window.location.hash.slice(1));
    const phase = target?.matches(".phase-section[id]")
      ? target
      : target?.closest(".phase-section[id]");
    if (phase) setActive(phase.id);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: "-12% 0px -72% 0px", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => setActive(tab.dataset.phase)),
  );
  stageGroups.forEach((stages, phaseId) =>
    stages.forEach(({ link }) => {
      link.addEventListener("click", () => {
        setActive(phaseId);
        setActiveStage(link.dataset.stage);
      });
    }),
  );
  window.addEventListener("scroll", requestStageUpdate, { passive: true });
  window.addEventListener("resize", requestStageUpdate);
  window.addEventListener("hashchange", activateHashTarget);
  window.addEventListener("load", () =>
    window.requestAnimationFrame(activateHashTarget),
  );
})();
