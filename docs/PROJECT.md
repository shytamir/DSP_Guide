# DSP Practical Progression Guide

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
- 18 phase-relevant production cards;
- two reusable production-line references;
- runtime-derived technology tooltips;
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
- Combat progression remains outside the guide's current industrial scope.
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
assets/js/                     Navigation, cards, tooltips, checklists
assets/data/                   Runtime-derived website data
assets/DSP_exported assets/    Authorized unmodified game assets
scripts/                       Deployment and guide-contract validation
docs/                          Current project and card documentation
docs/management/               Permission and governance records
docs/archive/                  Superseded planning and review documents
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

Pushes to `main` run the GitHub Pages workflow and create a versioned ZIP that
contains only the deployable static website.

## Pending product decisions

1. **Science pace:** use further full-playthrough evidence to decide whether
   the current minimum cube targets are merely sufficient or genuinely helpful
   to a beginner.
2. **Linked-card playtest:** complete a run using the current 18-card system as
   the primary build reference and record missing context or unhelpful density.
3. **Dark Fog scope:** either keep combat instruction explicitly outside this
   industrial guide or authorize a separate companion scope; do not let it
   enter piecemeal.
4. **Prototype icons:** implement the static icon pass preserved in
   `docs/management/guide-icon-integration-plan.md`, using only the external
   DSP Guide Check asset map and without changing guide copy or behavior.

Narrow mobile layout is best-effort and is not a release gate for this
PC-focused guide.

## Documentation roles

- `README.md` explains how to use, inspect, and deploy the repository.
- `docs/PROJECT.md` is the current project-status and decision record.
- `docs/CARD_SYSTEM_PLAN.md` is the active reader-facing card contract.
- `docs/management/` contains active governance records.
- `docs/archive/` contains superseded plans retained for historical context;
  archived statements are not current requirements.
