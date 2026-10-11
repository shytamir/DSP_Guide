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

The project is delivering phone support and localization under
[`mobile-localization-plan.md`](mobile-localization-plan.md).
The owner requested a complete draft and delegated design, language review,
technical acceptance, and eventual story closure on 2026-10-11. The final draft
has 28 weighted stories with agent-owned gates: English phone support first,
then Simplified Chinese, German, and Japanese together. The owner approved the
roadmap and authorized ML-01–05, stopping after that epic. ML-E1 is complete:
the 3.1 candidate, exact CI ZIP, and development deployment are agent-validated.
ML-E2 (ML-06–09) and ML-G2 are also agent-validated, including the exact ML-09
CI ZIP and development deployment. ML-E3 (ML-10–15) and ML-M2 are now
agent-validated: the complete Chinese edition has passed its linguistic,
factual and private browser checks. ML-E4 (ML-16–21) and ML-M3 are also
agent-validated: German is complete privately, with whole-edition review and
the full browser matrix passed. ML-E5 (ML-22–27) and ML-M4 are agent-validated:
Japanese is complete privately, with whole-edition review and the full browser
matrix passed. ML-E6 / ML-28 is now authorized and in combined 3.2 candidate
validation, including exact CI ZIP and development-deployment evidence, then
a handoff. Production publication remains the owner's action.
Each completed story includes a management update
and commit/push to `main`; production publication remains with the owner.
[`../ROADMAP.md`](../ROADMAP.md) remains the sole current roadmap.

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
