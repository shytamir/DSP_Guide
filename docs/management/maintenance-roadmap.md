# Maintenance Roadmap

**Status:** Active. The following stories are the next scheduled guide
maintenance work, in implementation order.

These stories were accepted from a completed guide-only playthrough. They
refine existing production guidance without changing the guide's progression
route, objectives, or product boundaries.

## 1. Clarify the reusable Electromagnetic Turbine production map

### User story

As a guide reader building Electromagnetic Turbines, I want their reusable
production map divided into clearly identified dependency branches and a final
convergence, so that I can understand and construct the production chain
without interpreting one flat collection of routes.

### Acceptance criteria

- Preserve the existing reusable Electromagnetic Turbine reference card and
  its public anchor.
- Divide its Production Map into three ordered, clearly headlined groups:
  **Magnetic Coil branch**, **Electric Motor branch**, and **Final
  convergence**.
- Show Iron Ore to Magnets, Copper Ore to Copper Ingots, and Magnets plus
  Copper Ingots to Magnetic Coils in the Magnetic Coil branch.
- Show Iron Ore to Iron Ingots, Iron Ingots to Gears, and Iron Ingots plus
  Gears plus Magnetic Coils to Electric Motors in the Electric Motor branch.
- Show Electric Motors plus Magnetic Coils converging into Electromagnetic
  Turbines in the final group.
- Retain the existing item icons, producer annotations, recipe information,
  and navigation behavior.
- Do not turn the reference map into a phase objective, checklist gate, or
  expanded dependency graph.
- Add focused structural validation for the three groups and their ordering.
- Pass the card-system, checklist, and release-equivalent deployment
  validations.
- Review a headless-Chromium desktop rendering for visual clarity.

## 2. Reconcile Titanium Ingot reserves in the ILS finite production bill

### User story

As a guide reader preparing the finite production bill for the first ILS
expansion, I want every limited Titanium Ingot commitment represented in the
Supporting reserve, so that the protected 860-Ingot return load funds the
yellow batch, both stations, and the vessel fleet without a hidden titanium
shortfall.

### Acceptance criteria

- Add 600 Titanium Ingots to the **First yellow batch** Supporting reserve for
  its 200 Titanium Crystals.
- Allocate 160 Titanium Ingots in the **ILS pair** Supporting reserve: 80 for
  the two embedded PLS components and 80 for the row's 80 Titanium Alloy.
- Add 100 Titanium Ingots to the **Vessel fleet** Supporting reserve for its
  100 Titanium Alloy.
- Show 860 Titanium Ingots in the **Protected total** Supporting reserve,
  reconciled as 600 for Titanium Crystals, 180 for all Titanium Alloy, and 80
  for the two embedded PLS components.
- Keep the existing 860-Titanium-Ingot return checklist aligned with the bill.
- Continue omitting non-limited supporting inputs outside the finite reserve's
  purpose.
- Preserve all unaffected finished targets, main subtotals, and supporting
  reserves.
- Add focused deterministic validation for the row allocations and reconciled
  total.
- Pass the card-system, checklist, and release-equivalent deployment
  validations.
- Review the rendered desktop table for legibility.

## Completion handling

When both stories are implemented and validated, move this record to
`docs/archive/`, revise its status and implementation language into the past
tense, and update `docs/PROJECT.md` and `docs/management/README.md` so they no
longer present the roadmap as active.
