# ILS-to-GREEN Research Handoff

**Status:** Completed and owner-validated on 2026-08-09; archived as historical
project work.

## User story

As a player following the guide from the ILS rush through GREEN science, I
wanted every required technology and finite material allocation introduced
before I needed it, so I could complete the documented builds without
discovering an unstated prerequisite or accidentally consuming protected
materials.

## Reader outcome

The completed changes to the guide:

- introduced Applied Superconductor before the ILS Particle Container build;
- exposed the full practical ILS research queue and started yellow science before
  the longer logistics-support branches;
- provided the complete temporary production reference in its practical build
  order without making automation mandatory;
- clearly allocated the Vessel fleet's protected Titanium Alloy;
- avoided repeating Applied Superconductor as new PURPLE research;
- introduced Frame Material before GREEN asked the player to craft Miniature
  Particle Colliders;
- kept the GREEN dashboard concise while the expanded guide explained the
  complete research route; and
- presented GREEN's Quantum, Frame, and Gravity technology branches in their
  practical order and relationship.

## Implemented changes

### ILS

1. Presented Cosmic Exploration Lv2 and Applied Superconductor as standalone
   technologies before the displayed research queues. Cosmic Exploration Lv1
   and Basic Chemical Engineering remained inexpensive or phase-gated assumed
   prerequisites explained in reader-facing prose.
2. Presented these six research queues in this practical order:
   - `Semiconductor Material → Processor`;
   - `Polymer Chemical Engineering → High-Strength Crystal → Structure
     Matrix`;
   - `Electromagnetic Drive → Magnetic Levitation → Magnetic Particle Trap`;
   - `Hydrogen Fuel Rod → Thruster → Reinforced Thruster`;
   - `Upgraded Logistics System → High-Efficiency Logistics System → Vertical
     Construction Lv1 → Planetary Logistics System`;
   - `High-Strength Titanium Alloy → Interstellar Logistics System`.
3. Explained that the Processor recipe supports the logistics towers, that early
   Structure Matrix research lets yellow cubes accumulate during the longer
   support work, and that the rush then finishes with two yellow-cube
   technologies before building the ILS pair.
4. Explained that Applied Superconductor unlocks the standard Graphene recipe
   required by Particle Containers, and preserve the direct link to the
   reusable Graphene production reference.
5. Removed the later repeated research unlock passage while retaining the
   actionable linked Graphene production instruction.
6. Restructured the temporary production reference so that:
   - a simple line stated `Processors → yellow cubes → Particle Containers →
     Titanium Alloy`;
   - the Processor map appears before Titanium Alloy;
   - Particle Containers remained a standalone group with links to the reusable
     Turbine and Graphene references;
   - the transport-hardware group used compact PLS and ILS labels and contained
     Reinforced Thruster and Logistics Vessel production maps; and
   - the dense reference did not imply that any line had to be automated.
7. Clarified the Vessel fleet's protected 100 Titanium Alloy allocation:
   - 50 Titanium Alloy goes into ten Reinforced Thrusters;
   - 50 Titanium Alloy goes directly into five Logistics Vessels.
8. Preserved the existing 100-Alloy subtotal, 180-Alloy protected total, and
   860-Titanium-Ingot total.

### PURPLE

1. Removed Applied Superconductor from the beginning of both PURPLE research
   summaries because ILS already required it.
2. Began the PURPLE sequence with High-Strength Material:
   `High-Strength Material → Particle Control → Information Matrix`.
3. Updated the supporting prose so it recognized Applied Superconductor as
   completed during ILS rather than presenting it as new PURPLE work.

### GREEN

The phase-dashboard `Research next` row and the expanded `Research first`
section were updated for their different purposes.

The condensed dashboard showed only the detailed Quantum chain followed by
plain Frame and Gravity branch labels and a Gravity Matrix technology tooltip:

`Quantum branch: Casimir Crystal + High-Strength Glass → Wave Function
Interference → Quantum Chip → Frame branch → Gravity branch → Gravity Matrix`.

The expanded section showed four uninterrupted lines in this order:

1. `Quantum branch: Casimir Crystal + High-Strength Glass → Wave Function
   Interference → Quantum Chip`;
2. `Frame branch: Solar Collection → Photon Frequency Conversion → Super
   Magnetic Field Generator → Solar Sail Orbit System → High-Strength
   Lightweight Structure → Frame Material`;
3. `Gravity branch: Miniature Particle Collider → Strange Matter →
   Gravitational Wave Refraction`;
4. `Both branches (Quantum + Gravity) → Gravity Matrix`.

No construction instruction, prose, or additional title interrupted a
technology chain. In particular, neither presentation appended an instruction
to build the Miniature Particle Collider to the Frame chain.

Reader-facing prose after the expanded map explained that:

- the Frame branch unlocks Frame Material, a recipe component for the
  Miniature Particle Collider building unlocked by the Gravity branch's first
  technology;
- researching Quantum first builds a useful Quantum Chip buffer while the
  longer Frame and Gravity route is completed and before Graviton Lenses begin
  reaching storage; and
- Quantum and Gravity are the two branches that converge on Gravity Matrix.

## Accepted result

- A player reached the ILS Particle Container step only after being told to
  research Applied Superconductor.
- The ILS support map contained the two standalone technologies followed by the
  six exact research queues in the approved practical order.
- Reader-facing ILS prose explained the assumed prerequisites, Processor recipe,
  early yellow-cube buffer, and final two-technology ILS finish.
- The ILS Graphene input retained its direct reusable-reference link.
- The later `Finish the unlock` repetition was removed without losing the
  actionable Graphene production instruction.
- The temporary production reference stated the approved production order and
  presented Processors, standalone Particle Containers, Titanium Alloy, and
  grouped transport hardware in that order.
- PLS, Reinforced Thruster, ILS, and Logistics Vessel recipes were all available
  in the ILS reference without becoming automation requirements.
- The Vessel fleet allocation explicitly accounted for all 100 protected
  Titanium Alloy without changing any established totals.
- PURPLE no longer presented Applied Superconductor as unfinished research.
- The GREEN dashboard contained the detailed Quantum chain, plain `Frame branch
  → Gravity branch` labels, and a Gravity Matrix milestone tooltip.
- The expanded GREEN map contained the exact Quantum, Frame, and Gravity branch
  descriptors followed by the preserved `Both branches` convergence
  descriptor, in that order.
- The expanded Frame branch was one uninterrupted chain from Solar Collection
  through Frame Material, with no prose or title inserted within it.
- Neither GREEN research presentation described building the Miniature
  Particle Collider as a step in a technology chain.
- The expanded prose explained the Frame Material recipe relationship, the
  Collider unlock relationship, and the practical Quantum-first buffer.
- The text distinguished the Frame branch's supporting relationship from the
  Quantum/Gravity convergence.
- Technology names and relationships agreed with the retained runtime-derived
  data.
- No authoring or non-reader-facing reasoning mentioned in this user story or
  developed during implementation appeared in the guide's text.
- Focused validation protected the ILS prerequisite, Alloy split, PURPLE
  handoff, ordered ILS research map, practical timing prose, distinct GREEN
  dashboard and expanded-section contracts, and Graphene link.
- Card-system, checklist, and release-equivalent deployment validation passed.
- Desktop and narrow rendering confirmed that the ILS research map, dashboard,
  and expanded GREEN guidance remained readable.

## Out of scope

- Phase order, navigation, public anchors, and checklist identities were not
  changed.
- No new phase objective, completion gate, or production card was added.
- Card inventory, production rates, recipes, machine counts, reserves, and
  established material totals were not changed.
- The reusable Graphene reference was unchanged beyond preserving its existing
  ILS link.
- Research guidance outside ILS, PURPLE, and GREEN was not broadly audited or
  rewritten.
- DYSON, SPHERE, WARP, optional routes, and Dark Fog coverage were unchanged.
- The `Both branches` Gravity Matrix convergence descriptor was not removed.
- The observation file's general "review later" remarks were not implemented.
- Runtime-derived data and research provenance were unchanged.
- Styling and layout were not redesigned beyond accommodating the revised
  research text.

## First implementation pass

- The first pass introduced Applied Superconductor before the linked standard
  Graphene line and Particle Container assembly.
- The Vessel fleet row identified the protected 100 Titanium Alloy as 50 for
  ten Reinforced Thrusters and 50 directly for five Logistics Vessels without
  changing any established total.
- PURPLE began its two research summaries with High-Strength Material and
  treated Applied Superconductor as completed ILS research.
- Both GREEN research presentations used the Quantum, Frame, Gravity,
  convergence order and identified the Frame Material requirement for Miniature
  Particle Collider construction.
- Focused deployment and checklist validation protected the corrected handoff,
  allocation, labels, order, technology chains, and existing Graphene link.
- Desktop browser review confirmed readable dashboard and expanded research
  presentation without horizontal overflow or console errors.

Those checks did not establish that the story was complete. The
[`first-pass audit`](ils-purple-green-research-handoff-first-pass-audit.md)
found material problems in the reader-facing changes and in the focused
validators that protected them.

## Corrective refinement pass

- The corrective pass presented `Basic Chemical Engineering → Applied Superconductor` as a
  separate Graphene prerequisite and links the instruction itself to the
  reusable standard Graphene line before Particle Container assembly.
- The Vessel fleet reserve presented the two 50-Alloy destinations on separate
  readable lines while preserving the 100-Alloy subtotal, 180-Alloy protected
  total, and 860-Titanium-Ingot total.
- PURPLE began both research summaries with High-Strength Material and labelled
  Applied Superconductor as completed ILS work.
- Both GREEN research presentations retained the Quantum, Frame, Gravity,
  convergence order. They showed Photon Frequency Conversion and Super Magnetic
  Field Generator as parallel prerequisites for Solar Sail Orbit System,
  connect Frame Material to building the Collider used by the Gravity branch,
  and identify Quantum and Gravity as the branches converging on Gravity
  Matrix.
- Checklist validation protected the Alloy total and its two destinations
  independently of the surrounding sentence. Deployment validation protected
  structural placement, technology identities, the parallel Frame
  prerequisites, the Frame-to-Gravity support relationship, and explicit
  Quantum/Gravity convergence.
- Card-system, checklist, and release-equivalent deployment validation passed.
- Reviewed desktop and narrow browser layouts remained readable without
  horizontal overflow or console warnings.

That evidence did not complete, accept, owner-validate, or archive the story.
The owner review that followed found the ILS restructure passable but required
a second GREEN refinement.

## Second GREEN refinement pass

- The dashboard kept only the detailed Quantum technology chain, followed
  by the plain `Frame branch → Gravity branch → Gravity Matrix` route summary.
- The expanded Frame branch became one uninterrupted chain from Solar Collection
  through Frame Material. The misplaced Collider construction instruction has
  been removed from both presentations.
- Reader-facing prose explained the Frame Material recipe relationship, the
  Gravity technology that unlocks the Miniature Particle Collider building,
  and the practical Quantum Chip buffer gained by researching Quantum first.
- Focused deployment validation independently protected the condensed dashboard
  and expanded guide contracts. Card-system, checklist, and release-equivalent
  deployment checks pass.
- Reviewed desktop and narrow browser layouts remained readable without
  horizontal overflow or console warnings.

That evidence did not complete, accept, owner-validate, or archive the story.
Owner review accepted the revised GREEN presentation and requested a fuller
ILS research map.

## ILS research-map refinement

- The flight-preparation section presented the two standalone technologies and
  six ordered research queues, exposing the Processor, yellow-science,
  magnetic and Particle Container, Thruster, PLS, and final ILS work.
- Reader-facing prose explained the two assumed prerequisites, the Processor
  recipe's role in station hardware, the early yellow-cube buffer, and the
  clean two-technology finish before building the ILS pair.
- The later repeated unlock paragraph was removed. Its actionable linked
  Graphene production instruction remained before Particle Container assembly.
- The condensed GREEN dashboard rendered Gravity Matrix as a milestone
  technology tooltip while keeping the Frame and Gravity labels plain.
- Card-system, checklist, and release-equivalent deployment validation passed.
- Reviewed desktop and narrow layouts remained readable without horizontal
  overflow or console warnings.

That evidence did not complete, accept, owner-validate, or archive the story.
Owner validation remained the final gate.

## ILS production-map refinement

- The temporary-production reference began with `Processors → yellow
  cubes → Particle Containers → Titanium Alloy`.
- The Processor map preceded Titanium Alloy, and Particle Containers had a
  standalone group linked to the reusable Turbine and Graphene references.
- A transport-hardware group exposed the PLS, Reinforced Thruster, ILS, and
  Logistics Vessel recipes together without requiring their automation; the
  station names use compact PLS and ILS labels in the dense map.
- Focused card-system and release-equivalent deployment validation passed.
- Reviewed desktop and narrow layouts remained readable without page overflow or
  console warnings.

That implementation evidence did not complete, accept, owner-validate, or
archive the story. The owner subsequently accepted the completed result on
2026-08-09, closing the story and returning the repository to maintenance mode.
