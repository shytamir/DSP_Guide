# Management Records

This directory contains durable governance, validation boundaries, and
publication permissions. Start here before creating or changing a management
record.

## Process index

1. **Classify and scope the work.** Use
   [`work-management.md`](work-management.md) to define the need, evidence,
   decision surfaces, non-goals, and approval checkpoints.
2. **Choose proportionate validation.** Use
   [`validation-and-tooling.md`](validation-and-tooling.md) to select the
   narrowest validation tier and keep runtime tools outside the product
   contract unless they enforce a durable requirement.
3. **Implement within the approved scope.** Passing checks establishes
   technical consistency, not reader acceptance.
4. **Obtain the required owner decision.** Only the owner can accept, complete,
   or archive a story.
5. **Close the record.** Update current project status at a meaningful
   milestone and move accepted or superseded records to `docs/archive/`.

## Active governance

- [`work-management.md`](work-management.md) defines work classes, approval
  gates, and record lifecycle.
- [`validation-and-tooling.md`](validation-and-tooling.md) defines validation
  tiers and toolchain boundaries.
- [`game-asset-use-permission-sanitized.md`](game-asset-use-permission-sanitized.md)
  preserves the limited permission to use unmodified in-game assets in the
  non-commercial guide and related mod.

## Planning state

The project is in maintenance mode with no active or planned work.
[`../ROADMAP.md`](../ROADMAP.md) is the sole current roadmap and is an empty
maintenance placeholder. No story or concept record is active in this
directory.

The completed version 3.0 sequence is indexed under
[`../archive/version-3.0/`](../archive/version-3.0/). The two previously named
unplanned concepts were deferred indefinitely and are indexed under
[`../archive/deferred-indefinitely/`](../archive/deferred-indefinitely/).

## Historical records

Completed, superseded, and indefinitely deferred plans, stories, audits,
evidence, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived language is historical
and does not define current work.

Unsettled analysis may remain in an untracked working note until the owner
approves it as active work. Raw correspondence, unsanitized personal
information, player snapshots, and game assemblies must remain outside version
control.
