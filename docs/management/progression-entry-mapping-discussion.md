# ILS, WARP, and LOGISTICS Entry Mapping

**Status:** Completed under [`ROADMAP.md`](ROADMAP.md). All three stories are
owner-accepted.

## Corrected model

Expedition shape and progression status are independent:

| Section   | Progression status             | Role                                                             |
| --------- | ------------------------------ | ---------------------------------------------------------------- |
| ILS       | Mandatory                      | Core RED-to-YELLOW transition executed across multiple locations |
| WARP      | Optional expedition capability | Rare-resource deployment and later automated interstellar import |
| LOGISTICS | Optional capability            | Replacement logistics hardware for repeatable expansion          |

ILS is a mandatory main-route phase. WARP is optional. LOGISTICS is optional
without being an expedition.

## Existing mapping and evidence

### ILS

- The default route, rail, progress index, RED handoff, and ILS `Next` prose all
  establish `RED -> ILS -> YELLOW`.
- Archived structural work deliberately consolidated FLIGHT, TITANIUM, and ILS
  into this chronological phase while preserving `#flight` and `#titanium`.
- The accepted ILS-to-GREEN handoff treats its research and transport hardware
  as required progression work.

ILS has no interphase-routing defect. Its remaining concern is resumption
inside a long mandatory phase.

### WARP

- The document places WARP after WHITE, while the Quick Progress Index offers
  it after PURPLE.
- ILS links to WARP as advance guidance when local Titanium and Silicon
  reserves look inadequate.
- PURPLE links to WARP as a deliberate rare-resource shortcut while retaining
  GREEN as the default route.
- WARP says it has no fixed entry or exit and contains no outgoing phase link.
- The first Warper recipe is unlocked by Gravitational Wave Refraction and
  consumes one Graviton Lens per Warper.
- Gravity Matrix unlocks the efficient recipe that converts one green cube
  into eight Warpers.
- Vessel warp also requires the later carrier and drive upgrades documented by
  the retained technology data.

WARP therefore has an early preparation/deployment context and a later cheap
automation context.

### LOGISTICS

- The document places LOGISTICS after WARP, while the Quick Progress Index
  describes it as useful from ILS onward.
- GREEN links to it when material movement becomes the larger problem.
- WHITE links to it after Mission Completed.
- ILS contains no direct LOGISTICS entry link.
- The section assumes the reader already used stations during progression and
  now wants their replacement stock automated.

LOGISTICS is a reusable capability whose value depends on repeated expansion,
not a gate reached at one fixed phase.

## Settled structural constraints

- Preserve ILS as mandatory phase 3 with its existing route and compatibility
  anchors.
- Keep WARP and LOGISTICS outside the default route and grouped at the end of
  the document for direct and repeated reference.
- Present WARP and LOGISTICS as optional capabilities rather than numbered
  continuations of the mandatory route.
- Preserve `#warp`, `#logistics`, public phase links, and checklist storage
  keys.
- Reuse the three WARP stage anchors approved in
  [`expedition-intra-navigation-user-stories.md`](expedition-intra-navigation-user-stories.md);
  do not create competing contextual destinations.
- Keep navigation stateless. Do not record an originating phase or add saved
  branch state.
- Use contextual entry links to state why the optional capability is useful.
- Direct-anchor visitors must receive a complete orientation without an
  assumed origin.

## Story 1 — Separate optional capabilities from main-route numbering

**Class:** Structural navigation change.

**State:** Completed and owner-accepted on 2026-08-09.

As a reader scanning the guide structure, I want WARP and LOGISTICS presented
as optional capabilities rather than phases after completion so that their
numbering does not imply one mandatory entry time.

### Scope

- Preserve the numbered mandatory route through WHITE and Mission Completed.
- Remove WARP and LOGISTICS from the mandatory numeric sequence while keeping
  them in their current end-of-document reference location.
- Group and label them consistently as optional capabilities in navigation,
  the Quick Progress Index, their headings, and the one-screen checklist.
- Preserve ILS as mandatory phase 3.
- Update directly affected navigation and structural validation.

### Non-goals

- Do not reorder main-route phases or move optional sections into phase bodies.
- Do not add branch persistence, history tracking, or new checklist state.
- Do not change WARP or LOGISTICS instructions.
- Do not address intra-navigation inside ILS or WARP.

### Acceptance

- The numbered route ends with WHITE and Mission Completed.
- WARP and LOGISTICS remain directly navigable and visibly optional without
  receiving mandatory phase numbers.
- ILS remains between RED and YELLOW everywhere the main route is shown.
- Existing public anchors and checklist storage keys remain stable.
- Tier 2 validation includes directly affected contracts and reviewed desktop
  navigation rendering.

## Story 2 — Map WARP's two contextual entry stages

**Class:** Structural navigation refinement.

**State:** Completed and owner-accepted on 2026-08-09.

As a reader considering interstellar resources, I want WARP links to identify
the relevant deployment stage so that an optional detour opens at the part I
can use without displacing my main-route phase.

### Scope

- Preserve the ILS resource-pressure reminder as advance guidance to the WARP
  overview.
- Direct the PURPLE shortcut cue to `#warp-prepare`.
- Expose the post-GREEN efficient-Warper context at `#warp-automate`.
- Add stable internal destinations only where needed for those two contexts.
- Give early-route readers an explicit GREEN continuation without claiming a
  fixed return phase for later direct visitors.

### Non-goals

- Do not make WARP mandatory or insert it into the default route.
- Do not move the Space Warper production card out of GREEN.
- Do not add origin tracking, browser-history behavior, or saved state.
- Do not create or rename WARP stage anchors; reuse the intra-navigation
  contract.
- Do not rewrite rare-resource or outpost guidance beyond affected handoffs.

### Acceptance

- Each retained WARP entry cue states why the section is useful and targets the
  relevant stage.
- The early path provides a clear continuation to GREEN.
- Later and direct visitors are not assigned a false return phase.
- `#warp` remains the stable section anchor.
- Tier 2 validation covers anchors, navigation, and reviewed desktop flow.

## Story 3 — Align LOGISTICS entry cues with repeat expansion

**Class:** Editorial navigation refinement.

**State:** Completed and owner-accepted on 2026-08-09.

As a reader repeatedly deploying logistics networks, I want LOGISTICS offered
when replacement hardware becomes useful so that technical availability is not
mistaken for a new phase objective.

### Scope

- Replace the Quick Progress Index's timing shorthand with a reader-observable
  repeated-expansion trigger.
- Keep the established GREEN and post-completion entry cues consistent with
  that trigger.
- Orient direct visitors without assuming a current main-route phase.
- Preserve the section's end-of-document reference location and `#logistics`.

### Non-goals

- Do not add a LOGISTICS gate or default-route step.
- Do not add an ILS handoff merely because the technology is available.
- Do not change logistics recipes, targets, cards, diagnostics, or checklist
  behavior.
- Do not add return-state tracking.

### Acceptance

- Every LOGISTICS entry describes an optional response to repeated expansion.
- The Quick Progress Index no longer implies that ILS completion alone creates
  a LOGISTICS objective.
- GREEN and post-completion links remain useful and consistent.
- Direct navigation remains complete and `#logistics` remains stable.
- Tier 2 validation covers directly affected links and reviewed desktop flow.

## Roadmap order

Implement Story 1 before the two entry refinements. Stories 2 and 3 remain
separate because WARP is a staged expedition while LOGISTICS is reusable
automation guidance. No release is included.
