# Companion Card System

Status: implemented in the published guide.

This contract applies the findings in `CARD_SYSTEM_REVIEW.md`. It keeps cards
subordinate to the progression guide and prevents the production DAG from
expanding into dozens of reader-facing cards.

## Purpose

The progression guide tells the player what matters, why it matters, and when
moving forward is useful. A card has one smaller job:

> Show a compact textual map of the production line behind a phase-relevant
> end product that the guide recommends automating.

The guide must remain useful with every card collapsed. Cards do not create
phase objectives or permission gates.

## Eligibility

A phase objective receives a card only when all of these are true:

1. The guide recommends automating a named end product.
2. The line remains useful after the immediate phase action.
3. The reader benefits from seeing its full production shape.
4. The card can state a meaningful output rate, reserve, or limited stock
   target.
5. The material is not better expressed as a procedure, configuration list,
   research sequence, or reference table.

One-time replication batches, route settings, travel loadouts, research
purchases, direct extraction, orbital operation, and simple final convergence
steps remain in prose.

## Numerical scope

Only the end-product target receives an exact figure. Card internals do not
prescribe raw draw rates, intermediate rates, belt counts, miner coverage,
machine counts, fill timers, or spare capacity.

The map tells the reader what must exist and how it connects. The factory
itself reveals which supply needs thickening.

## Textual production-map contract

Every phase card uses the same order.

### Title

The title names the desired end product and its exact guide target. Existing
titles and targets are stable contracts.

### Supplies

Supplies names the raw resources and established production lines used by the
map.

- One supply or direct reference per bullet.
- No internal arithmetic.
- References are links to the final useful card, named branch, or reusable
  line—not to another link.

### Production Map

The map is a short set of labelled route rows.

- One transformation or short linear chain per row.
- A convergence row may list every direct recipe input.
- Branches appear in practical build order.
- Technology-bound rows are grouped under `BUILD NOW`,
  `ADD AFTER [TECHNOLOGY]`, or `PHASE-COMPLETE LINE` as appropriate.
- Facility prose and numerical derivations do not belong in route rows.

### Destination

Destination identifies the final storage, research, launcher, or other named
consumer and restates the exact target from the card title.

### Surplus Yield

This optional footer names reusable or blocking byproduct types only. Unused
installed capacity is not surplus.

### Operating Note

This optional footer contains only information that changes how the line is
built or kept running, such as a blocking refinery outlet, a monitored tank,
a feedback belt, a limited mall buffer, or a rare-resource shortcut.

## Producer-type legend

Production-map outputs use three runtime-derived visual categories:

- **Smelting** for `Smelt` recipes;
- **Assembly** for `Assemble` recipes;
- **Processing** for `Refine`, `Chemical`, `Fractionate`, and `Particle`
  recipes.

Raw supplies, research endpoints, storage, and other exceptions remain
neutral. Color is reinforced with a distinct underline style and an accessible
tooltip so it is not the only carrier of meaning.

## Complexity boundary

A phase card may contain at most:

- eight route rows;
- three technology or construction groups;
- three arrows in a single route row.

The number of direct ingredients in one recipe is not itself a complexity
failure. Multi-output mall kits may retain shallow parallel endpoints when the
paired outputs form one practical deployment unit.

When a map exceeds the boundary, resolve it in this order:

1. Link directly to an existing endpoint or named branch.
2. Use an approved reusable production-line reference.
3. Split only at a stable, independently useful branch endpoint.

Purple and green keep their natural branch cards. Their final Matrix Lab
convergence remains in phase prose.

## Reusable production-line references

Reusable references are not cards and do not create guide objectives. They
exist only when several later cards would otherwise repeat a dense branch.

The approved reference set is deliberately small:

1. **Electromagnetic Turbines**
2. **Graphene**

Processors remains a real PURPLE card because it is already a phase endpoint.
Named branches inside existing cards—such as Titanium Crystals, Carbon
Nanotubes, Particle Containers, Gears, Magnetic Coils, and Circuit Boards—may
be linked directly without being promoted to separate cards.

Every link must reveal its collapsed ancestor and land on its final target in
one action. Link-to-link chains are invalid.

## Card inventory

The published guide contains exactly 19 phase cards:

| Section | Cards |
|---|---|
| BOOTSTRAP | Mall Logistics; Mall Industry; Mall Storage; Mall Power |
| BLUE | Blue Cubes |
| RED | Red Cubes |
| ILS | None |
| YELLOW | Yellow Cubes |
| PURPLE | Processors; Particle Broadband |
| WARP | None |
| GREEN | Quantum Chips; Graviton Lenses; Space Warpers |
| DYSON | Solar Sails; EM-Rail Ejectors |
| SPHERE | Dyson Sphere Components; Deuteron Fuel Rods |
| PHOTON | None |
| WHITE | None |
| LOGISTICS | Distribution Logistics Hardware; Planetary Logistics Hardware; Interstellar Logistics Hardware |

The ILS bootstrap remains prose because it is a focused procedure rather than
a permanent automated end-product line; its off-world smelting instructions
remain in the expedition text. PHOTON remains prose for the same procedural reason.
WHITE remains prose because its inputs already exist and its final Lab
convergence is simple.

## Validation contract

Automated checks enforce:

- exactly 19 planned phase cards;
- exactly two reusable references;
- one authoritative three-type producer legend;
- stable card IDs, titles, and output targets;
- `Supplies → Production Map → Destination` ordering;
- route-row and group complexity limits;
- absence of exact internal arithmetic;
- no legacy column-card markup;
- no cards in WARP, PHOTON, or WHITE;
- valid direct links to cards, reusable references, or named route rows;
- all referenced authoritative output recipes still exist in the runtime DAG.

Desktop, mobile, hash-navigation, collapsed-state, and print behavior require
presentation validation in addition to the structural checks.
