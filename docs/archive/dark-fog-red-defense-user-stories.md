# RED-Phase Dark Fog Defense User Stories

> **Archived:** Both stories were implemented. Current Dark Fog product
> boundaries are recorded in [`../PROJECT.md`](../PROJECT.md).

## Product decision

The default **New Game → Start** path enabled Dark Fog, so the project decided
that the guide needed enough practical help for a new player to clear
starter-planet bases without becoming a combat or Dark Fog farming guide.

The approved coverage was limited to the RED phase and to the two stories
below. The excluded Dark Fog subjects remained outside the product boundary.

ILS and WARP were the only exceptions to RED-only placement. Each expedition
section received one concise reminder linking back to the RED
planetary-base-clearing procedure. Those reminders introduced no additional
Dark Fog instruction.

## Completed stories

### 1. Automate the basic missile-defense supplies

**Historical outcome:** The story was implemented.

**As a** new player using the default game settings,  
**I want** RED-phase production guidance for Missile Turrets, Signal Towers,
and the missile sets they consume,  
**so that** I can establish a repeatable defense supply before committing to
the ILS rush.

#### Implementation requirements

- Place the guidance in RED, where sustainable red science can unlock and
  support the required production.
- Trace useful automated lines for Missile Turrets, Signal Towers, and missile
  sets using only authoritative runtime-derived names, recipes, and links.
- Follow the active card contract: production references must reduce cognitive
  load and must not reproduce the full dependency DAG or expose unnecessary
  intermediate arithmetic.
- Tell the reader to complete and buffer these lines before beginning the ILS
  rush.
- Keep the language practical and player-facing; do not turn the section into
  a general combat progression lesson.

#### Definition of done

- A RED-phase reader can identify every production line needed to replenish
  the three approved defense outputs.
- The recommended timing before the ILS rush is explicit.
- Every displayed name and recipe relationship validates against the
  authoritative runtime bundle.
- No prohibited Dark Fog subject is introduced.

### 2. Explain the starter-planet base-clearing pattern

**Historical outcome:** The story was implemented.

**As a** new player with basic missile production established,  
**I want** one concise procedure for using a fixed Missile Turret battery and
Signal Towers,  
**so that** I can remove existing planetary bases without needing a separate
combat guide.

#### Implementation requirements

- Place the procedure in RED beside the approved defense-production guidance.
- Instruct the reader to establish one battery of eight Missile Turrets with a
  dependable missile supply.
- Explain that progressively closer Signal Towers extend the battery's reach
  until the existing planetary base is eliminated.
- Present this as concise prose or a short ordered procedure, not a production
  card.
- Assume the reader can handle ordinary aggression and tactical adjustment;
  do not prescribe a broader combat doctrine.

#### Definition of done

- The reader can carry out the eight-turret, progressive-Signal-Tower pattern
  from the instructions at a glance.
- The procedure remains entirely within planetary RED-phase defense.
- No levels, farming, drops, space combat, Relay Stations, hives, or concealed
  technologies appear anywhere in the guide.

## Implementation record

Both stories were completed. RED gained the stocked Security Mall and the
single eight-turret, progressive-Signal-Tower procedure. ILS and WARP each
gained one linked reminder, and the superseded hidden-industry reference was
removed.
