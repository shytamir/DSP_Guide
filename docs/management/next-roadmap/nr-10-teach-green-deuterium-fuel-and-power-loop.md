# NR-10 — Teach GREEN's Deuterium, fuel, and power loop

**Status:** Draft for owner review. The outcome comes from the owner-approved
next roadmap, but this decomposed story does not authorize implementation.

**Dependency group:** C — Late-route progression
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a reader using the guide's Collider route, I want a visible operating loop that grows Deuterium, Strange Matter, fuel, and power together without requiring calculations.

## Authoritative evidence

NR-09 establishes the Collider route and research ownership. The approved plan retains alternative tradeoffs while teaching only the chosen compact, deterministic route.

## Intended outcome

Add the approved route rationale, simplified alternatives, production map, fuel buffer, and observable expansion loop.

## In-scope surfaces

- GREEN alternatives table and chosen-route explanation
- Grow Deuterium, Strange Matter, and power together section
- Compact production map
- Hydrogen, Deuterium, fuel-buffer, and expansion guidance

## Approved specification

Keep the alternatives table, lead with and identify Miniature Particle
Colliders as the guide route, and simplify its comparisons:

- **Miniature Particle Colliders — guide route:** compact and predictable;
  consume more Hydrogen and power.
- **Fractionators:** use Hydrogen and power more efficiently; require a larger
  circulating-belt system whose flow and stacking need more attention.
- **Orbital Collectors:** move supply away from the home factory; require a
  substantial Collector buildout and provide output that depends on the gas
  giant and the number deployed.

The table informs the reader of alternatives and tradeoffs only. Remove the
present Fractionator-loop implementation and troubleshooting language. The
guide does not offer solutions for a route it has chosen not to teach.

Use the following chosen-route rationale:

> This guide uses Miniature Particle Colliders because they make Deuterium
> through one compact, predictable line. Fractionators use less Hydrogen and
> power, but require a circulating belt that needs more attention. Orbital
> Collectors can supply Deuterium from a gas giant, but require a larger detour
> and their output depends on the giant and the number deployed.
>
> Colliders are the simplest route to build and understand. Their tradeoff is
> heavy Hydrogen and power use, so the line below turns its spare Deuterium into
> fuel for its own expansion.

Add a visible practical section titled **Grow Deuterium, Strange Matter, and
power together**. A compact production map may show:

```text
Hydrogen
  → Miniature Particle Collider
  → Deuterium
      ├─ priority → Strange Matter production
      └─ leftovers + Titanium Alloy + Super Magnetic Ring
           → Deuteron Fuel Rods
           → visible fuel buffer
           → Mini Fusion Power Plants
```

Use this final player-facing prose:

> Feed the Deuterium Colliders from a visible Hydrogen tank. They will draw
> heavily from it, especially while the Quantum Chip line is also consuming
> Hydrogen. If the tank keeps falling, strengthen the Hydrogen supply before
> adding more Colliders.
>
> Send the produced Deuterium to Strange Matter first. Continue the same belt
> into one Deuteron Fuel Rod line so only the leftovers become fuel. Store the
> finished Fuel Rods where you can see them and let a buffer build before
> relying on them for power.
>
> Then repeat this simple loop:
>
> 1. Add two Mini Fusion Power Plants.
> 2. Check the Fuel Rod buffer after they begin running.
> 3. If the buffer is falling, add more Deuterium production.
> 4. If the buffer is growing quickly and you want more green production, add
>    another Strange Matter Collider.
> 5. Repeat until power and Strange Matter are keeping up.
>
> Once both are where you want them, return unused Deuterium to a Storage Tank
> that feeds the line. The tank becomes a visible reserve for later expansion
> instead of letting extra Deuterium stop production.

This loop deliberately avoids calculations: Hydrogen falling means strengthen
Hydrogen; Fuel Rods falling means make more Deuterium; Fuel Rods growing
quickly means Strange Matter may expand; sufficient power and Strange Matter
means store the surplus. Existing grid capacity may make immediate fusion
construction unnecessary, so let the Fuel Rod buffer accumulate until more
generation is actually needed.

## Non-goals and preserved contracts

- Do not change authoritative research ownership; NR-09 owns it.
- Do not teach Fractionator implementation or troubleshooting.
- Do not add throughput or power calculations.
- Do not require immediate Fusion Plant construction when the existing grid is sufficient.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The Collider route is clearly identified as compact and predictable, not universally efficient.
- Alternative routes retain concise, accurate tradeoffs without parallel instructions.
- The production map prioritizes Strange Matter and sends leftovers to fuel.
- The observable buffer loop tells the reader when to strengthen Hydrogen, Deuterium, Strange Matter, or power.

## Validation

**Tier:** 2 — Experience

Run directly affected content/card checks, then review the visible rationale,
map, and operating loop on the deployed development Pages site in desktop
Chromium for sequence and clarity.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
