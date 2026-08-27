# NR-16 — Teach the LOGISTICS route model

**Status:** Implemented and technically validated on 2026-08-27. Pending owner acceptance.

**Dependency group:** D — Optional paths and support
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a reader automating logistics hardware, I want to know which transport layer fits the job and how Supply, Demand, Storage, Local, and Remote settings create a route.

## Authoritative evidence

The existing LOGISTICS dashboard, buffers, cards, and troubleshooting remain accepted. The current opening claim overstates what a blueprint alone accomplishes.

## Intended outcome

Replace only the introductory teaching layer with the approved problem statement, transport-layer table, route-setting explanation, and research ownership.

## In-scope surfaces

- LOGISTICS Goal
- Choose the right logistics layer table
- Set the route explanation
- Distribution Logistics instruction and handoff to existing cards/troubleshooting

## Approved specification

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

| Use                           | Hardware                     | What it connects                                              |
| ----------------------------- | ---------------------------- | ------------------------------------------------------------- |
| Nearby delivery               | Distributor + Logistics Bots | Icarus and nearby storage boxes                               |
| Planetary delivery            | PLS + Logistics Drones       | Two places on the same planet                                 |
| Planetary or stellar delivery | ILS + Drones/Vessels         | Local routes with Drones; other planets or stars with Vessels |

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

ILS materially proves PLS, ILS, Drones, and Vessels. It does not prove
Distribution Logistics System because YELLOW treats that recommendation as
discardable filler. LOGISTICS must therefore retain an explicit Distribution
Logistics instruction instead of assuming it was completed earlier.

The finished teaching order should be: why the hardware is automated; which
transport layer fits the job; which settings create the route; existing cards
for automating the hardware; existing troubleshooting for routes that still
fail.

## Non-goals and preserved contracts

- Do not change existing buffers, production cards, dashboard, or troubleshooting.
- Do not imply that both route endpoints require power or carriers.
- Do not assume Distribution Logistics was completed as discardable YELLOW filler.
- Do not claim that a pasted blueprint becomes an operational district by itself.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The opening names the repeated transport-hardware problem accurately.
- The table distinguishes Distributor, PLS, and ILS use.
- Supply, Demand, Storage, Local, and Remote settings are explained accurately.
- The powered-destination/unpowered-provider pattern remains valid.
- The teaching order leads cleanly into existing cards and troubleshooting.

## Validation

**Tier:** 2 — Experience

Run directly affected content checks, then review the introductory sequence and
table on the deployed development Pages site in desktop Chromium for clarity
and consistency with existing cards.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
