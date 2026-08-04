# Card System Reader-Value Review

> **Archived:** This review records the oversized legacy card system and the
> reasoning used to replace it. The active contract is
> [`../CARD_SYSTEM_PLAN.md`](../CARD_SYSTEM_PLAN.md).

Status: historical audit supporting the implemented card system.

The implemented 19-card system in `CARD_SYSTEM_PLAN.md` supersedes this review's
earlier provisional size estimate.

This document isolates the current card system from the rest of the guide and
reviews it as a player-facing tool. Phase prose, navigation, research advice,
and the universal dependency DAG are deliberately outside this review except
where a card has absorbed material that belongs in one of those places.

The current guide contains **63 cards**. That count is not evidence of
completeness or quality. A recipe can be correct, fully linked, and still have
no business occupying a card.

## Reader contract

A card earns its place only when it helps a player answer a real question at
the moment they are likely to ask it.

1. **One card represents one useful build decision or reusable operating
   module.** It does not represent one node in the item DAG.
2. **The title names the result the reader came looking for.** A rate belongs
   in the title only when sustaining that rate is useful.
3. **Input tells the reader what established supplies must arrive.** It may
   link to a genuinely reusable upstream module, but it must not create a new
   card merely to make the dependency graph tidy.
4. **Pipeline tells the reader what to place now.** It is not a transitive
   recipe closure and does not repeat linked upstream factories.
5. **Output tells the reader what leaves the module and where it should go.**
   A buffer or timer is included only when it changes a practical decision.
6. **Operating notes explain operation, not authorship or arithmetic.**
7. **Surplus means a real, usable net byproduct at the advertised operating
   rate.** Unused installed capacity is not surplus.
8. **Mall cards optimize convenience, not theoretical saturation.** A
   one-assembler mall output does not justify a private mine and a fully
   saturated upstream factory if a shared belt or modest buffer serves the
   player better.
9. **Direct extraction and trivial one-step substitutions usually belong in a
   compact reference table or prose.** They become cards only when their
   logistics or operation is itself a meaningful problem.
10. **No card exists for organizational symmetry.** “Every intermediate gets
    a card” is a development rule, not a reader need.

## Verdicts

- **KEEP** — the card answers a useful, distinct player question.
- **SIMPLIFY** — the card deserves to exist, but the current implementation
  overbuilds, overexplains, or presents irrelevant precision.
- **MERGE** — the information is useful, but not as an independent card.
- **REJECT** — the card is primarily a DAG node, organizational artifact, or
  out-of-scope diversion.

These are editorial verdicts, not recipe verdicts. A MERGE or REJECT verdict
does not claim that the underlying recipe or number is false.

## Complete card inventory and first-pass verdict

### BOOTSTRAP

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 1 | **Starter Ingots — 60 Iron/min + 60 Copper/min** | Gives a beginner the first two smelting lines and a small stock of the materials used almost everywhere. | The build is useful. Full-box fill times and pickup arithmetic add precision without helping the player decide what to build. | **SIMPLIFY** |
| 2 | **Basic components — 90 Magnetic Coils/min + 90 Circuit Boards/min** | Establishes the paired component block that feeds blue science and much of the first mall. | The paired output is a natural module. The dedicated raw draw, 6,000-item fill times, staged Magnet box, spare-capacity calculation, and pickup timers turn an elementary build into an operating manual. | **SIMPLIFY** |
| 3 | **Mall logistics — 135 Belts/min + 45 Sorters/min** | Lets the player stop handcrafting the two things consumed continuously while building everything else. | Clear phase need, clear outputs, modest scope. This is what a mall card should feel like. | **KEEP** |
| 4 | **Mall industry — Miners, Smelters & Mk.I Assemblers** | Automates the machines used to expand raw extraction and production. | The outputs belong together, but the present card builds a private 540-Iron/min support plant and two full Basic Component modules so three limited boxes can refill in roughly two to three minutes. That serves assembler-capacity math, not a beginner. | **SIMPLIFY** |
| 5 | **Mall storage — Storage Mk.I + Storage Tanks** | Automates the containers needed for solids and early fluids. | The outputs are useful together. Dedicated mines and a full smelting block are disproportionate for a bursty mall line that should draw from shared Iron, Stone Brick, and Glass supplies. | **SIMPLIFY** |
| 6 | **Mall power — Wind Turbines, Tesla Towers & Combustible Units** | Automates the first grid expansion hardware and a convenient mecha fuel. | Useful outputs, but the current self-sufficient upstream factory and “surplus capacity” bookkeeping are much larger than the practical decision. This should be a compact shared-bus mall block. | **SIMPLIFY** |
| 7 | **Tech-bound mall — Steel + Foundations** | Handles outputs whose recipes arrive after the first mall pieces can be placed. | The timing warning is useful; Steel and Foundations are not one operational module. Steel already has a later dedicated card, while Foundation belongs with terrain preparation. This card exists to solve an editorial sequencing problem. | **MERGE** |
| 8 | **Basic combat — 45 Magnum Ammo/min + 22.5 Missile Sets/min** | Provides early ammunition for a default-settings Dark Fog contingency. | Combat is outside the guide’s progression contract, and combining two unrelated ammunition chains does not create a progression build. Keep a concise defensive note or optional reference, not a mandated BOOTSTRAP card. | **REJECT** |

### BLUE

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 9 | **Blue cubes — 40/min + component reserves** | Starts sustainable research while retaining Coils and Circuit Boards for construction. | It answers the phase’s central question and teaches a useful shared-output arrangement. The reserves make sense because the components have immediate non-science uses. | **KEEP** |

### RED

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 10 | **Red cubes — 20/min with balanced refinery outputs** | Builds the first oil economy and prevents Hydrogen or Refined Oil from deadlocking the shared refinery block. | The card’s value is operational, not merely numerical. Its balanced-output warning is exactly the kind of help a new player needs. | **KEEP** |

### TITANIUM

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 11 | **Remote Titanium Ingots — 120/min; first reserve 860** | Sizes the first off-world Titanium smelting line and identifies the finite return load needed for the ILS transition. | It supports a concrete expedition decision and keeps the player from making repeated tiny trips. | **KEEP** |
| 12 | **Remote High-Purity Silicon — 120/min; first reserve 520** | Adds efficient Silicon production to the same first off-world foothold. | It is a second, independently useful output with a different reserve target. The card is small enough that the separate lookup remains helpful. | **KEEP** |

### ILS

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 13 | **ILS research batch — 200 yellow cubes at 15/min** | Converts the first Titanium haul into the exact research batch for Titanium Alloy and ILS. | This is a finite milestone operation, not arbitrary science scaling. It belongs. | **KEEP** |
| 14 | **Steel — 180/min; first reserve 260** | Supplies PLS/ILS hardware and gives the player a finite first stock target. | Steel is simple, reusable, and needed immediately. This should be the canonical Steel card; the earlier tech-bound card should not duplicate it. | **KEEP** |
| 15 | **Titanium Alloy — 20/min; first batch 180** | Builds the distinctive material needed for ILS and several later systems. | It answers a real first-batch question and remains useful later. | **KEEP** |
| 16 | **Processors — 45/min; first batch 130** | Establishes the Silicon-heavy reusable component line needed for logistics and later science. | This is a real reusable module with enough internal complexity to justify a card. | **KEEP** |
| 17 | **Electromagnetic Turbines — 22.5/min; first batch 210** | Builds the motor chain used by Particle Containers, logistics craft, and many later machines. | This is a recurring bottleneck and a practical reusable module. | **KEEP** |
| 18 | **Graphene — 120/min standard module** | Establishes the standard Graphene line before rare-resource shortcuts exist. | Graphene becomes a shared constraint across Particle Containers, Carbon Nanotubes, Casimir Crystals, and Solar Sails. A canonical standard-route card is useful. | **KEEP** |
| 19 | **Particle Containers — 11.25/min; first batch 80** | Combines Turbines and Graphene into the final difficult component for the first PLS/ILS pair. | It is a clear convergence module and a genuine ILS hardware gate. | **KEEP** |

### YELLOW

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 20 | **Yellow cubes — 22.5/min sustainable line** | Replaces the finite ILS bootstrap batch with a stable yellow-science chain. | It is the phase’s explicit output and teaches the coupled oil/Organic Crystal route. | **KEEP** |

### PURPLE

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 21 | **Carbon Nanotubes — 60/min** | Builds one of Particle Broadband’s three immediate inputs from the established Graphene line. | The standard Nanotube chain is operationally meaningful and is reused later. The link to the existing Graphene module prevents unnecessary repetition. | **KEEP** |
| 22 | **Plastic — 40/min** | Scales the Plastic branch needed for Particle Broadband. | The output is useful, but the current card again exposes the shared-refinery accounting and byproduct capacity more prominently than the simple need: supply Refined Oil and Graphite, make Plastic, buffer it. | **SIMPLIFY** |
| 23 | **Crystal Silicon — 90/min** | Provides Particle Broadband’s third immediate input. | This is one raw input, one Smelter step, and one box. It became a card because the DAG has a node, not because the player needs a separate operating module. Fold it into Particle Broadband. | **MERGE** |
| 24 | **Particle Broadband — 22.5/min** | Converges Carbon Nanotubes, Plastic, and Crystal Silicon into the difficult purple-science component. | This is exactly where the separate upstream references help: the player can see the convergence without rereading three factories. | **KEEP** |
| 25 | **Purple cubes — 18/min** | Combines Processors and Particle Broadband into the phase output. | Small, clear convergence card. | **KEEP** |

### WARP

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 26 | **Space Warpers — 36/min from green cubes** | Automates the cheap post-green Warper recipe and feeds ILS transport. | It answers the route’s central logistics question and should remain the anchor card for WARP. | **KEEP** |
| 27 | **Mined Organic Crystals — 180/min extraction** | Shows that a rare vein can replace the standard oil/Plastic Organic Crystal chain. | The shortcut is valuable information, but a Miner feeding a logistics station is not a production module. Put the acquisition method and displaced chain in the rare-resource reference prose/table. | **REJECT** |
| 28 | **Pumped Sulfuric Acid — 50/min per Water Pump** | Shows that a sulfuric ocean replaces chemical Sulfuric Acid production. | This is a one-building extraction fact. A card adds ceremony without helping construction. | **REJECT** |
| 29 | **Graphene from Fire Ice — 180/min** | Replaces the standard Graphite + Sulfuric Acid Graphene route and produces Hydrogen alongside it. | This is a genuine alternate production system with a byproduct that affects operation. It earns a card. | **KEEP** |
| 30 | **Diamonds from Kimberlite Ore — 240/min** | Replaces Graphite-to-Diamond smelting. | The shortcut matters, but the implementation is a trivial one-step substitution. Keep it in the rare-resource comparison, not a full card. | **REJECT** |
| 31 | **Crystal Silicon from Fractal Silicon — 240/min** | Replaces High-Purity Silicon-to-Crystal Silicon smelting. | Like Kimberlite, it is useful route knowledge but not an independent operating module. | **REJECT** |
| 32 | **Casimir Crystals from Optical Grating Crystal — 22.5/min** | Replaces Titanium Crystals in the Casimir recipe and changes the Green/Sphere material burden. | This is a consequential alternate recipe with Hydrogen logistics and a meaningful displaced chain. | **KEEP** |
| 33 | **Photon Combiners from Optical Grating Crystal — 180/min** | Replaces Prism production in the Photon Combiner chain used by Solar Sails. | The shortcut materially changes a large Dyson build and is useful when the player is choosing a target system. | **KEEP** |
| 34 | **Carbon Nanotubes from Spiniform Crystal — 60/min** | Replaces the standard Graphene + Titanium + Sulfuric Acid Nanotube route. | The physical build is simple, but the shortcut removes an entire chemical chain. This remains provisionally useful; a playtest should decide whether it is better as a card or a rare-resource table row. | **KEEP** |
| 35 | **Particle Containers from Unipolar Magnets — 11.25/min** | Replaces Turbines in Particle Containers and provides a powerful late logistics shortcut. | The recipe changes a major bottleneck and the finite nature of Unipolar Magnets creates a real operating decision. | **KEEP** |

### GREEN

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 36 | **Organic Crystals — 30/min standard module** | Rebuilds the standard Organic Crystal chain at the scale needed by Casimir Crystals. | The chain is real, but it already exists inside the yellow-science system. The reader needs a clear instruction to reuse or expand that line, not another canonical copy that competes with the earlier implementation. Fold the necessary scaling into Casimir guidance or establish one earlier canonical Organic Crystal module. | **MERGE** |
| 37 | **Deuterium — 120/min by Collider** | Supplies Strange Matter from a deliberate Hydrogen source and warns the reader to monitor storage depletion. | Deuterium logistics is an operating problem of its own. A dedicated card is helpful even though the recipe is short. | **KEEP** |
| 38 | **Titanium Crystals — 22.5/min** | Converts Organic Crystals and Titanium Ingots for the Casimir branch. | This is one Assembler step whose only purpose here is to feed the next card. It is a DAG node masquerading as a module. Fold it into Casimir Crystals. | **MERGE** |
| 39 | **Casimir Crystals — 22.5/min** | Handles the high-volume Hydrogen convergence and feeds Plane Filters/Quantum Chips. | The Hydrogen logistics and multiple immediate inputs make this a distinct operational module. | **KEEP** |
| 40 | **Titanium Glass — 36/min** | Supplies Plane Filters. | The two Smelter steps are not independently operated at this scale; they are support machinery for Plane Filters/Quantum Chips. | **MERGE** |
| 41 | **Plane Filters — 15/min** | Supplies Quantum Chips from Casimir Crystals and Titanium Glass. | This card exists mainly so Quantum Chips can link to another node. The player’s actual build decision is the Quantum Chip branch. Fold the Filter and Glass machinery into that card. | **MERGE** |
| 42 | **Quantum Chips — 7.5/min** | Completes the Processor → Plane Filter branch and supplies Green science. | This is one of Green’s two major branch endpoints and a natural lookup target. | **KEEP** |
| 43 | **Strange Matter — 7.5/min** | Combines Deuterium, Particle Containers, and Iron into Green’s gravity branch. | The Collider, Deuterium draw, and reused Particle Container line make this a distinct operating module. | **KEEP** |
| 44 | **Graviton Lenses — 7.5/min** | Converts Strange Matter and Diamonds for Green cubes and later Ray Receiver lenses. | It is a small convergence step, but the output has a second independent use in PHOTON. Keep it provisionally; if card count is reduced further, merge it with Strange Matter rather than preserving it for DAG purity. | **KEEP** |
| 45 | **Green cubes — 10/min** | Converges Quantum Chips and Graviton Lenses into the phase output. | Clear and appropriately small. | **KEEP** |

### DYSON

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 46 | **Photon Combiners — 270/min** | Builds the immediate non-Graphene input for the high-volume Solar Sail line. | At this point it is only a scaling partition created to keep the Sail card atomic. The player came to build Solar Sails, not to operate a standalone Photon Combiner factory. Fold the machinery into the Sail card; retain the Optical Grating shortcut as the optional alternative. | **MERGE** |
| 47 | **Solar Sails — 517.5/min installed capacity** | Sizes the swarm-production line that supports the four-Receiver photon target. | The card is essential, but its installed-capacity framing, multiple linked copies, and capacity surplus invite the reader to solve the validator’s arithmetic rather than the practical sail target. Recenter it on required sustained launch supply and a storage/feeding arrangement. | **SIMPLIFY** |

### SPHERE

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 48 | **Casimir Crystals — 45/min for sphere components** | Scales the Green Casimir module for a sphere-specific demand. | This is not a new build concept; it is a duplicate at a different multiplier. Link the canonical Casimir card and state the required aggregate rate in the Sphere plan. | **MERGE** |
| 49 | **Quantum Chips — 15/min for rockets** | Scales the Green Quantum Chip module for rockets. | Again, the only novelty is the multiplier. A second card makes the same production chain appear to be a different system. | **MERGE** |
| 50 | **Frame Material — 60/min** | Establishes the Carbon Nanotube/Titanium Alloy material used by Dyson Sphere Components. | This is a new reusable Sphere intermediate and a natural lookup target. | **KEEP** |
| 51 | **Solar Sails — 67.5/min for sphere components** | Supplies the sails consumed as components rather than launched directly. | This is the same product and core production chain as DYSON at a different rate. Reuse the canonical Sail card and describe the allocation in Sphere planning. | **MERGE** |
| 52 | **Deuteron Fuel Rods — 30/min** | Supplies rocket production and gives the player a distinct Deuterium/Fuel Chamber module. | The product has independent use and a nontrivial multi-input chain. | **KEEP** |
| 53 | **Dyson Sphere Components — 16.875/min** | Combines Frame Material, Solar Sails, and Processors into the major rocket component. | This is a meaningful convergence module unique to the Sphere route. | **KEEP** |
| 54 | **Small Carrier Rockets — 7.5/min installed capacity** | Completes the Sphere production chain and feeds Vertical Launching Silos. | This is the route’s final manufactured output and a clear player-facing target. | **KEEP** |

### PHOTON

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 55 | **Critical Photons — up to 48/min from four lensed Receivers** | Configures and operates the orbital-to-item conversion that ordinary production cards cannot represent. | This is a justified infrastructure exception: receiver mode, lens feed, warm-up, and Dyson satisfaction are the actual build. | **KEEP** |
| 56 | **Antimatter — up to 48/min from the four-Receiver stream** | Converts the Receiver output through Photon Materialization and exposes the returned Hydrogen. | The Collider is a distinct terrestrial endpoint with its own operational byproduct. The separate lookup remains useful. | **KEEP** |

### WHITE

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 57 | **White cubes — 40/min** | Converges all five science colors and Antimatter into the final research product. | This is the guide’s final and clearest convergence card. | **KEEP** |

### LOGISTICS

| # | Current card | Why it exists and how the reader uses it | Reader-value assessment | Verdict |
|---:|---|---|---|---|
| 58 | **Logistics Distributors — 5.625/min installed capacity** | Automates one half of the low-volume distribution system. | A player normally builds Distributors and Bots as one mall capability. The self-sufficient full-rate support plant and capacity surplus are not useful independently. Pair with Bots. | **MERGE** |
| 59 | **Logistics Bots — 22.5/min** | Automates the mobile half of Distributor logistics. | Useful output, wrong unit of organization. Pair with Distributors in one limited-buffer mall card. | **MERGE** |
| 60 | **Planetary Logistics Stations — 2.25/min installed capacity** | Automates the tower used by the local Drone network. | The station and its Drones are deployed together. A paired mall block better matches the reader’s expansion task than two saturated factory models. | **MERGE** |
| 61 | **Logistics Drones — 11.25/min** | Automates the craft used by PLS and ILS for local movement. | Pair with PLS. Preserve separate output buffers inside the shared card. | **MERGE** |
| 62 | **Interstellar Logistics Stations — 1.5/min installed capacity** | Automates the tower used for remote Vessel routes. | The player’s task is to stock an interplanetary expansion kit, not to sustain 1.5 towers/min. Pair with Vessels and size limited buffers. | **MERGE** |
| 63 | **Logistics Vessels — 7.5/min** | Automates the craft that makes ILS routes work. | Pair with ILS. The current full-capacity upstream multiplication is mathematically valid but practically extravagant for a sleeping mall line. | **MERGE** |

## First-pass result

| Verdict | Cards | Meaning |
|---|---:|---|
| KEEP | 35 | The card concept earns a place, subject to ordinary copy review. |
| SIMPLIFY | 7 | The player-facing concept is useful; the present implementation is not. |
| MERGE | 16 | Preserve the information, but remove the independent card. |
| REJECT | 5 | Remove from the card system; retain only concise prose/table information if needed. |
| **Total** | **63** | |

This immediately answers the card-count question: **no, 63 independent cards
were not required to keep the guide simple.** At least 21 current cards do not
deserve independent status, and another seven are materially overbuilt.

## Second-pass challenge: where the first verdict is still too generous

The first pass deliberately asks whether each card has *some* plausible use.
That is not strict enough. A second pass asks whether the guide becomes worse
if the card disappears.

### Clear rejects

These should not survive as cards:

- Basic combat;
- mined Organic Crystals;
- pumped Sulfuric Acid;
- Kimberlite Diamonds;
- Fractal Silicon Crystal Silicon.

The four rare-resource facts belong in a compact WARP comparison that states
where the resource comes from and which baseline chain it replaces. The combat
line belongs in optional defensive prose if it remains at all.

### Clear organizational artifacts

These exist chiefly to make the dependency system mechanically uniform:

- Tech-bound mall;
- Purple Crystal Silicon;
- Green Titanium Crystals;
- Green Titanium Glass;
- Green Plane Filters;
- Dyson Photon Combiners;
- Sphere-scaled Casimir Crystals;
- Sphere-scaled Quantum Chips;
- Sphere-scaled Solar Sails.

Their machinery or scaling information should survive inside the build the
reader actually came to make. Their card boundaries should not.

### Cards most likely to frustrate a new player despite a KEEP/SIMPLIFY verdict

1. **Mall industry.** A beginner asking for automated Miners, Smelters, and
   Assemblers is told to build a dedicated support factory large enough to
   refill tiny boxes almost immediately. This is the strongest early example
   of the guide solving saturation arithmetic instead of the player’s problem.
2. **Mall storage and Mall power.** Both repeat the same mistake at a smaller
   scale: private raw-resource closures for outputs that should sip from an
   early shared bus and sleep most of the time.
3. **Basic components.** The inline Magnet buffer and exact pickup timing may
   be clever, but cleverness is not automatically helpful. The card should
   teach the paired component block first.
4. **Plastic.** Shared refinery output accounting remains more prominent than
   the straightforward Purple requirement.
5. **Solar Sails.** “Installed capacity” and linked module multiplication are
   validator concepts. The reader needs the sustainable sail supply required
   by the chosen orbital plan and a warning about storage depletion.
6. **Graviton Lenses.** It has a legitimate second use, but it may still be too
   small to justify a Green card. It should survive only if readers actually
   return to it for Receiver lens supply.
7. **Spiniform Carbon Nanotubes.** The shortcut is substantial, but the build
   is trivial. It is a borderline case between a card and the rare-resource
   comparison.

### Logistics should return to three player tasks

The six LOGISTICS products are real, but the player does not approach them as
six unrelated factories. The useful cards are:

1. **Distribution logistics kit** — Distributors + Bots;
2. **Planetary logistics kit** — PLS + Drones;
3. **Interstellar logistics kit** — ILS + Vessels.

Each should use limited output boxes and established shared inputs. None should
pretend its one output Assembler is a continuously saturated production
requirement.

### Green should be a pair of branches, not a recipe ladder

The player is solving two systems:

- **Quantum branch:** Casimir Crystals → Plane Filters → Quantum Chips;
- **Gravity branch:** Deuterium → Strange Matter → Graviton Lenses.

Titanium Crystals, Titanium Glass, and Plane Filters must remain visible in the
construction instructions, but they do not all need independent cards.

### A defensible future size is a consequence, not a target

Applying only the clear REJECT and MERGE decisions would remove substantially
more than the 25-card growth that prompted this review. Some merged pairs,
especially LOGISTICS, would become new combined cards, so the final count
cannot be obtained by subtraction alone.

A likely reader-centered system is roughly **40 to 44 cards**, with further
reductions possible if:

- Titanium and Silicon become one expedition card;
- borderline rare-resource recipe cards move into the WARP comparison;
- Graviton Lenses fold into the gravity branch;
- early mall cards share supplies instead of pretending to be independent
  saturated factories.

The number is not an acceptance criterion. If a 45th card answers a real
question, it belongs. If the 35th exists only to make the dependency graph
look complete, it does not.

## Recommended next course of action

Do not edit card copy yet.

1. Approve or revise the **KEEP / SIMPLIFY / MERGE / REJECT** boundaries.
2. Define the intended player task for every surviving card in one sentence.
3. Rebuild BOOTSTRAP first as the usability proof:
   - shared early supplies;
   - modest limited buffers;
   - no theoretical saturation plants;
   - no pickup arithmetic unless it changes a decision;
   - no “surplus” that is merely unused capacity.
4. Test those cards in a fresh opening hour before propagating the model.
5. Only then rebuild later phases, preserving useful recipe facts without
   restoring the universal DAG as the document structure.

The central correction is simple:

> The DAG proves what a factory needs. A card helps a person build it. Those
> are related jobs, not the same job.
