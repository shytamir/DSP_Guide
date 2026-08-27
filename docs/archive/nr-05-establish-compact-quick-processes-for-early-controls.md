# NR-05 — Establish compact Quick processes for early controls

**Historical status:** Owner-accepted and archived on 2026-08-27.

**Dependency group:** B — Early and mid-route guidance
**Assessed workload:** Medium
**Class:** Structural change

## Reader need

As a new player, I want short required procedures beside the instruction that needs them so I can use Blueprints and split refinery outputs without leaving the progression flow.

## Authoritative evidence

The guide currently recommends reusable branches and separate refinery belts without teaching the minimum controls needed to perform either action.

## Intended outcome

Introduce one collapsed Quick-process pattern through a BLUE Blueprint example and a RED sorter-filter procedure.

## In-scope surfaces

- BLUE Small Tools table and Blueprint entry
- Reusable collapsed Quick-process markup and behavior
- RED refinery-output instruction
- Directly affected collapse, accessibility, and structural contracts

## Approved specification

### Small Tools and collapsed Quick-process convention

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
this story.

### RED refinery-output Quick process

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
Sorter tutorial. It does not authorize a broader RED Goal rewrite.

RED's broader purpose is not limited to refinery-output management. Its
universal outcome is sustainable red research; managing Hydrogen and Refined
Oil is the phase's defining operating lesson, and storing Refined Oil prepares
later chemistry.

## Non-goals and preserved contracts

- Do not create a comprehensive Blueprint or Sorter tutorial.
- Do not rewrite RED's broader Goal or phase gate.
- Do not convert the existing Dark Fog procedure in this story.
- Do not add permanent tooling unless an existing validator cannot express a durable contract.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- Latitude-aware building is renamed East-West Construction without changing its explanation.
- BLUE includes the approved reusable-branch example and capture procedure.
- RED explains how to select separate refinery outputs using the approved compact procedure.
- Both procedures use one accessible, collapsed-by-default semantic pattern beside their owning instructions.

## Validation

**Tier:** 2 — Experience

Run directly affected structural checks and review both collapsed procedures on
the deployed development Pages site in desktop Chromium, including disclosure
controls, focus behavior, and surrounding reading flow.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../PROJECT.md) and does not imply owner acceptance.
