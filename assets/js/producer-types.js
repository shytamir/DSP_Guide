(() => {
  const types = {
    smelting: new Set([
      "Iron Ingots", "Magnets", "Copper Ingots", "Stone Bricks", "Glass",
      "Steel", "Titanium Ingots", "High-Purity Silicon", "Energetic Graphite",
      "Diamonds", "Crystal Silicon", "Titanium Alloy",
    ]),
    assembly: new Set([
      "Gears", "Circuit Boards", "Magnetic Coils", "Electric Motors",
      "Electromagnetic Turbines", "Conveyor Belt Mk.I", "Sorter Mk.I",
      "Mining Machines", "Arc Smelters", "Assembling Machine Mk.I",
      "Storage Mk.I", "Storage Tank", "Wind Turbines", "Tesla Towers",
      "Combustible Units", "Microcrystalline Components", "Processors",
      "Titanium Crystals", "Casimir Crystals", "Titanium Glass", "Plane Filters",
      "Quantum Chips", "Particle Containers", "Graviton Lenses", "Prisms",
      "Photon Combiners", "Solar Sails", "Frame Material",
      "Dyson Sphere Components", "Super-Magnetic Rings", "Deuteron Fuel Rods",
      "Plasma Exciters", "Logistics Distributors", "Engines", "Logistics Bots",
      "Planetary Logistics Stations", "Thrusters", "Logistics Drones",
      "Interstellar Logistics Stations", "Reinforced Thrusters",
      "Logistics Vessels", "Space Warpers",
    ]),
    processing: new Set([
      "Refined Oil", "Hydrogen", "Sulfuric Acid", "Graphene", "Plastic",
      "Organic Crystals", "Carbon Nanotubes", "Particle Broadband", "Deuterium",
      "Strange Matter",
    ]),
  };

  const productTypes = new Map();
  for (const [type, products] of Object.entries(types)) {
    for (const product of products) productTypes.set(product, type);
  }
  const productNames = [...productTypes.keys()].sort((a, b) => b.length - a.length);

  function markProducts(segment) {
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    while (cursor < segment.length) {
      const match = productNames
        .map(name => ({ name, index: segment.indexOf(name, cursor) }))
        .filter(candidate => candidate.index >= 0)
        .sort((a, b) => a.index - b.index || b.name.length - a.name.length)[0];
      if (!match) {
        fragment.append(segment.slice(cursor));
        break;
      }
      if (match.index > cursor) fragment.append(segment.slice(cursor, match.index));
      const type = productTypes.get(match.name);
      const token = document.createElement("span");
      token.className = `producer-product producer-${type}`;
      token.dataset.producerType = type;
      token.title = `Produced by ${type}`;
      token.textContent = match.name;
      fragment.append(token);
      cursor = match.index + match.name.length;
    }
    return fragment;
  }

  for (const chain of document.querySelectorAll(".production-map .route-chain")) {
    if (chain.querySelector(".producer-product")) continue;
    const stages = chain.textContent.split("→");
    if (stages.length < 2) continue;
    chain.replaceChildren(document.createTextNode(stages[0]));
    for (const stage of stages.slice(1)) {
      chain.append(document.createTextNode(" → "));
      chain.append(markProducts(stage.trim()));
    }
  }
})();
