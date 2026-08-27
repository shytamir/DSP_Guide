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

## Current planning state

- [`ROADMAP.md`](ROADMAP.md) is the sole active authority for sequence,
  dependencies, story lifecycle, and prerelease milestone status. All 18
  reader-facing stories were owner-accepted and archived on 2026-08-27. The
  roadmap remains active for the version 2.8 capability proof, the future
  editorial refinement workshop ending in version 2.9, and the later separate
  release-candidate decision.
- Version 2.3 remains the current published release. Version 2.8 is an active
  prerelease development line, not a release-candidate announcement. The 2.3
  release record is preserved in
  [`../archive/version-2.3-navigation-and-progressive-disclosure-release.md`](../archive/version-2.3-navigation-and-progressive-disclosure-release.md).
- The completed twelve-story roadmap, its seven supporting story records, and
  the completed design-leftovers inventory are historical documents indexed in
  [`../archive/README.md`](../archive/README.md).
- [`dark-fog-control-future-work.md`](dark-fog-control-future-work.md) and
  [`yellow-purple-problem-resolver-future-work.md`](yellow-purple-problem-resolver-future-work.md)
  preserve named future-work concepts outside the active roadmap. Neither
  authorizes implementation.
- The superseded one-screen checklist correction and the owner-accepted NR-18
  synchronization story are archived as historical records.

## Historical records

Completed and superseded plans, stories, audits, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived implementation
language is historical and does not define current work.

Unsettled analysis may remain in an untracked working note until the owner
approves it as active work. Raw correspondence, unsanitized personal
information, player snapshots, and game assemblies must remain outside version
control.
