# ILS-to-GREEN Research Handoff

**Status:** Active; second GREEN refinement pass complete and owner validation
pending.

## User story

As a player following the guide from the ILS rush through GREEN science, I
want every required technology and finite material allocation introduced
before I need it, so I can complete the documented builds without discovering
an unstated prerequisite or accidentally consuming protected materials.

## Reader outcome

The guide will:

- introduce Applied Superconductor before the ILS Particle Container build;
- clearly allocate the Vessel fleet's protected Titanium Alloy;
- avoid repeating Applied Superconductor as new PURPLE research;
- introduce Frame Material before GREEN asks the player to craft Miniature
  Particle Colliders;
- keep the GREEN dashboard concise while the expanded guide explains the
  complete research route; and
- present GREEN's Quantum, Frame, and Gravity technology branches in their
  practical order and relationship.

## Required changes

### ILS

1. Add Applied Superconductor to the ILS research sequence before the
   temporary Graphene and Particle Container production work.
2. Explain that Applied Superconductor unlocks the standard Graphene recipe
   required by Particle Containers.
3. Preserve the existing direct link to the reusable Graphene production
   reference.
4. Clarify the Vessel fleet's protected 100 Titanium Alloy allocation:
   - 50 Titanium Alloy goes into ten Reinforced Thrusters;
   - 50 Titanium Alloy goes directly into five Logistics Vessels.
5. Preserve the existing 100-Alloy subtotal, 180-Alloy protected total, and
   860-Titanium-Ingot total.

### PURPLE

1. Remove Applied Superconductor from the beginning of both PURPLE research
   summaries because ILS now requires it.
2. Begin the PURPLE sequence with High-Strength Material:
   `High-Strength Material → Particle Control → Information Matrix`.
3. Update the supporting prose so it recognizes Applied Superconductor as
   completed during ILS rather than presenting it as new PURPLE work.

### GREEN

Update the phase-dashboard `Research next` row and the expanded `Research
first` section for their different purposes.

The condensed dashboard must show only the detailed Quantum chain followed by
plain representative text for the remaining route:

`Quantum branch: Casimir Crystal + High-Strength Glass → Wave Function
Interference → Quantum Chip → Frame branch → Gravity branch → Gravity Matrix`.

The expanded section must show four uninterrupted lines in this order:

1. `Quantum branch: Casimir Crystal + High-Strength Glass → Wave Function
   Interference → Quantum Chip`;
2. `Frame branch: Solar Collection → Photon Frequency Conversion → Super
   Magnetic Field Generator → Solar Sail Orbit System → High-Strength
   Lightweight Structure → Frame Material`;
3. `Gravity branch: Miniature Particle Collider → Strange Matter →
   Gravitational Wave Refraction`;
4. `Both branches (Quantum + Gravity) → Gravity Matrix`.

No construction instruction, prose, or additional title may interrupt a
technology chain. In particular, neither presentation may append an
instruction to build the Miniature Particle Collider to the Frame chain.

Reader-facing prose after the expanded map must explain that:

- the Frame branch unlocks Frame Material, a recipe component for the
  Miniature Particle Collider building unlocked by the Gravity branch's first
  technology;
- researching Quantum first builds a useful Quantum Chip buffer while the
  longer Frame and Gravity route is completed and before Graviton Lenses begin
  reaching storage; and
- Quantum and Gravity are the two branches that converge on Gravity Matrix.

## Acceptance criteria

- A player reaches the ILS Particle Container step only after being told to
  research Applied Superconductor.
- The ILS Graphene input retains its direct reusable-reference link.
- The Vessel fleet allocation explicitly accounts for all 100 protected
  Titanium Alloy without changing any established totals.
- PURPLE no longer presents Applied Superconductor as unfinished research.
- The GREEN dashboard contains the detailed Quantum chain followed only by the
  plain `Frame branch → Gravity branch → Gravity Matrix` summary.
- The expanded GREEN map contains the exact Quantum, Frame, and Gravity branch
  descriptors followed by the preserved `Both branches` convergence
  descriptor, in that order.
- The expanded Frame branch is one uninterrupted chain from Solar Collection
  through Frame Material, with no prose or title inserted within it.
- Neither GREEN research presentation describes building the Miniature
  Particle Collider as a step in a technology chain.
- The expanded prose explains the Frame Material recipe relationship, the
  Collider unlock relationship, and the practical Quantum-first buffer.
- The text distinguishes the Frame branch's supporting relationship from the
  Quantum/Gravity convergence.
- Technology names and relationships agree with the retained runtime-derived
  data.
- No authoring and non-reader-facing reasoning mentioned in this user story or
  thought up during implementation may appear in the guide's text.
- Focused validation protects the ILS prerequisite, Alloy split, PURPLE
  handoff, distinct GREEN dashboard and expanded-section contracts, and
  Graphene link.
- Card-system, checklist, and release-equivalent deployment validation pass.
- Desktop and narrow rendering confirm that the dashboard and expanded GREEN
  guidance remain readable.

## Out of scope

- No changes to phase order, navigation, public anchors, or checklist
  identities.
- No new phase objective, completion gate, or production card.
- No changes to card inventory, production rates, recipes, machine counts,
  reserves, or established material totals.
- No changes to the reusable Graphene reference beyond preserving its existing
  ILS link.
- No broader audit or rewrite of research guidance outside ILS, PURPLE, and
  GREEN.
- No changes to DYSON, SPHERE, WARP, optional routes, or Dark Fog coverage.
- No removal of the `Both branches` Gravity Matrix convergence descriptor.
- No implementation of the observation file's general "review later"
  remarks.
- No changes to runtime-derived data or research provenance.
- No styling or layout redesign beyond accommodating the revised research
  text.

## First implementation pass

- ILS now introduces Applied Superconductor before the linked standard
  Graphene line and Particle Container assembly.
- The Vessel fleet row identifies the protected 100 Titanium Alloy as 50 for
  ten Reinforced Thrusters and 50 directly for five Logistics Vessels without
  changing any established total.
- PURPLE begins its two research summaries with High-Strength Material and
  treats Applied Superconductor as completed ILS research.
- Both GREEN research presentations use the Quantum, Frame, Gravity,
  convergence order and identify the Frame Material requirement for Miniature
  Particle Collider construction.
- Focused deployment and checklist validation protect the corrected handoff,
  allocation, labels, order, technology chains, and existing Graphene link.
- Desktop browser review confirmed readable dashboard and expanded research
  presentation without horizontal overflow or console errors.

These checks did not establish that the story was complete. The
[`first-pass audit`](ils-purple-green-research-handoff-first-pass-audit.md)
found material problems in the reader-facing changes and in the focused
validators that protected them.

## Corrective refinement pass

- ILS now presents `Basic Chemical Engineering → Applied Superconductor` as a
  separate Graphene prerequisite and links the instruction itself to the
  reusable standard Graphene line before Particle Container assembly.
- The Vessel fleet reserve presents the two 50-Alloy destinations on separate
  readable lines while preserving the 100-Alloy subtotal, 180-Alloy protected
  total, and 860-Titanium-Ingot total.
- PURPLE begins both research summaries with High-Strength Material and labels
  Applied Superconductor as completed ILS work.
- Both GREEN research presentations retain the Quantum, Frame, Gravity,
  convergence order. They show Photon Frequency Conversion and Super Magnetic
  Field Generator as parallel prerequisites for Solar Sail Orbit System,
  connect Frame Material to building the Collider used by the Gravity branch,
  and identify Quantum and Gravity as the branches converging on Gravity
  Matrix.
- Checklist validation protects the Alloy total and its two destinations
  independently of the surrounding sentence. Deployment validation protects
  structural placement, technology identities, the parallel Frame
  prerequisites, the Frame-to-Gravity support relationship, and explicit
  Quantum/Gravity convergence.
- Card-system, checklist, and release-equivalent deployment validation pass.
- Reviewed desktop and narrow browser layouts remain readable without
  horizontal overflow or console warnings.

This evidence does not complete, accept, owner-validate, or archive the story.
The owner review that followed found the ILS restructure passable but required
a second GREEN refinement.

## Second GREEN refinement pass

- The dashboard now keeps only the detailed Quantum technology chain, followed
  by the plain `Frame branch → Gravity branch → Gravity Matrix` route summary.
- The expanded Frame branch is one uninterrupted chain from Solar Collection
  through Frame Material. The misplaced Collider construction instruction has
  been removed from both presentations.
- Reader-facing prose now explains the Frame Material recipe relationship, the
  Gravity technology that unlocks the Miniature Particle Collider building,
  and the practical Quantum Chip buffer gained by researching Quantum first.
- Focused deployment validation independently protects the condensed dashboard
  and expanded guide contracts. Card-system, checklist, and release-equivalent
  deployment checks pass.
- Reviewed desktop and narrow browser layouts remain readable without
  horizontal overflow or console warnings.

This evidence does not complete, accept, owner-validate, or archive the story.
Owner validation remains the final gate.
