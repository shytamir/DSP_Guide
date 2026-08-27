# NR-08 — Assign PURPLE-owned research and bounded upgrades

**Historical status:** Owner-accepted and archived on 2026-08-27.

**Dependency group:** B — Early and mid-route guidance
**Assessed workload:** Medium
**Class:** Data or research change

## Reader need

As a reader stabilizing purple production, I want research that belongs to PURPLE and supports its buildout without pulling GREEN's Deuterium and fusion work forward.

## Authoritative evidence

Use retained prerequisites and costs. The three-technology purple unlock is the only research required to begin cube production; GREEN owns Collider and fusion preparation.

## Intended outcome

Install the approved PURPLE gate, buildout, logistics, resource-horizon,
stopping-rank, and discard guidance with rank-accurate technology tooltips.

## In-scope surfaces

- PURPLE dashboard Research first groups
- Visible PURPLE research explanation
- Phase gate and discard-rule language
- Directly affected technology tooltips and research contracts
- The 163 retained higher-rank technology records whose base names previously
  omitted their rank, plus starting-rank metadata required to label their
  prerequisite edges accurately

## Approved specification

Keep PURPLE focused on work that unlocks or supports PURPLE. Deuterium,
Miniature Particle Colliders, and fusion-power preparation do not unblock this
phase and belong in GREEN, where their production and power requirements
become current concerns.

Preserve the dashboard's three-group surface pattern:

1. **Purple gate:** High-Strength Material → Particle Control → Information
   Matrix.
2. **Buildout:** Mecha Core Lv3, Mechanical Frame Lv4, Communication Control
   Lv4, Drone Engine Lv3, Energy Circuit Lv2, and Mass Construction Lv4.
3. **Logistics:** Logistics Carrier Engine Lv2 and Logistics Carrier Capacity
   Lv2.

The three-technology purple unlock is the only research required before
purple-cube production can begin. The prescribed buildout can catch up any
YELLOW stopping ranks the player discarded, then stop at the ranks listed
above. Explain the rejected higher point in one short sentence:

> Stop there. The next shared buildout stopping point would consume 20,800
> cubes in total, including purple cubes needed by GREEN, so the guide rejects
> it.

Stop Logistics Carrier Engine and Logistics Carrier Capacity at Lv2. Explain
the rejected higher point in one short sentence:

> The next pair of carrier ranks would consume another 4,800 cubes in total
> without being required for PURPLE's starter-system routes.

Do not add a fourth resource group to the dashboard. In the visible **Research
first** prose:

- explain that High-Strength Material unlocks Carbon Nanotubes, Particle
  Control unlocks Particle Broadband, and the established Processor branch
  completes the Information Matrix unlock;
- explain how the selected Mecha Core, Mechanical Frame, Communication
  Control, Drone Engine, Energy Circuit, and Mass Construction ranks support
  PURPLE's wide construction job;
- explain how the selected carrier Engine and Capacity ranks support PURPLE's
  growing interplanetary supply; and
- recommend continuing Vein Utilization through Lv2 as a visible prose-only
  resource-horizon improvement. YELLOW may have discarded Lv1. Stop at Lv2
  because the next rank begins consuming purple cubes.

Keep the research prescription, phase gate, and discard rule visibly distinct:

- **Required to begin PURPLE:** complete the three-technology purple unlock.
- **Prescribed while purple stabilizes:** work through the bounded buildout,
  logistics, and Vein Utilization recommendations above.
- **Required to leave PURPLE:** three purple-cube Labs remain continuously
  supplied. No filler recommendation is part of the phase gate.
- **Discard rule:** as soon as the three-Lab gate is satisfied, abandon any
  unfinished filler recommendation and move to GREEN.

Place this concise player-facing clarification beside the dashboard guidance:

> The upgrades below give the research queue useful work while the purple
> district settles. They are not requirements for leaving PURPLE. As soon as
> all three purple Labs keep running, stop wherever you are in the list and
> move to GREEN.

The aggregate rejected-stop totals and the prescribed availability and ranks
were checked against retained data. Do not expose individual recommended-tech
costs or use vague, open-ended rank advice.

### Owner-approved tooltip acceptance refinement — 2026-08-27

The initial implementation proved technology IDs and rendered a sample
tooltip, but did not prove that levelled technology names conveyed their ranks.
The retained graph identifies 206 upgrade-tree records. Of those, 163
higher-rank records use a repeated base name that previously made the tooltip
title and same-family prerequisite appear identical.

Preserve the authoritative base technology name and add the retained graph's
rank as structured website data for every upgrade-tree record. Use that rank
to qualify the tooltip's current technology, required prerequisites, and
implicit prerequisites. Existing names that already contain their correct
`Lv#` suffix must not receive a duplicate suffix.

The durable contract must validate all 206 upgrade records against retained
rank and direct prerequisite data, explicitly prove that all 163 previously
ambiguous higher-rank records render the correct rank, and prove that levelled
prerequisite labels identify the actual predecessor rank. Rendering or opening
a tooltip without verifying its conveyed information is insufficient.

## Non-goals and preserved contracts

- Do not add problem-resolver guidance or Quick processes; they remain roadmap-wide out of scope.
- Do not expose individual technology costs.
- Do not retain Deuterium, Collider, or fusion preparation in PURPLE.
- Do not make bounded upgrades part of the three-Lab phase gate.
- Do not redesign the tooltip or add individual technology costs.
- Do not deploy the retained research graph as a website dependency.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The dashboard contains the approved purple gate, buildout, and logistics groups.
- Vein Utilization uses catch-up language and stops at Lv2.
- Aggregate rejected-stop explanations remain concise and accurate.
- The unlock, recommendations, three-Lab gate, and discard rule remain distinct.
- All 163 previously ambiguous higher-rank records display their authoritative
  rank, and levelled prerequisite labels display the predecessor's actual rank.

## Validation

**Tier:** 1 — Contract

Validate technology prerequisites, phase ownership, stopping ranks, aggregate
costs, tooltip content, and gate separation against retained data. The tooltip
contract must compare all 206 upgrade-tree records and the 163-record ambiguity
set rather than relying on a rendering sample.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../PROJECT.md) and does not imply owner acceptance.
