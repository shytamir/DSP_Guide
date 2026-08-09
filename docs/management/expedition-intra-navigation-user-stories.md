# Expedition Intra-Navigation Stories

**Status:** Approved for ordered implementation under
[`ROADMAP.md`](ROADMAP.md). WARP follows acceptance of all three progression
entry stories.

## Reader problem

ILS and WARP each contain three major stages inside one long section. The phase
rail can return a reader to the expedition, but it cannot return them to the
major stage they were pursuing.

ILS is the mandatory `RED -> ILS -> YELLOW` transition. WARP is an optional,
leaner expedition without ILS's haulback specification or finite component-line
instructions. They share a three-stage navigation behavior but must retain
their different entry conditions and requirements.

## Settled shared contract

- Resume at one of three major stages, not at subordinate headings or
  individual checklist actions.
- When ILS or WARP is active, a secondary stage rail projects from that phase's
  tab in the existing phase strip.
- The stage rail presents only the visible labels `I`, `II`, and `III`.
- Each control has an accessible name and title that identifies the expedition
  and stage purpose.
- The visible stage follows scroll position using the existing phase-navigation
  model; it does not create a second navigation system elsewhere on the page.
- Stage selection is not stored in localStorage, sessionStorage, cookies, or a
  checklist key. Normal phase entry and refresh begin at the phase top.
- Stable stage anchors remain valid for direct and contextual navigation. An
  explicit stage fragment is an address, not stored progress.
- Each stage states the condition that makes it actionable and the requirement
  or outcome needed before advancing.
- Public phase anchors, checklist storage keys, and the phase rail's existing
  behavior remain stable.
- Desktop is the presentation target. Narrow behavior must remain accessible
  but receives no mobile-polish expansion.

## Anchor contract

| Expedition | Stage | Stable anchor    | Meaning                                               |
| ---------- | ----- | ---------------- | ----------------------------------------------------- |
| WARP       | I     | `#warp-prepare`  | Prepare the expedition and limited Warper supply      |
| WARP       | II    | `#warp-outpost`  | Establish the remote source outpost                   |
| WARP       | III   | `#warp-automate` | Automate the vessel route with cheap Warpers          |
| ILS        | I     | `#flight`        | Become flight-ready and prepare the departure         |
| ILS        | II    | `#titanium`      | Build the outpost and complete the specified haulback |
| ILS        | III   | `#ils-automate`  | Complete the finite lines and automate the route      |

The WARP anchors are also the only stage destinations used by the contextual
entry story in
[`progression-entry-mapping-discussion.md`](progression-entry-mapping-discussion.md).

## Story 1 — Prove the shared stage rail with WARP

**Class:** Structural navigation change.

**State:** Pending Progression Entry Story 3 owner acceptance.

As a reader pursuing the optional WARP expedition, I want its three major
stages exposed beside the active WARP rail tab so that I can return to the
relevant deployment step without rereading the whole section.

### Scope

- Add the reusable three-stage secondary rail behavior to the existing phase
  navigation.
- Add the three approved WARP anchors to its existing numbered major headings.
- Show `I`, `II`, and `III` only while WARP is the active phase.
- Track the active WARP stage as the reader scrolls.
- Give every Roman-numeral control a descriptive accessible name and title.
- Make each WARP stage's entry condition and completion requirement explicit:
  preparation and a justified destination; a functioning remote source
  outpost; then the later technology and supply needed for automated vessels.
- Add directly affected structural validation and desktop browser review.

### Non-goals

- Do not make WARP mandatory or change its optional entry timing.
- Do not change rare-resource facts, recipes, loadouts, outpost instructions,
  or production targets.
- Do not implement the separate contextual-entry story beyond using its shared
  anchors.
- Do not store an active stage or change checklist persistence.
- Do not implement ILS stage navigation in this story.

### Acceptance

- The active WARP rail tab exposes one projecting `I / II / III` stage rail.
- Each control reaches its approved heading and clearly identifies that stage
  to assistive technology.
- The active Roman numeral follows the major stage in view.
- Entering or refreshing the ordinary `#warp` phase route starts at the phase
  top; no saved stage is restored.
- Direct stage anchors work and `#warp` remains stable.
- The control remains usable at a narrow viewport without adding mobile polish.
- Tier 2 validation includes directly affected contracts and reviewed desktop
  Chromium rendering.

## Story 2 — Apply the shared stage rail to mandatory ILS

**Class:** Structural navigation change.

**State:** Pending Expedition Intra-Navigation Story 1 owner acceptance.

As a reader completing the mandatory ILS transition, I want the same three-stage
rail to distinguish departure, haulback, and automation so that I can resume
the longer expedition without losing its protected material plan.

### Scope

- Apply the accepted WARP stage-rail behavior to ILS.
- Reuse `#flight` for Stage I and `#titanium` for Stage II.
- Add `#ils-automate` to the existing third major heading.
- Show `I`, `II`, and `III` only while ILS is the active phase and track the
  major stage in view.
- Give every control a descriptive accessible name and title.
- Keep the stage boundaries explicit:
  - Stage I ends with flight readiness and the departure requirements;
  - Stage II contains the remote build, specified haulback, and return
    conditions;
  - Stage III contains the finite component-line instructions and finishes
    with an automated interplanetary route.
- Extend directly affected structural validation and desktop browser review.

### Non-goals

- Do not change ILS's mandatory position between RED and YELLOW.
- Do not change research order, material totals, haulback quantities, finite
  production instructions, cards, or phase completion criteria.
- Do not replace the accepted WARP control with an ILS-specific variant.
- Do not store an active stage or change checklist persistence.
- Do not add anchors for subordinate headings or individual actions.

### Acceptance

- The active ILS rail tab exposes the same projecting `I / II / III` control
  accepted in Story 1.
- `#flight` and `#titanium` retain their compatibility behavior, and
  `#ils-automate` reaches Stage III.
- The active Roman numeral follows the major stage in view.
- Stage cues preserve the distinction between departure preparation, the
  specified haulback, and finite-line automation.
- Entering or refreshing the ordinary `#ils` phase route starts at the phase
  top; no saved stage is restored.
- Checklist state, public phase anchors, and the RED-to-YELLOW route remain
  unchanged.
- Tier 2 validation includes directly affected contracts and reviewed desktop
  Chromium rendering.

## Roadmap order

Implement and obtain owner acceptance for WARP first. ILS may begin only after
the shared WARP control is accepted. No release is included.
