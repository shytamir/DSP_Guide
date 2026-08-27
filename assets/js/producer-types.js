(() => {
  for (const arrow of document.querySelectorAll(
    ".production-map .production-arrow",
  )) {
    const type = arrow.dataset.producerType;
    if (!type) continue;
    arrow.classList.add(`producer-${type}`);
  }
})();
