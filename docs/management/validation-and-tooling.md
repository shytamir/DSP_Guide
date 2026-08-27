# Validation and Tooling Boundaries

**Status:** Active governance.

Validation should establish the requested outcome without turning one story's
implementation into a permanent global workflow.

## Validation tiers

Run the narrowest relevant tier first. Higher tiers include only the additional
evidence justified by the change.

| Tier           | Use when                                              | Expected evidence                                                                                                                   |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Records    | Management or documentation only                      | Relevant record review, affected-link check, final diff                                                                             |
| 1 — Contract   | Guide content, data, cards, or checklists             | Directly affected deterministic validator                                                                                           |
| 2 — Experience | Presentation, navigation, interaction, or persistence | Tier 1 plus required desktop Chromium review; narrow viewport only when affected                                                    |
| 3 — Release    | Deployment behavior or publication candidate          | All repository validators, release-equivalent package validation including sanitized licensing records, and required browser review |

Desktop PC is the presentation target. Mobile remains best-effort unless a
story explicitly changes narrow behavior or exposes a shared structural defect.

## Durable and story-specific checks

Global validators should protect stable contracts such as:

- public anchors and phase/card identity;
- authoritative IDs, recipes, and prerequisites;
- deployment contents and local-only persistence;
- structural limits and behavior required across releases.

Story checks may protect a proposed result while it is under review. Before
closure, review them once:

- promote durable invariants;
- express factual relationships structurally where practical;
- retire exact prose assertions that preserve only one valid wording;
- do not let an unreviewed presentation become the executable contract.

Exact text is appropriate only when the wording itself is approved as a stable
requirement. Passing validators establishes consistency; it does not establish
clarity, usefulness, or owner acceptance.

## Browser evidence

- Use browser review for claims about presentation, navigation, responsive
  behavior, focus, persistence, or interaction.
- Review the reader-facing result before hardening editorial assertions.
- Use integrated browser tools for exploratory inspection and repository-local
  deterministic checks for recurring acceptance behavior.
- Do not add permanent browser automation for a one-time observation.

## Toolchain budget

Before adding a committed script, dependency, materialization step, or global
validator responsibility, record:

1. the durable product contract it enforces;
2. why an existing mechanism is insufficient;
3. when and by whom it is invoked;
4. how it remains outside the deployed runtime;
5. what complexity or older mechanism it replaces.

If the need is exploratory, host-specific, or limited to one pass, keep the
tool ephemeral.

## Environment boundary

The repository bootstrap provisions a reproducible agent workstation and may
be used for onboarding, repair, or release preparation. After activation, use
task-tiered validation; do not rerun the full environment inventory for every
bounded change.

Agent-host capabilities are not product dependencies. Recurring materializers
must not contain completed editorial migrations, and presentation work must not
expand the authoring pipeline without an approved tooling story.
