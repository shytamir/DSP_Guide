# Asset Map Corrections

Status: the guide-side corrections and follow-ups are complete. The external
DSP Guide Check map remains the authority and is not copied into this
repository; these are the exact upstream record edits needed to make it agree
with the verified guide presentation.

## Suggested `recognized-game-assets.json` record changes

Replace the corresponding item records with these one-line entries:

```json
{"id":6001,"name":"Electromagnetic Matrix","asset":"t-matrix.png","guideAliases":["blue cube","blue cubes"]}
{"id":6002,"name":"Energy Matrix","asset":"e-matrix.png","guideAliases":["red cube","red cubes"]}
{"id":6003,"name":"Structure Matrix","asset":"c-matrix.png","guideAliases":["yellow cube","yellow cubes"]}
{"id":1105,"name":"High-Purity Silicon","asset":"silicium-single-crystal.png"}
{"id":1113,"name":"Crystal Silicon","asset":"silicium-high-purity.png"}
{"id":1127,"name":"Strange Matter","asset":"strange-matter-generator.png"}
{"id":1208,"name":"Critical Photon","asset":"photon-capacitor-full.png"}
```

Add the missing guide item records:

```json
{"id":2207,"name":"Accumulator (full)","asset":"accumulator-full.png","guideAliases":["charged Accumulator","charged Accumulators"]}
{"id":1407,"name":"Engine","asset":"engine.png"}
```

The guide's PHOTON phase now uses item `1208`; LOGISTICS uses the existing
Interstellar Logistics Station item `2104`. These are guide phase bindings,
not additional asset-map records.
