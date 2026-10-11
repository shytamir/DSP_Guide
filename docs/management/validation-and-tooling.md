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

Desktop and the 3.1 phone candidate are presentation targets. Production 3.0
retains its previous best-effort mobile policy until the owner publishes 3.1.

The [phone/localization roadmap](../ROADMAP.md) explicitly changes that target
when its stories are implemented. Its
[validation contract](mobile-localization-plan.md#validation-contract) adds
mobile Chromium/WebKit emulation, per-locale linguistic/factual review, and
candidate package checks. The owner delegates acceptance to the agent; no
physical-device, native-speaker, or owner gate is required. Record emulator and
self-review limitations without presenting them as physical-device or independent
reader validation. Publication remains separate from candidate acceptance.

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

For the phone initiative, activate the runtime helper and run
`node scripts/validate-phone.mjs --mode baseline --output artifacts/phone-validation/baseline`.
The check starts/stops its own loopback static server, uses Chromium and WebKit
at four primary phone viewports plus desktop, and adds installed stable Chrome
when available. `--full` adds landscape, 320/480 px boundaries, tablet smoke,
and wide desktop. `--site <directory-or-URL>` checks staged or deployed output.
JSON findings and screenshots remain ignored artifacts; record acceptance
findings in the roadmap ledger. Baseline mode observes current defects without
asserting that unimplemented phone behavior already passes. Subsequent stories
add their acceptance scenarios to the same bounded check.

`--mode navigation` checks every route/stage/reference link, Back, dismissal,
focus return, and target sizing. `--mode navigation-edges` checks orientation,
desktop/phone transitions, simulated safe-area padding, and no-JavaScript stage
links in both engines.

`--mode layout` checks collapsed/expanded geometry, all dashboards and 19 cards,
independent table scrolling, sample German/Chinese/Japanese titles, and 200%
text on the primary Android/iPhone profiles. Review its screenshots alongside
the results. `--profile <name>` isolates a matrix case when diagnosing a failure.

`--mode interaction` checks technology-sheet scrolling/dismissal/focus, phone and
desktop transitions, desktop hover/keyboard, native checklist labels, grouped
card controls, 44 px primary targets, save/reload, isolated reset, and denied
storage. Its enlarged landscape scenario exercises actual overflowing details.

- Use browser review for claims about presentation, navigation, responsive
  behavior, focus, persistence, or interaction.
- Review the reader-facing result before hardening editorial assertions.
- Use integrated browser tools for exploratory inspection and repository-local
  deterministic checks for recurring acceptance behavior.
- Do not add permanent browser automation for a one-time observation.

## Toolchain budget

ML-08 adds pinned `parse5` 8.0.1 and a pnpm lockfile solely for static authoring.
`build-site.mjs` preserves source-owned markup/facts and emits complete editions;
`localization-source.mjs` inventories annotated messages and
`validate-localization.mjs`/`test-localization.mjs` enforce freshness, coverage,
placeholders, escaping, factual identity and deterministic output. Authors run
these on source/catalog edits; ML-09 connects generation to CI. They replace
manual locale HTML copies and the disposable parser probe. Nothing under
`localization/`, `scripts/` or `node_modules/` is a deployed dependency.

ML-09 replaces manual staging with that generator. CI checks authoring contracts,
the generated site and the extracted ZIP. The deployment validator compares all
files against deterministic generation before retaining its English editorial,
recipe, image, license and dependency checks. Localization validation adds
enabled-locale metadata, root/prefix links and native-data factual parity.
`validate-localization-browser.mjs <fresh-output> [android|iphone|desktop]` uses
complete synthetic fixtures for switching/persistence, no-JS links, native
tooltip names and all four storage messages. It is an authoring test, not a
language release or a new deployed dependency. Real-device limits still apply.

`extract-terminology.mjs` is an explicitly invoked provenance refresh: it reads
only requested native names and retains ID/key/hash mappings. Its companion
`validate-terminology.mjs` verifies all consumed names and rank composition from
those snapshots without game access. These authoring-only tools replace the
one-time locale join; no locale source files or extraction dependencies deploy.

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
