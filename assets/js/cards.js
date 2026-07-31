(() => {
  function setCards(button, open) {
    const phase = button.closest(".phase-section");
    if (!phase) return;
    phase.querySelectorAll("details.build-card").forEach(card => {
      card.open = open;
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest(".card-control");
    if (!button) return;
    setCards(button, button.dataset.cardAction === "open");
  });

  function openLinkedTarget() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;

    let parent = target.matches("details") ? target : target.closest("details");
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest("details") || null;
    }

    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }

  document.addEventListener("click", event => {
    if (event.target.closest(".card-crossref-link")) setTimeout(openLinkedTarget, 0);
  });
  window.addEventListener("hashchange", openLinkedTarget);
  openLinkedTarget();
})();
