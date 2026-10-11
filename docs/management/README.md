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
4. **Apply the recorded acceptance authority.** The owner normally accepts and
   closes stories. ML-01–28 used a completed, scoped delegation to the agent.
   LC-01–07 also completed under scoped agent validation and closure. Neither
   delegation authorizes future work; publication remains the owner's action.
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

Maintenance; no active implementation work. LC-01–07 and all three correction
epics are complete and agent-validated. The [archived correction records](../archive/version-3.2-localization-corrections/)
preserve full-edition pattern dispositions, story checks and the source-based
publication repair. The [final handoff](../archive/version-3.2-localization-corrections/HANDOFF.md)
identifies the corrected 3.2 ZIP, successful CI/branch deployment, exact live
bytes, browser checks and evidence limits.

The [original ML-01–28 records](../archive/version-3.2/) remain completed history.
Production publication is still the owner's action; version 3.0 is the last
recorded published product. The current [roadmap](../ROADMAP.md) is a maintenance
placeholder, and both [deferred concepts](../archive/deferred-indefinitely/) stay
deferred indefinitely. New work requires explicit direction.

The [validation contract](validation-and-tooling.md#phone-and-language-acceptance-contract)
and [localization authoring guide](../../localization/README.md) govern upkeep.
Keep generated editions/data committed with their inputs; CI rejects stale
source files and packages the committed publication set. Pages retains branch
publishing; the package workflow must not deploy a competing artifact.

## Historical records

Completed, superseded, and indefinitely deferred plans, stories, audits,
evidence, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived language is historical
and does not define current work.

Unsettled analysis may remain in an untracked working note until authorized as
active work under the applicable acceptance policy. Raw correspondence, personal
information, player snapshots, and game assemblies must remain outside version
control.
