# No Mobile Polish Work

**Status:** Archived historical record. This scope guardrail was excluded from
the completed roadmap and never represented an implementation step.

**Class:** Scope guardrail.

**State:** Historical scope exclusion; it did not gate roadmap completion.

As the product owner, I want mobile-specific polish excluded from planned work
so that effort remains focused on the desktop PC reading experience used while
playing DSP.

## Decision

- Desktop PC is the presentation target.
- Mobile and narrow layouts remain best-effort.
- Do not create stories for mobile-only visual polish.
- Narrow behavior enters scope only when it blocks basic access or exposes a
  structural defect shared with desktop.
- A story that changes shared responsive behavior may include the narrowest
  relevant viewport check without expanding into general mobile refinement.

## Acceptance

- The roadmap and active story set contain no mobile-polish work.
- Narrow-viewport review is required only by an affected responsive contract
  or a qualifying access defect.
- Mobile-only cosmetic defects are not promoted into planned work.
- A qualifying defect becomes its own bounded story rather than reopening this
  decision.

## Roadmap relationship

This record was archived with the completed roadmap so its desktop-first scope
decision remains visible as historical context.
