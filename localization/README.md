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

The following inventory covers every display-text source. Annotated individual
messages are retained in the machine-checkable source catalog.

| Source / surface | Translation treatment | Segment |
| --- | --- | --- |
| `index.html`: title/subtitle, introduction, glossary, progress index, opening and BLUE | Coherent headings, paragraphs, list items and table fields; keep inline links, emphasis and factual objects | A |
| RED / ILS; YELLOW / PURPLE / GREEN; DYSON / receiver bridge / PHOTON / WHITE / SPHERE; WARP / LOGISTICS | Dashboards, guidance, cards, callouts, checklists, optionality and captions | B / C / D / E respectively |
| Everything following LOGISTICS | Production references, tools/mod descriptions, quick checklist, troubleshooting, conclusion and footer | F |
| Shared rail, stage labels, reference menu, top/route/close/reset controls, sheet headings, grouped card controls | Visible text, titles and accessible names; stage `aria-label` also supplies CSS-visible text | A |
| Table-scroll hints and region labels, image alternatives, other `title`/`aria-label` attributes | Translate non-empty human text; preserve decorative empty alternatives | A for shared controls; containing segment for contextual labels |
| Document title, description, social metadata and image descriptions | Locale-specific message/attribute entries; version/URL fields remain structural | A |
| `checklists.js` | Saved, unavailable, reset and page-only reset messages; static no-JS guidance remains in HTML | A |
| `navigation.js` | Current-phase caption derives from translated rail text; opening `Start` derives from its translated HTML control | A |
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

## Working with catalogs

`source.json` inventories 1,537 annotated HTML messages and attributes:
A 393, B 227, C 257, D 228, E 250, F 182. The eight dynamic UI strings in
`assets/data/locales/en/ui.json` and `ui/<locale>.json` also belong to segment A.
UI catalogs carry the reviewed hash of the English strings. All eight are
translated and self-reviewed; the language story must reconcile them with its
terminology and complete HTML controls.
The source remains readable English HTML. Add stable `data-i18n` IDs when adding
text and `data-i18n-attrs` IDs for translated attributes; do not nest text-message
annotations. Run `node scripts/localization-source.mjs --write` after a reviewed
English edit. Without `--write`, that command detects a stale inventory.

Each `catalogs/<locale>.json` has `schema`, `locale`, and a `messages` array. An
entry has `id`, the reviewed `sourceHash`, `termHash` and translated `text`.
Copy current hashes from the source model; never update hashes to hide an
unreviewed source or term change. Duplicate/unknown IDs, missing enabled messages
and stale source/term hashes fail validation. Native-term hashes cover the terms
used by that message, including their provenance.

`{{strong_1}}…{{end_strong_1}}` and similar paired placeholders preserve inline
markup. Move the whole pair for grammar; nesting must remain valid. Atomic
`{{item_1106_1}}` / `{{tech_2203_1}}` placeholders render official names and keep
their original elements, IDs and icons. A technology placeholder's `rankInside`
flag says whether the English button already includes its rank. If false, the
placeholder emits only the native base name: translate an adjacent `Lv` label
using the locale's rank pattern and keep its separate fact token. Never append
a second rank. A rendered-number comparison checks every message.
`{{fact_1}}` retains the exact numeric
value, rate, unit or technical symbol shown in `source.json`. Keyboard commands
are atomic objects too. Every placeholder must occur exactly once. Catalogs
contain plain text, not HTML; quotes and ampersands are serialized safely.
Spelled-out quantities and the meaning of advice still require the roadmap's
proposition-by-proposition review; syntax checks cannot prove a translation.

Install the pinned authoring dependencies with
`pnpm install --frozen-lockfile --ignore-scripts`. On the Windows agent host,
append `--node-linker=hoisted --package-import-method=copy --store-dir artifacts/.pnpm-store`.
Use a new or empty ignored output directory:

```text
node scripts/build-site.mjs artifacts/site
node scripts/validate-localization.mjs artifacts/site
node scripts/test-localization.mjs
node scripts/build-site.mjs artifacts/preview-ja --preview ja --segment A
```

Serve the preview folder and open `/ja/`. It intentionally mixes translated
samples with English, contains `PREVIEW-ONLY.txt` and noindex metadata, and fails
the release allowlist. Never package it. Ordinary release generation currently
emits English only. `manifest.json` fixes the four URL paths/autonyms and keeps
the three target locales disabled. Enabling a locale requires all HTML messages,
current UI strings and native names; the build fails before writing an incomplete
edition. ML-28 owns public activation. Complete synthetic catalogs are constructed
only by test helpers and cannot be selected by the build CLI.

The generated selector links each complete edition, retaining the current hash
with a small enhancement. No-JS links still navigate. URLs/assets remain relative
to the edition, so the site also works under a path prefix. No preference is
stored and no redirect occurs. Shared localStorage identity is unchanged.
Localized tooltip data changes only display names/labels; ID/order/rank and
prerequisite/unlock facts are compared against the English data. Missing locale
UI prevents dependent behavior rather than requesting English fallback data.

`manifest.json` supplies the default production canonical base. Pass
`--base-url https://host/prefix/` to generation when changing that base, and pass
the same URL as the final argument to both output validators. The development
Pages deployment intentionally keeps production canonical metadata; relative
navigation/assets work under `/DSP_Guide/`. Only enabled locales appear in
selectors and alternate metadata. CI installs the exact lockfile, generates,
validates, packages, extracts and validates again.

Run `node scripts/validate-localization-browser.mjs artifacts/localization/check`
for complete synthetic root/prefix switching, no-JS, localized tooltips/status,
storage denial and fail-closed checks in desktop Chromium and both phone engines.
An optional final argument (`android`, `iphone`, `desktop`) isolates one profile.
Use a fresh output directory; fixtures carry `PREVIEW-ONLY.txt` and never deploy.
Chinese and German each have all 1,537 HTML/attribute messages and eight UI
strings reviewed and agent-validated privately through ML-15 and ML-21
respectively. The manifest still disables both. Japanese retains four private
tooling samples, not an accepted translation of segment A. The roadmap records
coverage, corrections and the ML-M2/ML-M3 handoffs; ML-28 owns public activation
of the three complete editions.
The original sample review covered the heading, intro/emphasis,
and native-name/numeric dashboard example; the German rate example uses a label
and colon to preserve the official name without an unnatural counted singular.
All language stories still require translation, semantic comparison, a separate
target-language read, and rendered inspection of the entire segment.
