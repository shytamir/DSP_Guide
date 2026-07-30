# DSP Universal End-Product DAG v1.0

This Phase 0 package is the source-of-truth layer for later guide restructuring. It was derived only from the supplied Phase 1 runtime bundle. The guide itself was not read as data and was not modified.

## Which file to use

- `dsp_universal_product_closures_v1_0.json` — start here when rebuilding a card. It contains one target record for every `ItemProto`, with its material closure, producer alternatives, recipe-unlock technology closure, research inputs, and conditional `PreItem` gates kept in separate fields.
- `dsp_universal_recipe_hyperedges_v1_0.json` — exact recipe inputs and outputs with quantities. This is the lossless recipe source for calculations.
- `dsp_universal_product_index_v1_0.csv` — searchable one-row summary for all 174 item targets.
- `dsp_universal_condensation_dag_v1_0.json` — all generated acyclic graph profiles and their strongly connected components.
- `dsp_universal_condensation_dag_v1_0.graphml` — the material-production condensation DAG for Gephi, yEd, Cytoscape, or another GraphML reader.
- `dsp_universal_end_product_graph_v1_0.json` — complete normalized Phase 1 graph, preserving all exact formal edges plus the seven practical edges in a separate overlay.
- `dsp_universal_recipe_hyperedges_v1_0.csv`, `dsp_universal_nodes_v1_0.csv`, and the edge/SCC CSV files — inspectable tabular views.
- `dsp_universal_validation_pass1_v1_0.json` — structural and losslessness validation.
- `dsp_universal_validation_pass2_v1_0.json` — independent semantic and graph validation.
- `dsp_universal_dag_report_v1_0.md` — methodology, findings, caveats, and recommended use.
- `dsp_guide_refactor_roadmap_preserved_v1_0.md` — preserved Phase 0/1/2 plan.

## Graph contract

Edges point from prerequisite or source to dependent or product.

Recipes remain bipartite hyperedges:

`input item → recipe → output item`

This preserves quantities, multiple inputs, multiple outputs, byproducts, and alternative recipes. No lossy direct item-to-item approximation is used.

The material graph contains one real feedback component:

`Refined Oil ↔ Hydrogen ↔ Reforming Refine / X-ray Cracking`

The universal DAG is therefore the strongly connected-component condensation of the lossless graph. The cycle is preserved as one inspectable DAG node rather than deleted or broken arbitrarily.

## Authority and scope

- Supplied archive SHA-256: `282720387DFFC1E5FEA4BFFD72F0AA405392C545C05989E554603059E45EE3AE`
- Canonical Phase 1 JSON SHA-256: `B52DEFC068830F6F36433D8136EDEEAD05B52603BF46154E3EEB7D300BAA719D`
- Assembly SHA-256 recorded by Phase 1: `ae0ba95f75bd879a62aa4ce253b2ab78eaa4fb3c7c595f5e1fee75ebe0e0ef85`

Only IDs, names, quantities, recipes, prerequisites, unlocks, theme resources, and vein mappings present in the Phase 1 bundle are asserted as game facts. Items whose production is implemented outside `LDB.recipes` remain visibly unresolved instead of being filled with guesses.
