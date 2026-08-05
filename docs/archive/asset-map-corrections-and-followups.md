# Asset Map Corrections

> **Archived:** These corrections supported the completed static-icon pass and
> are retained only as implementation history.

Status: the guide-side corrections and follow-ups were completed. The external
DSP Guide Check map remained the authority and was not copied into this
repository; these were the exact upstream record edits used to make it agree
with the verified guide presentation.

## Applied `recognized-game-assets.json` record changes

The corresponding item records were replaced with these one-line entries:

```json
{"id":6001,"name":"Electromagnetic Matrix","asset":"t-matrix.png","guideAliases":["blue cube","blue cubes"]}
{"id":6002,"name":"Energy Matrix","asset":"e-matrix.png","guideAliases":["red cube","red cubes"]}
{"id":6003,"name":"Structure Matrix","asset":"c-matrix.png","guideAliases":["yellow cube","yellow cubes"]}
{"id":1105,"name":"High-Purity Silicon","asset":"silicium-single-crystal.png"}
{"id":1113,"name":"Crystal Silicon","asset":"silicium-high-purity.png"}
{"id":1127,"name":"Strange Matter","asset":"strange-matter-generator.png"}
{"id":1208,"name":"Critical Photon","asset":"photon-capacitor-full.png"}
```

The missing guide item records were added:

```json
{"id":2207,"name":"Accumulator (full)","asset":"accumulator-full.png","guideAliases":["charged Accumulator","charged Accumulators"]}
{"id":1407,"name":"Engine","asset":"engine.png"}
```

The guide's PHOTON phase was updated to use item `1208`; LOGISTICS used the
existing Interstellar Logistics Station item `2104`. These were guide phase
bindings, not additional asset-map records.
