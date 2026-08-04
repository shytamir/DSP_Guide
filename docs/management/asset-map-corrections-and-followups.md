# Asset Map Corrections and Deferred Follow-ups

Status: the guide-side corrections below are implemented. The external DSP
Guide Check map remains the authority and is not copied into this repository;
these are the exact upstream record edits needed to make it agree with the
verified guide presentation.

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

Add the missing charged-Accumulator record:

```json
{"id":2207,"name":"Accumulator (full)","asset":"accumulator-full.png","guideAliases":["charged Accumulator","charged Accumulators"]}
```

The guide's PHOTON phase now uses item `1208`; LOGISTICS uses the existing
Interstellar Logistics Station item `2104`. These are guide phase bindings,
not additional asset-map records.

## Deferred work

- **ILS stage 3 temporary component lines:** the inline map under “Build the
  temporary component lines” needs a dedicated production-map contract pass.
  It remains readable but is deliberately untouched by this correction pass.
- **SPHERE phase icon:** replace the current Dyson Sphere Component phase icon
  after the new approved asset is supplied.
- **Rare resource nodes:** add vein/node icons after the corresponding approved
  exports and authoritative map records are supplied.

