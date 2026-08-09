# Guide Correction Stories

**Status:** Approved for ordered implementation under
[`ROADMAP.md`](ROADMAP.md).

These bounded corrections were extracted from the 2026-08-09 guide review.
Implement and obtain owner acceptance for each story before advancing to the
next roadmap item.

## 1. Align the opening route with unified BLUE

**Class:** Bounded correction.

As a reader using the opening route to locate my first phase, I want that route
to begin with BLUE so that it agrees with the guide's unified phase structure.

### Evidence

The introduction still describes `Bootstrap -> Blue`, while the phase rail,
Quick Progress Index, and published phase structure expose BLUE as the sole
opening phase. `#bootstrap` remains a compatibility anchor inside BLUE.

### Scope

- Correct the introductory default-route sequence.
- Update only directly affected validation or documentation.
- Preserve the BLUE phase number, navigation entry, and `#bootstrap`
  compatibility anchor.

### Acceptance

- The visible default route begins with BLUE and continues to RED.
- No separate BOOTSTRAP phase or navigation entry is introduced.
- Existing opening-phase anchors and checklist identity remain unchanged.
- The directly affected Tier 1 contract validation passes.

## 2. Reduce the perceived authority of DYSON planning figures

**Class:** Editorial refinement with presentation review.

As a reader planning the photon swarm, I want DYSON reference figures to read
as planning examples rather than permission gates so that I respond to live
generation, firing duty, storage trends, and Receiver output.

### Preserved contract

The guide may retain accurate reference calculations. Exact baseline figures
may appear in only two DYSON locations: production-card titles and the prose in
the "How much is enough" section. Card titles continue to omit raw intake,
intermediate rates, processing rates, and supporting machine counts.

For this story, baseline figures are the exact targets, capacities,
throughputs, ratios, and machine counts used to describe the planned DYSON
reference build.

### Scope

- Review the DYSON dashboard, quick references, and affected card summaries for
  visual or editorial overstatement and remove exact baseline figures from
  those surfaces.
- Retain exact baseline figures only in production-card titles and the "How
  much is enough" prose.
- Keep the distinction between installed capacity and observed throughput.
- Keep PHOTON entry available as soon as partial Dyson output is useful.
- Update only directly affected validation and management documentation.

### Non-goals

- Do not change the underlying calculations or authoritative game facts.
- Do not change any guide surface outside the DYSON phase. The one-screen
  checklist baseline correction is a separate, unscheduled story.
- Do not redesign production cards or audit reference authority across every
  phase.
- Do not change the SPHERE or PHOTON routes except for an existing direct
  handoff that must remain consistent.

### Owner checkpoint

The information hierarchy is settled by the preserved contract above. Approve
the revised wording before exact editorial assertions become durable validator
requirements.

### Acceptance

- Exact baseline figures appear only in production-card titles and the "How
  much is enough" prose, where they remain accurate and clearly identified as
  planning references.
- No exact baseline figure appears elsewhere in the DYSON phase.
- The "How much is enough" prose makes live player-observable evidence at least
  as prominent as the numeric targets.
- The dashboard and collapsed card layer do not imply that the reference swarm
  must be complete before PHOTON begins.
- The guide remains useful with every production card collapsed.
- Tier 2 validation includes directly affected contract checks and reviewed
  desktop Chromium rendering.
