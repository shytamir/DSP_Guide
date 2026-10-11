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
   LC-01–07 is now authorized through completion with agent validation and
   closure; production publication remains the owner's action.
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

Localization correction implementation is active. The sole current record is
[`../ROADMAP.md`](../ROADMAP.md): LC-E1–E3 / LC-01–07, authorized through completion on 2026-10-11.
Full-edition checks of the external review's patterns confirmed bounded
number-display, naming, convention and German-prose corrections. Native game
terms remain protected; optional polish is excluded. Execute in story order,
validate and update records, and commit/push each completed story to `main`.
Record epic handoffs while continuing through the fully authorized sequence.

All ML-01–28 stories and six original phone/localization epics remain complete
and agent-validated under their scoped delegation. Their technical delivery
evidence remains historical; it does not resolve the newly confirmed editorial
findings or validate a corrected candidate.

The [completed records](../archive/version-3.2/) preserve investigations and
execution. The [ML-M5 handoff](../archive/version-3.2/ROADMAP.md#ml-m5-handoff--2026-10-11)
identifies the four-language 3.2 package, exact CI/development checks and limits.
Production publication remains the owner's action. The active
[validation contract](validation-and-tooling.md#phone-and-language-acceptance-contract)
and [localization authoring guide](../../localization/README.md) govern upkeep.
The roadmap bounds authoring-rule revisions to the associated implementation
and validation stories. LC-01 now provides German numeric display with exact
canonical-value checks; LC-02 aligns native labels and German grade notation.
LC-E1–E2 is agent-validated, including all scoped convention/convergence and
German grammar corrections. LC-07 now validates the combined candidate and
records exact CI/package/development evidence before the final handoff. Its
development check exposed source/artifact drift; the owner directs keeping branch
publishing. The repair commits generated editions/data, packages verified source
bytes and removes the competing artifact deployment. Pages settings stay unchanged.

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
