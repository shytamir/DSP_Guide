# Management Records

This directory contains active governance, maintenance boundaries, standing
references, and publication permissions. Start here before creating or
changing a management record.

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

## Maintenance state

- [`ROADMAP.md`](ROADMAP.md) is the concise maintenance-mode record and
  indicates no pending work.
- Version 2.3 is the current published minor line. Its completed release record
  is preserved in
  [`../archive/version-2.3-navigation-and-progressive-disclosure-release.md`](../archive/version-2.3-navigation-and-progressive-disclosure-release.md).
- The completed twelve-story roadmap, its seven supporting story records, and
  the completed design-leftovers inventory are historical documents indexed in
  [`../archive/README.md`](../archive/README.md).
- [`one-screen-checklist-correction-story.md`](one-screen-checklist-correction-story.md)
  is an inactive standing reference. It is not pending implementation or part
  of an active roadmap, was explicitly deferred from version 2.3, and requires
  explicit owner reactivation.

## Historical records

Completed and superseded plans, stories, audits, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived implementation
language is historical and does not define current work.

Unsettled analysis may remain in an untracked working note until the owner
approves it as active work. Raw correspondence, unsanitized personal
information, player snapshots, and game assemblies must remain outside version
control.
