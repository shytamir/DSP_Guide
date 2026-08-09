# One-Screen Checklist Baseline Correction

**Status:** Tracked and unscheduled. This story is not part of the active
roadmap and is not authorized for implementation.

## Align the DYSON checklist with the technology-discounted baseline

**Class:** Bounded correction.

As a reader using the one-screen checklist for final verification, I want its
DYSON Solar Sail and Ejector targets to match the current technology-discounted
baseline so that the checklist does not preserve superseded planning figures.

### Evidence

The current DYSON phase and production-card contract use `405/min` installed
Solar Sail capacity and a `60`-Ejector deployment buffer. The one-screen
checklist still states `517.5/min` and `80` Ejectors.

The owner has selected the technology-discounted `405/min` and `60` figures as
the baseline for the one-screen checklist.

### Scope

- Replace the two superseded DYSON baseline figures in the one-screen
  checklist with `405/min` and `60` Ejectors.
- Keep the surrounding checklist statements accurate and grammatically
  coherent.
- Update only directly affected validation or management documentation.

### Non-goals

- Do not change the DYSON phase, its cards, dashboard, quick references, or
  "How much is enough" section.
- Do not reconsider the selected baseline or perform a broader DYSON audit.
- Do not add this story to `ROADMAP.md` until the owner schedules it.
- Do not include release work.

### Acceptance

- The one-screen checklist states `405/min` installed Solar Sail capacity.
- The one-screen checklist states a `60`-Ejector deployment buffer.
- No `517.5/min` or `80`-Ejector DYSON baseline remains in the one-screen
  checklist.
- The narrowest directly affected Tier 1 contract validation passes.
