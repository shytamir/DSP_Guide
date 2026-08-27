# NR-14 — Refine WARP expedition framing and route support

**Status:** Draft for owner review. The outcome comes from the owner-approved
next roadmap, but this decomposed story does not authorize implementation.

**Dependency group:** D — Optional paths and support
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a reader considering an interstellar detour, I want WARP framed as an optional solution to a named bottleneck with clear expedition capabilities and practical route-strengthening choices.

## Authoritative evidence

The existing three-stage structure, route figures, Warper recipes, rare-resource comparison, and completion gate remain accepted.

## Intended outcome

Replace distant mission language and add the approved survey, packing, catch-up, and carrier-capacity guidance without expanding WARP's scope.

## In-scope surfaces

- WARP Mission brief
- Expedition capability table
- Stage II Pack table
- Stage III route-strengthening guidance
- Named expedition technology wording

## Approved specification

Keep WARP's three-stage structure, rare-resource comparison, Warper recipes,
route figures, and completion gate. Refine the mission framing and supporting
references without expanding the capability's scope.

Replace the distant Mission brief with this player-facing treatment:

> A useful rare resource is waiting beyond your home system. Choose one that
> removes work from a factory line you already care about, pack a small
> outpost, and fly there yourself. Build the source, bring the first load home,
> then replace the personal cargo run with Logistics Vessels when green cubes
> make Warpers cheap.
>
> WARP is a shortcut, not a required detour. Make the trip when you can name
> the problem it will solve.

Retain the existing warning that the trip should solve a named bottleneck
rather than follow the attraction of the cluster map.

Rename the capability table's first column from **Warp capability** to
**Expedition capability** and present these three rows in stage order:

1. **Nearby survey:** reveal nearby systems and their resources before choosing
   a destination — Cosmic Exploration Lv3.
2. **Mecha warp:** let Icarus scout, build the outpost, and carry the first load
   home — Drive Engine Lv4.
3. **Vessel warp:** replace the personal cargo trip with an automated route —
   Logistics Carrier Engine Lv4.

Add one row to the Stage II **Pack** table:

> **1,000 Foundation** — an optional stack for flattening awkward terrain
> around veins and making room for the source outpost.

Keep the purpose explicitly optional. Do not imply that every resource world
should be paved.

In Stage III, place a short Carrier Capacity recommendation after the initial
fleet instructions and before the existing route-scaling advice:

> **Long route still falling behind?** Logistics Carrier Capacity lets every
> Vessel bring more material home. It is a powerful optional multiplier for a
> distant route, not a requirement for turning the route on.

Present route strengthening in this practical order: add Vessels while station
slots remain; improve Carrier Capacity when each long trip needs to accomplish
more; expand the source only when the remote buffer cannot remain full.

Use catch-up wording for the named expedition technologies: ILS proves Cosmic
Exploration Lv2, while GREEN proves Gravitational Wave Refraction. Stage
requirements such as Cosmic Exploration Lv3, Drive Engine Lv4, and Logistics
Carrier Engine Lv4 must say **continue through** the target rank so skipped
optional upgrades cannot become hidden assumptions.

## Non-goals and preserved contracts

- Do not change WARP's three stages, route figures, recipes, comparison table, or completion gate.
- Do not imply that every rare resource or world should be used.
- Do not make Foundation or carrier-capacity upgrades mandatory.
- Do not hide skipped earlier upgrades as assumptions.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The Mission brief presents WARP as an optional bottleneck-solving expedition.
- The capability table contains the three approved rows in stage order.
- The Pack table offers 1,000 Foundation as explicitly optional.
- Route strengthening follows Vessels, optional capacity, then source expansion.
- Named technologies use catch-up wording through exact ranks.

## Validation

**Tier:** 2 — Experience

Run directly affected content and navigation checks, then review the three-stage
flow, tables, and optionality language on the deployed development Pages site in
desktop Chromium.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
