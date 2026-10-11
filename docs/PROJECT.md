# DSP Practical Progression Guide

**Status:** Localization corrections authorized through completion on 2026-10-11.
LC-01 is agent-validated; LC-02–07 follows in sequence with agent validation and
per-story management updates and commit/push to `main`. Production publication
remains the owner's action.

ML-01–28 and all six original epics remain complete and agent-validated. Their
four-language 3.2 candidate passed the full local browser matrix, exact CI ZIP
and development checks. Subsequent review confirmed editorial defects in number
display, naming and prose; that technical evidence does not establish the
corrected candidate's readiness. Each translated catalog has 1,537 messages
and eight UI strings. The historical
[ML-M5 handoff](archive/version-3.2/ROADMAP.md#ml-m5-handoff--2026-10-11)
identifies the original package and evidence limits. Production publication
remains the owner's action. Version 3.0 is the last recorded published product
and passed final cold verification on 2026-08-27.

[`ROADMAP.md`](ROADMAP.md) is the sole active correction roadmap: three epics,
seven bounded stories, with confirmed defects separated from optional polish
and native terms protected. The owner has authorized the complete implementation sequence.
The two previously deferred concepts remain deferred indefinitely.

## Purpose

Localization authoring now generates static editions from annotated English
HTML, a keyed source inventory, and minimal native terminology snapshots.
All four editions are enabled. Chinese, German and Japanese completed the
original linguistic review, fact checks and private browser matrices; the
combined candidate passed delivery and shared-behavior validation. The current
correction roadmap addresses the confirmed gaps in that editorial review.
Narrow main text can wrap long native names and German compounds at 200% text.
The authoring-only parser and catalogs are not runtime dependencies. Generation
now supplies staging/CI, locale metadata, complete-edition links, and localized
tooltip/checklist data. Enabled locales cannot deploy with missing or stale
translations. See `localization/README.md` for authoring and reconciliation.

This repository publishes a player-facing progression guide for _Dyson Sphere
Program_. It is written primarily for new and returning players who understand
individual factory actions but can lose track of which progression problem
matters next.

The guide is intentionally opinionated without removing player agency. It
offers one practical route, clear phase objectives, optional detours, compact
production references, and enough explanation for the reader to recognize
when local circumstances justify ignoring the default advice.

## Current product

The source static site is `index.html` with supporting files under
`assets/`. It contains:

- ten numbered route sections plus two directly navigable optional
  capabilities;
- 19 phase-relevant production cards;
- two reusable production-line references;
- runtime-derived technology tooltips;
- static runtime-bound prototype icons and producer-marked production maps;
- player-owned persistent checklists and a compact glossary;
- a narrow-screen route sheet with full expedition-stage labels, scrollable
  technology details, tappable checklist labels, stacked dashboards, and
  independently scrollable reference tables; desktop retains its phase rail
  and hover/focus details;
- a wide-desktop companion dock linking to the optional DSP Guide Check mod;
- no server-side code, accounts, repository-supplied analytics, cookies, or
  repository-supplied remote dependencies.

Further changes require explicit owner direction supported by playtest
evidence, a clearly articulated reader need, authoritative game data, or a
bounded maintenance need.

## Game compatibility

The guide fully supports Dyson Sphere Program Early Access `0.10.35.29057`.
On 2026-09-23, the project owner confirmed that all existing validations pass
and the guide works unchanged after the game update.

Verified installed build:

- Steam build ID: `25482430`.
- `Assembly-CSharp.dll` SHA-256:
  `e75d3fe4b6a9ca822766189f826ba3a8348dfb7e301aa37ff6779db29a83fd8d`.

Build identity comes from the installed game's `Updates/Versions.txt`, Steam's
`appmanifest_1366540.acf`, and a SHA-256 calculation of `Assembly-CSharp.dll`.
The retained research hashes and archived runtime observations identify their
original sources and remain historical provenance.

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
For the phone/localization initiative, the owner has explicitly delegated
acceptance and story closure to the agent under the roadmap's execution policy;
production publication remains separate and owner-controlled.
Release packages include `LICENSE` and the privacy-sanitized game-asset
permission record alongside `index.html`, the three locale directories and `assets/`.

The production host's Cloudflare Pages Analytics injection was explicitly
accepted by the owner as out-of-scope background noise during the version 3.0
cold verification. It is external to the repository-supplied static package.

## Planning state

The [archived phone/localization records](archive/version-3.2/)
preserve the completed investigations, 28 stories, language reviews and exact
3.1/3.2 candidate evidence. There is no active implementation epic. Current
support checks are maintained in
[validation and tooling](management/validation-and-tooling.md#phone-and-language-acceptance-contract).
Phone targets are current
Android Chrome on the S23 Ultra class and current iOS Safari, assessed through
agent-operated browser emulation. Desktop behavior must be preserved. The
published 3.0 product retains its best-effort mobile policy. The 3.2 candidate
supports 360–480 CSS px portrait, landscape, and 200% text using the emulation
contract; 320 px is a stress check. Physical devices, branded iOS Safari, OS
fonts, and assistive technologies have not been certified. Spanish and Russian
remain excluded.

The owner delegated decisions, linguistic review, acceptance and closure for
ML-01–28. Every story has validation and a management-bearing commit/push;
candidate stories retain their separate post-push evidence. No decision remains
pending within that completed scope. Publication remains the owner's action.
Later English edits must reconcile every affected enabled translation under the
[authoring contract](../localization/README.md#maintaining-an-enabled-edition).
No game launch or game-file modification is needed to build or validate.

The YELLOW/PURPLE problem-resolver concept and Dark Fog COMBAT/PEACE control
concept remain deferred indefinitely. Their historical records, including the
2026-10-11 review recommendations, are preserved under
[`archive/deferred-indefinitely/`](archive/deferred-indefinitely/).

The completed version 3.0 sequence, its source review, story records, and
supporting evidence are preserved under
[`archive/version-3.0/`](archive/version-3.0/). Earlier completed and superseded
records remain indexed by [`archive/README.md`](archive/README.md).

Further work requires explicit owner direction classified under
`management/work-management.md`. Historical records do not authorize new work.

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
