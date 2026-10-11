(() => {
  const links = [...document.querySelectorAll("#language-selector a")];
  function update() {
    for (const link of links) {
      const target = new URL(link.href);
      target.hash = location.hash;
      link.href = target.href;
    }
  }
  update();
  window.addEventListener("hashchange", update);
})();
