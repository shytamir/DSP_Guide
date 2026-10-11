# Phone Support and Localization — Decisions and Investigation

**Status:** Roadmap approved, 2026-10-11; ML-E1–E5 are agent-validated.
ML-E6 / ML-28 is authorized and in combined candidate validation. Version 3.2
enables all four complete editions; exact CI/development evidence is required
before ML-M5 closes. Production publication remains the owner's action.
Early investigations and planning decisions are resolved below. Historical
browser samples are disposable feasibility work, not product acceptance.
Story scope, progress, and sequencing live only in the linked roadmap.

**Roadmap:** [Current roadmap](../ROADMAP.md).

## Owner direction and boundaries

- Prioritize phones. Preserve desktop behavior; a dedicated tablet support
  promise is not part of the initial scope.
- Plan Simplified Chinese, German, and Japanese alongside the English guide.
  Simplified Chinese matches the available native Chinese locale. Spanish and
  Russian were removed from the initial scope by owner direction.
- Conduct early investigations without launching the game or modifying its
  files. Inspect retained data and installed localization files read-only.
- Keep the two [deferred concepts](../archive/deferred-indefinitely/) deferred.
- The owner delegates design decisions, language review, technical acceptance,
  and story closure to the agent. There will be no owner device-testing,
  native-speaker, or owner-acceptance gates during implementation. Each finished
  story will update management records and be committed/pushed to `main` once
  implementation is instructed. Production publication remains with the owner.
- Execution through ML-28 is authorized, following the phone, localization and
  three translation epics. Validate the combined 3.2 candidate, commit/push to
  main and stop with a handoff. Production publication is outside this run.

The historical [no-mobile-polish record](../archive/no-mobile-polish-story.md)
does not prohibit this newly authorized planning. The published site's
best-effort mobile policy remains its current support statement until the new
contract is agreed, implemented, and accepted.

## Selected reader outcomes

1. A phone reader can find a phase, recover their place, read the necessary
   guidance, inspect cards and technology details, and use checklists without
   needing a desktop pointer or repeatedly zooming to operate controls.
2. A reader can choose an included language and receive equivalent progression
   guidance, recognizable game terminology, and translated interaction labels.
3. Changing language preserves location and checklist progress. Existing
   English links and saved progress remain usable.
4. Future English edits can be reconciled with each translation without
   silently publishing stale or incomplete instructions.

These outcomes define the draft's acceptance contract. Browser coverage,
delivery, translation review, and release sequencing are settled below.

## Initial investigations — 2026-10-11

Baseline: repository `20576ee`, published guide version 3.0. Findings describe
source inspection and bounded local browser observations, not a full audit.

### Phone layout and interaction

- [guide.css](../../assets/css/guide.css) already has 900 px and 620 px
  responsive rules: a horizontally scrolling bottom phase rail, single-column
  card flows, scrolling tables, and stacked checklist/glossary layouts.
- Integrated desktop Chromium was resized to 390 x 844 and 320 x 740. The
  opening view, expanded YELLOW card, and YELLOW research tooltip were sampled.
  The sampled states had no document-wide horizontal overflow. The bottom
  rail and several tables have their own horizontal scrolling.
- At 320 px, phase tabs measured about 35 px high. The YELLOW dashboard's
  research column was very narrow; the Quick Progress Index had 457 px of
  content inside 277 px, and the rare-resource table had 552 px inside 277 px.
  These are concrete design inputs, not automatic decisions to remove tables.
- Tooltips support click pinning and Escape, but CSS caps their height and
  sets `pointer-events: none`. Long translated prerequisites need a readable,
  dismissible presentation whose overflow can be operated on a phone.
- Further phone review must cover route and expedition-stage navigation,
  REF/back-to-top controls, dense cards, table scrolling, text enlargement,
  and safe-area/landscape behavior. Resizing desktop Chromium does not verify
  touch, mobile Safari, Android Chrome, device fonts, or browser chrome.

### Content and localization identity

- The English HTML is about 891 kB, with roughly 18,100 whitespace-delimited
  tokens after stripping markup. This is a sizing indicator, not a translation
  word count. The DOM contains 19 production cards, 25 tables, 218 technology
  references, 1,033 prototype references, and 66 checklist inputs.
- Only 25 checklist inputs have explicit keys in source. The other 41 receive
  keys derived from English text by [checklists.js](../../assets/js/checklists.js).
  Translating their text directly would change identity. Freeze existing keys
  and preserve saved-state compatibility before introducing translated copy.
- Localization includes prose, phase labels, tooltips, producer descriptions,
  card controls, checklist messages, accessible names, titles, metadata, and
  short UI labels. Numeric IDs, recipes, prerequisites, rates, anchors, and
  checklist identity must remain separate from translated display text.
- [tech-tooltips.js](../../assets/js/tech-tooltips.js) builds English labels
  such as Required/Implicit/Unlocks and qualifies ranks with `Lv`. Its data also
  contains English cube labels and compact unlock labels. These are distinct
  translation surfaces, not just a paragraph translation task.

### Native terminology sources

Read-only inspection found native tables under the installed game's `Locale/`
directory. `Header.txt` identifies `2052` as Simplified Chinese, `1031` as
German, and `1041` as Japanese. The files are UTF-16LE with a byte-order mark.
Retained graph `name_raw` values are localization keys; some begin with `T`
and must be resolved through these tables rather than displayed verbatim.

An in-memory join used the 314 technology records in website data and the
113 distinct item IDs referenced by the guide's markup:

| Locale | Non-empty matched records | Missing records | Conflicting requested keys |
| --- | --- | --- | --- |
| Simplified Chinese | 427 / 427 | 0 | 0 |
| German | 427 / 427 | 0 | 0 |
| Japanese | 427 / 427 | 0 | 0 |

Each folder yielded 6,496 parsed keys, zero malformed rows, and three duplicate
keys across files; no conflicting requested key or flagged requested record
was encountered. This establishes a usable terminology source, not translation
quality, localized rank formatting, full UI-string coverage, or publication
approval. Guide-authored prose and abbreviations still need separate work.

Provenance: installed Steam build `25599610`; SHA-256 of each `prototype.txt`:

- German: `6cf40e4a9a5918853d744c6f8042c0701ea743b1009df7ffb306158f1b487f4a`.
- Simplified Chinese: `350b79de6eb5741372c887d168901221fe9102953ccc4c33432c4e7b7e9a62f8`.
- Japanese: `f845d23c2074ea8a57c92a498da53dd5e92aa7234fdcd9a3981c0aa668228c7c`.

Russian is declared in the header but no `1049` table directory was found;
the owner excluded it rather than proceed without an established source.
This observation does not claim that every distribution lacks Russian support.
The installed build identity is provenance only; this pass did not revalidate
game compatibility or change the current compatibility declaration.

### Delivery and maintenance constraints

- The current site has one English `index.html`, local JSON, shared CSS, and
  small independent scripts. There is no content-generation step.
- [Deployment validation](../../scripts/validate-deployment.mjs) expects exactly
  `index.html`, `assets/`, and the licensing records. Locale directories would
  require deliberate staging, package, link, metadata, and serving changes.
- Current card/deployment/checklist validators contain English-label and
  exact-copy assertions. Preserve fact/structure checks while distinguishing
  the English editorial contract from per-locale completeness and identity.
- Selected: shared semantic structure and stable translation keys producing
  complete static locale pages. English keeps its URL and readable source.
  A bounded authoring-only generation step replaces four manually maintained
  copies. Runtime prose replacement and hand-maintained locale HTML are rejected.
  The scoped tooling change is ML-08/09; no production generator exists yet.

## Completed follow-up investigations — 2026-10-11

An ignored workspace at `artifacts/mobile-localization-investigation/` contains
the disposable probe, catalog samples, key map, JSON results, and screenshots.
No published HTML, CSS, JavaScript, game file, or committed tool was changed.

- `parse5` 8.0.1 parsed and serialized the actual English document with unchanged
  normalized text and the tested ID/technology/prototype/card attributes.
  This proves parser feasibility, not a finished placeholder-safe generator.
- Browser-derived checklist inventory: **66 keys, 66 unique, 25 explicit**.
  All legacy keys were recorded in the disposable map. The sample pages made
  them explicit; one existing saved entry restored on all three language paths
  on the same origin. Full legacy/alias/reset failure coverage belongs to ML-06.
- The HTML inventory also contains 20 non-empty `title`, 18 `aria-label`, and
  two `alt` attributes. Empty decorative alternatives stay empty. The full
  message manifest must include document metadata, template text, and the
  English strings created by `checklists.js` and `tech-tooltips.js`.
- Three disposable full-document copies translated only the title and opening
  paragraph, preserving an emphasized inline span and the original factual IDs.
  Chromium 151.0.7922.34 rendered them at 412 x 915 with mobile/touch emulation.
  WebKit 27.2, revision 2370, rendered them at 393 x 852 with no document-wide
  horizontal overflow in those samples. The rest of each sample remains English
  by design and is not a localized edition or deployable output.
- Screenshots reviewed: Chromium/German and WebKit/Japanese and Chinese. German
  expansion and an isolated final Japanese heading character expose typography
  work; the existing header's rights notice crowds the subtitle. These are
  assigned to ML-03. Glyphs rendered on this host; that does not verify iOS fonts.
- Playwright 1.64.0 and WebKit 27.2 were installed only in ignored tools and
  launched successfully. The initial pnpm install hit sandbox symlink errors;
  a repository-local store and hoisted/copy installation succeeded. The existing
  committed bootstrap remains at 1.62.0 until ML-01. Its Chromium was reused for
  the probe; the new 1.64.0 Chromium binary was not installed/tested in this pass.
- HTML inspection sizes the six translation segments at approximately 3,258,
  2,898, 3,048, 3,098, 2,916, and 2,197 English DOM tokens, plus shared/ancillary
  UI. This supports six independently reviewed stories per language rather
  than treating a whole edition as one story.

The local probe used `probe.mjs` and `inventory.mjs` in that ignored directory;
its HTTP server and browser processes were closed on completion. These are
one-time evidence tools, not additions to the permanent validation contract.

## Settled product decisions

| Area | Decision |
| --- | --- |
| Phone baseline | Current stable Android Chrome on the S23 Ultra class; latest stable Safari/iOS at each candidate freeze. No Samsung Internet, historical iOS, or dedicated tablet promise. Primary portrait support is 360–480 CSS px, with usable landscape and 200% text enlargement. |
| Navigation | Replace the narrow bottom rail with a current-phase/Route control opening a grouped route sheet; keep Reference and Top directly reachable. Preserve desktop navigation, stage hierarchy, and existing links. Use progressive enhancement and native dialog behavior for modal focus/dismissal. |
| Content | Stack dense dashboard/card fields; preserve meaningful tables with independent scrolling and a visible scroll affordance. Use local system fonts, natural wrapping, no truncated essential labels, and adequate room for German/CJK. |
| Technology details | Narrow-screen scrollable dialog/sheet, visible close control, focus return, and touch scrolling. Retain desktop hover/focus presentation and the same authoritative facts. One active sheet at a time. |
| Language URLs | English `/`, Chinese `/zh-CN/`, German `/de/`, Japanese `/ja/`; HTML `lang` values `en`, `zh-CN`, `de`, `ja`. Japanese game header `ja-JA` is provenance, not the web language tag. |
| Selection | Autonyms: English, 简体中文, Deutsch, 日本語. Explicit links select the language and retain the hash; a small enhancement carries the current hash. URL/bookmark records the choice. No automatic redirect or separate language-preference storage. Without JavaScript, links still reach each complete edition. |
| Progress | Keep `dsp-guide:checklist-state:v1`, all 66 legacy keys and aliases. Languages share progress only on the same origin; production and development remain separate. Reset clears this checklist record only. Denied storage gives localized page-only feedback. |
| Names | Display the native ID-mapped game name. Technology details may show a clearly labeled English alias for cross-reference; do not repeat English throughout the prose. Official spellings win over invented translations/transliterations. |
| Phase tags and ranks | Translate visible color/phase labels while retaining their stable IDs/colors. Expand ILS/PLS and other useful game acronyms in the localized glossary, then use consistently. Render rank separately from the native base name: `Stufe {n}`, `等级 {n}`, `レベル {n}`; preserve the integer and avoid duplicate native suffixes. |
| Prose | Chinese: direct Simplified Chinese. German: consistent `du`, idiomatic clauses and compounds. Japanese: natural `です・ます` explanation and concise neutral UI. Preserve uncertainty, advice strength, optionality, and distinctions among targets, shortages, and gates. |
| Quantities | Treat recipe quantities, rates, ranks, technical symbols, and units as protected factual tokens/placeholders. Keep their source values/notation; translate surrounding explanations without changing magnitude or precision. |
| Partial/stale translations | Never silently mix English into an enabled locale. Keep unfinished locales absent from packages/selectors. Fail generation for stale/missing messages in any enabled locale. English root remains available as an explicit reader choice. |
| Release sequence | Agent-validated 3.1 English phone candidate, then 3.2 with all three languages together. The owner chooses when to publish either; implementation does not wait for production publication. |

## Authoring and upkeep contract

English `index.html` remains semantic authoring source. Stable annotations
identify whole messages, translated attributes, and protected inline objects.
Catalogs under `localization/` store language text and the source-content hash
reviewed for each entry. A message is a paragraph, list item, heading, or other
coherent grammatical unit, not isolated English words. Named placeholders can
move for grammar but must retain the required fact/link/technology objects;
catalogs cannot introduce arbitrary HTML, executable code, or new fact values.

The selected authoring-only Node generator uses pinned `parse5` 8.0.1 and a
lockfile. It emits English plus enabled locale pages and localized UI/name data
to an ignored site directory, copying shared assets and existing legal records.
No parser, catalog source, game locale table, or dependency directory ships.
Use prefix-safe relative asset/locale links. Keep localized titles, descriptions,
`lang`, and alternate-language links consistent with the enabled manifest;
host-specific absolute metadata must derive from the explicit deployment base.

This generation step enforces durable cross-language identity and completeness;
copying one source file cannot do that. The agent runs it for previews and
validation, and CI runs it before packaging. It replaces manual staging of the
single HTML page and avoids three hand-maintained markup copies. The deployed
site stays framework-free, serverless, and dependent only on local static files.
ML-08/09 implement the intentional source/tooling change. The deployed site
still has no package dependencies; generation belongs only to authoring and CI.

Native terminology snapshots contain only the required names, ID/key maps, and
source hashes. They do not republish complete game files or imply new asset
permissions. No installed game is needed to build or validate from retained
snapshots. A terminology refresh is an explicit, read-only source-data task.

On a later English edit, hash comparison marks affected entries stale. Update
those messages in all enabled languages with the same review process in the
same story before pushing a publishable build. Structural-only edits need
parity/browser checks but do not invalidate unrelated prose. Term changes
invalidate affected usages. Do not silently disable an already published locale
to evade maintenance, leave it stale, or add a second manual copy of the guide.

The implemented command interface is `node scripts/build-site.mjs <site-directory>`
followed by `node scripts/validate-localization.mjs <site-directory>` and the
updated deployment validator. Actual story evidence is in the roadmap ledger.
Segment preview/check mode is explicitly separate from release
generation and cannot enable incomplete catalogs.

## Validation contract

Planning used Tier 0 plus the bounded feasibility probes above. Implementation
uses the story-specific tiers and records actual product/release evidence in
the roadmap ledger; the historical probes do not count as acceptance.

### Browser matrix

| Surface | Required evidence |
| --- | --- |
| Android primary | Chromium mobile/touch at 412 x 915, device scale factor 3; repeat at 360 x 800 for the narrow supported edge. These are S23-class layout proxies, not measurements of the owner's settings. |
| iOS primary | WebKit mobile/touch at 393 x 852 and 430 x 932, device scale factor 3. Pin binaries and record the latest stable Safari/iOS target at candidate freeze. |
| Boundary checks | 480 px portrait, landscape 915 x 412 and 852 x 393, 200% text enlargement, 320 px stress, and 768 px tablet smoke without a tablet-specific support claim. |
| Desktop regression | Chromium 1280 x 800 and 1920 x 1080; keyboard focus, navigation, cards, tooltips, checklist persistence, and reviewed screenshots. |

Primary phone scenarios in both engines: jump to each phase/stage/reference;
load hashes directly and use Back; open/close cards; read and scroll longest
technology details; operate tables and checklists; reload/reset; handle denied
storage; dismiss sheets and recover focus. Inspect every section once in each
edition at primary widths, with representative high-risk states at boundaries.
At the final candidate, also switch every locale pair preserving a known hash
and saved entry. Run locale-aware DOM scans for clipping and overflow and inspect
the flagged cases; a clean scan is not a substitute for reading screenshots.

Primary navigation, sheet controls, and reset use at least 44 x 44 CSS px touch
targets. Inline technology references must remain individually operable with
adequate separation, without forcing every prose line to be 44 px tall. Text
enlargement must not hide content or controls; scrolling tables is acceptable.
Simulate safe-area padding and viewport-height changes, but report that physical
notches, mobile browser chrome, OS fonts, and assistive-technology behavior have
not been verified. This plan does not claim accessibility certification.

Playwright's WebKit is a patched engine, not branded Safari. The official
[browser documentation](https://playwright.dev/docs/browsers) distinguishes
that limitation; [device emulation](https://playwright.dev/docs/emulation)
configures viewport, touch, and related properties, not an actual phone OS.
[Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)
is the current stable major identified for this planning snapshot. Refresh the
stable target and pin suitable test binaries at candidate freeze; avoid new
engine-only features not available in that Safari release. No purchased device
service or real-device owner gate is planned. Record this accepted coverage
limit without describing emulator passes as physical-device certification.

### Language quality and factual parity

For every segment, the agent performs three distinct passes:

1. Translate against the native terminology map and complete source context.
   Preserve all values, links, prerequisites, negations, and advice strength.
2. Compare source and target proposition by proposition. Check default versus
   optional, prerequisite versus recommendation, bottleneck advice, soft pace
   versus gate, singular/plural quantities, and all numerical tokens. A back
   translation alone is insufficient evidence.
3. Read the target independently for natural phrasing, consistency, terminology,
   grammar, register, punctuation, awkward transliterations, and unnecessary
   English. Rewrite and then inspect the rendered result; verify that a rewrite
   has not changed meaning. Recheck affected assertions after correction.

Language closure includes a whole-edition read to catch drift between segments.
Allow English only for explicit proper names/acronyms, labeled aliases, legal
originals, and external destinations; keep a small justified allowlist. Zero
missing/stale text, unresolved meaning errors, terminology mismatches, known
grammatical errors, unnatural phrasing, unjustified transliterations, or blocking
readability defects is the release gate. Record actual review coverage
and corrections, not a claim of native-speaker endorsement. Self-review is the
delegated acceptance method; real-user validation arrives after publication.

### Validator responsibilities

| Check | Retained or new responsibility |
| --- | --- |
| Card validator | Preserve card/phase/anchor IDs, complexity, recipes, technology relationships, and rank identity across editions. Keep English editorial assertions scoped to English; use semantic identity for localized output. |
| Checklist validator | Preserve all legacy keys/aliases, shared persistence, reset and storage-failure behavior. Test translated status strings separately from storage identity. |
| Localization validator | Check message coverage/source hashes, protected placeholders/factual values, consumed terminology, locale/UI metadata, and enabled-locale parity. Missing or extra factual objects are errors. |
| Deployment validator | Validate generated output and extracted ZIP against deterministic generation plus an explicit locale/file allowlist. Keep asset/license/remote-dependency boundaries and internal-link checks. Do not simply remove current byte/structure safeguards. |
| Source readability | Extend only to new first-party tools/catalog conventions where justified; preserve existing checks. |

Tier 3 includes all applicable repository validators, deterministic generation,
release-equivalent staging/extracted-ZIP checks, and the browser matrix.
Candidate remote checks bind to the exact commit/artifact; failed required checks
block that story and are not deferred to users. No game launch, game write,
external language reviewer, or owner validation is part of these gates.

## Investigation closure and residual evidence limits

No planning decision remains open. Identity, terminology availability, authoring
feasibility, browser tooling, workload boundaries, release order, and acceptance
authority are settled sufficiently to implement. Full message annotation,
all-consumer terminology completion, production generation, and exhaustive
behavior/linguistic validation are bounded deliverables in ML-01–28, not
unresolved research or owner decisions.

Physical phones, actual iOS Safari, device fonts/browser chrome, and independent
native-speaker reactions remain unverified. The owner explicitly delegated
acceptance under these constraints. Preserve those limits in candidate reports;
do not replace them with new approval gates or promises of flawless language.
