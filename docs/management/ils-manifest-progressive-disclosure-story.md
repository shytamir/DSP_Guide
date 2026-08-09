# ILS Manifest Progressive-Disclosure Story

**Status:** Approved and tracked, but held. Implementation may begin only
after ILS intra-navigation has been implemented and owner-accepted. This story
is not part of the current roadmap.

## Let the ILS manifest orient while each stage owns its figures

**Class:** Structural change.

As a reader completing the mandatory ILS expedition, I want the top manifest
to show the three stage outcomes while each stage presents its own exact
requirements so that I can understand the whole mission without retaining
later-stage numbers before they are actionable.

### Reader problem

The ILS expedition manifest currently exposes departure requirements, exact
haulback quantities, the finite yellow-cube spending split, and final hardware
counts before Stage I begins. The information is necessary, but presenting all
of its figures at the phase entrance competes with the reader's current stage.

### Dependency hold

Do not implement this story until the ILS portion of
[`expedition-intra-navigation-user-stories.md`](expedition-intra-navigation-user-stories.md)
has been implemented and owner-accepted. The accepted stage anchors and rail
must define the final stage boundaries before the manifest is reorganized.

### Scope

- Reorganize the top ILS manifest around the outcomes of Stages I, II, and III.
- Keep the manifest concise and free of exact cargo, research-spending, and
  hardware figures.
- Place every existing exact requirement in the stage where it becomes
  actionable:
  - departure requirements in Stage I;
  - haulback quantities and return conditions in Stage II;
  - finite research spending and final hardware counts in Stage III.
- Preserve the manifest as a whole-mission orientation surface rather than
  replacing it with another procedure.
- Update directly affected validation or management documentation.

### Non-goals

- Do not change any authoritative quantity, research order, recipe, loadout,
  stage boundary, or ILS completion requirement.
- Do not change ILS's mandatory position between RED and YELLOW.
- Do not redesign or reimplement the accepted expedition stage rail.
- Do not add new stages, subordinate navigation, or persistence.
- Do not include release work or add this story to the roadmap until the owner
  schedules it after the dependency hold clears.

### Acceptance

- The top manifest names the outcome of each accepted ILS stage without exact
  cargo, cube-spending, or hardware figures.
- Every removed figure remains present once, in the stage where the reader
  needs to act on it.
- Stage I owns departure readiness, Stage II owns the specified haulback, and
  Stage III owns finite spending, hardware, and route automation.
- The mandatory mission sequence and all accepted stage anchors remain
  unchanged.
- The guide remains usable when every production card is collapsed.
- Tier 1 content validation and a focused desktop reading review confirm that
  the reorganized manifest and stage rail work as one information hierarchy.
