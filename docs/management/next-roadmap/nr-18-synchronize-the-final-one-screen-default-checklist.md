# NR-18 — Synchronize the final One-Screen Default Checklist

**Status:** Implemented and technically validated on 2026-08-27. Pending owner acceptance.

**Dependency group:** E — Final synchronization
**Assessed workload:** Medium
**Class:** Structural change

## Reader need

As a reader using the one-screen route, I want a compact summary derived from accepted phase gates so it does not preserve outdated methods, optional work, or planning-reference figures.

## Authoritative evidence

Every preceding accepted story supplies the final route structure and phase gates. The archived bounded checklist correction is superseded by this comprehensive synchronization.

## Intended outcome

Rebuild the default checklist last, preserving browser state where practical and representing the Receiver bridge exactly once.

## In-scope surfaces

- One-Screen Default Checklist wording and ordering
- Checklist IDs, storage keys, and deliberate aliases
- DYSON-to-PHOTON Receiver bridge condition
- Directly affected checklist and persistence validators

## Approved specification

Defer implementation until every preceding accepted content and structural
change has been implemented. The One-Screen Default Checklist is a derived
summary of the completed default route, not an independent source of phase
requirements. Rebuild it from the final phase gates rather than incrementally
editing its historical wording.

Apply these synchronization rules:

- copy outcomes from each final **Ready to move on when** gate, not methods;
- omit research recommendations, tutorials, troubleshooting steps, optional
  optimizations, and card reference targets unless they are themselves an
  accepted phase gate;
- keep SPHERE, WARP, and LOGISTICS outside the default-route checklist;
- use the fewest checks that prove each phase is complete;
- use **cube** in reader-facing language and reserve **Matrix** for literal
  technology names;
- represent the Receiver and Antimatter bridge exactly once at the DYSON →
  PHOTON boundary;
- audit every final checklist claim against the section that owns it; and
- preserve existing browser checklist state with deliberate storage-key
  aliases where practical after final wording is known.

The restructured DYSON checklist must follow DYSON's transition outcomes, not
its planning-reference figures. It should require that Solar Sail production
and the Ejector launch infrastructure are automated and operating, and that
the resulting live Dyson generation is useful enough to proceed to the
Receiver bridge. Do not place the `405/min` Solar Sail reference or the
60-Ejector buffer reference in the One-Screen Default Checklist. Those figures
remain reference material in their approved DYSON locations and are not phase
gates.

The archived
[`one-screen-checklist-correction-story.md`](../../archive/one-screen-checklist-correction-story.md)
preserves an earlier decision to
replace obsolete `517.5/min` and 80-Ejector checklist figures with `405/min`
and 60. The comprehensive synchronization supersedes that narrow correction:
remove the obsolete exact figures without replacing them with new exact
figures. The archived record remains decision history; do not schedule or
implement it separately.

The exact Receiver-bridge checklist placement may be selected after the
canonical bridge exists. This is a final presentation decision, not a blocker
to the synchronization contract: bridge conditions must appear once, remain
mandatory on the default route, and must not be duplicated under both DYSON
and PHOTON.

## Non-goals and preserved contracts

- Do not begin until every preceding accepted content and structural story is implemented.
- Do not treat the checklist as an independent source of requirements.
- Do not include SPHERE, WARP, LOGISTICS, tutorials, troubleshooting, optional optimizations, or reference-only figures.
- Do not schedule the archived bounded correction separately.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- Every check derives from the final owning phase gate.
- The checklist contains the fewest checks needed to prove each phase complete.
- The Receiver and Antimatter bridge appears exactly once.
- No 405/min, 517.5/min, 60-Ejector, or 80-Ejector planning figure becomes a checklist gate.
- Existing reader state is preserved with deliberate aliases where practical.

## Validation

**Tier:** 2 — Experience

Run the checklist contract validator and directly affected structural checks,
then verify persistence, reset behavior, aliases, route separation, and desktop
presentation on the deployed development Pages site in Chromium.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
