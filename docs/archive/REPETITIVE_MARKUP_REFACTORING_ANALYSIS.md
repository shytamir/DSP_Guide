# Repetitive Markup Refactoring Analysis

**Status:** Archived analysis  
**Recorded:** 2026-08-05

This document preserves a read-only investigation into repeated markup in the
published guide. It records evidence and possible future refactoring routes;
it is not an active implementation contract.

## Conclusion

The repeated markup is real, but it is not primarily a download-performance
problem. The significant debt is architectural: the same component contracts
are represented independently in the published HTML, generator templates,
transformation regular expressions, CSS selectors, JavaScript queries, and
validators.

The preferred direction is to improve the authoring and materialization tools
incrementally while retaining fully expanded static HTML as the deployment
artifact.

## Evidence

Static inspection of `index.html` found:

| Structure | Count |
| --- | ---: |
| Total elements | 5,875 |
| Images | 1,433 |
| Unique image sources | 193 |
| Item references (`.proto-ref`) | 1,033 |
| Technology references (`.tech-ref`) | 195 |
| Production arrows | 128 |
| Route maps | 38 |
| Route rows | 118 |
| Build cards | 19 |
| Phase sections | 12 |
| `aria-hidden="true"` attributes | 1,559 |

The published HTML measured 514,885 bytes. Applying the icon materializer's
own generated-markup stripping rules reduced it to 232,029 bytes, meaning
generated references account for approximately 282,856 bytes, or 55% of the
raw document.

Compression substantially limits the transfer impact:

| Document | Raw | Gzip |
| --- | ---: | ---: |
| Current HTML | 514,885 bytes | 54,106 bytes |
| Generated markup stripped | 232,029 bytes | 40,972 bytes |
| Difference | 282,856 bytes | 13,134 bytes |

The source therefore establishes substantial authoring and DOM repetition,
but does not establish a user-visible performance defect.

## Primary design debt

### Duplicated structural knowledge

Production arrows, technology references, route maps, route rows, and cards
are each described in several places. For example, a production arrow is
emitted, stripped, detected, and validated in `scripts/apply-proto-icons.mjs`,
then independently recognized by `scripts/validate-deployment.mjs`.

Likewise, `scripts/validate-card-system.mjs` recognizes a route row by an
exact closing `</div>`. A semantically equivalent conversion from a generic
`div` to a native `li` therefore propagates through unrelated implementation
layers.

### Editorial migrations in the materializer

The main icon transformation pipeline also performs content-specific
migrations for storage guidance, the RED Security Mall, planetary-base
guidance, and the ILS bootstrap map. Several of those functions embed complete
card or production-map fragments that also exist in `index.html`.

This means that an icon refresh can rewrite unrelated editorial content, and
some content has more than one effective representation.

### ARIA-emulated native structures

Route maps use generic elements with `role="list"` and `role="listitem"`.
Technology references use interactive spans. Native `ul`, `li`, and `button`
elements would reduce repeated attributes and improve semantics, but the
exact-tag assumptions in the generator and validators make those otherwise
local changes unnecessarily broad.

Repeated `aria-hidden="true"` attributes are not by themselves a defect. Most
belong to decorative icons and arrow glyphs and are intentional.

## Alternatives considered

### A. Refactor the materializer and validators

Keep the complete static `index.html`, but separate reusable icon and arrow
materialization from completed editorial migrations. Centralize structural
contracts, make validators tolerate semantically equivalent native elements,
and prefer native HTML where practical.

This preserves the deployment model and directly reduces change fan-out. It
does not materially shrink the deployed DOM.

### B. Introduce a build-time semantic source

Maintain a compact authoring source and generate the expanded `index.html` as
a committed artifact. This would centralize component definitions, but it
would introduce a build contract, source/generated drift risk, and an
unresolved dependency on the intentionally external asset map.

This route is justified only if sustained structural editing makes the large
HTML source materially expensive to maintain.

### C. Store cards and routes as structured data

Represent the 19 cards and 118 route rows in data and render them at build
time. This maximizes shell reuse but turns nuanced editorial HTML into a
custom content schema, with a high migration cost at the current scale.

### D. Render components in the browser

Web Components, templates, or JavaScript rendering would shorten the source
but not the resulting DOM. This would conflict with the explicit static
materialization contract and make core content depend on runtime execution.

### E. Replace images with backgrounds or sprites

This could remove repeated `img` markup but would make mapping, print
behavior, validation, and decorative-image semantics less transparent. The
compressed transfer saving does not justify the additional complexity.

## Preserved recommendation sequence

1. Preserve the expanded static `index.html` deployment artifact.
2. Remove completed one-off editorial migrations from the recurring icon
   materializer.
3. Separate reusable materialization logic from content migration logic.
4. Centralize structural markup and validation rules.
5. Make validators tolerant of semantically equivalent native elements.
6. Convert appropriate ARIA-emulated structures to native HTML.
7. Reconsider a dedicated build-time authoring format only if sustained
   editing volume makes the large HTML source materially expensive to
   maintain.

The recommended work is maintainability refactoring, not an urgent rendering
performance intervention. Client-side component rendering is not recommended.
