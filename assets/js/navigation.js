(() => {
  const tabs = [...document.querySelectorAll(".rail-tab")];
  const sections = tabs.map(tab => document.getElementById(tab.dataset.phase)).filter(Boolean);

  function setActive(id) {
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.phase === id));
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
  tabs.forEach(tab => tab.addEventListener("click", () => setActive(tab.dataset.phase)));
})();
