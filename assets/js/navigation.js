(() => {
  const tabs = [...document.querySelectorAll(".rail-tab")];
  const sections = tabs.map(tab => document.getElementById(tab.dataset.phase)).filter(Boolean);
  const stageGroups = new Map(
    [...document.querySelectorAll(".stage-rail[data-stage-phase]")].map(group => [
      group.dataset.stagePhase,
      [...group.querySelectorAll(".stage-tab[data-stage]")]
        .map(link => ({ link, heading: document.getElementById(link.dataset.stage) }))
        .filter(stage => stage.heading),
    ]),
  );
  let activePhase = null;
  let stageFrame = null;

  function setActiveStage(activeStage) {
    stageGroups.forEach(stages => stages.forEach(({ link, heading }) => {
      const isActive = heading.id === activeStage;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    }));
  }

  function updateActiveStage() {
    stageFrame = null;
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
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.phase === id));
    requestStageUpdate();
  }

  function activateHashTarget() {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    const phase = target?.matches(".phase-section[id]")
      ? target
      : target?.closest(".phase-section[id]");
    if (phase) setActive(phase.id);
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
  tabs.forEach(tab => tab.addEventListener("click", () => setActive(tab.dataset.phase)));
  stageGroups.forEach((stages, phaseId) => stages.forEach(({ link }) => {
    link.addEventListener("click", () => {
      setActive(phaseId);
      setActiveStage(link.dataset.stage);
    });
  }));
  window.addEventListener("scroll", requestStageUpdate, { passive: true });
  window.addEventListener("resize", requestStageUpdate);
  window.addEventListener("hashchange", activateHashTarget);
  window.addEventListener("load", () => window.requestAnimationFrame(activateHashTarget));
})();
