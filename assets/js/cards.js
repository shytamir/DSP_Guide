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

  function openLinkedCard() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && target.matches("details.build-card")) target.open = true;
  }

  window.addEventListener("hashchange", openLinkedCard);
  openLinkedCard();
})();
