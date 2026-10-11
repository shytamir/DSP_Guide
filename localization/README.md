# Localization authoring contract

Only English is currently deployable. Chinese (`zh-CN`), German (`de`), and
Japanese (`ja`) stay private until ML-28. The roadmap owns story progress.

Native ID mappings and language rules are in [style.md](style.md). Validate
retained snapshots with `node scripts/validate-terminology.mjs`; extraction is
an explicit read-only provenance refresh, never part of an ordinary build.

## Identity and message inventory

`scripts/fixtures/checklist-identity.json` freezes the 66 pre-localization keys,
their aliases, and the English labels used to establish the baseline. Every
input now declares its key. Never derive translated identity from display text,
rename public anchors, change prototype/technology/card IDs, or change the
`dsp-guide:checklist-state:v1` storage record. The fixture's historical wording
is evidence, not a restriction on future editorial copy.

The following inventory covers every display-text source. ML-08 will annotate
individual messages and produce a machine-checkable source catalog.

| Source / surface | Translation treatment | Segment |
| --- | --- | --- |
| `index.html`: title/subtitle, introduction, glossary, progress index, opening and BLUE | Coherent headings, paragraphs, list items and table fields; keep inline links, emphasis and factual objects | A |
| RED / ILS; YELLOW / PURPLE / GREEN; DYSON / receiver bridge / PHOTON / WHITE / SPHERE; WARP / LOGISTICS | Dashboards, guidance, cards, callouts, checklists, optionality and captions | B / C / D / E respectively |
| Everything following LOGISTICS | Production references, tools/mod descriptions, quick checklist, troubleshooting, conclusion and footer | F |
| Shared rail, stage labels, reference menu, top/route/close/reset controls, sheet headings, grouped card controls | Visible text, titles and accessible names; stage `aria-label` also supplies CSS-visible text | A |
| Table-scroll hints and region labels, image alternatives, other `title`/`aria-label` attributes | Translate non-empty human text; preserve decorative empty alternatives | A for shared controls; containing segment for contextual labels |
| Document title, description, social metadata and image descriptions | Locale-specific message/attribute entries; version/URL fields remain structural | A |
| `checklists.js` | Saved, unavailable, reset and page-only reset messages; static no-JS guidance remains in HTML | A |
| `navigation.js` | Current-phase caption derives from translated rail text; opening `Start` is a UI message | A |
| `tech-tooltips.js` and `assets/data/tech-*.json` | Required/Implicit/Unlocks labels, rank pattern, technology and prerequisite names, cube and compact unlock labels | A + native terminology snapshot |
| Prototype icons / inline names and producer descriptions | Native ID-based names where a name is meant; translate surrounding prose and producer explanations as full messages | Containing segment |
| Card/prototype scripts and CSS | Existing DOM labels supply prose; plus/minus/disclosure arrows are invariant symbols; generated `attr(aria-label)` uses the translated attribute | No separate prose catalog |
| Licensing records and external destinations | Retain legal originals, proper names and URLs; translate surrounding guide descriptions | F where present |

Stable message IDs use `<segment>.<context>.<kind>.<number>` (for example
`a.opening.p.001`). Assign once, keep through rewording/moves, and never derive
identity from English text. Attribute IDs append the attribute name. A message
is a complete grammatical unit; short captions or UI labels can stand alone.
Do not split a sentence at every emphasis/link boundary. Each inline object
has a named placeholder; grammar may reorder it while its structural identity
and factual values stay intact. Native term placeholders carry numeric IDs.
Numbers, rates, ranks and technical units remain source-owned. Catalog text
cannot inject HTML or executable attributes.

Bulk annotation and catalogs belong to ML-08. Runtime UI integration belongs
to ML-09. The three private sample passages are tooling fixtures, not accepted
translations of their segments. The agent performs translation, proposition
comparison, an independent target-language edit, and browser inspection in
each language story; no owner language or device gate applies.
