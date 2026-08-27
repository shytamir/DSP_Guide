# DSP Practical Progression Guide

**Status:** Version 2.3 is the current published minor line. Its twelve-story
roadmap and resulting release were completed, owner-accepted, and archived on
2026-08-09. The active [`ROADMAP.md`](management/ROADMAP.md) governs the next
workload. NR-01 through NR-07 were owner-accepted and archived on 2026-08-27.
NR-08 is implemented and technically validated, pending owner acceptance;
NR-09 through NR-18 are owner-approved and remain inactive until separately
activated after their prerequisites are satisfied.

## Purpose

This repository publishes a player-facing progression guide for _Dyson Sphere
Program_. It is written primarily for new and returning players who understand
individual factory actions but can lose track of which progression problem
matters next.

The guide is intentionally opinionated without removing player agency. It
offers one practical route, clear phase objectives, optional detours, compact
production references, and enough explanation for the reader to recognize
when local circumstances justify ignoring the default advice.

## Current product

The published static site is `index.html` with supporting files under
`assets/`. It currently contains:

- ten numbered route sections plus two directly navigable optional
  capabilities;
- 19 phase-relevant production cards;
- two reusable production-line references;
- runtime-derived technology tooltips;
- static runtime-bound prototype icons and producer-marked production maps;
- player-owned persistent checklists and a compact glossary;
- a wide-desktop companion dock linking to the optional DSP Guide Check mod;
- no server-side code, accounts, analytics, cookies, or remote dependencies.

The guide is considered deployable. Further changes should be driven by
playtest evidence, a clearly articulated reader need, or authoritative game
data—not by a desire to make every valid factory route equally prominent.

## Product principles

- The guide must remain useful with every production card collapsed.
- Cards reduce cognitive load; they do not reproduce the dependency graph.
- A phase target is a safe reference point, not permission to continue.
- Optional routes explain the opportunity and tradeoff without pretending to
  be mandatory progression.
- Player-observable shortages decide what gets expanded.
- Dark Fog coverage is limited to practical RED-phase starter-planet defense:
  automate the basic missile battery supplies and explain one simple
  Signal-Tower-assisted base-clearing pattern.
- Dark Fog levels, farming, drops, space combat, Relay Stations, hives, and
  concealed technologies remain outside the guide and must not be mentioned.
- ILS and WARP may each contain one linked reminder pointing back to the RED
  planetary-base-clearing procedure; those reminders add no new combat advice.
- Technology names, prerequisites, recipes, and item relationships come from
  runtime-derived source data rather than memory or community shorthand.

## Authoritative evidence

The directory `dsp_universal_end_product_dag_v1_0/` contains the validated
runtime-derived dependency model used to check production relationships. Its
research artifacts are retained for provenance and are not loaded by the
website.

Technology references used by the live site are stored in:

- `assets/data/tech-reference.json`;
- `assets/data/tech-tooltip-details.json`.

Unmodified game assets included in the repository are governed by the
privacy-sanitized permission record at
`docs/management/game-asset-use-permission-sanitized.md`.

## Repository structure

```text
index.html                     Published guide content
assets/css/                    Presentation
assets/images/                 Guide-original presentation artwork
assets/js/                     Navigation, cards, tooltips, checklists
assets/data/                   Runtime-derived website data
assets/DSP_exported assets/    Authorized unmodified game assets
scripts/                       Deployment and guide-contract validation
scripts/lib/markup-contracts.mjs  Shared static component recognition
docs/                          Current project documentation
docs/management/               Active permission and governance records
docs/archive/                  Completed and superseded project documents
archive/                       Historical publication artifacts
dsp_universal_end_product_dag_v1_0/  Runtime-derived research package
```

## Active validation contracts

- `scripts/validate-deployment.mjs` checks the deployable static package,
  internal anchors, asset boundaries, the bounded Dark Fog placement contract,
  semantic component markup, and runtime-derived technology relationships.
- `scripts/validate-card-system.mjs` enforces the current card inventory,
  direct-link rules, structural complexity limits, icon-free Operating Notes,
  map icon treatments, authoritative recipe relationships, phase and
  navigation identity, compatibility anchors, and scoped card controls.
- `scripts/validate-checklists.mjs` checks checklist identity and persistence,
  reset behavior, storage failure, glossary presence, and separation of the
  one-screen route from optional capabilities.
- `scripts/apply-proto-icons.mjs --check` validates the committed static icon
  markup against the externally supplied authoritative asset map during an
  authorized local icon pass. It performs reusable icon and production-arrow
  materialization only. Item references require explicit prototype bindings,
  and item and technology icons are added only on the semantic surfaces
  approved by the icon-placement policy. Existing markup is preserved;
  completed editorial migrations are not part of the recurring pass. The
  validator also enforces the completed narrative/action and card Operating
  Note cleanup.
- `scripts/lib/markup-contracts.mjs` is the shared structural contract used by
  materialization, card validation, and deployment validation.

## Development validation and evidence decisions

**Owner decision — 2026-08-27:** pushes to `main` run the GitHub Pages workflow
and create a versioned ZIP containing only the deployable static website. The
Pages site is a development deployment for reliable browser validation; it is
not the production website, and a push does not constitute production
publication.

Use the deployed Pages site with Chromium when presentation, navigation,
interaction, persistence, or responsive behavior requires real deployed
evidence. Structural validation, deployed browser review, and owner acceptance
remain separate gates; none implies either of the others.

The archived Production Statistics runtime investigation retains its textual
evidence after removal of dead local screenshot embeds. It is historical
traceability rather than a maintained current-version contract, and no further
versioning of that record is required.

**Owner decision — 2026-08-27:** the two SPHERE links to
`#receiver-antimatter-bridge` may remain unresolved background noise until
NR-12 creates the canonical bridge. The exception does not block intermediate
story validation. NR-12 is incomplete if the target remains unresolved after
that story.

## Current management status

The active [`roadmap`](management/ROADMAP.md) is the sole authority for story
sequence, dependencies, and lifecycle status. NR-01 through NR-07 were
owner-accepted and archived on 2026-08-27. NR-08 is implemented and technically
validated, pending owner acceptance. NR-09 through NR-18 are approved and
implementation-ready planning records, but remain inactive until separately
activated after their prerequisites are satisfied. Story approval, activation,
technical validation, owner acceptance, and release authorization remain
separate decisions.

YELLOW/PURPLE problem-resolver guidance and a Dark Fog COMBAT/PEACE control are
named future work outside the active roadmap. They do not create current
implementation requirements.

The version 2.3 navigation and progressive-disclosure release is complete,
owner-authorized, and archived in
[`docs/archive/version-2.3-navigation-and-progressive-disclosure-release.md`](archive/version-2.3-navigation-and-progressive-disclosure-release.md).

The version 2.2 presentation and card-refinement work is complete,
owner-validated, and archived in
[`docs/archive/version-2.2-maintenance-release.md`](archive/version-2.2-maintenance-release.md).
The ILS-to-GREEN research handoff is complete, owner-validated, and archived.
Its final form exposes the complete practical ILS research queue, starts yellow
science before the longer logistics work, provides the ordered temporary
production reference, and preserves a condensed GREEN dashboard with a Gravity
Matrix tooltip. The [`completed story`](archive/ils-purple-green-research-handoff-user-story.md)
and [`first-pass audit`](archive/ils-purple-green-research-handoff-first-pass-audit.md)
preserve that work's historical implementation and correction record.

The ordered guide-correction sequence is complete. Both stories are preserved
in the
[`archived story record`](archive/guide-corrections-user-stories.md). The later
twelve-story icon, progression-entry, expedition-navigation, and
progressive-disclosure sequence was also completed and owner-accepted on
2026-08-09. Its [`historical roadmap`](archive/ROADMAP.md) and supporting
records are archived; the active [`current roadmap`](management/ROADMAP.md)
governs the new sequence and its story lifecycle.

- **Completed — opening-route consistency:** owner-accepted on 2026-08-09. The
  introductory default route now begins with unified BLUE while preserving the
  `#bootstrap` compatibility anchor.
- **Completed — DYSON reference authority:** owner-accepted on 2026-08-09. Live
  player-observable evidence now leads the DYSON decision layer, while exact
  planning figures remain confined to the approved reference locations.
- **Completed — icon placement:** all three stories are owner-accepted. Plain
  narrative and Operating Note guidance now remains distinct from approved
  icon-rich identity, reference, and production-map surfaces.
- **Completed — navigation:** all three Progression Entry stories and both
  expedition-navigation stories were owner-accepted. The shared three-stage
  rail remains the accepted WARP and ILS behavior.
- **Completed — progressive disclosure:** ILS manifest refinement, global
  cube-target retirement, PHOTON dashboard refinement, and DYSON Ejector map
  condensation were owner-accepted as Stories 9–12.
- **Standing references — not pending work:** the no-mobile-polish decision is
  preserved with the archived roadmap. The earlier one-screen checklist
  correction is superseded and archived; NR-18 in the active roadmap
  owns final-checklist synchronization after preceding changes are accepted.

- **Completed — ILS-to-GREEN research handoff:** owner-validated and archived
  on 2026-08-09 after the GREEN, ILS research-map, and ILS production-map
  refinements.

- **Standing reference — science pace:** further calibration of minimum cube
  targets was outside the completed roadmap and is not pending work.
- **Standing reference — accessibility:** [Issue #5](https://github.com/shytamir/DSP_Guide/issues/5)
  preserves earlier checklist-label, document-structure, and navigation
  findings; it is not active or pending implementation without explicit owner
  reactivation.
- **Completed — linked-card playtest:** the ICQ full playthrough found the card
  system useful and complete throughout progression.
- **Completed — RED defense:** the two approved RED-phase defense stories were
  implemented and archived in
  `docs/archive/dark-fog-red-defense-user-stories.md`.

## Documentation roles

- `README.md` explains how to use, inspect, and deploy the repository.
- `docs/PROJECT.md` is the current project-status and decision record.
- `docs/management/` contains the maintenance record, standing references,
  permissions, and governance records.
- `docs/archive/` contains completed and superseded plans, stories, analyses,
  and reviews retained for historical context; archived statements are not
  current requirements.
