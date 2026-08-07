# Reading-Pane Right-Edge Alignment

**Status:** Completed and owner-validated on 2026-08-07.

## User story

As a guide reader moving through prose, boxes, tables, and production cards, I
want their right edges to align with the far-right edge of the reading pane,
even when an element remains indented on the left, so that the guide presents
one stable document shape instead of a sequence of inconsistent widths.

## Acceptance criteria

- Paragraphs and list-item content reach the right edge of their containing
  reading pane.
- Left indentation for lists, nested procedures, and other hierarchy remains
  intact; right-edge alignment must not flatten the document structure.
- Blockquotes, callouts, tables, cards, production maps, and other boxes reach
  the same right boundary when they share a containing pane.
- Reusable reference cards retain their left indentation while their right
  borders reach the containing pane's right edge.
- The compact first-yellow-research allocation table no longer stops at an
  arbitrary narrower width.
- Intentionally sized interface elements remain scoped out: game logos,
  navigation rails, reference controls, tooltips, icons, and numeric columns
  retain their existing dimensions; both game logos are centered within the
  reading pane.
- Desktop rendering shows one consistent right boundary without horizontal
  overflow.
- Narrow rendering preserves readable indentation and introduces no horizontal
  page overflow; intrinsically wide table content may scroll within its own
  aligned table boundary.
- Focused deployment validation protects the logo-centering, paragraph/list,
  and compact-table width contracts.
- Card-system, checklist, and release-equivalent deployment validation pass.

## Implemented change

- Removed the global 78-character maximum width from paragraphs and list
  items, allowing their right edges and nested block content to reach the
  reading-pane boundary.
- Made the compact allocation table explicitly fill its containing width.
- Converted reusable reference-card side margins into left-only indentation
  at desktop and narrow widths.
- Contained intrinsically wide tables so they scroll internally instead of
  widening the page on narrow screens.
- Centered both game logos without changing their dimensions.
- Added deterministic deployment checks for the alignment and logo-centering
  rules.

## Validation state

Automated contract checks and desktop and narrow Chromium rendering reviews
passed. The owner confirmed the guide's aligned document shape on 2026-08-07;
the two game logos were then centered as the final accepted polish.
