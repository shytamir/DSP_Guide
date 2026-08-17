# Playthrough Observations — Working Record

**Status:** Provisional planning record. These observations are not approved
requirements, user stories, roadmap work, or authorization to change the
guide. Analyze and resolve them with the owner one topic at a time.

## Review method

- Preserve the distinction between an observed problem, a proposed direction,
  and a settled decision.
- Discuss topics in the numbered order below unless a dependency requires a
  combined decision.
- Do not implement, stage, commit, or publish from this record alone.
- Update the One-Screen Default Checklist only after all preceding guide
  changes have been decided and implemented.

## Work in progress candidates

These candidates preserve accepted discussion results but are not authorized
guide changes.

### WIP-1 — Introduction scope and closing line

> The route above is the simplest way through the game, but it isn't the only
> path this guide supports. You can choose to build a permanent Dyson Sphere
> before the final stretch. Everything leading up to that choice works for
> either route, so you don't need to decide now.
>
> If you're playing with Dark Fog, RED shows you a simple way to defend your
> first planet and clear a Dark Fog base. The guide doesn't try to cover the
> rest of Dark Fog combat.
>
> You'll also meet a few useful side projects along the way. You don't need to
> understand or choose them now. The guide introduces each one when it can help
> and explains the problem it solves.

### WIP-2 — Introductory language without moving the Glossary

Keep the Glossary in its current location. Replace the exposed guide-structure
jargon with the following player-facing language.

Replace the return reminder with:

> **Lost after a long play session?** Use the colored strip on the right, jump
> to the part of the route you're working on, and let **YOU ARE HERE** do the
> remembering. That's what it's for.

Replace the numbered usage instructions with:

1. **Jump to where you are in the route.** Use the colored strip on the right.
   If you're unsure, use the Quick Progress Index below.
2. **Read YOU ARE HERE first.** It reminds you what you just solved, what
   matters now, and what comes next.
3. **Scan the short summary.** It shows what to keep running, what to research
   next, what is likely to go wrong, and what you need before moving on.
4. **Open a build card only when you want to see how a useful product comes
   together.** One-time jobs stay in the main instructions.
5. **Read the rest only when you need to understand why.** You shouldn't have
   to reread a whole section just to recover one number.

Replace the later reminder with:

> You aren't expected to remember how every factory line fits together. Leave
> the guide open, disappear into the game for a while, and come back when you
> can no longer remember why half the belts exist.

The collapsed **Build-card assumptions** reference keeps its precise
vocabulary. Opening it is a deliberate request for technical detail, and the
Glossary remains immediately after the visible usage instructions.

### WIP-3 — BLUE Goal final draft

> Your first proper phase has two jobs, and they belong together. Build a mall
> so basic supplies are waiting in boxes instead of wasting time replicating
> everything yourself. The mall already makes the blue cube ingredients so use
> the same growing factory to keep blue research running on its own. You need
> both before you move on.
>
> Don’t wait until you can build everything at once. You can start each part of
> the mall as soon as you unlock its recipe. The first boxes will refill while
> blue research unlocks Thermal Power, Steel, and Foundation.
>
> Don't get stuck in this phase for too long automating every recipe you have.
> You will have plenty of downtime waiting for tech completions to fill with
> busy work.

### WIP-4 — Small Tools and collapsed Quick process convention

- Rename **Latitude-aware building** to **East-West Construction** and preserve
  its existing explanation unchanged.
- Keep the **Small modular blueprints** table row concise.
- Place the following collapsed procedure immediately below the Small Tools
  table:

> **Quick process — Capture a reusable branch**
>
> **Good first example:** A short smelting block with one input belt, a row of
> smelters and sorters, and one output belt. It is small, useful, and easy to
> repeat.
>
> 1. Open the Blueprint interface and press `Ctrl+C` to enter capture mode.
> 2. Drag a box around the branch you want to save.
> 3. Click individual belts or buildings to add or remove them until only the
>    reusable part is selected.

Adopt **Quick process — [task]** as the shared format for short procedures that
the guide requires but that would interrupt the main prose. Each procedure is
collapsed by default and placed beside the instruction it supports. RED's
sorter-filter procedure is the next intended use. The existing Dark Fog
procedure is a future candidate for the same treatment and is not changed by
this WiP item.

### WIP-5 — RED refinery-output Quick process

Place the following collapsed procedure beside RED's instruction to give each
refinery product its own belt:

> **Quick process — Split refinery outputs**
>
> 1. Run one belt for Hydrogen and another for Refined Oil.
> 2. Start placing a Sorter from the refinery to the first belt.
> 3. While the Sorter is still previewed, press `Tab` until the product you want
>    appears, then place it.
> 4. Repeat for the second belt and select the other product.

This procedure explains the omitted control without expanding into a general
Sorter tutorial. RED's broader phase purpose remains under discussion and is
not settled by this item.

RED's broader purpose is not limited to refinery-output management. Its
universal outcome is sustainable red research; managing Hydrogen and Refined
Oil is the phase's defining operating lesson, and storing Refined Oil prepares
later chemistry.

Preserve a separate future-development concept for Dark Fog guidance: consider
an enabled-by-default COMBAT/PEACE control, possibly attached to the navigation
strip, that can show or hide the guide's Dark Fog recommendations. This is not
an authorized design or implementation specification. Its placement, labels,
state behavior, affected content, accessibility, and relationship to phase
completion gates all require a separately scoped story and owner decisions.
Until then, leave the current mismatch unchanged: RED's Security Mall is marked
MANDATED and its prose requests completion before ILS, while the dashboard and
move-on checklist do not include Dark Fog preparation.

### WIP-6 — Four-stage ILS rush and chronological research ownership

The current Stage 1 statement that yellow cubes can begin accumulating before
departure is incorrect. Their Titanium Crystal input depends on the protected
Titanium haulback completed by the return trip in Stage 2. Yellow-cube
production therefore begins only after the player returns home.

Replace the current three-stage expedition structure with four stages:

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
3. **Produce the ILS pair and vessels**
   - Build the temporary Processor and yellow-cube lines.
   - Produce the first 200 yellow cubes.
   - Research High-Strength Titanium Alloy → Interstellar Logistics System.
   - Produce the protected component bill, two ILS towers, and five Logistics
     Vessels.
   - End when the complete transport-hardware package is assembled and
     protected.
4. **Place and automate the route**
   - Place the remote source station and connect the outpost smelters.
   - Place and power the home receiver.
   - Configure Remote Supply and Remote Demand, install the Vessels, filter the
     outputs, and manage the charging spike.
   - End when Titanium and Silicon reach home without Icarus.

The completed transport-hardware package is a substantive boundary: Stage 3
is a finite production job with protected materials, while Stage 4 deploys and
configures the permanent logistics system.

Assign research recommendations chronologically:

- **Stage 1:** flight, reconnaissance, and remote-smelting requirements.
- **Stage 2:** blue- and red-cube support branches researched while the
  expedition is underway.
- **Stage 3:** yellow-cube production followed by the two yellow-gated
  technologies.
- **Stage 4:** no mandatory research; deployment and verification only.

The future story must verify the complete prerequisite order against retained
technology data and preserve technology hover behavior. It must also update
ILS intra-navigation from three stage anchors to four—**I, II, III, IV**—and
align every resume target with the corresponding new stage heading.

### WIP-7 — YELLOW buildout research hierarchy

Replace YELLOW's current completed-technology recap and unrelated Integrated
Logistics suggestion with research guidance that supports the phase's large
construction job. Preserve the existing dashboard/detail information split.

The dashboard's **Research first** row should contain only three practical-path
groups, in this order:

1. **Buildout:** Mechanical Frame, Inventory Capacity, Communication Control,
   and Drone Engine.
2. **Mall access:** Distribution Logistics System.
3. **Resource horizon:** Vein Utilization Lv1.

Use commas, semicolons, line breaks, or group labels rather than arrows or plus
signs where technologies do not have a prerequisite relationship. The future
story must verify and deliberately bound the recommended ranks for the four
Icarus upgrade families; do not use an open-ended instruction such as “take
every affordable rank.”

The visible **Research first** prose should explain the same three groups in
short, player-facing language. Follow them with a visible Energy Storage
recommendation: Accumulators can absorb surplus generation and cushion
logistics-station charging shocks. Place this paragraph immediately before the
optional disclosure so Energy Storage reads as prudent preparation rather than
an afterthought or an equal dashboard priority.

End the section with a collapsed element titled **Optional research — Solve a
problem you can see**. Introduce these situational choices only inside it:

- **Cleared Dark Fog bases:** Solar Collection → Photon Frequency Conversion →
  Geothermal Extraction turns exposed core-drill sites into steady power.
- **Crowded production lines:** High-Speed Assembling offers more throughput
  per building at greater construction and power cost.
- **Expensive inputs:** Proliferator Mk.I → Proliferator Mk.II can provide extra
  products or faster production, but requires spray infrastructure and more
  power.
- **Weak carried fuel:** Combustible Unit → Explosive Unit provides a denser
  fuel option for Icarus.

This hierarchy means: the dashboard states the practical path; visible prose
explains that path and adds accumulator preparation; collapsed content offers
problem-specific tools without making them YELLOW gates. Geothermal remains
conditional and does not resolve RED's separate Dark Fog gate mismatch.

### WIP-8 — PURPLE phase-owned research and buildout upgrades

Keep PURPLE focused on work that unlocks or supports PURPLE. Deuterium,
Miniature Particle Colliders, and fusion-power preparation do not unblock this
phase and belong in GREEN, where their production and power requirements
become current concerns.

Preserve the dashboard's three-group surface pattern:

1. **Purple gate:** High-Strength Material → Particle Control → Information
   Matrix.
2. **Buildout:** Mecha Core Lv3 plus deliberately bounded builder and energy
   upgrades.
3. **Logistics:** deliberately bounded Logistics Carrier Engine and Logistics
   Carrier Capacity upgrades.

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
- recommend the next deliberate Vein Utilization rank as a visible prose-only
  resource-horizon improvement.

If optional problem-solvers are retained, place them in a collapsed element
after the visible prose. Candidate topics are Research Speed when research
Labs—not cube production—are the actual constraint, Integrated Logistics and
cargo-stacking tools when transport throughput is visibly constrained, and
useful YELLOW options the player previously deferred. Do not turn skipped
options into new PURPLE requirements.

The future story must verify exact costs, availability, and stopping ranks
against retained technology data. Do not use vague or open-ended rank advice.

### WIP-9 — GREEN Collider route, fuel, and controlled power growth

The earlier no-change assessment of GREEN was premature. Preserve its existing
dashboard, four-part research summary, cube-production descriptions, cards,
and phase gate. Expand only the practical progression around the guide's
chosen Deuterium route and its consequences.

The guide chooses Miniature Particle Colliders for Deuterium because they form
a compact, deterministic, seed-independent line and use the same machine type
required for Strange Matter. This is the simplest dependable first-completion
route, not the most material- or power-efficient route. Its important costs are
heavy Hydrogen consumption, competition with Casimir Crystal production, and
a large additional power load.

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

Do not change the research dashboard. Extend the visible **Research first**
prose with this supporting order while preserving the existing Quantum, Frame,
Gravity, and convergence explanations:

> After **Miniature Particle Collider**, research **Deuterium Fractionation →
> Mini Fusion Power Generation**. Deuterium Fractionation is only a prerequisite
> for fusion here; this guide still makes Deuterium with Colliders. Then continue
> through **Strange Matter → Gravitational Wave Refraction**.

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

### WIP-10 — DYSON chosen sail-life route and reference ownership

Apply the same route-ownership rule used in GREEN. The guide chooses Solar Sail
Life Lv1 → Solar Sail Life Lv2 before full launch-network scale, explains the
tradeoff, and provides figures only for that chosen route. Alternatives may be
mentioned but must not receive instructions or a precise parallel calculation.

Preserve the opening live-behavior paragraph in **How much is enough**. Replace
the dense calculation paragraph with the following chosen-route explanation:

> This guide assumes Solar Sail Life Lv1 → Lv2 before the launch network reaches
> full scale. The upgrades keep each sail in orbit longer, reducing the number
> of replacements the factory and Ejectors must provide. You can skip them and
> compensate with more sail production and more successful launches, but this
> guide does not plan that route.

Follow it with the chosen reference calculation:

> With both Solar Sail Life upgrades, the reference swarm uses 405 Solar
> Sails/min of installed production and needs about 383 successful launches/min.
> Sixty Ejectors averaging 32% firing time provide about 384 launches/min. This
> is a planning reference, not a finish line: placed Ejectors matter only when
> their orbit and firing window let them launch.

Use this short general disclaimer:

> Treat the reference as a starting point. The factory and star you actually
> built will decide what is enough.

Remove the exact no-upgrade comparison. Do not include the Receiver-array
power requirement in this clarification.

Preserve the following Antimatter concept, with final wording and placement to
be reviewed during the DYSON/SPHERE → PHOTON restructuring:

> The Receiver array will begin storing Antimatter before the reference swarm
> is complete. Keep it running while the swarm grows and PHOTON strengthens the
> system. Reaching 2,000 stored Antimatter later is the midpoint used to enter
> WHITE; it is not a requirement for leaving DYSON.

The future restructuring must assign Receiver-power information as follows:

- DYSON and SPHERE each teach the initial Receiver-array procedure needed to
  complete their transition.
- Each procedure preserves the unaltered baseline: four fully warmed, lensed
  Receivers at Ray Efficiency Lv0 require at least 1.655 GW of live Dyson
  generation.
- The baseline describes the initial array before later efficiency upgrades;
  it is not the future total power requirement.
- PHOTON owns Ray Receiver Efficiency research, the resulting changed demand,
  and any revised late-phase power recommendation.
- Do not calculate or promise the upgraded PHOTON requirement until that
  design is settled.

### WIP-11 — Shared Receiver bridge and PHOTON stabilization gate

Do not duplicate the required Receiver procedure inside DYSON and SPHERE.
Create one canonical visible operational reference between SPHERE and PHOTON,
with a stable anchor such as `#receiver-antimatter-bridge`:

```text
DYSON ──┐
        ├── Receiver and Antimatter bridge ── PHOTON
SPHERE ─┘
```

Both orbital paths link to this same element from their gate and **Next**
language. Use one semantic HTML source rather than cloned content or
template-rendering JavaScript. Do not collapse it or present it as a production
card because it contains required progression instructions.

DYSON owns useful swarm generation. SPHERE owns useful permanent generation.
The shared bridge converts either source into the common Antimatter line and
owns:

- Planetary Ionosphere Utilization → Dirac Inversion Mechanism;
- four Ray Receivers;
- Graviton Lens supply;
- Photon Generation mode and Receiver warm-up;
- the unchanged starting reference that four fully warmed, lensed Receivers at
  Ray Efficiency Lv0 require at least 1.655 GW of live Dyson generation;
- Critical Photon transport into a Miniature Particle Collider using Photon
  Materialization;
- visible Antimatter storage; and
- a clear returned-Hydrogen outlet.

The bridge completes when all four Receivers are configured and lensed,
Critical Photons reach the Collider, Antimatter accumulates reliably, and the
returned-Hydrogen outlet remains clear. It then directs the reader into PHOTON.

PHOTON recommends exactly:

> Ray Transmission Efficiency Lv1 → Ray Transmission Efficiency Lv2

Stop the guide's recommendation after two ranks. Do not mention or recommend
further investment. The shared bridge's 1.655 GW figure remains the unaltered
pre-upgrade comparison; do not promise an unsettled upgraded total-power
requirement.

Distinguish array design headroom from the effective WHITE gate:

- **48 Antimatter/min** is the four-Receiver array's comfortable maximum and
  design headroom.
- **40 Antimatter/min sustained** is sufficient to support WHITE's promised
  40/min baseline.
- Brief movement below 48 is not a failure if Antimatter remains at or above
  40/min and storage continues growing.

Use this player-facing direction:

> Aim for the full 48/min array output, but proceed when Antimatter remains at
> or above 40/min and the stored reserve continues growing.

PHOTON's eventual checklist must require every colored Matrix to sustain at
least 40/min, Antimatter to sustain at least 40/min, and at least 2,000
Antimatter in storage before WHITE. The exact PHOTON prose and placement of its
stabilization guidance remain for the PHOTON topic; the ownership, two-rank
recommendation, shared reference, and gate semantics are settled here.

### WIP-12 — PHOTON stabilization and supporting research

PHOTON does not introduce another cube color. Preserve the grouped research
pattern, but use it to strengthen the factory already built rather than to
present another unlock path. The dashboard's **Research next** row should use
these three visible groups:

1. **Receiver efficiency:** Ray Transmission Efficiency Lv1 → Ray
   Transmission Efficiency Lv2.
2. **Resource supply:** Vein Utilization Lv3, following the planned Lv1 in
   YELLOW and Lv2 in PURPLE.
3. **Faster production:** Plane-Filter Smelting; High-Speed Assembling →
   Quantum Printing.

The faster production technologies give the player compact tools for a
specific old line that cannot sustain WHITE's pace. Do not instruct the player
to rebuild healthy production merely because faster machines are available.
In the visible prose, conditionally recommend the next deliberately bounded
Logistics Carrier Engine and Logistics Carrier Capacity ranks only when an
imported material is arriving too slowly. Do not recommend Research Speed,
Sorter Cargo Stacking, Controlled Annihilation Reaction, Artificial Star, or
Universe Matrix here. The shared Receiver bridge already completes PHOTON's
only implied WHITE prerequisite, Dirac Inversion Mechanism; WHITE retains
ownership of Universe Matrix.

Use this reader-facing **Goal** treatment:

> You have made Antimatter. Now make the whole finish dependable.
>
> Keep the Receiver array working while you check the five cube lines built
> during the earlier phases. Bring every cube color and Antimatter to at least
> 40/min, then fix only the first supply line that falls behind. Let the
> Antimatter reserve grow to 2,000 while you work.
>
> PHOTON is complete when WHITE can begin without immediately starving.

The shared Receiver bridge owns the required process explanation. Do not
repeat that procedure in PHOTON.

Use this treatment for **Bring every cube line to WHITE pace**:

> Open the Statistics Panel and check blue, red, yellow, purple, and green
> cubes. Each color must hold at least 40/min.
>
> Start with the first color below the target. Follow its production line
> backward until you find the missing material, then strengthen that branch.
> Leave every line that already holds 40/min alone.

Use **cube** in reader-facing prose. Reserve **Matrix** for literal technology
names such as Universe Matrix.

Preserve the settled Antimatter direction:

> Aim for the full 48/min array output, but proceed when Antimatter remains at
> or above 40/min and the stored reserve continues growing.

Connect the Receiver upgrades to that outcome without adding another power
calculation:

> The two Ray Transmission Efficiency upgrades reduce the Dyson power needed
> by the array. Give the Receivers time to settle after each upgrade, then
> check whether Antimatter remains above 40/min.

Use simple, player-facing **Watch for** guidance:

- **A short burst can fool you.** Let the factory run for a few minutes before
  trusting the displayed rate.
- **Fix the first shortage you can see.** Follow the weak cube line backward
  and strengthen only the branch holding it down.
- **Do not chase every dip below 48 Antimatter/min.** The line is ready when it
  stays at or above 40/min and storage keeps growing.
- **Keep the returned Hydrogen moving.** If its output stops, Antimatter stops
  with it.

Research choices are methods, not gates. Use the same two outcome conditions
for **Ready to move on when** and the **Next** checklist:

- blue, red, yellow, purple, green, and Antimatter each sustain at least
  40/min; and
- at least 2,000 Antimatter is stored.

Remove the present superfluous instruction to keep things running after the
two-item **Next** checklist.

### WIP-13 — WARP expedition framing and route support

Keep WARP's three-stage structure, rare-resource comparison, Warper recipes,
route figures, and completion gate. Refine the mission framing and supporting
references without expanding the capability's scope.

Replace the distant Mission brief with this player-facing treatment:

> A useful rare resource is waiting beyond your home system. Choose one that
> removes work from a factory line you already care about, pack a small
> outpost, and fly there yourself. Build the source, bring the first load home,
> then replace the personal cargo run with Logistics Vessels when green cubes
> make Warpers cheap.
>
> WARP is a shortcut, not a required detour. Make the trip when you can name
> the problem it will solve.

Retain the existing warning that the trip should solve a named bottleneck
rather than follow the attraction of the cluster map.

Rename the capability table's first column from **Warp capability** to
**Expedition capability** and present these three rows in stage order:

1. **Nearby survey:** reveal nearby systems and their resources before choosing
   a destination — Cosmic Exploration Lv3.
2. **Mecha warp:** let Icarus scout, build the outpost, and carry the first load
   home — Drive Engine Lv4.
3. **Vessel warp:** replace the personal cargo trip with an automated route —
   Logistics Carrier Engine Lv4.

Add one row to the Stage II **Pack** table:

> **1,000 Foundation** — an optional stack for flattening awkward terrain
> around veins and making room for the source outpost.

Keep the purpose explicitly optional. Do not imply that every resource world
should be paved.

In Stage III, place a short Carrier Capacity recommendation after the initial
fleet instructions and before the existing route-scaling advice:

> **Long route still falling behind?** Logistics Carrier Capacity lets every
> Vessel bring more material home. It is a powerful optional multiplier for a
> distant route, not a requirement for turning the route on.

Present route strengthening in this practical order: add Vessels while station
slots remain; improve Carrier Capacity when each long trip needs to accomplish
more; expand the source only when the remote buffer cannot remain full.

### WIP-14 — Statistics Panel introduction and canonical walkthrough

Introduce the Statistics Panel during BLUE, but place its full canonical
walkthrough in the troubleshooting reference. The panel is a general
diagnostic tool rather than a BLUE mechanic, and a useful example needs later
scope, storage, and import behavior. Do not duplicate the tutorial.

Add this concise entry to BLUE's **Small tools** table:

> **Statistics Panel** — Press `P` to see what the factory is actually
> producing, consuming, importing, and storing. Use the [Production Statistics
> walkthrough](#production-statistics-walkthrough) when a line slows down and
> the cause is not visible.

Add one collapsed **Quick process — Find a shortage with Production
Statistics** after the ordered troubleshooting questions. Give it the stable
anchor `#production-statistics-walkthrough` so BLUE and later phase guidance
can link to one source.

Use the current installed-game investigation in
[Statistics Panel runtime evidence](statistics-panel-runtime-evidence.md) as
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

### WIP-15 — LOGISTICS introduction and route model

Preserve the existing LOGISTICS dashboard, buffer targets, Research first
recap, production cards, and troubleshooting material. Replace only the
introductory teaching layer. The copy below records the agreed structure and
substance; refine its exact reader-facing wording during the future story.

Remove the unsupported opening claim that a good blueprint becomes a complete
factory district in a few clicks. LOGISTICS teaches and automates transport
infrastructure; it does not make a pasted district operational by itself.

Open **Goal** by naming the player's actual problem and the section's bounded
solution:

> Your factory already moves materials for you, but every expansion still
> needs the same transport hardware. If each new district sends you back to
> handcraft another tower and set of carriers, automate them here.
>
> Build limited buffers for Distributors, PLS, ILS, Bots, Drones, and Vessels.
> Their production lines should refill after an expansion project, then stop
> until you take the next batch.

Follow the Goal with a small **Choose the right logistics layer** table:

| Use | Hardware | What it connects |
| --- | --- | --- |
| Nearby delivery | Distributor + Logistics Bots | Icarus and nearby storage boxes |
| Planetary delivery | PLS + Logistics Drones | Two places on the same planet |
| Planetary or stellar delivery | ILS + Drones/Vessels | Local routes with Drones; other planets or stars with Vessels |

Give the reader this practical selection rule:

> Use the smallest layer that reaches the job. A nearby box does not need a
> tower, and two factories on the same planet do not need a Vessel route.

Then add a short **Set the route** explanation:

> Every route needs matching items at both ends. **Supply** makes an item
> available, **Demand** asks the network to deliver it, and **Storage** keeps
> the item out of that network.
>
> **Local** settings control Drone traffic on the same planet. **Remote**
> settings control Vessel traffic between planets. Interstellar Vessel routes
> also need Warpers. Before troubleshooting anything complicated, confirm that
> one end supplies, the other demands, and the station operating the carriers
> has the required power and hardware.

Do not imply that both route endpoints require power or carriers. Preserve the
WARP-supported pattern in which a powered destination can collect from an
unpowered provider.

The finished teaching order should be: why the hardware is automated; which
transport layer fits the job; which settings create the route; existing cards
for automating the hardware; existing troubleshooting for routes that still
fail.

### WIP-16 — Final One-Screen Default Checklist synchronization

Defer implementation until every preceding accepted content and structural
change has been implemented. The One-Screen Default Checklist is a derived
summary of the completed default route, not an independent source of phase
requirements. Rebuild it from the final phase gates rather than incrementally
editing its historical wording.

Apply these synchronization rules:

- copy outcomes from each final **Ready to move on when** gate, not methods;
- omit research recommendations, tutorials, troubleshooting steps, optional
  optimizations, and card reference targets unless they are themselves an
  accepted phase gate;
- keep WARP, LOGISTICS, and the optional SPHERE route outside the default-route
  checklist;
- use the fewest checks that prove each phase is complete;
- use **cube** in reader-facing language and reserve **Matrix** for literal
  technology names;
- represent the shared Receiver and Antimatter bridge exactly once at the
  DYSON/SPHERE → PHOTON boundary;
- audit every final checklist claim against the section that owns it; and
- preserve existing browser checklist state with deliberate storage-key
  aliases where practical after final wording is known.

The restructured DYSON checklist must follow DYSON's transition outcomes, not
its planning-reference figures. It should require that Solar Sail production
and the Ejector launch infrastructure are automated and operating, and that
the resulting live Dyson generation is useful enough to proceed to the shared
Receiver bridge. Do not place the `405/min` Solar Sail reference or the
60-Ejector buffer reference in the One-Screen Default Checklist. Those figures
remain reference material in their approved DYSON locations and are not phase
gates.

The existing inactive
`one-screen-checklist-correction-story.md` preserves an earlier decision to
replace obsolete `517.5/min` and 80-Ejector checklist figures with `405/min`
and 60. The comprehensive synchronization supersedes that narrow correction:
remove the obsolete exact figures without replacing them with new exact
figures, then retire or supersede the inactive record when the comprehensive
story is authorized. Do not schedule or implement both records separately.

The exact Receiver-bridge checklist placement may be selected after the
canonical bridge exists. This is a final presentation decision, not a blocker
to the synchronization contract: bridge conditions must appear once, remain
mandatory on the default route, and must not be duplicated under both DYSON
and PHOTON.

### WIP-17 — Troubleshooting ending and Statistics Panel handoff

Preserve the troubleshooting section's ordered FAQ format and its first four
questions and answers. Replace only the final question and the three obsolete
rate-class statements that follow the list. Do not turn this repair into the
guide's conclusion; the conclusion remains a separate final topic.

Replace the final question with:

> **Can I find the first place the product stops moving?**
> Start with the item you need and follow its production backward. Look for
> the first machine with a missing input, a full output, no power, or a
> transport connection that is not delivering. Use the [Production Statistics
> walkthrough](#production-statistics-walkthrough) when the factory is too
> spread out to follow by eye. Fix that one problem, let the line run, then
> check again.

This completes the troubleshooting sequence as: missing technology; missing
recipe or machine; unreliable material supply; manual transport dependency;
then the first physical stop inside an otherwise valid chain.

Remove the three standalone statements that classify lines as below minimum,
between minimum and comfortable, or above comfortable. Replace them with this
single rule:

> Fix one visible stop at a time. A quiet machine whose output is already full
> is waiting, not failing, and does not need to be expanded.

Place the canonical collapsed **Quick process — Find a shortage with
Production Statistics** from WIP-14 after the ordered questions, using the
stable `#production-statistics-walkthrough` anchor. The final question links to
that one source; do not repeat the walkthrough inside the FAQ answer.

### WIP-18 — Reader conclusion

Add one visible final section after troubleshooting. Do not collapse it or add
another objective, checklist, reference, card, link collection, button, or
return-to-top prompt. Its purpose is to recognize the player's work and the
practical skills learned along the route, then let the guide end.

Use this final draft:

> # The road is yours
>
> Mission Completed does not mean the factory is finished. It means you know
> how to finish one.
>
> You began beneath an alien sun with Icarus, a Replicator, and more work than
> answers. You now have a factory that reaches across planets, five cube lines
> converging into white science, a working Dyson project, and Antimatter moving
> without you.
>
> More importantly, you learned how to turn shortages into production lines,
> keep paired outputs moving, carry industry beyond the homeworld, grow power
> beside demand, and trace a stalled product back to its cause. Those skills
> will outlast every figure and factory layout in this guide.
>
> Build the permanent Sphere, expand across the cluster, raise your own
> targets, or begin again with a better plan. Congratulations, engineer. Dyson
> left directions; you built the road.

Keep **working Dyson project** broad enough to include both the swarm and
permanent-Sphere routes. Preserve the final sentence as the guide's actual end.

## 1. Introduction scope and closing line

- The final introductory paragraph does not mention Dark Fog. A blanket scope
  exclusion would also be inaccurate because the guide already contains
  bounded Dark Fog advice and may later enhance it.
- The prose excludes a permanent pre-photon Dyson sphere even though the guide
  offers that route. The progression is deliberately planned so the reader can
  choose it without wasting resources or research on the non-permanent sphere
  path.
- The closing line asks the reader to select optional paths according to
  problems they can name. At this point, a new reader does not yet know which
  problems will arise or why an optional path would solve them. The finish does
  not match the substance of the introduction.

### Discussion status

- The scope distinction is accepted: the permanent Sphere is a supported route,
  Dark Fog receives bounded practical coverage, and other capabilities are
  introduced only when relevant.
- The first proposed wording was rejected as too abstract and technical for the
  guide's new-player audience.
- The current player-facing candidate is preserved as WIP-1.

## 2. Introductory terminology and Glossary placement

- The introductory prose uses terms before the Glossary defines them.
- Moving the collapsed Glossary earlier would be tolerable, but the preferred
  direction is to make the introduction understandable to a completely new
  reader without relying on jargon.

## 3. BLUE Goal prose

- The first paragraph begins in useful player-facing language, but its second
  sentence is long, fragmented, and technical. Preserve the opening voice and
  replace that sentence with two simpler sentences.
- The entire second paragraph has the same problem: complex ideas are
  compressed into fragmented user-manual language. It faces the player but
  does not currently deliver useful guidance.
- The desired style is concise, substantive, player-facing, and appropriate
  for a new or returning player.
- Owner-authored final draft preserved as WIP-3.

## 4. Small Tools table

- Rename **Latitude-aware building** to **East-West Construction**. Preserve
  its existing explanation.
- The blueprint entry recommends saving repeatable branches and stations but
  gives neither an example nor the minimum process needed to follow the advice.
- Add one simple reusable-branch example.
- Add a compact process: open the Blueprint interface, use `Ctrl+C` to enter
  capture mode, drag a box over the branch, then click elements to add or remove
  them until only the intended build remains.
- Do not turn this into a comprehensive Blueprint-interface guide.
- Final candidate and reusable collapsed-procedure convention preserved as
  WIP-4.

## 5. RED Goal and omitted sorter-filter process

- The Goal correctly identifies combined Refined Oil and Hydrogen management
  as the phase's major learning curve.
- “Give each product its own belt” implies selecting sorter filters, but the
  guide does not explain that the player can cycle through filters while
  previewing sorter placement.
- Consider a reusable mini-tutorial format for small procedures of this kind.
  It should remain collapsed by default and avoid interrupting prose flow.
- Preserve the accepted refinery-output procedure and broader RED-purpose
  interpretation as WIP-5.
- Defer reconciliation of conditional Dark Fog guidance and RED's completion
  gate to a future story. Preserve only the COMBAT/PEACE visibility-control
  concept; do not resolve or implement it in this pass.

## 6. ILS rush research order

- The first research discussion mentions five technologies, assumes two
  completed dependencies, and then presents the three minimum technologies
  needed to fly and smelt titanium. The implied Steel Smelting dependency for
  Titanium Smelting is not named.
- The following section then acknowledges two prerequisite technologies,
  undermining the earlier presentation as the primary order.
- The current detailed priority list is valuable, but it is presented in full
  during pre-flight preparation even though different technologies gate
  different ILS stages.
- Later ILS stages do not revisit research, apart from the appropriately placed
  yellow-cube technologies at the rush's final bridge gate.

### Proposed direction requiring decisions

- Establish one correct, chronological priority recommendation for the full
  ILS rush.
- Replace the existing three-stage structure with the agreed four-stage
  structure preserved as WIP-6, and segment the order accordingly.
- Place each stage's recommendation consistently after that stage's Goal
  prose.
- Preserve the current compact, ordered branch-chain pattern and its meaningful
  branch choices, limited to the relevant stage.
- Do not add explanatory flavor text for why each technology is selected.
- Preserve technology hover-tooltip behavior.
- Remove ILS-rush technologies from YELLOW's **Research first** material.
- Treat the false pre-departure yellow-cube claim and the fourth
  intra-navigation anchor as required parts of the future story.

## 7. YELLOW Research first

- The current prose names technologies already unlocked during the ILS rush
  and therefore does not serve its heading or purpose.
- Design a genuine YELLOW-phase research-priority recommendation to replace it.
- The remainder of YELLOW is considered straightforward, simple, and
  exemplary.
- Preserve the agreed dashboard, visible-prose, accumulator, and collapsed
  optional-research hierarchy as WIP-7. Exact Icarus upgrade stopping ranks
  remain for prerequisite and cost verification in the future story.

## 8. PURPLE Research first

- The Goal is good.
- The research recommendation is probably too short.
- Explain why High-Strength Material is prioritized: it supports Particle
  Collider construction.
- Deuterium becomes required soon, and fusion-power planning matters, but the
  actual production requirement belongs to the GREEN branch rather than
  PURPLE. The section needs a clearer reason for introducing this preparation
  here.
- The remainder of PURPLE is solid. The Processors card's presentation is
  especially effective and may be a reusable pattern for other key cards.
- Preserve the agreed phase-owned three-group dashboard, detailed prose, and
  prose-only resource-horizon recommendation as WIP-8. Exact upgrade ranks
  remain for retained-data verification in the future story.

## 9. GREEN section

- The original no-change assessment was premature. Preserve GREEN's excellent
  dashboard, four-part research summary, cube-production descriptions, cards,
  and gate.
- Add only the agreed Collider-route rationale, simplified alternatives,
  supporting fusion research order, and player-facing Deuterium–fuel–power
  loop preserved as WIP-9.

## 10. DYSON — How much is enough

- The second paragraph is long and dense.
- Replace its penultimate sentence with simpler, player-facing language that
  gives a short general accuracy disclaimer based on varying playthrough
  conditions without naming those conditions.
- Its final sentence is unrelated to the reference calculation and feels
  appended.
- Consider splitting the material into:
  1. the reference calculation;
  2. the baseline exception plus the short accuracy disclaimer;
  3. continuous antimatter banking by the eventual receiver array, including
     the 2,000-antimatter midway marker before the WHITE transition.
- Present the midway marker in context: it is not the DYSON phase gate and is
  not part of the preceding calculation.
- Preserve the agreed chosen-route explanation, upgraded-swarm reference,
  simplified disclaimer, Antimatter context, and future Receiver-baseline
  ownership as WIP-10.

## 11. DYSON–SPHERE–PHOTON structure and early lensing

- Graviton-lens receiver operation can begin during DYSON, before PHOTON, and
  can materially increase antimatter production while continuous reception is
  still being established.
- SPHERE can probably use the same early-lensing timing before its PHOTON
  transition.
- Review technology priorities across DYSON, SPHERE, and PHOTON before deciding
  how to restructure these instructions.
- Preserve the agreed single-source Receiver bridge, research ownership, and
  transition structure as WIP-11.

## 12. SPHERE receiver-array preparation

- SPHERE expects the reader to establish and lens the receiver array and begin
  antimatter production.
- The instructions and research needed to do so currently appear only in the
  following PHOTON phase.
- This concern is resolved structurally by WIP-11: DYSON and SPHERE converge on
  one required Receiver and Antimatter bridge rather than duplicating the
  procedure.

## 13. PHOTON purpose, research, and gate

- Review the PHOTON research recommendation. Dirac Inversion Mechanism probably
  belongs in the preceding mutually exclusive DYSON and SPHERE paths.
- The guide does not mention Ray Receiver Efficiency upgrades. These can reduce
  receiver-array power demand and help stabilize a 48/min antimatter rate
  sooner.
- Ray receiver placement, graviton-lens supply, photon-generation mode, and
  antimatter breakdown belong in DYSON and SPHERE because those procedures
  prepare the conditions needed to complete the chosen preceding path.
- The procedure may be duplicated between DYSON and SPHERE because those paths
  are mutually exclusive for guide purposes. Do not repeat it verbatim again
  in PHOTON.
- Preserve the existing procedure's prose and presentation when relocating it;
  decide where it belongs in each phase's current order.
- Refocus PHOTON on stabilizing and strengthening the selected DYSON or SPHERE
  path:
  - expand and monitor earlier cube production so every cube sustains at least
    40/min;
  - establish reliable receiver-array antimatter output of 48/min;
  - prepare both conditions for WHITE's final push.
- Preserve the correct 2,000-antimatter midway storage marker.
- Move the split production-rate requirement into its own checklist item:
  verify at least 40/min across every cube and antimatter before entering WHITE
  comfortably.
- WIP-11 settles the shared procedure ownership, exactly two Ray Transmission
  Efficiency ranks, 48/min as design headroom, and a sustained 40/min
  Antimatter gate paired with 2,000 stored Antimatter and 40/min from every
  colored Matrix. Exact PHOTON stabilization prose and its placement remain to
  be reviewed.

## 14. WHITE

- No changes requested.

## 15. WARP

- Rewrite the Mission Brief in closer, more player-facing language.
- Add **Cosmic Exploration Lv3** as the first row of the capability-explanation
  table, using the existing row format.
- Add one stack of 1,000 Foundation to the Pack list for optional terraforming
  around veins.
- Mention carrier-capacity technology upgrades as a powerful optional
  multiplier for longer routes.

## 16. LOGISTICS Goal

- The Goal opens with an unsupported claim, compresses a dense set of concerns
  into one fragmented sentence, and then blurs important distinctions to stay
  brief.
- Later material does not expand those omitted instructions; it provides only
  an effective troubleshooting guide.
- Rewrite the introduction so it properly prepares the reader for the
  capability in both style and substance while preserving the strong
  troubleshooting material.

## 17. One-Screen Default Checklist

- Update this last, after every other accepted guide change is decided and
  implemented, so it reflects the resulting guide accurately.

## 18. Troubleshooting ending

- The FAQ format and question selection are good except for the final question.
- The final answer and the three following standalone statements refer
  historically to full build-specification cards with precise rate classes.
  Remove those references.
- Discuss and provide an appropriate replacement rather than deleting the
  ending without substitution.

## 19. Missing conclusion

- The guide currently ends on troubleshooting, which is an unsatisfying final
  note.
- Add a conclusion that congratulates the reader on what they have learned and
  recognizes the effort required to complete the game with the guide.

## Cross-topic dependencies

- Resolve the ILS staged research order before rewriting YELLOW Research first.
- Resolve receiver research and procedure ownership across DYSON and SPHERE
  before refocusing PHOTON.
- Decide whether the collapsed mini-tutorial pattern introduced for RED should
  also carry the Small Tools Blueprint procedure.
- Revisit the One-Screen Default Checklist only after all accepted content and
  structural changes are complete.
