# Icon Placement Policy and Proposed Stories

**Status:** Archived historical record. All three stories were completed and
owner-accepted under [`ROADMAP.md`](ROADMAP.md) on 2026-08-09.

## Problem

The original icon pass decorated nearly every mapped item, building, and
technology name. The recurring materializer still scans broad visible-text
surfaces, so a local cleanup can be reversed by a later authorized icon pass.

Prevention and cleanup are separate work classes. The materializer must first
respect the settled placement policy without becoming an editorial migration
tool. Existing markup can then be cleaned up in bounded presentation stories.

## Settled placement policy

Icons remain decorative and never replace visible names. Prototype IDs, asset
bindings, tooltip behavior, phase links, public anchors, and card semantics
remain unchanged.

| Surface                                                                   | Item/building icons             | Technology icons                                            |
| ------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| Phase rail, Quick Progress Index, phase headings, and phase tags          | Keep the phase-identifying icon | Keep existing non-prose treatment                           |
| Ordinary paragraphs and instructional lists                               | Remove                          | Remove the icon but retain the tooltip-bearing text control |
| Phase dashboards                                                          | Remove                          | Keep                                                        |
| Task checklists and one-screen checklist                                  | Remove                          | Keep                                                        |
| Card titles, summaries, supplies, maps, destinations, and producer arrows | Keep                            | Keep                                                        |
| Card Operating Note prose                                                 | Remove all icons                | Remove the icon but retain any tooltip-bearing text control |
| Dedicated comparison and reference tables                                 | Keep                            | Keep                                                        |
| Non-phase headings                                                        | Remove                          | Keep                                                        |
| Explicitly designed legends and callouts                                  | Keep                            | Keep                                                        |

The policy is semantic. Do not implement it as a growing list of individual
text exceptions.

## Story 1 — Prevent icon growth outside approved surfaces

**Class:** Tooling change.

**State:** Completed and owner-accepted on 2026-08-09.

As a maintainer running the authorized icon materializer, I want it to add
icons only on approved surfaces so that later content edits cannot reintroduce
prose-icon saturation.

### Scope

- Constrain item, building, and technology icon materialization according to
  the settled surface table.
- Preserve phase-icon and production-arrow materialization.
- Add the narrowest deterministic check needed to reject newly materialized
  icons on prohibited surfaces.
- Document the durable placement contract where the tool is maintained.

### Non-goals

- Do not remove existing icons from `index.html`.
- Do not change guide prose, tooltip behavior, prototype bindings, or assets.
- Do not add a dependency or new authoring pipeline.
- Do not encode completed cleanup as a recurring migration.

### Acceptance

- A materialization pass adds no item or building icon to ordinary prose,
  instructional lists, phase dashboards, checklists, non-phase headings, or
  card Operating Note prose.
- A materialization pass adds no technology icon to ordinary prose,
  instructional lists, or card Operating Note prose.
- Approved phase, card, map, table, legend, and callout treatments remain
  available.
- Repeated materialization is deterministic.
- Directly affected Tier 1 tooling checks pass without a new dependency.

## Story 2 — Remove icons from narrative and action surfaces

**Class:** Editorial refinement with presentation review.

**State:** Completed and owner-accepted on 2026-08-09.

As a reader following phase instructions, I want prose and action surfaces to
read without repeated item artwork so that names, sentences, and decisions set
the reading rhythm.

### Scope

- Remove item and building icons from ordinary paragraphs, instructional
  lists, phase dashboards, task checklists, the one-screen checklist, and
  non-phase headings.
- Remove technology icons from ordinary paragraphs and instructional lists
  while preserving their tooltip-bearing text controls.
- Preserve approved icons in phase identity surfaces, cards, reference tables,
  legends, and callouts.
- Update only directly affected validation and documentation.

### Non-goals

- Do not rewrite prose or change progression advice.
- Do not change card Operating Notes; they are Story 3.
- Do not remove technology tooltip controls or change authoritative bindings.
- Do not redesign dashboards, checklists, headings, or tables.

### Acceptance

- Every in-scope surface follows the settled placement table.
- Item and technology names remain visible and accurate.
- Technology hover references in prose still work without an icon.
- Checklist behavior and storage keys remain unchanged.
- Tier 2 validation includes directly affected checks and reviewed desktop
  Chromium rendering.

## Story 3 — Remove icons from card Operating Note prose

**Class:** Editorial refinement with presentation review.

**State:** Completed and owner-accepted on 2026-08-09.

As a reader opening a production card, I want its Operating Note to read as
plain guidance so that the note is visually distinct from the icon-rich
production map above it.

### Scope

- Remove every item, building, producer, and technology icon from card
  Operating Note prose.
- Preserve visible names and any tooltip-bearing technology text control.
- Preserve icons in card titles, summaries, supplies, production maps,
  destinations, and producer arrows.
- Update directly affected card validation.

### Non-goals

- Do not rewrite Operating Note guidance.
- Do not change card calculations, identities, collapse behavior, or layout.
- Do not clean icons outside card Operating Notes.

### Acceptance

- No icon appears inside card Operating Note prose.
- All other approved card icon surfaces retain their current treatment.
- Cards remain useful when collapsed and preserve their public IDs.
- Tier 2 validation includes card contracts and reviewed expanded-card desktop
  rendering.

## Roadmap order

Implement Story 1 before either cleanup story. Implement Stories 2 and 3 as
separate reviewable changes. No release is included.
