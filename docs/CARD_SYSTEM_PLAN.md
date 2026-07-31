# Proposed Companion Card System

Status: implemented in the published guide.

This plan applies the findings in `CARD_SYSTEM_REVIEW.md` and the subsequent
scope decisions. It defines what qualifies for a card, how technology-bound
lines progress, and which guide objectives should remain prose.

The implementation replaces the former card layer while preserving the
guide's progression structure and recipe values.

## Place in the guide

The progression guide is the product. Cards are optional reference tools that
sit beside it.

The guide tells the reader:

- what matters now;
- why the phase exists;
- what can safely wait;
- when an opportunity to move forward has appeared.

A card does one smaller job:

> Show the complete high-level production path to a phase-relevant end product
> that the reader is expected to automate.

The guide must remain useful if every card is collapsed or removed. A card
does not create a phase objective, a phase gate, or a reason to build
something. It supports an objective the guide has already established.

## Card eligibility test

A guide objective receives a card only when all of these are true:

1. **The guide recommends automating a named end product.**
2. **The line remains useful after the immediate phase action.** It may run
   continuously or sleep behind a limited output buffer.
3. **The reader benefits from seeing a complete production path.**
4. **The card can state a meaningful end-product rate, reserve, or stock
   target.**
5. **The material is not better expressed as a short procedure, configuration
   checklist, research sequence, or reference table.**

A valid recipe does not automatically pass this test.

### Natural branch endpoints

A substantial production branch may receive a card even when the phase's
headline output is assembled one step later.

The branch must:

- contain several meaningful production stages;
- be buildable and testable independently;
- have its own logistics or operating concerns;
- end in an item that is stored, reused, or appears as an input elsewhere.

When all branch outputs already have cards, their final convergence normally
stays in phase prose. A Matrix Lab or Assembler that merely combines completed
branch outputs is not automatically another useful card.

### Material that does not qualify

Use prose rather than a card for:

- one-time manual replication batches;
- finite research purchases;
- infrastructure placement and configuration;
- route settings;
- research-only capability unlocks;
- orbital mechanics;
- direct extraction that requires no meaningful production line;
- trivial alternate recipes better described beside the full standard line.

This distinction removes ILS and PHOTON from the card system without removing
their practical guidance from the guide.

## Deliberate numerical scope

Only the **end-product target** receives an exact figure.

Card internals do not prescribe:

- raw-resource draw rates;
- intermediate production rates;
- belt counts;
- miner coverage;
- machine counts;
- upstream module multipliers;
- unrestricted storage-fill times;
- pickup intervals;
- spare installed capacity.

The reader can see when a belt, machine, or storage buffer is starved and add
supply where needed. The card's job is to make sure the reader knows which
production stages must exist and how they connect.

This is an intentional transfer of agency, not missing documentation.

## Card contract

### Title

The title names the desired end product and its exact guide target.

Examples:

- `Processors — 45/min`
- `Mall Logistics — limited Belt and Sorter buffers`
- `First Off-World Smelting Outpost — 860 Titanium Ingots + 520 High-Purity Silicon`

The figure may be a sustained output, a finite reserve produced by a continuing
line, or a limited stock target. It must reflect a useful guide objective
rather than the maximum capacity of the final machine.

### Input

Input lists the **types of supplies** the full line needs.

- One resource or established supply type per bullet.
- No rates, machine counts, or upstream capacity arithmetic.
- A directly mined, pumped, or gathered resource is named plainly.
- An existing line may be referenced by product name, but the card must remain
  understandable without opening another card.
- References are navigation aids, not missing steps in the explanation.

### Pipeline

Pipeline gives the complete high-level route from those inputs to the end
product.

- List branches in the order the reader builds them.
- Name every intermediary product that must be automated.
- Name the facility type used for each stage when that helps construction.
- Do not give intermediate rates or exact machine counts.
- Keep trivial intermediates inside the end-product card.
- Do not split the pipeline into cards merely because the item DAG contains
  another node.

A reader should be able to open one card, understand the whole production
shape, and begin building. They may need to thicken an underfed stage later;
they should not need to reconstruct the recipe tree first.

### Output

Output identifies:

- the final production facility;
- the exact end-product target from the title;
- the intended destination: storage, research Labs, launchers, or another
  clearly named consumer.

No other exact production figures are required.

### Surplus Yield

Surplus Yield names only the **types of reusable or blocking byproducts** left
by the full line.

It does not calculate amounts. Unused machine capacity is not surplus.

Omit the section entirely when the line has no byproduct the reader must use,
store, or prevent from blocking production.

### Operating Note

Operating Note contains only information that changes how the line is built or
kept running.

Good uses include:

- both refinery outputs must keep moving;
- a Hydrogen or Deuterium tank must be watched for depletion;
- a short feedback belt returns unused Hydrogen to the feeding tank;
- a rare-resource recipe can replace a named standard branch;
- a limited mall buffer should stop the line when full.

It does not contain:

- derivation or authoring rationale;
- exact intermediate arithmetic;
- warnings repeated from phase prose;
- advice unrelated to operating this line.

### Footer

There is no mandatory mathematical footer.

The only permitted footer sections are:

1. **Surplus Yield**, when a real byproduct exists;
2. **Operating Note**, when the line has an operating condition worth knowing.

`Total Draw and Output`, `Minimal Pickup Interval`, capacity margins, and
similar audit sections are removed from the reader-facing contract.

## Staged technology-bound cards

A production goal may remain useful while some of its components unlock during
the phase. That does not justify separate cards or instructions to build a
dead factory in advance.

Use one stable card with staged Pipeline groups:

1. **Build now** — useful stages available at the start of the phase;
2. **Add after [Technology]** — the next production branch made available by
   an exact named unlock;
3. **Phase-complete line** — how the stages connect once every required recipe
   is available.

Rules:

- Add a `STAGED` badge to the card summary.
- Use the exact in-game technology display name and existing tooltip.
- Do not repeat research costs or the phase's research strategy.
- Do not hide or dynamically rewrite stages based on presumed player state.
- Do not instruct the reader to place inert machinery unless reserving layout
  space has a clear practical benefit.
- If the entire end product is locked, place the card in the phase where it
  becomes buildable.
- If a later unlocked addition is optional rather than part of the phase
  objective, put it in Operating Note or phase prose instead.

This keeps the card stable while making its construction order honest.

## Guide-objective eligibility scan

The current guide was scanned phase by phase, including its optional reference
sections.

| Guide section | Objective | Card decision | Reason |
|---|---|---|---|
| BOOTSTRAP | Replenishing logistics, industry, storage, and basic-power mall outputs | **4 cards** | These are continuing automated end products and each is a useful build task. |
| BLUE | Continuous blue science | **1 card** | A permanent end-product line with an explicit guide target. |
| RED | Continuous red science with balanced refinery outputs | **1 card** | A permanent line whose operating behavior is genuinely useful. |
| FLIGHT | Research, fuel, loadout, and planetary travel | **No card** | Capability and expedition procedure, not an automated end product. |
| TITANIUM | Return exact reserves while leaving remote smelting ready for ILS | **1 card** | The first reserves are finite, but both automated lines remain in service afterward. |
| ILS | Buy research, manually produce a narrow hardware batch, place two towers, configure a route | **No card** | A one-time bootstrap and configuration procedure. Permanent station automation belongs later in LOGISTICS. |
| YELLOW | Continuous yellow science | **1 card** | Permanent end-product line with an explicit guide target. |
| PURPLE | Establish the Processor and Particle Broadband branches, then converge them into purple science | **2 cards** | Both branches are independently buildable, reusable, and later visible as stored inputs. The Lab convergence belongs in prose. |
| WARP | Optional rare-resource decisions and automated Warper supply | **1 card + table** | Space Warpers are a continuing automated end product. Rare shortcuts are reference information and Operating Notes. |
| GREEN | Establish the Quantum Chip and Graviton Lens branches, then converge them into green science | **2 cards** | Both branches are substantial independent projects whose outputs recur later. The Lab convergence belongs in prose. |
| DYSON | Sustainable Solar Sail supply for the chosen swarm plan | **1 card** | Solar Sails are the automated manufactured end product. Ejector placement and swarm operation remain prose. |
| SPHERE | Establish Dyson Sphere Components and Deuteron Fuel Rods, then combine them with existing Quantum Chips into rockets | **2 cards** | The two new branches are independently useful construction projects. Rocket convergence, Sphere Editor, and launch operation remain prose. |
| PHOTON | Configure Receivers and route their output through a Collider | **No card** | Infrastructure operation followed by one obvious processing step; prose is clearer and complete. |
| WHITE | Combine five established cube colors and Antimatter into white science | **No card** | Every input line already exists and the final Lab convergence is fully explained in prose. |
| LOGISTICS | Automate expansion hardware | **3 cards** | Three sleeping mall systems produce useful paired end products behind limited buffers. |
| Pile Sorter reference | Research and deploy when insertion speed is the problem | **No card** | Optional capability choice, not a guide-mandated production line. |
| Gas Giant reference | Place Orbital Collectors when gas supply solves a named problem | **No card** | Finite infrastructure deployment and logistics choice. |
| Interstellar Power reference | Configure Accumulator shipping when it is simpler than local generation | **No card** | Network configuration without a guide output target. |
| Advanced Mining reference | Use advanced extraction when remote setup becomes tedious | **No card** | Convenience infrastructure, not a recommended automated end product. |
| Dark Fog reference | Enter a separate combat/industry progression lane | **No card** | Outside the default progression and card scope. |

### Missing-card result

The scan found one objective that should remain a real card despite WARP's
other cards being removed:

- **Space Warpers** — the guide recommends an automated, reusable supply that
  feeds ILS towers. It passes every eligibility test.

No additional phase-wide end-product card was found. The density review does,
however, promote six natural branch endpoints to cards: Processors, Particle
Broadband, Quantum Chips, Graviton Lenses, Dyson Sphere Components, and
Deuteron Fuel Rods.

The following recommended objects remain intentionally in prose:

- Foundation preparation;
- flight fuel and expedition buildings;
- the first ILS towers and Vessels;
- EM-Rail Ejectors;
- Ray Receivers;
- Orbital Collectors;
- Energy Exchangers and Accumulators;
- Advanced Mining Machines.

They are finite infrastructure or procedures rather than the continuing
end-product lines cards are meant to explain.

## Proposed size

| System | Cards |
|---|---:|
| Current published system | 63 |
| First reduced proposal | 42 |
| Full-line proposal | 21 |
| Revised eligibility-tested proposal | 17 |
| Natural-branch proposal | 19 |

## Proposed 19-card inventory

### BOOTSTRAP — 4 cards

BOOTSTRAP cards describe useful mall blocks. Starter Ingots and Basic
Components remain visible inside the relevant pipelines; they are not separate
goals.

| # | Card | End product and full-line boundary |
|---:|---|---|
| 1 | **Mall Logistics** | Limited Belt and Sorter buffers. Iron Ore through Ingots and Gears; Copper Ore through Ingots; Circuit Boards; then Belts and Sorters. Use staged unlock markers where required. |
| 2 | **Mall Industry** | Limited Miner, Smelter, and Mk.I Assembler buffers. Iron, Copper, Stone, Magnets, Coils, Circuit Boards, Gears, and Stone Bricks through the three machine outputs. Mark later-unlocked output branches as staged. |
| 3 | **Mall Storage** | Limited Storage Mk.I and Storage Tank buffers. Iron Ingots, Stone Bricks, and Glass through the two storage outputs. |
| 4 | **Mall Power** | Limited Wind Turbine, Tesla Tower, and Combustible Unit buffers. Iron, Copper, Stone, Magnets, Coils, Gears, and Energetic Graphite through the three power/fuel outputs. Mark later recipe additions as staged. |

Not cards:

- Foundation automation remains a guide/checklist instruction when its recipe
  becomes available.
- Steel appears inside ILS prose and later full lines.
- Basic combat remains optional prose if retained.

### BLUE — 1 card

| # | Card | End product and full-line boundary |
|---:|---|---|
| 5 | **Blue Cubes** | Iron and Copper Ore through Magnets, Ingots, Coils, Circuit Boards, and Matrix Labs. The title retains the guide's exact blue target. Spare Coils and Circuit Boards may go to small construction buffers. |

### RED — 1 card

| # | Card | End product and full-line boundary |
|---:|---|---|
| 6 | **Red Cubes** | Crude Oil through Refined Oil and Hydrogen; Coal through Energetic Graphite; both cube inputs into Matrix Labs. The title retains the guide's exact red target. |

Surplus Yield names Refined Oil, Hydrogen, and Energetic Graphite only. The
Operating Note explains that both refinery outputs must keep moving.

### FLIGHT — no cards

FLIGHT remains research, preparation, fuel, and navigation prose.

### TITANIUM — 1 card

| # | Card | End product and full-line boundary |
|---:|---|---|
| 7 | **First Off-World Smelting Outpost** | Titanium Ore to Titanium Ingots and Silicon Ore to High-Purity Silicon, each ending in storage beside its future ILS site. The title retains the guide's exact first reserves for both outputs. |

This card qualifies because the lines remain automated and later become the
sources for permanent ILS routes. The finite first collection is not their
only purpose.

### ILS — no cards

ILS becomes focused guide prose.

The prose must:

1. state the exact yellow research batch and its allocation;
2. list the required structural, electronic, magnetic, and propulsion
   components in build order;
3. explain that the first quantities may be made in the Replicator or temporary
   Assemblers because this is a narrow bootstrap, not a permanent mall;
4. state the required final hardware: two ILS towers and the initial Vessel
   fleet selected by the guide;
5. walk through source Provider and home Receiver settings;
6. state which tower is powered and where Vessels are loaded;
7. confirm success by automatic Titanium and Silicon delivery.

This is more useful than forcing a one-time procedure into a card title with a
fictional sustained output rate.

### YELLOW — 1 card

| # | Card | End product and full-line boundary |
|---:|---|---|
| 8 | **Yellow Cubes** | Crude Oil, Coal, Water, and Titanium through Refined Oil, Graphite, Plastic, Organic Crystals, Titanium Crystals, Diamonds, and Matrix Labs. The title retains the guide's exact yellow target. |

The Operating Note may mention mined Organic Crystals as a later shortcut that
removes the oil-to-Organic-Crystal branch.

### PURPLE — 2 cards

| # | Card | End product and full-line boundary |
|---:|---|---|
| 9 | **Processors — 45/min** | Iron and Copper through Circuit Boards; Silicon and Copper through Microcrystalline Components; both converge in Processors. This is the first permanent Processor line after the finite ILS bootstrap. |
| 10 | **Particle Broadband — 22.5/min** | Standard Graphene through Carbon Nanotubes; Crude Oil and Coal through Plastic; High-Purity Silicon through Crystal Silicon; all branches converge in Particle Broadband. |

Phase prose tells the reader to feed Processors and Particle Broadband into the
purple-science Labs at the guide's intended cube target.

The Particle Broadband Operating Note may mention:

- Spiniform Crystal replacing the standard Carbon Nanotube branch;
- Fractal Silicon replacing the Crystal Silicon step;
- pumped Sulfuric Acid replacing chemical Sulfuric Acid.

### WARP — 1 card plus one reference table

| # | Card | End product and full-line boundary |
|---:|---|---|
| 11 | **Space Warpers** | Green Cubes through the efficient Space Warper recipe, then limited storage and ILS distribution. The title retains the guide's chosen Warper output target. The card is explicitly marked as available after GREEN; pre-green personal warp remains prose. |

WARP's rare resources remain a prose/reference table. Each row states:

- where the resource is acquired;
- which alternate recipe it enables;
- which branch of a full-line card it removes;
- any practical scarcity or logistics cost.

The affected full-line card also names the shortcut in its Operating Note.

### GREEN — 2 cards

| # | Card | End product and full-line boundary |
|---:|---|---|
| 12 | **Quantum Chips — 7.5/min** | Organic Crystals and Titanium through Titanium Crystals; Hydrogen, Graphene, and Titanium Crystals through Casimir Crystals; Water, Glass, and Titanium through Titanium Glass; Casimir Crystals and Titanium Glass through Plane Filters; Plane Filters and Processors converge in Quantum Chips. |
| 13 | **Graviton Lenses — 7.5/min** | Hydrogen through Deuterium; motor and Graphene branches through Particle Containers; Deuterium and Particle Containers through Strange Matter; Strange Matter and Diamonds converge in Graviton Lenses. |

Phase prose tells the reader to feed Quantum Chips and Graviton Lenses into the
green-science Labs at the guide's intended cube target.

The Quantum Chip Operating Note covers:

- Hydrogen delivery and tank depletion;
- returning unused Hydrogen to the feeding tank where applicable;
- mined Organic Crystals;
- Optical Grating Crystal Casimir Crystals;
- Fire Ice Graphene.

The Graviton Lens Operating Note covers Hydrogen/Deuterium storage,
Unipolar-Magnet Particle Containers, and any returned material that must keep
moving.

Surplus Yield names only leftover subcomponent types on the card that produces
them.

### DYSON — 1 card

| # | Card | End product and full-line boundary |
|---:|---|---|
| 14 | **Solar Sails** | Stone to Glass and Prisms; Circuit Boards and Prisms to Photon Combiners; Graphene and Photon Combiners to Solar Sails; storage into the Ejector feed. The title retains the guide's exact sustainable sail target. |

The Operating Note mentions Optical Grating Crystal as a replacement for the
Prism branch and tells the reader to watch the sail buffer for depletion.
Ejector manufacture, placement, duty cycle, swarm population, and Dyson demand
remain prose.

### SPHERE — 2 cards

| # | Card | End product and full-line boundary |
|---:|---|---|
| 15 | **Dyson Sphere Components — 16.875/min** | Carbon Nanotubes, Titanium Alloy, and High-Purity Silicon through Frame Material; Frame Material, Solar Sails, and Processors converge in Dyson Sphere Components. |
| 16 | **Deuteron Fuel Rods — 30/min** | Deuterium, Titanium Alloy, and Super-Magnetic Rings converge in Deuteron Fuel Rods. |

Phase prose tells the reader to feed Dyson Sphere Components, Deuteron Fuel
Rods, and the existing Quantum Chips into the Rocket Assembler at the guide's
intended Small Carrier Rocket target. Sphere-specific Solar Sail and Casimir
Crystal requirements remain visible without creating scaled duplicate cards.
Sphere Editor and launching procedure remain prose.

### PHOTON — no cards

PHOTON becomes focused guide prose.

The prose must explain the complete process:

1. place the Receiver array chosen by the guide;
2. supply Graviton Lenses and configure Photon Generation;
3. allow Continuous Receiving and Receiver Strength to warm;
4. confirm the Dyson system can supply useful Receiver output;
5. belt Critical Photons to a Miniature Particle Collider;
6. select Photon Materialization;
7. supply the Collider's Hydrogen input;
8. send Antimatter toward WHITE;
9. keep the returned Hydrogen outlet moving so the Collider cannot block.

The Receiver display already reports photon performance. A card repeating that
interface is decorative rather than helpful. Once photons reach the Collider,
the Antimatter step is simple enough that a second card merely repeats the
same prose.

### WHITE — no cards

WHITE prose tells the reader to feed Blue, Red, Yellow, Purple, and Green
Matrices plus Antimatter into the white-science Labs at the guide's exact
target. It also tells the reader to expand whichever established feed actually
starves.

A card would add no production path that the reader has not already built.

### LOGISTICS — 3 cards

These are sleeping mall lines with exact limited output targets, not sustained
per-minute factories.

| # | Card | End product and full-line boundary |
|---:|---|---|
| 17 | **Distribution Logistics Kit** | Iron, Glass, Prisms, Plasma Exciters, Magnetic Coils, Engines, and Processors through limited Distributor and Bot buffers. |
| 18 | **Planetary Logistics Kit** | Steel, Titanium, Processors, Particle Containers, Thrusters, and basic components through limited PLS and Drone buffers. |
| 19 | **Interstellar Logistics Kit** | PLS, Titanium Alloy, Particle Containers, Processors, Turbines, and Reinforced Thrusters through limited ILS and Vessel buffers. |

The Output section gives the exact limited stock target for each item. The
Pipeline does not attempt to size a private upstream factory capable of
saturating both output Assemblers.

## Ordering audit

The revised inventory was checked against the guide's phase order.

| Potential ordering problem | Resolution |
|---|---|
| BOOTSTRAP mall outputs unlock at different times | Use the `STAGED` contract and exact technology markers inside the stable mall card. |
| ILS needs Processors, Turbines, Graphene, and Particle Containers before their later permanent branches | ILS prose explicitly treats these as finite bootstrap batches made in the Replicator or temporary Assemblers. PURPLE and GREEN establish the continuing lines only when they become real factory branches. |
| WARP appears before GREEN, but efficient Warper automation consumes Green Cubes | Keep pre-green personal/vessel warp and the expensive Lens recipe in prose. Mark the Space Warper card `AFTER GREEN`; the optional WARP section is designed to be revisited. |
| Particle Containers no longer have a canonical card before the gravity branch | The Graviton Lens card includes the complete motor, Turbine, Graphene, and Particle Container path at high level. |
| SPHERE consumes Quantum Chips and Solar Sails produced in earlier phases | The two SPHERE cards name those established supplies and remain understandable without reproducing their full factories. Links are optional navigation aids. |
| Small Carrier Rockets no longer have a card | SPHERE prose performs the simple convergence of Dyson Sphere Components, Deuteron Fuel Rods, and Quantum Chips and retains the exact rocket target. |
| PHOTON has no cards before WHITE needs Antimatter | PHOTON prose covers Receiver configuration, Collider processing, Antimatter routing, and returned Hydrogen before WHITE begins. |
| WHITE has no card despite its exact target | The target remains in the dashboard and `How much is enough`; prose performs the simple six-input Lab convergence. |
| LOGISTICS appears after Mission Completed but reuses earlier products | This is intentional. The three kit cards are post-completion permanent mall lines and include their full high-level paths. |

No remaining card requires an unexplained product from a later phase. The only
deliberately forward-looking card is Space Warpers, and it is explicitly
marked as a post-GREEN automation option inside a revisit-anytime reference
section.

## What moved out of cards

| Removed card material | New home |
|---|---|
| Starter Ingots and Basic Components | Visible stages inside the relevant full-line cards |
| Steel, Titanium Alloy, Processors, Turbines, Graphene, Particle Containers for the first ILS | ILS bootstrap and manual-replication prose |
| ILS research batch | ILS prose |
| Minor Purple and Green intermediates | Visible stages inside Processor, Particle Broadband, Quantum Chip, and Graviton Lens branch cards |
| Rare-resource shortcut cards | WARP comparison table plus affected Operating Notes |
| Photon Combiners | Visible stage inside Solar Sails |
| Frame Material and scaled Sphere duplicates | Visible stages or established inputs inside Dyson Sphere Components and the Sphere convergence prose |
| Critical Photon card | PHOTON Receiver-configuration prose |
| Antimatter card | PHOTON Collider procedure |
| Purple Cube, Green Cube, Small Carrier Rocket, and White Cube convergence cards | Phase prose that connects completed branch outputs |
| Six individual LOGISTICS outputs | Three paired expansion-kit cards |

No necessary production fact is discarded. The representation changes to fit
the kind of help the reader actually needs.

## Factual validation boundary

The authoritative DAG remains responsible for:

- recipe inputs and outputs;
- facility types;
- alternate recipes;
- technology unlocks;
- whether each high-level pipeline is complete.

It is not responsible for:

- deciding which outputs deserve cards;
- setting guide end-product targets;
- multiplying every intermediate into an exact factory ratio;
- turning every valid item node into reader-facing content.

Only exact end-product targets must be checked against the guide's intended
pace. Internal pipeline facts are validated for completeness and correctness,
not converted into prescribed rates.

## Proposed sidecar drafting sequence

This remains a plan; it does not authorize guide edits.

1. Draft the four staged BOOTSTRAP cards in a separate card-copy document.
2. Check that a new player can build each line without reconstructing the
   recipe tree or solving internal arithmetic.
3. Draft BLUE, RED, TITANIUM, YELLOW, and the natural PURPLE and GREEN branch
   cards.
4. Draft the ILS and PHOTON replacement prose beside the cards, without
   touching the guide.
5. Draft the WARP table and add shortcut notes to affected full-line cards.
6. Draft DYSON, the two SPHERE branch cards, WHITE convergence prose, and the
   three LOGISTICS kits.
7. Validate high-level pipeline completeness and exact technology names
   against the authoritative data.
8. Review every card with one final question:

   > Does this reduce the reader's cognitive load while automating an end
   > product the guide already asked for?

9. Reject any card whose honest answer is no, even when its data is correct.

If this eligibility boundary is accepted, the next artifact should be a
sidecar draft containing the 19 cards, the WARP table, and the replacement
ILS, PHOTON, and convergence prose for review before any guide implementation.
