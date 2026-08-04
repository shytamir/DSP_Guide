(() => {
  for (const arrow of document.querySelectorAll(".production-map .production-arrow")) {
    const type = arrow.dataset.producerType;
    if (!type) continue;
    let sibling = arrow.nextSibling;
    while (sibling && !sibling.classList?.contains("production-arrow")) {
      if (sibling.nodeType === Node.TEXT_NODE && /[;·]/.test(sibling.textContent || "")) break;
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        const references = sibling.matches(".proto-ref")
          ? [sibling]
          : [...sibling.querySelectorAll(".proto-ref")];
        for (const reference of references) {
          reference.classList.add("producer-product", `producer-${type}`);
          reference.dataset.producerType = type;
        }
      }
      sibling = sibling.nextSibling;
    }
  }
})();
