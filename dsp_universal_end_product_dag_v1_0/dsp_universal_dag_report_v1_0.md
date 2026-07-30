# DSP Universal End-Product DAG — Phase 0 Report

## Result

Phase 0 is complete. The package represents every one of the runtime bundle's **174 ItemProto records** as a possible end-product target and preserves all **161 RecipeProto records** as explicit hyperedges.

The guide was not used as source data and was not edited.

## Source authority

The only factual input was the supplied Phase 1 bundle, itself reconstructed from the game's runtime prototype database:

- 314 technologies and upgrades
- 161 recipes
- 174 items
- 25 planet themes
- 14 vein types
- 765 normalized nodes
- 2,580 total edges
- 2,573 exact formal runtime edges
- 7 separately identified practical-interpretation edges

The practical edges remain a separate overlay. They are never presented as literal runtime fields.

## Why the package contains more than one graph

A useful universal model has three distinct questions to answer.

### Material-production profile

This is the card-authoring graph:

- 374 source nodes: items, recipes, themes, and veins
- 796 exact material/acquisition edges
- 371 condensation nodes
- 789 condensation edges
- acyclic after condensation

It follows materials backward through every producer recipe and raw-resource source without mixing research costs into the factory line.

### Formal research profile

This is the exact technology prerequisite graph:

- 314 technology nodes
- 417 explicit and implicit prerequisite edges
- no cycles

Each product closure separately records the technologies that unlock its reachable recipes, the complete prerequisite closure of those technologies, their research-input records, and any `PreItem` gates.

### Integrated audit profile

The integrated graph preserves production, recipe unlocks, technology prerequisites, research inputs, and acquisition in one model. It is valuable for auditing total dependency relationships, but it is intentionally not used as the card blueprint.

Joining research-material consumption to recipe unlocks creates one 86-node strongly connected component. That is a property of the integrated dependency model, not a reason to discard any edges. The separated material and research profiles retain the same facts in a form suitable for guide work.

## The one material feedback cycle

The material graph has one four-node strongly connected component:

- Refined Oil (`item:1114`)
- Hydrogen (`item:1120`)
- X-ray Cracking (`recipe:58`)
- Reforming Refine (`recipe:121`)

This is a real production feedback relationship. The source graph retains all four nodes and their exact edges. The condensation DAG represents the component as one node, making the graph acyclic without inventing an arbitrary break.

## Alternative production

Exactly **13 items** have more than one RecipeProto producer:

- Energetic Graphite
- Diamond
- Crystal Silicon
- Refined Oil
- Organic Crystal
- Hydrogen
- Deuterium
- Graphene
- Carbon Nanotube
- Casimir Crystal
- Particle Container
- Space Warper
- Photon Combiner

Every alternative remains a distinct recipe node with its own quantities and unlock requirements. Per-product closures retain all alternatives.

## Explicitly unresolved direct sources

Eleven ItemProto records have no direct RecipeProto, vein, theme-resource, or technology-grant producer in the supplied data:

- Wood (`1030`)
- Plant Fuel (`1031`)
- Soil Pile (`1099`)
- Critical Photon (`1208`)
- Accumulator (full) (`2207`)
- Dark Fog items `5201` through `5206`

This is not treated as an error. These items involve gathering, enemy drops, building-state conversion, or production behavior implemented outside the supplied recipe table. The package marks them as unresolved source boundaries rather than fabricating recipes or IDs.

## Per-product closure contract

For each of the 174 item targets, the closure dataset provides:

- every reachable material item, recipe, theme, and vein;
- every source edge used by that closure;
- all direct producer recipes and non-recipe acquisition sources;
- every alternative producer route;
- raw-resource items;
- unresolved source boundaries;
- reachable material feedback components;
- recipe-unlock technologies;
- complete explicit/implicit technology prerequisites;
- research-input records;
- conditional `PreItem` gates;
- a separate integrated audit closure.

This is designed to support atomic, linked guide cards without repeating upstream lines or silently omitting prerequisites.

## Validation

Two independent validation passes succeeded.

### Pass 1 — structural and losslessness

**26/26 checks passed.**

It independently verified:

- source IDs and edge IDs are unique;
- every edge endpoint resolves;
- all nodes and edges are preserved;
- formal and practical layers remain separated;
- all 441 recipe-input and 165 recipe-output edges are reconstructed;
- every recipe has at least one input and output;
- all 174 product closures are complete;
- every closure matches an independently recomputed reverse traversal;
- every SCC partition is total and unique;
- condensation edges preserve every inter-component source edge;
- every condensation profile is acyclic.

### Pass 2 — independent semantic audit

**14/14 checks passed.**

It used an independent SCC algorithm and verified:

- exact quantities for the stone-to-silicon fallback and the titanium-to-yellow chain;
- Titanium Ore has no RecipeProto producer;
- exactly 13 items have alternative recipe producers;
- no alternative producer is lost from any target closure;
- every recipe quantity matches the source ledger;
- the material SCC partition matches an independent Kosaraju reconstruction;
- the only material cycle is the Refined Oil/Hydrogen feedback component;
- the formal research graph is independently acyclic;
- every product name resolves from Phase 1 data;
- GraphML counts match the canonical material condensation DAG;
- the product index contains exactly 174 data rows.

## Recommended use in later phases

For any guide card:

1. Locate the target in `dsp_universal_product_index_v1_0.csv`.
2. Read its record in `dsp_universal_product_closures_v1_0.json`.
3. Select the intended producer recipe without deleting the alternatives.
4. Follow recipe nodes in `dsp_universal_recipe_hyperedges_v1_0.json`.
5. Stop expanding an input when an earlier atomic card already owns that output; link to that card instead.
6. Use the separate technology closure for phase placement and research instructions.
7. Treat unresolved source boundaries as mechanics requiring runtime/assembly interpretation, not opportunities to infer missing recipes.

This keeps the future guide work grounded in runtime data while allowing editorial decisions about which valid route the guide recommends.
