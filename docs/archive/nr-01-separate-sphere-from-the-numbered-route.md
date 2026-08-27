# NR-01 — Separate SPHERE from the numbered route

**Status:** Completed and owner-accepted on 2026-08-27. Archived historical
record; this file no longer defines active work.

**Dependency group:** A — Route foundation
**Assessed workload:** Medium
**Class:** Structural change

## Reader need

As a reader following the prescribed route, I want numbered progression to run directly from BLUE through WHITE so optional permanent Sphere construction cannot be mistaken for a required phase.

## Authoritative evidence

Before NR-01, the guide numbered SPHERE inside the main route while also
calling it optional. The owner-approved roadmap established nine numbered
phases and three optional entries.

## Intended outcome

NR-01 reclassified SPHERE structurally as an optional entry without changing
its detailed guidance.

## In-scope surfaces

- Numbered phase navigation and Quick Progress Index
- SPHERE document position and optional-navigation entry
- Displayed PHOTON and WHITE numbers
- Directly affected phase, icon, navigation, and structural validators

## Approved specification

- Make the numbered route **BLUE → RED → ILS → YELLOW → PURPLE → GREEN →
  DYSON → PHOTON → WHITE**.
- Remove SPHERE from the numbered route and Quick Progress Index.
- Place SPHERE with WARP and LOGISTICS, visibly labeled **OPTIONAL PATH**.
- Move SPHERE after numbered WHITE and before WARP so document order matches
  optional-navigation order without prescribing entry timing.
- Preserve the public `#sphere` anchor.
- Renumber only displayed PHOTON and WHITE phase numbers. Preserve their
  anchors, checklist identities, and progression responsibilities.
- Update directly affected contracts for nine numbered phases and three
  optional entries.

## Non-goals and preserved contracts

- Do not rewrite SPHERE guidance in this story; NR-02 owns that layer.
- Do not change WARP or LOGISTICS beyond the shared optional-navigation structure.
- Do not change checklist storage identities or public anchors.
- Do not change DSP Guide Check or any other mod.

## Gates satisfied

- The owner approved the bounded story before implementation began.
- Technical validation established structural and presentation consistency.
- The owner accepted the deployed reader-facing result on 2026-08-27.

## Acceptance evidence

- The numbered route is an uninterrupted nine-phase BLUE-to-WHITE sequence.
- SPHERE appears with WARP and LOGISTICS as an optional path and retains #sphere.
- PHOTON and WHITE retain their responsibilities after display-number correction.
- Directly affected validators recognize nine phases and three optional entries.

## Validation

**Tier:** 2 — Experience

Technical validation covered the directly affected structural contracts,
navigation, document order, direct links, and optional-entry presentation on
the deployed development Pages site in desktop Chromium.

## Release

Production release, version changes, and production publication were not
included. Development deployment for validation followed
[`docs/PROJECT.md`](../PROJECT.md) and did not imply owner acceptance.
