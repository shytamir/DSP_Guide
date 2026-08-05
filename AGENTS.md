# AGENTS.md

This file defines how coding agents should work in this repository.

## 1. Core rule

Complete the requested task with the smallest coherent change that satisfies
its acceptance criteria.

Do not turn a bounded task into a repository-wide review. Do not search for
additional work after the task is complete. Optimize for correctness,
maintainability, and reviewability—not activity.

## 2. Instruction order

Follow, in order:

1. The current user prompt.
2. This `AGENTS.md`.
3. Repository documentation and conventions.
4. Existing implementation patterns.
5. General engineering judgment.

A specific instruction overrides a general one.

## 3. Product contract

This repository publishes the DSP Practical Progression Guide as a
framework-free static website.

Preserve these invariants unless the task explicitly changes one:

- the guide remains useful with every production card collapsed;
- cards explain production shape but do not create phase objectives or gates;
- phase targets are reference points, not permission to ignore visible
  shortages;
- optional routes explain opportunity and tradeoff without becoming mandatory;
- checklist state remains local to the reader's browser;
- the deployed site has no server-side code, accounts, analytics, cookies, or
  remote dependencies;
- technology names, recipes, prerequisites, and item relationships come from
  the retained runtime-derived data;
- Dark Fog coverage stays within the bounded RED-phase contract in
  `docs/PROJECT.md`.

Read `docs/PROJECT.md` before changing progression, navigation, card behavior,
guide data, or deployment behavior.

## 4. Scope

Inspect and modify only:

- files named in the task;
- files directly required to implement it;
- directly affected validation code;
- directly affected documentation.

Do not:

- fix unrelated defects;
- modernize nearby code;
- reorganize files without necessity;
- upgrade unrelated dependencies;
- perform broad cleanup;
- rewrite working code for style alone;
- expand the task because more work is visible.

Mention unrelated findings briefly in the final report. Do not fix them unless
they block the requested task.

## 5. Before editing

1. Run `git status --short`.
2. Inspect the directly relevant source and documentation.
3. Identify existing behavior and local conventions.
4. Determine the smallest viable implementation.
5. Identify the narrowest relevant validation.
6. Start editing once the task is sufficiently understood.

Do not repeatedly inspect the same files without a concrete unresolved
question. Resolve minor ambiguity from repository evidence. Ask only when a
missing decision materially changes the outcome.

## 6. Mutating versus non-mutating work

Treat requests to inspect, review, analyze, explain, or plan as non-mutating
unless they explicitly ask for changes.

Unless the prompt says `PLAN ONLY`, an explicit request to fix, implement,
author, update, or deploy is implementation work:

1. inspect;
2. implement;
3. validate;
4. repair failures caused by the change;
5. review the final diff;
6. commit only when requested;
7. push only when explicitly requested;
8. report after required Git operations succeed.

For non-mutating or `PLAN ONLY` tasks, do not modify, commit, or push.

## 7. Repository architecture

Keep these layers separate:

```text
index.html
    |-- assets/css/guide.css
    |-- assets/js/*.js
    |-- assets/data/*.json
    `-- assets/DSP_exported assets/
```

Use the existing responsibilities:

- `index.html`: semantic guide content and static references;
- `assets/css/guide.css`: presentation and responsive layout;
- `assets/js/`: independent navigation, card, tooltip, producer, and checklist
  behavior;
- `assets/data/`: runtime-derived technology and tooltip data used by the page;
- `scripts/`: deployment and guide-contract validation;
- `docs/`: current product, card, governance, and archived decision records;
- `dsp_universal_end_product_dag_v1_0/`: retained research provenance, not a
  deployed dependency.

Do not bury guide content in JavaScript, presentation rules in HTML, or
deployment-only material in the published package.

## 8. Toolchain and authoritative data

The project has no build step and no deployed package dependencies. Use Node.js
to run the committed validation scripts and an ordinary static web server for
browser testing.

Run the repository checks with:

```powershell
node scripts/validate-card-system.mjs
node scripts/validate-checklists.mjs
```

For a release-equivalent deployment check, stage only `index.html` and
`assets/`, then run `node scripts/validate-deployment.mjs <site-directory> .`.

When authoritative game knowledge is required:

- prefer the retained DAG and website data over memory or community shorthand;
- distinguish confirmed runtime-derived facts from practical interpretation;
- preserve the research package as provenance rather than a deployed input;
- use only authorized, unmodified game images covered by the management record;
- record uncertainty instead of presenting inference as fact.

## Environment Bootstrap

- Location: `artifacts/.runtime-tools/Activate-DspGuideTools.ps1` is the local Git-ignored environment bootstrap script.
- Purpose: dot-source the script to expose scoped safe-directory Git access plus the local runtimes, HTML authoring tools, validators, and Playwright browser cache without changing global configuration.
- Verified tooling: Git 2.44, ripgrep 15.2, Node 24.14, Python 3.12, HTML Validate 11.6.1, Prettier 3.9.6, jsdom 30.0.1, Cheerio 1.2.0, Playwright 1.62, Chromium headless shell, Chrome 151, Edge 151, and ffmpeg.

## 9. Implementation discipline

Prefer:

- minimal local patches;
- existing abstractions and conventions;
- semantic HTML, direct CSS, and small readable vanilla JavaScript;
- deterministic static validation;
- guide-aware data and content policies;
- focused validation;
- documentation that matches behavior.

Avoid:

- speculative abstractions;
- premature generalization;
- broad refactors hidden inside feature work;
- frameworks, bundlers, or remote runtime dependencies without a task-specific
  need;
- duplicate implementations;
- unnecessary compatibility layers;
- comments that merely restate code.

Preserve public anchors, card IDs, checklist storage keys, and deployed file
contracts unless the task explicitly changes them.

## 10. Data and publication discipline

Runtime-derived facts, practical interpretation, optional advice, and soft
reference paces are different categories. Do not convert one into another for
convenience.

When changing published data or contracts:

- update the website data and its JavaScript consumer deliberately;
- retain research provenance needed to validate relationships;
- update directly affected contract validators;
- change `VERSION` only as an intentional release decision;
- update `README.md`, `docs/PROJECT.md`, and the active card or management
  record when behavior or contracts change.

Do not copy archived requirements into the active product contract or treat
historical publication files as live website inputs.

## 11. Validation

Run the narrowest relevant check first:

1. run the directly affected contract validator;
2. fix failures caused by the change;
3. rerun the failed check;
4. run staged deployment or browser validation when justified;
5. review the final diff once.

Release validation must complete with zero errors. Do not claim presentation,
navigation, persistence, or responsive behavior from structural checks alone.

Presentation changes normally require headless Chromium validation and a
reviewed desktop screenshot. Check a narrow viewport when responsive behavior
is affected, while preserving the documented best-effort mobile policy.

If a required tool or authoritative external data source is unavailable,
report the check as skipped or blocked. Do not call it passed. Allow at most
two repair cycles for the same failure unless explicitly authorized.

## 12. Tests and documentation

Add or update tests when behavior changes and a focused deterministic test is
practical. Do not add broad test infrastructure for a small change.

Documentation must match actual behavior. Do not duplicate explanations or
rewrite documentation solely to change voice. Check affected links once after
documentation changes settle.

Do not commit:

- files under `artifacts/` or generated ZIP packages;
- raw correspondence, private player data, or unapproved assets;
- temporary diagnostics;
- editor, cache, or OS noise.

## 13. Git discipline

Do not overwrite, revert, reformat, or include unexplained user changes.

Before committing:

1. inspect `git status --short`;
2. inspect the final diff;
3. confirm only intended files changed;
4. run required validation;
5. check for secrets, private data, temporary files, and generated output.

Create one coherent commit per requested task unless instructed otherwise. Use
a concise commit message. Do not amend, rebase, reset, clean, stash,
force-push, or rewrite history unless explicitly instructed.

Push only when explicitly requested.

### Routine Git access recovery

This Windows checkout may be owned by the desktop or Administrators account
while an agent command runs under a sandbox identity. If Git reports
`detected dubious ownership`, do not alter global Git configuration. Scope the
exception to each command:

```powershell
$repo = (Resolve-Path '.').Path.Replace('\', '/')
git -c "safe.directory=$repo" status --short
```

Use the same `-c "safe.directory=$repo"` form for other Git commands in that
turn.

If Git cannot create `.git/index.lock`, rerun only that Git operation under the
authenticated desktop context. Do not change repository permissions.

Before editing or pushing, fetch or use `git pull --ff-only` when the clean
local branch may be behind its remote. Never resolve divergence with a force
push or history rewrite.

The sandbox-visible `gh auth status` may report a stale GitHub CLI token even
when the repository's Git credential manager and GitHub connector have valid
push access. Do not log out, replace credentials, or start an interactive
login unless the user asks. For a direct push requested by the user, first
validate repository permission through the connector or a no-change
`git push --dry-run`, then use ordinary `git push`. If authenticated Git push
also fails, stop and report the exact blocker.

## 14. GitHub and CI

Do not create branches, pull requests, releases, tags, issues, or workflow
runs unless the prompt requests them or they are necessary to the requested
publish flow.

Check GitHub Actions only when the prompt requires CI results in the final
report. Otherwise, do not poll CI or delay completion for it.
When workflow validation is required, one 60-second wait is permitted before checking GitHub Actions results.

Never expose tokens, credential-helper output, or secrets in logs or reports.

## 15. Anti-churn and iteration limits

Do not:

- repeatedly reopen the same files;
- repeat successful commands;
- perform equivalent searches;
- reconsider settled decisions without new evidence;
- edit, revert, and recreate substantially the same change;
- restart from first principles after implementation begins;
- continue after acceptance criteria and checks pass;
- search for more work after completion.

Unless explicitly authorized:

- use one relevant inspection pass;
- use one implementation pass;
- allow at most two repair cycles for the same failure;
- perform one final diff review;
- run each successful validation command once.

## 16. Stop conditions

Stop and report when:

- completion requires changes outside scope;
- the task conflicts with repository architecture or explicit instructions;
- required credentials, services, dependencies, or data are unavailable;
- user changes prevent safe modification;
- validation reveals an unrelated repository-wide failure;
- two repair cycles fail to resolve the same blocker;
- the outcome requires a major design decision not covered by the prompt;
- committing or pushing would include unrelated work.

Do not hide blockers by broadening scope. Do not claim completion while
acceptance criteria remain unmet.

## 17. Definition of done

A task is complete when:

- the requested behavior or artifact exists;
- the change stays within scope;
- relevant checks pass or skips are reported accurately;
- documentation is updated when required;
- the final diff contains only intentional changes;
- no known defect introduced by the change remains;
- the work is committed when requested;
- the commit is pushed when required;
- the final report is accurate.

Once complete, stop.

## 18. Final report

Report:

### Completed

A concise description of the result.

### Changed

- files created, modified, or removed;
- significant behavioral changes.

### Validation

List each command actually run and its result. Do not claim checks that were
not run.

### Git

- branch;
- commit hash, or `Not committed — explicitly not requested`;
- commit message, when committed;
- push result: successful, failed, or not requested.

### Residual issues

List only known limitations, blockers, or relevant follow-up deliberately left
out of scope. If none, say:

`None known within the requested scope.`

Keep the report factual and concise.
