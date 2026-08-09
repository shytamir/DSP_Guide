# ILS-to-GREEN Research Handoff — First-Pass Audit

**Status:** First implementation pass rejected for refinement on 2026-08-09.

## Purpose

This record preserves the audit of commit `97bcd2b` against its parent, the
active user story, and the retained runtime-derived technology data. It is a
management record, not reader-facing guide content and not authorization to
begin the corrective implementation pass.

The audit found that the implementation was not ready for owner validation.
The most serious defect was the GREEN presentation: it converted a dependency
graph into misleading linear chains, overloaded the compact dashboard, and
left the preserved `Both branches` convergence label ambiguous after adding a
third branch. The focused validators then protected those defects rather than
the intended reader outcome.

## Reader-facing changes audited

### 1. ILS Applied Superconductor instruction

**Change made:** Added Applied Superconductor after the Structure Matrix chain
and stated that the standard Graphene line should be ready before Particle
Container assembly.

**How it made the guide worse:** The prerequisite was buried in prose rather
than presented as a distinct research branch. The Graphene mention at that
point was not the reusable-reference link, and the text implied that a line
was ready before directing the reader to build it.

**Required refinement:** Present `Basic Chemical Engineering → Applied
Superconductor` as a distinct prerequisite before component construction and
connect the instruction directly to the reusable Graphene reference.

### 2. ILS Vessel fleet Titanium Alloy allocation

**Change made:** Added the correct 50-Alloy-for-thrusters and
50-Alloy-for-vessels split inside the supporting-reserve table cell.

**How it made the guide worse:** The arithmetic was correct, but the long
parenthetical made an already dense table cell harder to scan and repeated the
Reinforced Thruster destination in the same sentence.

**Required refinement:** Show the two 50-Alloy destinations as explicit,
parallel allocations and keep the Electromagnetic Turbine requirement
separate, without changing established totals.

### 3. PURPLE dashboard research sequence

**Change made:** Removed Applied Superconductor and began the sequence with
High-Strength Material.

**How it made the guide worse:** The new research start was correct, but the
compact dashboard silently assumed the ILS handoff and no longer explained why
Applied Superconductor was absent for a reader resuming at PURPLE.

**Required refinement:** Keep Applied Superconductor out of unfinished
research while adding a compact completed-handoff cue and clearly label
High-Strength Material as the work to do now.

### 4. PURPLE expanded handoff prose

**Change made:** Recast Applied Superconductor and Basic Chemical Engineering
as research cleared during ILS.

**How it made the guide worse:** The passive phrase “were cleared” recorded
status but gave less direct player guidance than the surrounding text.

**Required refinement:** State the consequence directly: Applied
Superconductor was researched during ILS, so PURPLE begins with High-Strength
Material. Mention Basic Chemical Engineering only where it helps the reader.

### 5. GREEN dashboard research row

**Change made:** Reordered the row to Quantum, Frame, Gravity, convergence;
added the required descriptors; inserted the complete Frame chain; and linked
Frame Material textually to the Miniature Particle Collider.

**How it made the guide worse:** The compact dashboard became substantially
denser. More importantly, it falsely represented Photon Frequency Conversion
as leading to Super Magnetic Field Generator. The retained data shows that
Photon Frequency Conversion and Super Magnetic Field Generator are parallel
prerequisites feeding Solar Sail Orbit System. The row also mixed technology,
item, and building concepts in one arrow sequence without identifying the
transitions.

**Required refinement:** Preserve the requested order and descriptors while
showing `Photon Frequency Conversion + Super Magnetic Field Generator → Solar
Sail Orbit System`. Identify Frame Material as an unlocked item used to build
the Collider, and explicitly show that this production support flows into the
Gravity branch.

### 6. GREEN expanded research section

**Change made:** Replaced the original two-branch explanation with four
labelled paragraphs in Quantum, Frame, Gravity, convergence order.

**How it made the guide worse:** It repeated the false linear Frame chain.
After introducing three branches, `Both branches → Gravity Matrix` became
ambiguous. The change also removed the original explicit statement that
Gravitational Wave Refraction and Quantum Chip are the two completed
technologies required for Gravity Matrix. “This material” was a weak
cross-reference, and the copy did not clearly distinguish the Miniature
Particle Collider technology from the building of the same name.

**Required refinement:** Represent the Frame prerequisites accurately,
identify Frame Material and the Collider building explicitly, and retain the
convergence descriptor as `Both branches (Quantum + Gravity) → Gravity
Matrix` or equally explicit reader-facing wording.

## Validator changes audited

### Checklist validator

The changed assertion protects the entire new Vessel reserve sentence. This
couples validation to one editorial formulation instead of independently
protecting the 100-Alloy total and its two 50-Alloy destinations.

**Required refinement:** Validate the total and both destinations separately
so clearer wording remains possible.

### Deployment validator

The new checks rely heavily on exact prose and raw string placement. They:

- do not require the useful Graphene reference link at the new ILS instruction;
- count Applied Superconductor across PURPLE rather than proving it is absent
  from both unfinished-research summaries;
- codify the false linear Frame chain;
- accept mere proximity between Frame Material and Miniature Particle Collider
  without validating the meaning of the relationship; and
- do not establish that Quantum and Gravity are the two branches converging on
  Gravity Matrix.

**Required refinement:** Protect structural placement, technology identities,
the correct parallel prerequisite relationship, the Frame-to-Gravity support
relationship, and explicit Quantum/Gravity convergence without freezing full
editorial sentences.

## Management error

The implementation pass also declared the story completed and archived it
before owner validation. That made the recorded project state inaccurate and
violated the repository's completion and stop conditions. Commit `11794e6`
reopened the story, but the first-pass audit now supersedes the intermediate
claim that implementation was complete and merely awaiting owner review.

## Preserved intent

The audit does not reject these approved outcomes:

- Applied Superconductor belongs in ILS before Particle Container production.
- The Vessel fleet uses a 50/50 split of its protected 100 Titanium Alloy.
- PURPLE begins new research with High-Strength Material.
- GREEN is ordered Quantum, Frame, Gravity, convergence.
- Every branch uses its required descriptor.
- Quantum and Gravity are the branches that converge on Gravity Matrix.

## Next state

The story remains active after its first implementation pass. Refinement is
indicated, but no corrective implementation pass is authorized by this audit
record. Owner validation resumes only after that pass is completed and its
result is presented for review.
