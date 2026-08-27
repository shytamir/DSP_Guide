# Version 2.9 Release-Candidate Roadmap — Completed

**Status:** Completed and archived on 2026-08-27. NR-01 through NR-18 were
owner-accepted, the version 2.8 capability proof and editorial refinement
workshop were completed, and the owner established version 2.9 as the release
candidate. Production publication remained a separate release decision.

## Purpose

This index governed sequence, dependencies, status, and owner gates. Detailed
reader needs, evidence, specifications, non-goals, acceptance evidence, and
validation tiers are preserved in the linked story records.

The archived
[`source-review notes`](next-roadmap-source-review-notes.md) preserve
the playthrough findings and original WIP mapping for traceability. They were
not active requirements; the NR stories controlled implementation.

## Historical roadmap-wide contracts

### Research proof

A later phase could treat a technology as completed only when an earlier phase:

1. required it formally for research that completed that phase;
2. required a recipe or building that could not be produced without it; or
3. named it as a non-optional instruction.

Useful, optional, filler, and discardable recommendations did not count as
proof. Technology prerequisites and material recipes were checked against the
retained runtime-derived data before research ownership was assigned.
Practical memory was not an evidence source.

Reader-facing research recommendations prescribed stopping ranks without
showing individual cube costs. A rejected higher stopping point could use one
aggregate total with no per-technology calculation.

### Roadmap-wide out of scope

- YELLOW/PURPLE problem-resolver guidance and related Quick processes were left
  as named future work. This roadmap did not decide or implement them.
- A Dark Fog COMBAT/PEACE control and reconciliation of conditional Dark Fog
  guidance with RED's completion gate were left as named future work. This
  roadmap did not decide or implement them.
- Both named concepts were subsequently deferred indefinitely and archived as
  historical context rather than planned work.
- The PHOTON carrier-upgrade rank was left deliberately unspecified and was not
  a PHOTON phase-gate requirement.
- Production release, version changes, and production publication were excluded
  from every story. Explicitly authorized pushes to `main` could be used for
  deployed development validation under [`docs/PROJECT.md`](../../PROJECT.md);
  they did not imply production publication or owner acceptance.

## Dependency groups

### Group A — Route foundation

NR-01 through NR-03 were completed in order. The group established SPHERE's
optional route position, reader-facing boundary, and research ownership before
dependent route or SPHERE handoff work was finalized.

### Group B — Early and mid-route guidance

NR-04 through NR-08 were completed in order. The group moved from opening
language and compact procedures through chronological ILS, YELLOW, and PURPLE
research ownership. Each later research story consumed the proof boundary
established by the preceding phase.

### Group C — Late-route progression

NR-09 through NR-13 were completed in order after Group A and the relevant
Group B research stories. The group established GREEN proof, taught its
operating loop, then moved through DYSON, the canonical Receiver bridge, and
PHOTON.

### Group D — Optional paths and support

NR-14 through NR-16 preserved separate reader outcomes. They followed the
shared optional-navigation foundation where applicable. NR-15 depended on the
Quick-process pattern from NR-05 and YELLOW's settled production context from
NR-07.

### Group E — Final synchronization

NR-17 followed the canonical Statistics walkthrough and closed the guide.
NR-18 followed after every preceding content and structural story had settled
the final route and phase gates.

## Story sequence

Every story had an assessed medium workload. Large original outcomes were
split at factual, structural, and editorial review boundaries; small adjacent
outcomes were paired only when they produced one reader-visible result.

The balance was deliberate:

- SPHERE used three stories so navigation, editorial guidance, and research
  ownership could be reviewed independently.
- GREEN used two stories so factual research/material proof settled before its
  player-facing operating loop.
- The Quick-process story owned one reusable pattern and its two initial uses;
  it did not become a general tutorial project.
- Troubleshooting and the conclusion shared one final reader journey; each was
  too small to justify a separate implementation cycle.
- The Receiver bridge and Statistics walkthrough were the longest individual
  drafts, but each owned one semantic surface, one reader task, and one review
  checkpoint without new tooling.

Independent decision surfaces discovered during implementation were handled
within the story lifecycle rather than hidden inside another story.

| Order | Story                                                                                                                                          | Class                   | Requires                     | Status                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------- | ------------------------- |
| 1     | [NR-01 — Separate SPHERE from the numbered route](nr-01-separate-sphere-from-the-numbered-route.md)                                 | Structural change       | None                         | Owner-accepted — archived |
| 2     | [NR-02 — Reframe SPHERE as optional guidance](nr-02-reframe-sphere-as-optional-guidance.md)                                         | Editorial refinement    | NR-01                        | Owner-accepted — archived |
| 3     | [NR-03 — Limit SPHERE research to route-specific ownership](nr-03-limit-sphere-research-to-route-specific-ownership.md)             | Data or research change | NR-01, NR-02                 | Owner-accepted — archived |
| 4     | [NR-04 — Clarify the opening orientation and BLUE goal](nr-04-clarify-the-opening-orientation-and-blue-goal.md)                     | Editorial refinement    | NR-02                        | Owner-accepted — archived |
| 5     | [NR-05 — Establish compact Quick processes for early controls](nr-05-establish-compact-quick-processes-for-early-controls.md)       | Structural change       | NR-04                        | Owner-accepted — archived |
| 6     | [NR-06 — Assign ILS research chronologically across three stages](nr-06-assign-ils-research-chronologically-across-three-stages.md) | Data or research change | NR-05                        | Owner-accepted — archived |
| 7     | [NR-07 — Replace YELLOW research with bounded buildout guidance](nr-07-replace-yellow-research-with-bounded-buildout-guidance.md)   | Data or research change | NR-06                        | Owner-accepted — archived |
| 8     | [NR-08 — Assign PURPLE-owned research and bounded upgrades](nr-08-assign-purple-owned-research-and-bounded-upgrades.md)             | Data or research change | NR-07                        | Owner-accepted — archived |
| 9     | [NR-09 — Establish GREEN research and material-proof ownership](nr-09-establish-green-research-and-material-proof-ownership.md)     | Data or research change | NR-03, NR-08                 | Owner-accepted — archived |
| 10    | [NR-10 — Teach GREEN's Deuterium, fuel, and power loop](nr-10-teach-green-deuterium-fuel-and-power-loop.md)                         | Editorial refinement    | NR-09                        | Owner-accepted — archived |
| 11    | [NR-11 — Define DYSON's chosen Solar Sail route](nr-11-define-dyson-chosen-solar-sail-route.md)                                     | Data or research change | NR-03, NR-10                 | Owner-accepted — archived |
| 12    | [NR-12 — Create one Receiver and Antimatter bridge](nr-12-create-one-receiver-and-antimatter-bridge.md)                             | Structural change       | NR-03, NR-11                 | Owner-accepted — archived |
| 13    | [NR-13 — Refocus PHOTON on stable WHITE readiness](nr-13-refocus-photon-on-stable-white-readiness.md)                               | Data or research change | NR-12                        | Owner-accepted — archived |
| 14    | [NR-14 — Refine WARP expedition framing and route support](nr-14-refine-warp-expedition-framing-and-route-support.md)               | Editorial refinement    | NR-01                        | Owner-accepted — archived |
| 15    | [NR-15 — Add one canonical Production Statistics walkthrough](nr-15-add-one-canonical-production-statistics-walkthrough.md)         | Editorial refinement    | NR-05, NR-07                 | Owner-accepted — archived |
| 16    | [NR-16 — Teach the LOGISTICS route model](nr-16-teach-the-logistics-route-model.md)                                                 | Editorial refinement    | NR-01                        | Owner-accepted — archived |
| 17    | [NR-17 — Repair troubleshooting and add the final conclusion](nr-17-repair-troubleshooting-and-add-the-final-conclusion.md)         | Editorial refinement    | NR-03, NR-13, NR-15, NR-16   | Owner-accepted — archived |
| 18    | [NR-18 — Synchronize the final One-Screen Default Checklist](nr-18-synchronize-the-final-one-screen-default-checklist.md)           | Structural change       | NR-01 through NR-17 accepted | Owner-accepted — archived |

## Prerelease milestones

| Order | Milestone                                                                                                            | Requires             | State                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------- |
| P1    | Establish version 2.8 as a prerelease capability proof and validate the pushed `main` state at Tier 3                | NR-18 owner-accepted | Completed                                      |
| P2    | Conduct the editorial refinement workshop and conclude it with a separately authorized version 2.9 prerelease update | P1                   | Completed                                      |
| P3    | Decide whether to announce a release candidate and dispose of this roadmap                                           | P2                   | Completed — version 2.9 announced as candidate |

At closure, version 2.3 remained the current published release and version 2.9
became the release candidate. Production publication was left to a separate
owner decision.

## Historical owner gates and lifecycle

1. **Approve decomposition.** The owner reviewed this index and the 18 bounded
   drafts without authorizing implementation by approval alone.
2. **Authorize one story.** The owner selected eligible stories after their
   listed prerequisites were satisfied.
3. **Validate technically.** Each story received its stated validation tier
   without technical evidence being treated as reader acceptance.
4. **Decide.** The owner requested refinement or accepted each result.
5. **Advance status.** Current project status and dependent-story eligibility
   advanced only after explicit acceptance.
6. **Release separately.** Release-candidate and production decisions remained
   separate from story completion.

Approval, activation, technical validation, owner acceptance, completion, and
release authorization were treated as separate lifecycle decisions.
