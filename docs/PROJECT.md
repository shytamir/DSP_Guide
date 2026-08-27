# DSP Practical Progression Guide

**Status:** Maintenance mode. Version 3.0 was published and passed final cold
verification on 2026-08-27. No product work is active or planned. Previously
named unplanned concepts were deferred indefinitely and moved to the historical
archive.

[`ROADMAP.md`](ROADMAP.md) is the sole active roadmap and intentionally contains
no work.

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
`assets/`. It contains:

- ten numbered route sections plus two directly navigable optional
  capabilities;
- 19 phase-relevant production cards;
- two reusable production-line references;
- runtime-derived technology tooltips;
- static runtime-bound prototype icons and producer-marked production maps;
- player-owned persistent checklists and a compact glossary;
- a wide-desktop companion dock linking to the optional DSP Guide Check mod;
- no server-side code, accounts, repository-supplied analytics, cookies, or
  repository-supplied remote dependencies.

Further changes require explicit owner direction supported by playtest
evidence, a clearly articulated reader need, authoritative game data, or a
bounded maintenance need.

## Product principles

- The guide must remain useful with every production card collapsed.
- Cards reduce cognitive load; they do not reproduce the dependency graph.
- A phase target is a safe reference point, not permission to continue through
  a visible shortage.
- Optional routes explain opportunity and tradeoff without pretending to be
  mandatory progression.
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

Technology references used by the site are stored in:

- `assets/data/tech-reference.json`;
- `assets/data/tech-tooltip-details.json`.

Unmodified game assets included in the repository are governed by the
privacy-sanitized permission record at
`management/game-asset-use-permission-sanitized.md`.

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
docs/archive/                  Historical project documents
archive/                       Historical publication artifacts
dsp_universal_end_product_dag_v1_0/  Runtime-derived research package
```

## Validation contracts

- `scripts/validate-deployment.mjs` checks the deployable static package,
  required sanitized licensing records, internal anchors, asset boundaries,
  bounded Dark Fog placement, semantic component markup, and runtime-derived
  technology relationships.
- `scripts/validate-card-system.mjs` checks card inventory, direct-link rules,
  structural complexity limits, icon placement, production relationships,
  phase and navigation identity, compatibility anchors, card controls, and
  rank-qualified technology-tooltip labels.
- `scripts/validate-checklists.mjs` checks checklist identity and persistence,
  reset behavior, storage failure, glossary presence, and separation of the
  default route from optional capabilities.
- `scripts/apply-proto-icons.mjs --check` validates committed static icon markup
  against the externally supplied authoritative asset map during an authorized
  local icon pass.

## Deployment and evidence boundaries

Pushes to `main` run the GitHub Pages workflow and create a versioned ZIP of the
deployable static website. The GitHub Pages site is a development deployment
for browser validation, not the production website, and a push does not itself
constitute production publication.

Structural validation, deployed browser review, owner acceptance, and
production publication are separate gates. Passing one never implies another.
Release packages include `LICENSE` and the privacy-sanitized game-asset
permission record alongside `index.html` and `assets/`.

The production host's Cloudflare Pages Analytics injection was explicitly
accepted by the owner as out-of-scope background noise during the version 3.0
cold verification. It is external to the repository-supplied static package.

## Maintenance state

No roadmap sequence, implementation story, release milestone, or named future
work remains active. The YELLOW/PURPLE problem-resolver concept and Dark Fog
COMBAT/PEACE control concept were explicitly deferred indefinitely. Their
historical concept records are preserved under
[`archive/deferred-indefinitely/`](archive/deferred-indefinitely/).

The completed version 3.0 sequence, its source review, story records, and
supporting evidence are preserved under
[`archive/version-3.0/`](archive/version-3.0/). Earlier completed and superseded
records remain indexed by [`archive/README.md`](archive/README.md).

Maintenance work begins only through a new explicit owner direction classified
under `management/work-management.md`. Historical records do not authorize new
work.

## Documentation roles

- `README.md` provides an ageless introduction to the guide and repository.
- `docs/PROJECT.md` defines current product, governance, and maintenance
  boundaries.
- `docs/ROADMAP.md` is the sole current planning-status record.
- `docs/management/` contains durable process, validation, and permission
  records.
- `docs/archive/` contains historical plans, stories, evidence, decisions, and
  indefinitely deferred concepts. Archived statements are not current
  requirements.
