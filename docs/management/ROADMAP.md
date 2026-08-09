# Active Roadmap

**Status:** Icon-placement implementation active on 2026-08-09. Story 1 is
ready for owner acceptance.

This roadmap implements the three approved stories in
[`prose-icon-placement-discussion.md`](prose-icon-placement-discussion.md) in
order. The earlier guide-correction sequence is complete and preserved in
[`docs/archive/guide-corrections-user-stories.md`](../archive/guide-corrections-user-stories.md).

## Execution order

### 1. Prevent icon growth outside approved surfaces

**State:** Active; implementation and Tier 1 validation complete, awaiting
owner acceptance.

Story 1 constrains the existing materializer and its directly affected check
without removing icons from `index.html` or adding a dependency.

The tooling result and Tier 1 evidence are ready for owner acceptance. Do not
start cleanup before that decision.

### 2. Remove icons from narrative and action surfaces

**State:** Pending Story 1 owner acceptance.

Implement Story 2 in the icon-placement record. Apply the settled placement
policy only to its prose, dashboard, checklist, and heading surfaces, then
complete its Tier 2 presentation review.

### 3. Remove icons from card Operating Note prose

**State:** Pending Story 2 owner acceptance.

Implement Story 3 in the icon-placement record. Keep the rest of the approved
card icon system unchanged, then complete its card contracts and Tier 2
expanded-card presentation review.

## Parallel planning boundary

Analysis and story preparation may continue in
[`pending-guide-design-leftovers.md`](pending-guide-design-leftovers.md) and
the proposed navigation record while the icon stories are implemented. That
planning does not authorize implementation or alter this execution order.

## Operating rules

- Work on one roadmap story at a time.
- Obtain explicit owner acceptance before advancing to the next story.
- Preserve each story's scope, non-goals, placement policy, and validation
  tier.
- Passing validation does not imply owner acceptance.
- No release is included.
- Commit, push, complete, or archive work only when separately authorized.

## Completion

This roadmap is complete when all three icon stories are owner-accepted.
Archive or replace it only after an explicit owner instruction.
