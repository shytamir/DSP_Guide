# Management Records

This directory contains active governance, approved work, and publication
permissions. Start here before creating or changing a management record.

## Process index

1. **Classify and scope the work.** Use
   [`work-management.md`](work-management.md) to define the reader need,
   evidence, decision surfaces, non-goals, and approval checkpoints.
2. **Choose proportionate validation.** Use
   [`validation-and-tooling.md`](validation-and-tooling.md) to select the
   narrowest validation tier and keep runtime tools outside the product
   contract unless they enforce a durable requirement.
3. **Implement within the approved scope.** Passing checks establishes
   technical consistency, not reader acceptance.
4. **Obtain the required owner decision.** Only the owner can accept, complete,
   or archive a story.
5. **Close the record.** Update current project status at meaningful
   milestones and move accepted or superseded records to `docs/archive/`.

## Active governance

- [`work-management.md`](work-management.md) defines work classes, approval
  gates, and record lifecycle.
- [`validation-and-tooling.md`](validation-and-tooling.md) defines validation
  tiers and toolchain boundaries.
- [`game-asset-use-permission-sanitized.md`](game-asset-use-permission-sanitized.md)
  preserves the limited permission to use unmodified in-game assets in the
  non-commercial guide and related mod.

## Active work

- [`ROADMAP.md`](ROADMAP.md) defines the current ordered implementation and the
  next-roadmap planning gate.
- [`guide-corrections-user-stories.md`](guide-corrections-user-stories.md)
  contains the two approved correction stories.
- [`pending-guide-design-leftovers.md`](pending-guide-design-leftovers.md)
  preserves input for the next roadmap update; it is not current
  implementation scope.
- [`one-screen-checklist-correction-story.md`](one-screen-checklist-correction-story.md)
  tracks the approved DYSON checklist baseline correction; it is unscheduled
  and is not part of the current roadmap.

The project is in active roadmap implementation. Story 1 was owner-accepted on
2026-08-09. Story 2 is active and must return to its owner checkpoint before
completion or the next roadmap step.

## Historical records

Completed and superseded plans, stories, audits, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived implementation
language is historical and does not define current work.

Unsettled analysis may remain in an untracked working note until the owner
approves it as active work. Raw correspondence, unsanitized personal
information, player snapshots, and game assemblies must remain outside version
control.
