# DYSON Ejector Production-Map Condensation Story

**Status:** Approved and tracked, but unscheduled. This story is not part of
the current roadmap and is not authorized for implementation.

## Reduce the Ejector map to four meaningful branch rows

**Class:** Editorial refinement.

As a reader opening the EM-Rail Ejectors card, I want its production map to
show the complete raw-supply path without assigning a full row to every
one-arrow conversion so that the four-component convergence is compact enough
to scan as one production shape.

### Reader problem

The current map uses separate rows for the shared Iron Ingot supply, Magnets,
Gears, Steel, and Energetic Graphite before it reaches Super-Magnetic Rings
and the final Ejector convergence. The raw transformations are required by the
card contract, but the standalone one-arrow rows make elementary branches
more prominent than the product they support.

### Settled map structure

Retain four branch rows followed by the final Ejector convergence:

1. **Gear branch:** Iron Ore → Iron Ingots → Gears.
2. **Steel branch:** Iron Ore → Iron Ingots → Steel.
3. **Magnet/graphite branch:** Iron Ore → Magnets; Coal → Energetic
   Graphite.
4. **Ring branch:** Electromagnetic Turbines + Magnets + Energetic Graphite →
   Super-Magnetic Rings.
5. **Ejector convergence:** Steel + Gears + Processors + Super-Magnetic Rings
   → EM-Rail Ejectors.

The semicolon in the Magnet/graphite row separates its two short raw-to-output
chains. It does not imply that Magnets and Energetic Graphite are produced by
one recipe.

### Scope

- Remove the standalone `Iron supply` row.
- Extend both the Gear and Steel rows back to Iron Ore through their own Iron
  Ingot step.
- Merge the standalone Magnet and Graphite rows into the single
  `Magnet/graphite branch` row specified above.
- Preserve the producer icon and accessible producer identity for every
  transformation.
- Leave the Ring branch and final Ejector convergence factually unchanged.
- Update only directly affected card validation or management documentation.

### Preserved contracts

- Iron Ore and Coal remain named raw supplies.
- The production map retains every raw-to-output transformation needed by the
  standard recipes.
- Processors and Electromagnetic Turbines remain established linked supplies.
- The card continues to omit machine counts, internal rates, and belt counts.
- The card remains optional and collapsed by default.

### Non-goals

- Do not change the `buffer 60` title, badges, destination, Operating Notes,
  deployment advice, or target framing.
- Do not change recipes, ingredients, technology prerequisites, icons, or
  cross-reference destinations.
- Do not establish a new document-wide grammar for combining short branches.
- Do not change any other production card.
- Do not include release work or add this story to the roadmap until the owner
  schedules it.

### Acceptance

- The Ejector production map contains exactly four branch rows and one final
  convergence row.
- No standalone Iron-supply, Magnet, or Graphite row remains.
- The Gear and Steel rows each begin with Iron Ore and visibly include the
  Iron Ingot transformation.
- The `Magnet/graphite branch` row contains both short chains separated by a
  semicolon, with the correct producer treatment on each arrow.
- The Ring and Ejector recipes remain accurate and visually legible.
- The card's supplies, summary, destination, and Operating Notes are
  unchanged.
- Tier 1 card validation and a focused Tier 2 desktop Chromium review pass.
