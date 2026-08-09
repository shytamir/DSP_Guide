# Active Roadmap

**Status:** Owner-approved for ordered implementation on 2026-08-09.

This roadmap returns the project from maintenance mode to active work. It
implements the two approved correction stories in order, then converts the
remaining design concerns into the next roadmap update.

## Execution order

### 1. Align the opening route with unified BLUE

**State:** Ready for implementation.

Implement Story 1 in
[`guide-corrections-user-stories.md`](guide-corrections-user-stories.md), run
its Tier 1 validation, and present the result for owner acceptance.

Do not begin Story 2 until Story 1 is explicitly accepted.

### 2. Refine DYSON reference authority

**State:** Pending Story 1 acceptance.

Implement Story 2 in
[`guide-corrections-user-stories.md`](guide-corrections-user-stories.md). Obtain
the documented owner checkpoint before hardening editorial assertions, then
complete Tier 2 validation and present the reader-facing result for acceptance.

### 3. Prepare the next roadmap update

**State:** Pending acceptance of Stories 1 and 2.

Review
[`pending-guide-design-leftovers.md`](pending-guide-design-leftovers.md) and:

1. convert concerns with settled outcomes into bounded, ordered stories;
2. retain unresolved product decisions in a separate leftovers record;
3. update `ROADMAP.md` with the next proposed implementation sequence;
4. present the next roadmap for owner approval before implementation.

This step authorizes planning only. It does not authorize implementation of a
leftover concern.

## Operating rules

- Work on one roadmap story at a time.
- Preserve each story's scope, non-goals, and validation tier.
- Passing validation does not imply owner acceptance.
- Update `docs/PROJECT.md` only at meaningful roadmap milestones.
- Commit, push, release, complete, or archive work only when separately
  authorized.

## Completion

This roadmap is complete when Stories 1 and 2 are owner-accepted and the next
roadmap update has been prepared for approval. Archive this record only after
an explicit owner instruction.
