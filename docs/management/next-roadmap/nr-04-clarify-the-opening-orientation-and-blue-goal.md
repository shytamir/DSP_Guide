# NR-04 — Clarify the opening orientation and BLUE goal

**Status:** Draft for owner review. The outcome comes from the owner-approved
next roadmap, but this decomposed story does not authorize implementation.

**Dependency group:** B — Early and mid-route guidance
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a new or returning player, I want the introduction and BLUE Goal to explain the route in direct player-facing language before relying on guide-specific vocabulary.

## Authoritative evidence

The approved source review found unclear route scope, premature optional-path language, exposed structural jargon, and compressed BLUE prose. Owner-authored replacement copy is preserved below.

## Intended outcome

Install the approved opening scope, usage guidance, and BLUE Goal copy while keeping the Glossary in place.

## In-scope surfaces

- Introduction scope and closing line
- Return reminder and numbered usage instructions
- Build-card assumptions handoff and Glossary position
- BLUE Goal

## Approved specification

### Introduction scope and closing line

> The route above is the simplest way through the game, but it isn't the only
> useful project this guide supports. The default route uses a Solar Sail swarm
> to reach photon production and white science. Permanent Sphere construction
> is an optional path you can open when you want a lasting structure; it is
> never required to move forward.
>
> If you're playing with Dark Fog, RED shows you a simple way to defend your
> first planet and clear a Dark Fog base. The guide doesn't try to cover the
> rest of Dark Fog combat.
>
> You'll also meet a few useful side projects along the way. You don't need to
> understand or choose them now. The guide introduces each one when it can help
> and explains the problem it solves.

### Introductory language without moving the Glossary

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

### BLUE Goal final draft

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

## Non-goals and preserved contracts

- Do not move or rewrite the collapsed Glossary.
- Do not change production cards, phase gates, navigation behavior, or checklist identity.
- Do not broaden Dark Fog beyond the bounded RED-phase contract.
- Do not change optional-path structure; Group A owns it.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The introduction distinguishes the prescribed swarm route, optional permanent Sphere, and bounded Dark Fog coverage.
- A new reader can follow the usage instructions without first opening the Glossary.
- The BLUE Goal is concise, substantive, and player-facing.
- All retained technical vocabulary remains available in Build-card assumptions and the Glossary.

## Validation

**Tier:** 2 — Experience

Run directly affected static checks, then review the complete opening and BLUE
Goal on the deployed development Pages site at desktop width for flow,
hierarchy, and new-reader clarity.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
