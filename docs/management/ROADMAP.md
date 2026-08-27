# Active Roadmap — Story Index

**Status:** Active. NR-01 through NR-14 were owner-accepted and archived on
2026-08-27. NR-15 is implemented and technically validated, pending owner
acceptance. NR-16 through NR-18 are owner-approved and implementation-ready but
remain inactive until separately activated after their prerequisites are
satisfied.

## Purpose

This index owns sequence, dependencies, status, and owner gates. Detailed
reader needs, evidence, specifications, non-goals, acceptance evidence, and
validation tiers live in the linked story records.

The archived
[`source-review notes`](../archive/next-roadmap-source-review-notes.md) preserve
the playthrough findings and original WIP mapping for traceability. They are
not active requirements; the current NR stories control.

## Roadmap-wide contracts

### Research proof

A later phase may treat a technology as completed only when an earlier phase:

1. requires it formally for research that completes that phase;
2. requires a recipe or building that cannot be produced without it; or
3. names it as a non-optional instruction.

Useful, optional, filler, and discardable recommendations are not proof. Check
both technology prerequisites and material recipes against the retained
runtime-derived data before assigning research ownership. Practical memory is
not an evidence source.

Reader-facing research recommendations prescribe stopping ranks without
showing individual cube costs. A rejected higher stopping point may use one
aggregate total with no per-technology calculation.

### Roadmap-wide out of scope

- YELLOW/PURPLE problem-resolver guidance and related Quick processes remain
  named future work. This roadmap does not decide or implement them.
- A Dark Fog COMBAT/PEACE control and reconciliation of conditional Dark Fog
  guidance with RED's completion gate remain named future work. This roadmap
  does not decide or implement them.
- The PHOTON carrier-upgrade rank remains deliberately unspecified and is not
  a PHOTON phase-gate requirement.
- Production release, version changes, and production publication are excluded
  from every story. Explicitly authorized pushes to `main` may be used for
  deployed development validation under [`docs/PROJECT.md`](../PROJECT.md);
  they do not imply production publication or owner acceptance.

## Dependency groups

### Group A — Route foundation

Complete NR-01 through NR-03 in order. The group establishes SPHERE's optional
route position, reader-facing boundary, and research ownership. Group A must
be owner-accepted before work that depends on the revised route or SPHERE
handoffs is finalized.

### Group B — Early and mid-route guidance

Complete NR-04 through NR-08 in order. The group moves from opening language
and compact procedures through chronological ILS, YELLOW, and PURPLE research
ownership. Each later research story consumes the proof boundary established
by the preceding phase.

### Group C — Late-route progression

Complete NR-09 through NR-13 in order after Group A and the relevant Group B
research stories. The group establishes GREEN proof, teaches its operating
loop, then moves through DYSON, the canonical Receiver bridge, and PHOTON.

### Group D — Optional paths and support

NR-14 through NR-16 preserve separate reader outcomes. They follow the shared
optional-navigation foundation where applicable. NR-15 depends on the
Quick-process pattern from NR-05 and YELLOW's settled production context from
NR-07.

### Group E — Final synchronization

NR-17 follows the canonical Statistics walkthrough and closes the guide.
NR-18 is last: it may begin only after every preceding accepted content and
structural story has settled the final route and phase gates.

## Story sequence

Every story has an assessed medium workload. Large original outcomes were
split at factual, structural, and editorial review boundaries; small adjacent
outcomes were paired only when they produce one reader-visible result.

The balance is deliberate:

- SPHERE is three stories so navigation, editorial guidance, and research
  ownership can be reviewed independently.
- GREEN is two stories so factual research/material proof settles before its
  player-facing operating loop.
- The Quick-process story owns one reusable pattern and its two initial uses;
  it does not become a general tutorial project.
- Troubleshooting and the conclusion share one final reader journey; each is
  too small to justify a separate implementation cycle.
- The Receiver bridge and Statistics walkthrough are the longest individual
  drafts, but each owns one semantic surface, one reader task, and one review
  checkpoint without new tooling.

If implementation discovery exposes another independent decision surface,
stop and split the affected draft before authorizing additional scope.

| Order | Story                                                                                                                                          | Class                   | Requires                     | Status                                 |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------- | -------------------------------------- |
| 1     | [NR-01 — Separate SPHERE from the numbered route](../archive/nr-01-separate-sphere-from-the-numbered-route.md)                                 | Structural change       | None                         | Owner-accepted — archived              |
| 2     | [NR-02 — Reframe SPHERE as optional guidance](../archive/nr-02-reframe-sphere-as-optional-guidance.md)                                         | Editorial refinement    | NR-01                        | Owner-accepted — archived              |
| 3     | [NR-03 — Limit SPHERE research to route-specific ownership](../archive/nr-03-limit-sphere-research-to-route-specific-ownership.md)             | Data or research change | NR-01, NR-02                 | Owner-accepted — archived              |
| 4     | [NR-04 — Clarify the opening orientation and BLUE goal](../archive/nr-04-clarify-the-opening-orientation-and-blue-goal.md)                     | Editorial refinement    | NR-02                        | Owner-accepted — archived              |
| 5     | [NR-05 — Establish compact Quick processes for early controls](../archive/nr-05-establish-compact-quick-processes-for-early-controls.md)       | Structural change       | NR-04                        | Owner-accepted — archived              |
| 6     | [NR-06 — Assign ILS research chronologically across three stages](../archive/nr-06-assign-ils-research-chronologically-across-three-stages.md) | Data or research change | NR-05                        | Owner-accepted — archived              |
| 7     | [NR-07 — Replace YELLOW research with bounded buildout guidance](../archive/nr-07-replace-yellow-research-with-bounded-buildout-guidance.md)   | Data or research change | NR-06                        | Owner-accepted — archived              |
| 8     | [NR-08 — Assign PURPLE-owned research and bounded upgrades](../archive/nr-08-assign-purple-owned-research-and-bounded-upgrades.md)             | Data or research change | NR-07                        | Owner-accepted — archived              |
| 9     | [NR-09 — Establish GREEN research and material-proof ownership](../archive/nr-09-establish-green-research-and-material-proof-ownership.md)     | Data or research change | NR-03, NR-08                 | Owner-accepted — archived              |
| 10    | [NR-10 — Teach GREEN's Deuterium, fuel, and power loop](../archive/nr-10-teach-green-deuterium-fuel-and-power-loop.md)                         | Editorial refinement    | NR-09                        | Owner-accepted — archived              |
| 11    | [NR-11 — Define DYSON's chosen Solar Sail route](../archive/nr-11-define-dyson-chosen-solar-sail-route.md)                                     | Data or research change | NR-03, NR-10                 | Owner-accepted — archived              |
| 12    | [NR-12 — Create one Receiver and Antimatter bridge](../archive/nr-12-create-one-receiver-and-antimatter-bridge.md)                             | Structural change       | NR-03, NR-11                 | Owner-accepted — archived              |
| 13    | [NR-13 — Refocus PHOTON on stable WHITE readiness](../archive/nr-13-refocus-photon-on-stable-white-readiness.md)                               | Data or research change | NR-12                        | Owner-accepted — archived              |
| 14    | [NR-14 — Refine WARP expedition framing and route support](../archive/nr-14-refine-warp-expedition-framing-and-route-support.md)               | Editorial refinement    | NR-01                        | Owner-accepted — archived              |
| 15    | [NR-15 — Add one canonical Production Statistics walkthrough](next-roadmap/nr-15-add-one-canonical-production-statistics-walkthrough.md)       | Editorial refinement    | NR-05, NR-07                 | Implemented — pending owner acceptance |
| 16    | [NR-16 — Teach the LOGISTICS route model](next-roadmap/nr-16-teach-the-logistics-route-model.md)                                               | Editorial refinement    | NR-01                        | Owner-approved — inactive              |
| 17    | [NR-17 — Repair troubleshooting and add the final conclusion](next-roadmap/nr-17-repair-troubleshooting-and-add-the-final-conclusion.md)       | Editorial refinement    | NR-03, NR-13, NR-15, NR-16   | Owner-approved — inactive              |
| 18    | [NR-18 — Synchronize the final One-Screen Default Checklist](next-roadmap/nr-18-synchronize-the-final-one-screen-default-checklist.md)         | Structural change       | NR-01 through NR-17 accepted | Owner-approved — inactive              |

## Owner gates and lifecycle

1. **Approve decomposition.** The owner reviews this index and the 18 bounded
   drafts. This step does not authorize implementation.
2. **Authorize one story.** The owner selects an eligible story whose listed
   prerequisites are satisfied and explicitly authorizes implementation.
3. **Validate technically.** Run the story's stated validation tier and report
   evidence without inferring reader acceptance.
4. **Decide.** The owner requests refinement, accepts the result, or stops the
   work.
5. **Advance status.** Only after explicit acceptance may current project
   status and dependent-story eligibility be updated.
6. **Release separately.** Create or publish a coherent release only under a
   later explicit release instruction.

Approval, activation, technical validation, owner acceptance, completion, and
release authorization remain separate lifecycle decisions.
