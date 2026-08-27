# NR-15 — Add one canonical Production Statistics walkthrough

**Status:** Owner-approved on 2026-08-27. Implementation-ready but inactive
pending separate activation.

**Dependency group:** D — Optional paths and support
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a reader facing a shortage, I want one accurate Statistics Panel workflow that teaches scope, intervals, Reference Rate, storage, and upstream tracing without duplicating the tutorial across phases.

## Authoritative evidence

Use the archived runtime investigation in
[Production Statistics runtime evidence](../../archive/statistics-panel-runtime-evidence.md)
for visible labels, controls, calculations, tooltips, and scope behavior.

## Intended outcome

Keep BLUE's Statistics Panel treatment to concise discovery, introduce the full
workflow from YELLOW when its example is actionable, and retain one canonical
collapsed troubleshooting walkthrough using the approved yellow-cube example.

## In-scope surfaces

- BLUE Small Tools Statistics Panel discovery entry
- YELLOW contextual introduction to the complete workflow
- Canonical troubleshooting walkthrough and stable anchor
- Scope, interval, rate, storage, import/export, and real-time explanations
- Cross-links from BLUE, YELLOW, and later guidance

## Approved specification

Introduce the Statistics Panel briefly during BLUE, but reserve the complete
teaching moment for YELLOW, after Structure Matrix production, planetary
imports, and ILS routes have become meaningful to the reader. Place the full
canonical walkthrough in the troubleshooting reference. The panel is a general
diagnostic tool rather than a BLUE or YELLOW mechanic. Do not duplicate the
tutorial or teach interplanetary troubleshooting as a BLUE requirement.

Add this concise entry to BLUE's **Small tools** table:

> **Statistics Panel** — Press `P` to inspect what the factory is producing,
> consuming, and storing. The [Production Statistics
> walkthrough](#production-statistics-walkthrough) uses a later YELLOW line to
> teach multi-planet scope and imports; return to it when those routes are
> running.

Add one concise contextual link from YELLOW after its multi-planet production
and delivery context is established:

> **Multi-planet line slowing down?** Use the [Production Statistics
> walkthrough](#production-statistics-walkthrough) to distinguish a waiting
> output, a weak input, and a delivery gap before rebuilding anything.

Add one collapsed **Quick process — Find a shortage with Production
Statistics** after the ordered troubleshooting questions. Give it the stable
anchor `#production-statistics-walkthrough` so BLUE and later phase guidance
can link to one source.

Use the archived runtime investigation in
[Statistics Panel runtime evidence](../../archive/statistics-panel-runtime-evidence.md) as
the factual source for visible labels, controls, calculations, tooltips, and
scope behavior. The investigation used an advanced save, so preserve its panel
facts but do not copy its original blue-cube diagnostic proposal unchanged.

The canonical walkthrough should briefly establish:

- press `P` and select **Production**;
- choose **Local planet** for the factory in front of the player, a named
  system when work crosses planets in that system, or **Entire star cluster**
  only for a later whole-factory view;
- use **1 minute** for a quick recent response and **10 minutes** for a steadier
  short-term average;
- historical interval figures are per-minute averages, except **Total**, which
  reports cumulative counts;
- each item row shows actual production and consumption, separate production
  and consumption Reference Rates, import and export, related logistics
  storage, total storage, litter, a history graph, and direct raw-material and
  product navigation;
- **Reference Rate** is the configured ideal capacity of applicable,
  grid-connected facilities in scope, accounting for recipes, machine speeds,
  proliferator mode, research modifiers, and relevant facility behavior. It is
  not actual output, a historical average, or a player-set target;
- hovering Reference Rate reveals its facility breakdown, hovering Storage
  Amount reveals where items are held, and hovering the history graph reveals
  its exact period and values;
- right-clicking either circular refresh arrow enables continuous refresh of
  Reference Rates and current inventory snapshots. It does not turn historical
  production or consumption into instantaneous rates and does not replace the
  selected interval; and
- imports and exports cross the selected scope boundary and are distinct from
  production and consumption inside that boundary.

Use this controlled hypothetical:

> Yellow research is running and yellow-cube storage is not full, but cube
> production has slowed.

Teach this workflow:

1. Press `P`, select **Production**, choose **Local planet**, and select
   **1 minute**.
2. Search for **Structure Matrix**.
3. Compare its Production Rate with its production Reference Rate.
4. Hover Storage Amount before diagnosing a fault. A full output means the line
   is waiting, not failing.
5. If storage is not full and research is consuming cubes, click **Raw Material
   Statistics** and compare Diamond with Titanium Crystal.
6. Follow a weak Titanium Crystal row one step upstream to Organic Crystal and
   Titanium Ingots.
7. Observe that the home planet imports Titanium Ingots rather than producing
   them locally.
8. Switch from the home planet to the named home system. Explain that the
   planet view reports Titanium crossing its boundary as an import, while the
   system view includes production on the source planet and treats movement
   between the system's planets as internal.
9. Switch to **10 minutes** to decide whether the shortage persists beyond one
   recent delivery gap.
10. Follow Titanium Ingots farther upstream or inspect the ILS route according
    to what the rows show.
11. Fix one cause, let the route run, and check again.

State the interpretation in simple language:

- **Reference Rate:** what the installed, grid-connected machinery could make
  under ideal conditions.
- **Production Rate:** what it actually made over the selected interval.
- **Storage Amount:** whether production may simply have stopped because there
  was nowhere for the output to go.

The Statistics Panel identifies the underperforming stage; a Reference Rate gap
alone does not prove whether the exact cause is missing inputs, blocked output,
insufficient power, or another operating constraint. End the workflow by
directing the player to inspect the implicated factory line.

Keep the Real-time Statistics control as a short final note rather than making
it another workflow step. It continuously refreshes Reference Rates and
inventory snapshots; it does not replace the selected historical interval or
turn production and consumption into instantaneous rates.

Do not add a screenshot to the tutorial. The verified text is sufficient, a
published panel image would duplicate the instructions and age with UI changes,
and the evidence package retains the screenshot references if implementation
later needs to confirm an exact spatial relationship.

## Non-goals and preserved contracts

- Do not turn the Statistics Panel into a BLUE-only mechanic.
- Do not make the YELLOW example or interplanetary scope a BLUE requirement.
- Do not duplicate the tutorial.
- Do not add a screenshot or permanent browser automation.
- Do not claim that a Reference Rate gap proves a particular physical cause.
- Do not turn historical rates into instantaneous values.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- BLUE discovers the panel and explicitly frames the linked example as later
  YELLOW guidance.
- YELLOW introduces the complete workflow after its multi-planet context is
  established.
- One collapsed walkthrough owns the complete diagnostic procedure at the stable anchor.
- All labels and behavior remain faithful to the runtime evidence.
- The example distinguishes waiting output, local imports, system scope, and persistent shortages.
- The ending sends the reader back to the implicated physical factory line.

## Validation

**Tier:** 2 — Experience

Check links and semantic disclosure behavior, then review the BLUE discovery
entry, YELLOW teaching handoff, and full tutorial on the deployed development
Pages site in desktop Chromium. Reverify runtime wording only if implementation
encounters a factual conflict.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
