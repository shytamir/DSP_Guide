# Work Management

**Status:** Active governance.

Use this process to keep work reader-centered, bounded, and reviewable. A
specific approved story may override this general process.

## Management principles

1. Classify the work before approving implementation.
2. Name owner decisions that must be made before implementation continues.
3. Separate technical completion from reader acceptance.
4. Require justification for new committed tooling or global validation.
5. Treat management records as contracts, not implementation journals.
6. Release coherent, owner-validated product states.

## Work classes

| Class | Typical scope | Required preparation |
| --- | --- | --- |
| Bounded correction | One settled defect, fact, label, link, or local rule | Confirm the defect and authoritative correction |
| Editorial refinement | Reader-facing explanation within settled structure | Define reader problem, retained facts, and affected layer |
| Structural change | Navigation, phase shape, card behavior, or information hierarchy | Approve the proposed structure and compatibility boundaries |
| Data or research change | Technology, recipe, prerequisite, or item relationship | Identify authoritative evidence and distinguish fact from interpretation |
| Tooling or deployment change | Validators, materializers, dependencies, bootstrap, or publication | Define the durable contract, invocation point, and toolchain cost |
| Release work | Versioned publication of accepted changes | Confirm scope, validation evidence, and owner acceptance |

Do not combine classes merely because they touch the same file. Split work
when factual, structural, editorial, or tooling decisions can be reviewed
independently.

## Story contract

An approved story should state only what is needed to implement and review it:

- reader or maintenance need;
- authoritative evidence;
- intended outcome;
- in-scope files or surfaces;
- non-goals and preserved contracts;
- unresolved owner decisions;
- acceptance evidence and validation tier;
- whether a release is included.

Complex stories should identify separate checkpoints for factual modeling,
information architecture, condensed presentation, expanded presentation, or
tooling changes when those decisions are not already settled.

## Lifecycle

1. **Investigate.** Keep unsettled analysis non-mutating or in an untracked
   working note.
2. **Approve.** Create one active record after the problem, scope, and decision
   authority are clear.
3. **Implement.** Work only within the approved story and use the narrowest
   relevant validation.
4. **Review.** Present technical evidence and reader-facing results. Passing
   checks does not imply acceptance.
5. **Decide.** The owner may request refinement, accept the result, or stop the
   work.
6. **Close.** Only after explicit acceptance, update current status and archive
   the completed record.

Do not mark work completed, accepted, owner-validated, or archived by
inference. A rejected pass may receive a separate audit when it preserves a
reusable lesson; ordinary iteration belongs in the active record or working
tree.

## Status and release discipline

- Update `docs/PROJECT.md` when work is activated, materially rescoped,
  blocked, accepted, or archived—not after every implementation pass.
- Keep one coherent active record per requested outcome.
- Do not use commits as substitutes for owner-review checkpoints.
- Create a new release only for a coherent accepted product state.
