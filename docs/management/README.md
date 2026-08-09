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

## Roadmap state and tracked work

- [`ROADMAP.md`](ROADMAP.md) records the completed correction sequence and the
  boundary before further roadmap specification.
- [`pending-guide-design-leftovers.md`](pending-guide-design-leftovers.md)
  preserves input for a future owner-specified roadmap; it is not active
  planning or implementation scope.
- [`one-screen-checklist-correction-story.md`](one-screen-checklist-correction-story.md)
  tracks the approved DYSON checklist baseline correction; it is unscheduled
  and is not part of the current roadmap.

Both ordered guide-correction stories were owner-accepted on 2026-08-09 and
archived. No story is currently active. Further work awaits owner specification
of the next roadmap.

## Historical records

Completed and superseded plans, stories, audits, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived implementation
language is historical and does not define current work.

Unsettled analysis may remain in an untracked working note until the owner
approves it as active work. Raw correspondence, unsanitized personal
information, player snapshots, and game assemblies must remain outside version
control.
