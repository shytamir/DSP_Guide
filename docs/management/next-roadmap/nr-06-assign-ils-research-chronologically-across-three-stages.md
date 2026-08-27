# NR-06 — Assign ILS research chronologically across three stages

**Status:** Owner-approved on 2026-08-27. Inactive pending separate activation.

**Dependency group:** B — Early and mid-route guidance
**Assessed workload:** Medium
**Class:** Data or research change

## Reader need

As a reader rushing ILS, I want each technology recommendation at the stage where it becomes useful so prerequisites are explicit and the route no longer claims yellow cubes can begin before the Titanium return.

## Authoritative evidence

Use retained technology prerequisites and material recipes. RED proves Steel
Smelting through Oil Refinery material cost. Its required Signal Towers consume
Crystal Silicon, whose starter-route recipe requires Crystal Smelting, but RED
currently omits the explicit research instruction. RED does not prove Basic
Chemical Engineering.

## Intended outcome

Preserve the three-stage ILS navigation while assigning research and checkpoints chronologically.

## In-scope surfaces

- ILS stage Goals, research lists, and three navigation anchors
- Stage III transport-package checkpoint and route deployment
- RED's Research first sequence only where required to place Crystal Smelting
  before its existing Signal Tower and Security Mall instructions
- Technology tooltip and prerequisite relationships
- False pre-departure yellow-cube statement

## Approved specification

The current Stage 1 statement that yellow cubes can begin accumulating before
departure is incorrect. Their Titanium Crystal input depends on the protected
Titanium haulback completed by the return trip in Stage 2. Yellow-cube
production therefore begins only after the player returns home.

Repair the revealed prerequisite at its source. In RED's **Research first**
sequence, explicitly assign Crystal Smelting after its prerequisite Smelting
Purification and before the existing Signal Tower and Security Mall
instructions. This establishes the technology required to make Crystal Silicon
for RED's non-optional Signal Towers. Do not otherwise change RED or either
Quick process established by NR-05.

Keep the current three-stage navigation model. Give Stage III two clearly
named parts so the finite build and route deployment remain distinct without
adding another stage or navigation anchor:

1. **Get flight-ready**
   - Research only what is required to inspect the system, fly, and smelt at
     the destination.
   - Select the destination and pack a powered-outpost loadout.
   - End when Icarus launches.
2. **Build an outpost worth returning to**
   - Establish powered Titanium and Silicon smelting.
   - Allow continuous blue and red research to clear the support technologies
     needed after the return while the player builds the outpost.
   - Protect and carry home 860 Titanium Ingots and 520 High-Purity Silicon.
   - End when Icarus returns with the complete haulback.
3. **Build and automate the route**
   - **Build the transport package:** Build the temporary Processor and
     yellow-cube lines, produce the first 200 yellow cubes, research
     High-Strength Titanium Alloy → Interstellar Logistics System, and produce
     the protected component bill, two ILS towers, and five Logistics Vessels.
     Mark the assembled and protected package as a visible checkpoint.
   - **Put the route to work:** Place the remote source station and connect the
     outpost smelters. Place and power the home receiver. Configure Remote
     Supply and Remote Demand, install the Vessels, filter the outputs, and
     manage the charging spike.
   - End when Titanium and Silicon reach home without Icarus.

The completed transport-hardware package remains a substantive checkpoint,
not a fourth phase. The reader stays within Stage III while moving from a
finite protected build into deployment and verification.

Assign research recommendations chronologically:

- **Stage I — flight and remote smelting:** Cosmic Exploration Lv1 → Lv2;
  Engine → Drive Engine Lv1; Mecha Core Lv2 → Drive Engine Lv2; Titanium
  Smelting. Do not repeat Steel Smelting: building RED's Oil Refineries already
  proves it through their Steel material cost.
- **Stage II — support research during the expedition:** Basic Chemical
  Engineering → Applied Superconductor; Semiconductor Material → Processor;
  Polymer Chemical → High-Strength Crystal → Structure Matrix;
  Electromagnetic Drive → Magnetic Levitation → Magnetic Particle Trap;
  Hydrogen Fuel Rod → Thruster → Reinforced Thruster; Upgraded Logistics →
  High-Efficiency Logistics; Vertical Construction Lv1; then Planetary
  Logistics System after its branches converge.
- **Stage III — yellow bridge and route:** Produce the first yellow batch, then
  research High-Strength Titanium Alloy → Interstellar Logistics System. The
  rest of the stage is production, deployment, and verification.

Use arrows only for actual prerequisite relationships. Do not falsely join
independent branches merely because they converge later. Preserve technology
hover behavior and the existing three anchors—**I, II, III**—with resume
targets aligned to the three major stage headings.

The order above is supported by both research and material proofs. After the
bounded prerequisite repair, RED proves Steel Smelting and Crystal Smelting but
not Basic Chemical Engineering. The first yellow batch therefore inherits
Crystal Smelting from RED and still requires the chemistry chain assigned to
ILS Stage II. Building the ILS pair and Vessels proves the remaining Processor,
Graphene, particle-container, thruster, alloy, and logistics branches for later
phases.

## Non-goals and preserved contracts

- Do not add a fourth stage or navigation anchor.
- Do not join independent research branches with false prerequisite arrows.
- Do not add explanatory flavor text for every selected technology.
- Do not change any NR-05 Quick process or otherwise expand RED beyond the one
  missing Crystal Smelting instruction.
- Do not change the established ILS material bill except where the approved chronology states it.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The false pre-departure yellow-cube claim is removed.
- RED explicitly assigns Crystal Smelting before requiring Signal Towers, and
  ILS does not repeat that completed research.
- Stages I, II, and III each own the approved research needed at that point.
- Stage III visibly separates the finite transport package from deployment without becoming a fourth stage.
- All arrows represent actual prerequisites and existing hover behavior is preserved.

## Validation

**Tier:** 1 — Contract

Validate the RED Signal Tower material path, technology prerequisites, material
proof, stage ownership, anchors, and tooltips with the directly affected
deterministic contracts.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
