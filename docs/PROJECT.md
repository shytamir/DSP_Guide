# DSP Practical Progression Guide

**Status:** Active roadmap implementation. Version 2.2 is the current
published minor line.

## Purpose

This repository publishes a player-facing progression guide for *Dyson Sphere
Program*. It is written primarily for new and returning players who understand
individual factory actions but can lose track of which progression problem
matters next.

The guide is intentionally opinionated without removing player agency. It
offers one practical route, clear phase objectives, optional detours, compact
production references, and enough explanation for the reader to recognize
when local circumstances justify ignoring the default advice.

## Current product

The published static site is `index.html` with supporting files under
`assets/`. It currently contains:

- 12 navigable progression and optional-route sections;
- 19 phase-relevant production cards;
- two reusable production-line references;
- runtime-derived technology tooltips;
- static runtime-bound prototype icons and producer-marked production maps;
- player-owned persistent checklists and a compact glossary;
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
  internal anchors, technology references, and asset boundaries.
- `scripts/validate-card-system.mjs` enforces the current card inventory,
  direct-link rules, complexity limits, and authoritative output recipes.
- `scripts/validate-checklists.mjs` checks checklist coverage, persistence,
  reset behavior, storage failure, and glossary placement.
- `scripts/apply-proto-icons.mjs --check` validates the committed static icon
  markup against the externally supplied authoritative asset map during an
  authorized local icon pass. It performs reusable icon and production-arrow
  materialization only; completed editorial migrations are not part of the
  recurring pass.
- `scripts/lib/markup-contracts.mjs` is the shared structural contract used by
  materialization, card validation, and deployment validation.

Pushes to `main` run the GitHub Pages workflow and create a versioned ZIP that
contains only the deployable static website.

## Active roadmap

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

Current implementation is governed by
[`docs/management/ROADMAP.md`](management/ROADMAP.md). It activates two ordered
guide-correction stories, followed by a planning pass that breaks the preserved
design leftovers into the next roadmap update. Work outside that sequence
requires a separate owner decision.

- **Completed — opening-route consistency:** owner-accepted on 2026-08-09. The
  introductory default route now begins with unified BLUE while preserving the
  `#bootstrap` compatibility anchor.
- **Active — DYSON reference authority:** refine the DYSON presentation so
  planning figures do not read as permission gates.
- **Next-roadmap input — guide design leftovers:** after both correction
  stories are accepted, classify the remaining expedition-navigation,
  progressive-disclosure, prose-icon, and mobile-priority concerns into the
  next roadmap update.

- **Completed — ILS-to-GREEN research handoff:** owner-validated and archived
  on 2026-08-09 after the GREEN, ILS research-map, and ILS production-map
  refinements.

- **Tabled — science pace:** further calibration of minimum cube targets is not
  scheduled.
- **Deferred — accessibility:** [Issue #5](https://github.com/shytamir/DSP_Guide/issues/5)
  records the remaining checklist-label, document-structure, and navigation
  accessibility work.
- **Completed — linked-card playtest:** the ICQ full playthrough found the card
  system useful and complete throughout progression.
- **Completed — RED defense:** the two approved RED-phase defense stories were
  implemented and archived in
  `docs/archive/dark-fog-red-defense-user-stories.md`.

## Documentation roles

- `README.md` explains how to use, inspect, and deploy the repository.
- `docs/PROJECT.md` is the current project-status and decision record.
- `docs/management/` contains active roadmap, permission, and governance
  records.
- `docs/archive/` contains completed and superseded plans, stories, analyses,
  and reviews retained for historical context; archived statements are not
  current requirements.
