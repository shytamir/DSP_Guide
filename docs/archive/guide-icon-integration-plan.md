# Guide Prototype Icon Integration Plan

> **Archived:** This plan was implemented and its recurring structural checks
> were moved into the repository validators.

Status: the game logo and static prototype icons were added to the published
guide, including producer icons above production-map arrows.

## Reader outcome

The pass added the game's unmodified icons beside technologies, items,
buildings, and recipe outputs already named by the guide. The icons helped a
player recognize objects without turning the page into an icon catalog or
creating another navigation system.

This was a presentation pass. It did not change guide copy, rates, phase
ordering, cards, tooltips, anchors, or progression advice.

## Authoritative binding source

The sole prototype-to-asset authority is the DSP Guide Check mod repository's
external `assets/recognized-game-assets.json` file (schema version 2). During
implementation it was supplied from outside this repository at:

```text
D:\Shy\dsp-beginner-guide\assets\recognized-game-assets.json
```

The map must be read in place. It must not be copied, generated, summarized as
a second binding table, or committed to this repository. The implementation
map defines 113 guide-facing item/building records and 80 technology records,
together with approved aliases and explicit exclusions.

Verified corrections and the missing charged-Accumulator record used during
implementation were preserved in `asset-map-corrections-and-followups.md`.
The guide applied that narrow compatibility set instead of reproducing the
source map.

Rules:

- IDs, display names, aliases, asset roots, and filenames come only from the
  supplied map.
- A missing or ambiguous binding remains without an icon and is reported; it
  is never inferred from a filename or from memory.
- Recipe IDs are explicitly outside the map. A named production recipe uses
  the mapped icon of its output item or building; no separate recipe identity
  is invented.
- Generic prose that happens to contain an item-like word is not matched.
- Existing technology tooltip data remains independent and authoritative for
  prerequisite and unlock content.

## Presentation contract

### Inline technology references

Every mapped `.tech-ref[data-tech-id]` receives the mapped technology icon
immediately before its visible in-game name. The image is decorative because
the adjacent text already supplies the accessible name. It does not create a
new link or control, and it does not change the existing native tooltip trigger.

```html
<button type="button" class="tech-ref" data-tech-id="1605">
  <img class="proto-icon proto-icon-tech"
       src="assets/DSP_exported assets/Texture2D/Tech/1605.png"
       width="20" height="20" alt="" aria-hidden="true">
  Interstellar Logistics System
</button>
```

### Inline items, buildings, and recipe outputs

Every literal occurrence covered by the map's canonical name or approved
guide alias receives a non-interactive item icon. The wrapper records the item
ID for validation but adds no tooltip or link.

```html
<span class="proto-ref" data-item-id="1210">
  <img class="proto-icon proto-icon-item"
       src="assets/DSP_exported assets/Texture2D/Recipes (items)/space-warper.png"
       width="20" height="20" alt="" aria-hidden="true">
  Space Warpers
</span>
```

The same compact format applies in prose, tables, checklists, card supplies,
production-route items, destinations, operating notes, and reference sections.
A production route remains textual and readable, with its producing building
attached to the transformation arrow as specified below.

```html
<span class="proto-ref" data-item-id="1001"><img ...>Iron Ore</span>
<span class="production-arrow" data-producer-item-id="2302">
  <img class="proto-icon proto-icon-producer" src=".../smelter.png"
       width="20" height="20" alt="" aria-hidden="true">
  <span class="production-arrow-glyph" aria-hidden="true">→</span>
  <span class="visually-hidden">Produced in Arc Smelter</span>
</span>
<span class="proto-ref" data-item-id="1101"><img ...>Iron Ingots</span>
```

### Phase navigation and headings

The phase rail, Quick Progress Index, phase links, and phase headings receive
one small identifying icon while retaining their visible text. No icon-only
navigation is introduced. Images inside an existing phase link are decorative
parts of that existing control; they are not new links.

| Phase | Prototype represented |
|---|---|
| BLUE | Electromagnetic Matrix item |
| RED | Energy Matrix item |
| ILS | Interstellar Logistics System technology |
| YELLOW | Structure Matrix item |
| PURPLE | Information Matrix item |
| GREEN | Gravity Matrix item |
| DYSON | Solar Sail item |
| SPHERE | Dyson Sphere Component item |
| PHOTON | Antimatter item |
| WHITE | Universe Matrix item |
| WARP | Space Warper item |
| LOGISTICS | Planetary Logistics Station item |

Example phase rail treatment:

```html
<a class="rail-tab tab-warp" href="#warp">
  <img class="phase-icon phase-icon-rail" src=".../space-warper.png"
       width="18" height="18" alt="" aria-hidden="true">
  <span>WARP</span>
</a>
```

Example heading treatment:

```html
<h1 class="phase-heading phase-photon">
  9. <a class="phase-tag phase-tag-photon" href="#photon">
    <img class="phase-icon" src=".../anti-matter.png"
         width="22" height="22" alt="" aria-hidden="true">
    [PHOTON]
  </a> — Critical Photons and Antimatter
</h1>
```

### Cards and dense tables

Card titles may carry the icon for the named final output. Within a card, each
literal mapped supply, intermediate, machine, and destination receives its own
small inline icon. Icons never replace route labels, arrows, rates, or names.
Dense tables use the same inline size as prose so row height remains stable.

No icon is repeated inside a technology tooltip: the visible technology
reference already carries it. No icon gets a `title` attribute that duplicates
the adjacent label.

### Production-map transformation arrows

Every recipe-transformation arrow inside `.route-chain` receives the producing
building icon directly above the arrow glyph. The producer icon uses the same
20-pixel square size as the surrounding item icons; it is never placed to the
left of the arrow or substituted for the arrow.

Producer identity does not come from prose or filename inference. For each
transformation:

1. identify the output recipe in the runtime-derived universal recipe
   hyperedges;
2. use that recipe's facility relationship to select the guide's baseline
   producing building for the phase;
3. resolve that building ID and image through the supplied external asset map;
4. record the binding as `data-producer-item-id` on the arrow wrapper.

The result should read as a normal left-to-right pipeline while making the
machine choice visible at a glance:

```text
               [Arc Smelter icon]
[Iron Ore icon]        →         [Iron Ingot icon]
```

Multi-step routes receive one producer icon per arrow. For example, both
smelting steps in `Iron Ore → Iron Ingots → Steel` carry their own Arc Smelter
icon. A convergence such as `Iron Ingots + Gears → Conveyor Belt Mk.I` carries
the Assembling Machine Mk.I icon above its single arrow.

The source contained 115 arrow glyphs across 106 route chains. Four routes
used arrows for transport or storage rather than production, so they were
rewritten as concise buffer or destination wording. The final guide contains
110 recipe transformations, each represented by exactly one producer icon
above its arrow. The external map resolves every technology reference used by
the guide; no local substitute bindings were created.

## Layout and accessibility

- Inline icons use explicit square `width` and `height` attributes to prevent
  layout shift.
- Default inline size is approximately `1.1em`; phase-heading and rail variants
  may be slightly larger within fixed bounds.
- Producer arrows use an inline two-row layout: a 20-pixel producer icon above
  the arrow glyph, centered as one compact transformation token.
- Icons align to the text baseline, keep a small right gap, and never acquire
  padding, borders, filters, or altered artwork.
- All icons use `alt=""` and `aria-hidden="true"` because the literal adjacent
  text remains the accessible name.
- `pointer-events: none` prevents decorative images from interfering with
  tooltips or navigation.
- Icons remain visible in print without filters or recoloring.
- Existing PC layout is the release target. Narrow mobile behavior remains
  best-effort and must not distort desktop card or table layout.

## Implementation record

### 1. Preflight and binding inventory

- Load and validate the external schema-version-2 map without copying it.
- Confirm every current `data-tech-id` resolves to a technology record.
- Inventory exact canonical item names and approved aliases in visible guide
  text, excluding attributes, scripts, styles, generic prose, and already
  processed markup.
- Inventory every `.route-chain` arrow, bind recipe arrows to their
  runtime-derived producing facility, and identify non-production arrows that
  need concise buffer or destination wording instead.
- Confirm resolved occurrences and genuine coverage gaps before editing the
  page.

Done when every prospective icon has one explicit map record and every
unresolved occurrence is either corrected in the source map or deliberately
left unadorned.

### 2. Materialize static inline markup

- Use a deterministic offline helper that accepts the external map path and
  writes literal `<img>` markup into `index.html`.
- Add technology icons by ID first, then item/building icons by canonical name
  and approved alias.
- Materialize each recipe transformation as a `.production-arrow` whose mapped
  producer icon sits above its arrow glyph. Normalize transport and storage
  wording so no bare non-production arrow remains.
- Process reader-facing text nodes only. Do not alter technology labels,
  tooltip JSON, IDs, anchors, rates, or prose.
- Keep the deployed page independent of the external map and JavaScript for
  icon rendering.

Done when every in-scope literal occurrence has static, map-derived markup and
running the helper again makes no further changes.

### 3. Add structural phase icons and restrained styling

- Apply the phase table above to the rail, progress index, phase links, and
  headings.
- Add shared `.proto-icon` and `.phase-icon` rules plus only the variants
  required by those surfaces.
- Preserve all visible phase labels and current navigation targets.

Done when icons assist recognition without widening the rail excessively,
breaking heading wraps, or obscuring card and table text.

### 4. Extend validation and review the result

- Replace the deployment validator's fixed asset count with a complete
  existence and allowed-root check.
- Validate every `data-tech-id` and `data-item-id` against the externally
  supplied map during the implementation run.
- Validate every `.production-arrow[data-producer-item-id]` against both the
  recipe facility relationship in the universal DAG and the producer image in
  the external map.
- Reject bare `→` glyphs inside `.route-chain`; each remaining arrow must be
  wrapped once and contain exactly one producer icon above it.
- Validate that every mapped image path exists under the map's declared asset
  root and that no image introduces an external URL or new link.
- Confirm the external map itself is absent from Git status and the deployment
  package.
- Re-run anchor, tooltip, checklist, card-system, deployment, and JavaScript
  checks.
- Review representative desktop surfaces: title/introduction, rail, progress
  index, phase heading, prose, table, collapsed and expanded cards, tooltip
  trigger, optional route, checklist, and print preview.

Done when all existing behavior remains intact, every image is traceable to
the supplied map, no mapped file is missing, and the deployment ZIP contains
only the static site.

## Hard scope limits

- No new external links, wiki links, item tooltips, lightboxes, hover previews,
  filters, image editing, or dynamically injected icons.
- No copy, number, card, phase, navigation, or technology-tooltip changes.
- The only permitted route wording changes are concise replacements for
  non-production arrows that currently describe storage or transport.
- No inferred mappings and no second authoritative map in this repository.
- No redistribution of anything beyond the already authorized unmodified game
  assets present under `assets/DSP_exported assets/`.
