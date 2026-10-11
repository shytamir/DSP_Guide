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
   closes stories. The phone/localization roadmap explicitly delegates those
   decisions to the agent, with no repeated owner gate.
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

The project is in maintenance with no active implementation roadmap. All
ML-01–28 stories and six phone/localization epics are complete and agent-validated
under the owner's delegated acceptance policy. Each story has validation,
management updates and a commit/push to `main`; candidate delivery evidence is
retained separately from publication.

The [completed records](../archive/version-3.2/) preserve investigations and
execution. The [ML-M5 handoff](../archive/version-3.2/ROADMAP.md#ml-m5-handoff--2026-10-11)
identifies the four-language 3.2 package, exact CI/development checks and limits.
Production publication remains the owner's action. The active
[validation contract](validation-and-tooling.md#phone-and-language-acceptance-contract)
and [localization authoring guide](../../localization/README.md) govern upkeep.
[`../ROADMAP.md`](../ROADMAP.md) is the sole current maintenance placeholder;
new implementation requires new direction.

The published version 3.0 sequence is indexed under
[`../archive/version-3.0/`](../archive/version-3.0/). The two previously named
unplanned concepts remain deferred indefinitely, with review recommendations
retained alongside each record, and are indexed under
[`../archive/deferred-indefinitely/`](../archive/deferred-indefinitely/).

## Historical records

Completed, superseded, and indefinitely deferred plans, stories, audits,
evidence, and reviews are indexed in
[`../archive/README.md`](../archive/README.md). Archived language is historical
and does not define current work.

Unsettled analysis may remain in an untracked working note until authorized as
active work under the applicable acceptance policy. Raw correspondence, personal
information, player snapshots, and game assemblies must remain outside version
control.
