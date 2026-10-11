# Roadmap — Phone Support and Localization

**Status: executing ML-E3, 2026-10-11.** ML-01–13, ML-M1 and ML-G2 are
agent-validated. The owner authorized ML-10–15 with validation, management
updates and a commit/push per story to `main`, stopping after the Chinese epic.
ML-E4–06 require a later execution instruction; all translations remain private.

**Outcome:** make the complete guide practical on phones, then offer equivalent
English, Simplified Chinese, German, and Japanese editions without losing
existing links, progress, or progression distinctions.

The [decision and investigation record](management/mobile-localization-plan.md)
settles support, interaction, language, authoring, and maintenance choices.
There are no pending owner design, language-review, or device-testing decisions.
The Dark Fog control and YELLOW/PURPLE resolvers remain
[deferred indefinitely](archive/deferred-indefinitely/).

## Authority and delivery

The owner delegated implementation decisions, linguistic review, technical
acceptance, story closure, and release sequencing to the implementing agent.
Once implementation is instructed, complete the next story, review and correct
its work, update management records, commit, and push to `main` without another
owner acceptance gate. The owner is not the language reviewer or device tester.
Use **agent-validated**, never **owner-validated**, for this work.

The roadmap review is complete. Implementation reports are handoffs, not
requests for routine approval. Resolve ordinary choices autonomously within
these contracts. A failed required check blocks its story: repair within
repository limits or report the concrete blocker. Do not weaken the gate,
claim an unperformed check, or expand scope silently.

Choose two independently usable publication candidates:

1. **Version 3.1: English phone support**, through ML-05.
2. **Version 3.2: phone support plus all three localized editions**, through
   ML-28. No staggered or partially translated public language release.

Change versions only in those candidate stories. Pushes update the existing
GitHub Pages **development deployment**; production publication remains with
the owner. Publishing or owner-reviewing 3.1 is not a dependency for continuing
into localization.

## Scope and fixed constraints

- Target current stable Chrome on a Galaxy S23 Ultra class Android phone and
  current stable Safari on iOS. Acceptance uses mobile Chromium/WebKit emulation
  and agent inspection, with its limits explicitly recorded.
- Support 360–480 CSS px portrait, usable landscape, and 200% text enlargement;
  use 320 px as a stress check. Preserve desktop behavior and existing anchors.
- English stays at `/`; add `/zh-CN/`, `/de/`, and `/ja/`, respecting deployment
  under a path prefix. Share local assets and emit complete static HTML pages.
- Preserve progression facts, optional/default distinctions, cards, and bounded
  RED Dark Fog guidance. The guide remains useful with every card collapsed.
- Share browser-local checklist state across languages. No cloud sync, accounts,
  telemetry, automatic language redirect, or remote font/service.
- Inspect installed locale data read-only. Never launch or modify the game.
- Exclude Spanish, Russian, Traditional Chinese, tablet-specific design,
  Samsung Internet and other browser support promises, native apps, offline/PWA
  features, gameplay revisions, new assets, and the two deferred concepts.
- External destinations, the mod itself, source documentation, and legal records
  are not translated. Translate their surrounding guide descriptions; retain
  legal originals and identify external destinations' language where useful.

## Allocation, sequence, and milestones

Weights include implementation, review, and validation; they are not days:
**M = 3**, **L = 5**. Nothing exceeds L. Split a story before starting if new
evidence substantially increases its scope; use suffix IDs and preserve prior
IDs. Do not renumber completed work.

| Epic | Value | Stories | Weight |
| --- | --- | --- | ---: |
| ML-E1 — Phone experience | Read and operate the English guide on the two target browser families. | ML-01–05 | 21 |
| ML-E2 — Localization foundation | Maintain static editions with stable facts, identity, and progress. | ML-06–09 | 18 |
| ML-E3 — Simplified Chinese | Follow the entire route using native terminology and natural Chinese prose. | ML-10–15 | 30 |
| ML-E4 — German | Follow the same route with precise German phrasing and readable longer labels. | ML-16–21 | 30 |
| ML-E5 — Japanese | Follow the same route with natural Japanese instructions and typography. | ML-22–27 | 30 |
| ML-E6 — Combined candidate | Deliver consistent editions and repeatable upkeep. | ML-28 | 5 |
| **Total** | Translation and its review account for 90 of 134 units (67%). | **28 stories** | **134** |

Execute in ID order. Chinese first exercises the native terminology source;
German next exposes expansion; Japanese receives its own review with those
lessons available. Samples of all three languages are used during phone and
foundation work, so Japanese layout is not postponed until the final epic.
Each story depends on its predecessor plus any explicit additional gate.

| Gate / milestone | After | Agent-owned exit evidence | Enables |
| --- | --- | --- | --- |
| ML-G1 — Repeatable phone checks | ML-01 | Both engines launch; versioned matrix and scenarios work. | Phone behavior changes |
| ML-M1 — English phone candidate | ML-05 | Phone stories accepted; full English release checks and reviewed 3.1 development artifact. | Optional publication; localization proceeds independently |
| ML-G2 — Translation-ready foundation | ML-09 | Progress, generation, terminology, localized UI, private previews, stale-copy detection, and package boundaries verified. | Bulk translation |
| ML-M2 — Chinese accepted privately | ML-15 | Six segments and whole-edition review pass. | German work |
| ML-M3 — German accepted privately | ML-21 | Six segments and whole-edition review pass. | Japanese work |
| ML-M4 — Japanese accepted privately | ML-27 | Six segments and whole-edition review pass. | Combined integration |
| ML-M5 — Four-language candidate | ML-28 | Every locale passes the combined 3.2 candidate gate. | Owner-controlled publication |

“Private” means absent from the deployable site and selector. Catalogs remain
reviewable repository sources; previews stay in ignored `artifacts/`.

## Common definition of done and handoff

Each story satisfies its own contract below and these requirements:

1. Change only its named surfaces and necessary affected validators/docs.
   Preserve unrelated work and fixed product contracts.
2. Run the narrowest relevant deterministic checks and specified browser checks.
   Review actual output, correct defects, and review the final diff. Tests
   belong to the story introducing behavior.
3. Leave the deployed site coherent. Draft locales cannot leak into output,
   selectors, links, or metadata. Unpublished catalogs are a valid bounded
   outcome when explicitly specified.
4. Update this roadmap's execution ledger in the same commit: ID, agent-validated
   outcome, exact commands/results, engine/viewport evidence where applicable,
   limitations, and the next starting point. Record findings durably; ignored
   screenshot paths alone are not the handoff. Avoid a separate narrative report
   for every small edit.
5. Update PROJECT at milestones or material scope changes and other active
   contracts when affected. Stage audited paths, commit one coherent story,
   push `main`, and report the hash/push result. A failed push leaves delivery
   pending; do not proceed as if it succeeded.
6. Distinguish local acceptance, development deployment, and publication.
   Candidate stories verify their exact CI ZIP and development deployment.
   Routine stories do not wait for CI unless changed deployment behavior
   requires it.

The [validation contract](management/mobile-localization-plan.md#validation-contract)
defines browser and linguistic review. No native-speaker sign-off, owner device
run, or owner acceptance is required. Physical-device behavior and reader
feedback remain explicit evidence limitations.

## ML-E1 — Phone experience

### ML-01 — Reproducible phone validation · M / 3

**Value:** catch interaction and layout failures consistently in both engines.

**Scope:** bootstrap, ignored runtime tools, a bounded browser check under
`scripts/`, and support/evidence instructions. Pin investigated Playwright
1.64.0 and its managed Chromium/WebKit; retain Prettier 3.9.6. Capture navigation,
cards, tooltips, checklists, and dense-content baselines. Record branded stable
Chrome coverage when available locally.

**Out of scope:** baseline UI fixes, a device farm, pixel-perfect screenshot
contracts, unrelated dependency upgrades.

**Done:** both engines execute representative matrix scenarios; failures identify
the affected contract. Assign existing defects to ML-02–04, without masking
them or making baseline UI quality a prerequisite for fixing it. Existing
English contract checks pass. Tier 2; ML-G1.

### ML-02 — Reach any route stage by touch · L / 5

**Value:** find a phase, optional capability, or reference without dragging a
long strip of small controls.

**Scope:** navigation markup, `navigation.js`, and CSS. At the existing narrow
breakpoint, replace the bottom rail with a current-phase/Route control and an
accessible route sheet containing phase groups and expedition stages. Keep
Reference and Top directly reachable. Preserve links/IDs; close on selection,
Escape, or explicit dismissal and return focus. Progressive enhancement keeps
route links available without JavaScript.

**Out of scope:** new phases, route reordering, language selection, desktop
navigation redesign, automatic last-read-position storage.

**Done:** all route/stage/reference links work by touch and keyboard in both
engines. Check direct hashes, Back, current-phase indication, focus, safe-area
spacing, landscape, 44 CSS px primary controls, and desktop regression. Tier 2.

### ML-03 — Read dense guidance on a phone · L / 5

**Value:** dashboards, production shapes, and reference tables stay readable.

**Scope:** responsive CSS and necessary semantic wrappers. Stack dense dashboard
fields and card flows; retain genuinely tabular content in independently
scrollable, visibly discoverable containers. Correct observed header/rights
notice crowding and narrow research columns. Accommodate long German labels
and Chinese/Japanese line breaks with local system fonts.

**Out of scope:** progression edits, replacing every table with cards, new
artwork/fonts, tablet-specific layout, whole-site redesign.

**Done:** inspect every dashboard and all 19 cards collapsed/expanded; review
widest tables, header, glossary, checklists, and footer at primary phone sizes.
No document-wide overflow or hidden essential content at supported widths;
tables remain operable. Review 200% text, 320 px stress, landscape, all three
sample scripts, and desktop screenshots. Tier 2.

### ML-04 — Operate technology details and checklists · L / 5

**Value:** inspect long prerequisites and manage progress with a finger.

**Scope:** `tech-tooltips.js`, control/checklist markup, and CSS. Use a scrollable,
dismissible narrow technology sheet with a visible close control; retain
desktop hover/focus behavior. Make checklist labels, card controls, and reset
operable without pointer precision. Preserve reset meaning and saved state.

**Out of scope:** technology facts, language labels, new reset-confirmation
flows, desktop-tooltip redesign.

**Done:** longest prerequisite/unlock content can be scrolled and read; opening,
closing, focus return, outside dismissal, orientation, and route-sheet
interaction work in both engines. Verify save/reload, reset, denied storage,
keyboard use, and no hover-only dependency. Tier 2.

### ML-05 — English phone publication candidate · M / 3

**Value:** deliver useful phone support before the larger language effort.

**Scope:** integrate ML-01–04; set version 3.1; update README, PROJECT, support
and release evidence. Validate staging, extracted CI ZIP, and development
deployment at the candidate commit.

**Out of scope:** translations, physical-device certification, production
publication, waiting for owner phone testing.

**Done:** English Tier 3 passes with zero errors, primary tasks work in both
engines, desktop remains usable, and assets/legal records are included. State
emulation limits. After push, match CI artifact identity to the commit and
record remote checks. Repairs stay in this story before ML-06. ML-M1.

## ML-E2 — Localization foundation

### ML-06 — Preserve identity before translating · M / 3

**Value:** existing links and checkmarks survive display-language changes.

**Scope:** explicit keys for all 66 checklists, preserving the 41 currently
derived keys and existing aliases; a complete translation-surface inventory.
Establish the stable content-ID convention for ML-08. Preserve anchors, card
IDs, prototype IDs, and the current storage key.

**Out of scope:** bulk message annotation, translation, changed checkmark
meaning, a new storage schema, renamed anchors.

**Done:** exact legacy-key parity and uniqueness pass; saved fixtures restore,
reset touches only checklist state, and denied/corrupt storage remains usable.
Inventory includes prose, tooltips, UI, accessible labels, titles, metadata,
and generated text. English card/checklist checks and focused browser
persistence pass. Tiers 1–2.

### ML-07 — Native terminology and editorial contracts · L / 5

**Value:** readers recognize game names instead of guessing at translations.

**Scope:** minimal ID-keyed terminology snapshots and provenance under
`localization/`, language style rules, rank/cube/unlock label policy, and a
bounded extraction/check command. Extend the 427 confirmed records to every
name-bearing UI/unlock record actually consumed. Retain source hashes/key
mappings; keep English factual data separate.

**Out of scope:** entire game locale files, game descriptions/binaries, game
modification, automatic gameplay-data refresh, additional languages.

**Done:** all consumed names resolve without missing/conflicting keys. Rank
labels add no duplicate rank; labels retain IDs, quantities, and relationships.
Review explicit terminology exceptions and natural prose samples. Ordinary
builds need no installed game; extraction is only for refreshing provenance.
Tier 1.

### ML-08 — Deterministic static editions · L / 5

**Value:** maintain one semantic guide instead of hand-editing four pages.

**Scope:** stable source annotations, keyed catalogs/source hashes, pinned
authoring-only `parse5` 8.0.1 plus lockfile, `scripts/build-site.mjs`, and focused
localization validation. English HTML remains readable source; full semantic
messages use named inline placeholders. Emit static HTML and necessary locale
data to ignored staging; provide private segment previews. Preserve
markup-owned facts while allowing grammatical placeholder reordering.

**Out of scope:** frameworks/bundlers, runtime prose replacement, translation
services, publishing unfinished languages, manually editing generated HTML.

**Done:** repeated builds match; English semantic/factual contracts hold.
All three samples preserve IDs and inline markup. Missing, duplicate, stale,
unknown, or unsafe placeholders fail closed for enabled locales. Preview mode
cannot package an incomplete locale. Check escaping, translated attributes,
invalid catalogs, and factual parity with negative fixtures. Tier 1 plus
preview browser review.

### ML-09 — Deliver and switch complete editions · L / 5

**Value:** switching language preserves location/progress, and packages work on
both deployment hosts.

**Scope:** locale manifest/selector, localized tooltip/checklist UI, `lang` and
metadata, prefix-safe paths, staging/ZIP/CI integration, and affected validators.
Use ML-08 generation for deployment. Keep new locales disabled publicly;
demonstrate switching in complete synthetic fixtures.

**Out of scope:** bulk translation, redirects, preference tracking, new hosting,
publication, activating draft catalogs.

**Done:** root/prefixed deployment and deep links work; switching retains hash
and progress; shared assets and dynamic labels use the correct locale. Active
locale data cannot silently fall back to English. Package checks enforce
allowlists, factual parity, no remote dependencies, and exclusion of authoring
sources. No-JS HTML remains readable and locale links usable. Retain existing
fact checks and English-specific editorial checks. Tier 3 on the changed
English-only deployment; ML-G2.

## Translation story contract — ML-E3, ML-E4, ML-E5

The 18 rows below are individual stories. Each inherits this contract and its
segment's scope, exclusions, and additional DoD. All are **L / 5**: translation,
semantic comparison, and a separate natural-language revision dominate effort.

**Scope per row:** that locale's catalog entries and translated attributes for
its segment, associated term usage, and necessary terminology exceptions.
Keep English structure/facts fixed. Include corrections and browser inspection
in the story; never defer linguistic review to ML-28.

**Out of scope for every row:** other languages, new advice, shared-UI redesign,
public locale activation, publication, and English-source changes except a
blocking source defect. Resolve shared defects through a bounded foundation
repair with affected checks.

**Done per row:** translate 100% of its source inventory with current source
hashes; resolve every term/factual discrepancy; preserve numbers, negation,
conditions, optionality, quantities, rates, and prerequisites. Complete bilingual
comparison, a separate target-language read/rewrite, and rendered inspection of
the entire segment. Inspect dense/long-label examples in both engines plus
desktop. Record coverage and corrections. Scoped locale/fact checks pass and
public output remains English-only. No known grammatical errors, unnatural
phrasing, or unjustified transliterations remain in the segment. Tiers 1–2.

### Segment boundaries and additional acceptance

Sizes are approximate whitespace-separated English DOM tokens, not translation
speed estimates; most surrounding UI is excluded.

| Segment | Scope and value | Size | Additional DoD | Explicit exclusion |
| --- | --- | ---: | --- | --- |
| A — Orientation and BLUE | Opening through BLUE; shared navigation, controls, metadata, dynamic messages, term/rank labels, glossary conventions. Start and operate the edition. | 3,258 + shared UI | Tone/acronym rules established; all non-prose interaction strings covered; UI/rank/metadata fixtures pass. | RED onward and reference prose |
| B — RED and ILS | Bounded RED defense and the interstellar logistics bridge. | 2,898 | RED limits, ILS reminders, route gates, and transfer distinctions match the source. | Earlier prose, YELLOW onward, new combat advice |
| C — YELLOW through GREEN | YELLOW, PURPLE, GREEN dashboards, cards, instructions. Sustain science progression. | 3,048 | Conditional remedies, optional shortcuts, and numeric targets retain their force. | Earlier/later route prose and new resolvers |
| D — DYSON through completion | DYSON, receiver/antimatter bridge, PHOTON, WHITE, SPHERE/Mission Completed. Follow the late-game transition. | 3,098 | Distinguish power, photons, antimatter, science, and completion; preserve bridge anchors. | Optional capabilities and reference prose |
| E — Optional capabilities | WARP and LOGISTICS. Choose opportunities without inventing mandatory gates. | 2,916 | Both remain optional; cross-links and ranks match the route's terminology. | Default-route edits and appendix prose |
| F — References and edition closure | Everything after LOGISTICS: production references, tools/mod explanation, quick checklist, glossary, troubleshooting, conclusion/footer, remaining ancillary copy. | About 2,197 + ancillary copy | Reconcile the entire message manifest; whole-edition consistency read; inspect every section and run the full per-locale matrix privately. No untranslated/stale surface remains. | External-tool/legal translation and public activation |

### ML-E3 — Simplified Chinese edition

Use `zh-CN`, Simplified characters, native game names, and direct idiomatic
instructions. Avoid needless transliteration and English-shaped syntax.

| Story | Segment and value | Dependency | Exit |
| --- | --- | --- | --- |
| ML-10 | A — Start and operate the Chinese guide | ML-09 | Segment A done |
| ML-11 | B — Secure RED and establish ILS | ML-10 | Segment B done |
| ML-12 | C — Sustain YELLOW–GREEN science | ML-11 | Segment C done |
| ML-13 | D — Reach late-game completion | ML-12 | Segment D done |
| ML-14 | E — Choose optional capabilities | ML-13 | Segment E done |
| ML-15 | F — Complete and review the Chinese edition | ML-10–14 | Segment F done; ML-M2 |

### ML-E4 — German edition

Use consistent `du` address, idiomatic German compounds, native game names,
and readable instructions. Rewrite awkward literal phrasing; accommodate
expansion without dropping necessary conditions.

| Story | Segment and value | Dependency | Exit |
| --- | --- | --- | --- |
| ML-16 | A — Start and operate the German guide | ML-15 | Segment A done |
| ML-17 | B — Secure RED and establish ILS | ML-16 | Segment B done |
| ML-18 | C — Sustain YELLOW–GREEN science | ML-17 | Segment C done |
| ML-19 | D — Reach late-game completion | ML-18 | Segment D done |
| ML-20 | E — Choose optional capabilities | ML-19 | Segment E done |
| ML-21 | F — Complete and review the German edition | ML-16–20 | Segment F done; ML-M3 |

### ML-E5 — Japanese edition

Use natural `です・ます` explanatory prose, concise neutral UI labels, native
game names, and normal Japanese punctuation. Avoid English word order, forced
pronouns, unnecessary romanization, and invented katakana names.

| Story | Segment and value | Dependency | Exit |
| --- | --- | --- | --- |
| ML-22 | A — Start and operate the Japanese guide | ML-21 | Segment A done |
| ML-23 | B — Secure RED and establish ILS | ML-22 | Segment B done |
| ML-24 | C — Sustain YELLOW–GREEN science | ML-23 | Segment C done |
| ML-25 | D — Reach late-game completion | ML-24 | Segment D done |
| ML-26 | E — Choose optional capabilities | ML-25 | Segment E done |
| ML-27 | F — Complete and review the Japanese edition | ML-22–26 | Segment F done; ML-M4 |

## ML-E6 — Combined candidate

### ML-28 — Four-language publication candidate · L / 5

**Value:** deliver complete editions with trustworthy switching and upkeep.

**Scope:** depends on ML-05, ML-09, ML-15, ML-21, ML-27. Enable all three locales
together; set version 3.2; update README/PROJECT and support/authoring guidance.
Use a disposable English edit to prove stale translations block release.
Validate the generated package, ZIP, development URLs, locale selector,
deep links, and shared persistence.

**Out of scope:** retranslating accepted prose without a defect, new languages
or features, device certification, real-user acceptance claims, production
publication, monitoring automations.

**Done:** all four locales pass Tier 3 with zero missing/stale entries, broken
links, factual/structural mismatches, or known blocking readability/interaction
defects. Run the full matrix; inspect route, tooltip, table/card, and checklist
behavior after language switches, reset, and storage failure. Match exact CI ZIP
and development deployment to the candidate commit, locale allowlist, and
asset/legal contract. Provide one publishable package identity and concise
limitations. Record ML-M5 as agent-validated; publication remains pending.
Archive implementation records only when this delegated scope is complete,
preserving release evidence.

## Execution ledger

The containing commit identifies each local result; the story report supplies
the resulting hash and push outcome.

| Story | Agent validation and commands | Outcome / limitations | Next handoff |
| --- | --- | --- | --- |
| ML-01 — agent-validated | `Bootstrap-AgentEnvironment.ps1 -ValidateOnly`; `node scripts/validate-phone.mjs --mode baseline --output artifacts/phone-validation/ml-01`; card, checklist, and source-readability validators; diff review. All passed. | Playwright 1.64.0; managed Chromium 156.0.8078.4 and WebKit 27.2; installed Chrome 155.0.8059.39. Six browser profiles passed inventory, hash, disclosure, tooltip, and persistence checks; desktop screenshot reviewed. No phone document overflow sampled. 35 px route tabs and non-interactive tooltip overflow remain baseline defects. | ML-02 owns route controls; ML-03 owns dense layout/header spacing; ML-04 owns touch details. Tooling is ready; no real-device claim. |
| ML-02 — agent-validated | `node scripts/validate-phone.mjs --mode navigation --full --output artifacts/phone-validation/ml-02` (12 profiles); `--mode navigation-edges --output artifacts/phone-validation/ml-02-edges` (both engines); card and source-readability validators; links/diff review. All passed. | Every route/stage/reference link, Back, target size, keyboard/explicit/outside dismissal, focus return, landscape, breakpoint changes, safe-area simulation, and no-JS stage links verified. Android, WebKit portrait/landscape, and desktop screenshots reviewed. Explicit focus restoration fixes WebKit's click-to-dialog return behavior. | ML-03: retain this navigation while correcting dense layout and header spacing. |
| ML-03 — agent-validated | `node scripts/validate-phone.mjs --mode layout --full --output artifacts/phone-validation/ml-03-accepted` (12 profiles); card, checklist, and source-readability validators; links/diff review. All passed. | All 25 tables and 19 expanded cards fit; 17 key/value tables stack and eight labelled comparison regions scroll. Header, representative dashboards/production flows, desktop, German/CJK samples, and 200% screenshots reviewed. Enlarged WebKit phase tags and reference headings now wrap; 320 px and landscape pass. Emulation only; facts and saved-key meaning unchanged. | ML-04: replace narrow hover details with an operable sheet and enlarge checklist/control targets. |
| ML-04 — agent-validated | `node scripts/validate-phone.mjs --mode interaction --full --output artifacts/phone-validation/ml-04-accepted-final` (12 profiles); card, checklist, and source-readability validators; exact 66-item label/key/alias comparison with the preceding commit; links/diff review. All passed. | Native narrow details sheet supports Close, Escape, outside dismissal, focus return, scrolling at enlarged landscape text, orientation and desktop transitions. Reviewed both engine sheets, checklists, and desktop hover. All checkboxes have native labels; the Universe Matrix details button stays independently operable. Primary controls meet 44 px height. Save/reload, keyboard, grouped cards, isolated reset and denied storage pass. Synchronous dismissal removes a rapid-reopen race. | ML-05: freeze 3.1 and run full staged, CI ZIP and development-deployment acceptance. |
| ML-05 — agent-validated; ML-M1 reached | All four repository validators passed, including `node scripts/validate-deployment.mjs artifacts/phone-validation/ml-05-site .` (536 identical files). `validate-phone.mjs --site artifacts/phone-validation/ml-05-site --full` passed navigation, layout and interaction modes (12 profiles each), plus navigation-edges (2). Final navigation evidence is `ml-05-navigation-final`; other mode evidence is `ml-05-<mode>`. | Version 3.1; reviewed desktop/phone dashboards, cards, glossary, footer, German/CJK samples, enlarged text/details and wide tables. A separate Chromium/WebKit touch-event audit passed route/details/checklist taps and non-overlapping enlarged controls. Integration accepts named ARIA regions and resets the Route caption when scrolling into the introduction. Assets/legal records included; no game access, translations, physical-device or production-publication claim. | Exact CI ZIP and development checks passed as recorded below. ML-E1 is complete; stop before ML-E2. |
| ML-06 — agent-validated | `node scripts/validate-checklists.mjs`, `node scripts/validate-card-system.mjs`, `node scripts/validate-source-readability.mjs`, and `node artifacts/ml06-browser.mjs` passed; planning links and final diff reviewed. | All 66 keys and aliases match the pre-localization browser snapshot; the 41 derived keys are explicit. Fixtures restore every legacy/alias state with translated labels. Corrupt/array/null storage, isolated reset and denial pass. Chromium 156 at 1280×800 and WebKit 27.2 at 393×852 verified persistence/recovery and reviewed checklist screenshots. Full display-source inventory and stable-ID convention are in `localization/README.md`. | ML-07: retain the minimal all-consumer native terminology map; no bulk translation yet. |
| ML-07 — agent-validated | `node scripts/extract-terminology.mjs <installed-game>/Locale 25599610`, `node scripts/validate-terminology.mjs`, and `node scripts/validate-source-readability.mjs` passed; source mappings, language rules/samples, links and final diff reviewed. | Three minimal snapshots resolve 444 records each (314 technologies, 130 items; 273 unique native keys), extending the 427-record probe by 17 tooltip/cube items. Zero missing/conflicting names; all 206 ranks compose exactly once. Source files were read only; no game launch/write. Native names, IDs and hashes are retained; full tables/descriptions are excluded. Offline checks require no game. | ML-08: annotate messages and build deterministic private/static editions using retained names and protected facts. |
| ML-08 — agent-validated | `pnpm install --ignore-scripts --node-linker=hoisted --package-import-method=copy --store-dir artifacts/.pnpm-store`; `localization-source.mjs --write`; `test-localization.mjs`; `build-site.mjs artifacts/localization/ml08-final`; `validate-localization.mjs` and `validate-deployment.mjs` on that output; card, checklist and readability validators. All passed. Three `--preview <locale> --segment A` builds and `artifacts/ml08-browser.mjs` passed; the release validator rejected a preview as expected. | Pinned parse5 8.0.1/lockfile; 1,536 source messages; four private samples per locale. Complete synthetic catalogs preserve objects and allow grammatical reordering; negative fixtures reject stale/missing/duplicate/unknown/unsafe entries and changed numbers. Repeated release maps are byte-identical (536 files). Desktop Chromium and phone WebKit previews reviewed; German rate phrasing corrected and rechecked. English semantic contracts remain intact; automated checks do not establish linguistic equivalence. | ML-09: manifest/selector, dynamic UI, locale metadata and delivery integration; all non-English public editions remain disabled. |
| ML-09 — agent-validated; ML-G2 reached | `node scripts/test-localization.mjs`, `localization-source.mjs`, and card/checklist/terminology/readability validators passed. `build-site.mjs artifacts/localization/ml09-accepted`, `validate-localization.mjs` and `validate-deployment.mjs` passed; PowerShell `Compress-Archive`/`Expand-Archive` and both validators on `ml09-extracted` passed (539 exact files). `validate-phone.mjs --site artifacts/localization/ml09-accepted --mode <mode> --full --output artifacts/localization/ml09-<mode>` passed navigation/layout/interaction (12 each) and navigation-edges (2). `validate-localization-browser.mjs artifacts/localization/ml09-switching-<profile> <profile>` passed android/iphone/desktop (96 switching cases). | Manifest keeps all target locales disabled. Complete synthetic fixtures verify every locale pair at root/prefix paths, hash/progress retention, no-JS links, native tooltip names/ranks/unlocks, all four status messages, denied storage and fail-closed UI loading. Reviewed phone/desktop screenshots and eight UI strings per language. Integration fixed duplicate inline ranks and reduced-motion `srcset` paths; per-message number parity and srcset checks now guard them. Production remains unchanged; emulation/synthetic coverage is not full language acceptance. | Exact CI ZIP and development checks passed as recorded below. Stop after ML-E2; ML-E3 / ML-10 requires a new instruction. |
| ML-10 — agent-validated | `node artifacts/ml-e3/catalog.mjs A` passed all 393 entries, hashes, placeholders and rendered numbers. `node scripts/localization-source.mjs`, `build-site.mjs artifacts/ml-e3/ML10-preview --preview zh-CN`, `artifacts/ml-e3/browser.mjs ML10 A`, `build-site.mjs artifacts/ml-e3/ML10-release`, `validate-localization.mjs artifacts/ml-e3/ML10-release`, `validate-deployment.mjs artifacts/ml-e3/ML10-release .`, `validate-checklists.mjs`, and documentation checks passed (539 English-only files). | Bilingual comparison and a separate Chinese read covered all 393 HTML/attribute entries and eight UI strings. Chromium 156 / WebKit 27.2 at 412×915, 393×852 and 1280×800 inspected 347 rendered text nodes, expanded cards, 200% phone text, route controls, native ranks and checklist persistence/reset. Reviewed glossary, reference flow, dashboard, card, route and technology screenshots. Corrected inventory-capacity wording, official Reclamation name, completion-name grammar, producer-label order and Chinese punctuation. Native item links use official matrix names; color aliases identify prose/route stages. English-only output and fixed identities remain intact. | ML-11: translate RED and ILS (segment B), retaining bounded combat and manual/automatic transfer distinctions. |
| ML-11 — agent-validated | `node scripts/localization-source.mjs --write`, `node artifacts/ml-e3/catalog.mjs B`, card/readability validators, `build-site.mjs artifacts/ml-e3/ML11-preview --preview zh-CN`, `artifacts/ml-e3/browser.mjs ML11 B`, and `build-site.mjs artifacts/ml-e3/ML11-release` plus both output validators passed. | 227/227 segment entries; 620 cumulative. Bilingual and separate Chinese review retained oil-output blocking, optional balancing, eight-turret procedure, 860/520 haulback, 200-cube batch, two stations/five vessels, component subtotals and unpowered-source/powered-receiver distinction. Three primary Chromium/WebKit/desktop cases inspected 224 rendered text nodes and 200% phone text; dense tables and combat/stage screenshots reviewed. Two bounded source repairs corrected Drive Engine Lv2 from item 1407 to tech 2902 and removed item 1131 from the generic FOUNDATIONS heading; English wording/facts remain unchanged. Existing card/factual/recipe/readability checks and the 539-file English-only package pass. No game access. | ML-12: YELLOW, PURPLE and GREEN, preserving conditional remedies and optional shortcuts. |
| ML-12 — agent-validated | `node artifacts/ml-e3/catalog.mjs C`, `localization-source.mjs --write`, card/readability validators, `build-site.mjs artifacts/ml-e3/ML12-preview --preview zh-CN`, `artifacts/ml-e3/browser.mjs ML12 C`, and `build-site.mjs artifacts/ml-e3/ML12-release` plus both output validators passed. | 257/257 segment entries; 877 cumulative. Bilingual comparison and separate Chinese revision retained rank caps, discard rules, three/three/two Labs, conditional expansion, optional resource detours, net Hydrogen consumption, and Strange-Matter-first fuel priority. Corrected an ambiguous Chinese bypass verb and smoothed fuel/blueprint phrasing. Chromium/WebKit/desktop covered 255 rendered nodes, all three dashboards/cards and enlarged text. Source item 1102 on the Iron Ingots flow was corrected to 1101 against retained runtime recipe 104; the validator now compares those inputs to that recipe. English wording, image and quantities are unchanged; English-only output passes. | ML-13: DYSON, receiver bridge, PHOTON, WHITE and optional SPHERE; preserve power/photon/antimatter/completion distinctions. |
| ML-13 — agent-validated | `node artifacts/ml-e3/catalog.mjs D`, `build-site.mjs artifacts/ml-e3/ML13-preview --preview zh-CN`, `artifacts/ml-e3/browser.mjs ML13 D`, and `build-site.mjs artifacts/ml-e3/ML13-release` plus both output validators passed. | 228/228 segment entries; 1,105 cumulative. Bilingual and separate Chinese review preserved sail-capacity/reference distinctions, receiver warm-up and output blocking, the 40/min baseline, 2,000 Antimatter reserve, 4,000-cube completion and optional permanent-sphere scope. Read-only native locale lookup confirmed 光子生成, 持续接收, 自动轨道 and the displayed collider recipe 质能储存; no game launch/write. Revised literal sphere phrasing. Chromium/WebKit/desktop inspected 227 rendered nodes, bridge, dashboards, cards and 200% phone text; screenshots reviewed. The 539-file English-only release remains unchanged. | ML-14: optional WARP and LOGISTICS, preserving departure checks, scout-first progression and replacement-stock boundaries. |

ML-01 repaired the generated runtime lockfile upgrade path (`--no-frozen-lockfile`)
and uses a hoisted/copy install to avoid sandbox symlink requirements. The first
upgrade failed on the old lockfile; a buffered browser download was interrupted
and completed separately with `playwright install chromium webkit`. The final
validate-only run confirmed the exact packages and both rendering smoke tests.

For ML-05/ML-28, append actual CI artifact/run identity and remote results after
the first push in a small evidence follow-up commit within that story. Do not
invent remote success before the commit exists. Close delivery after that
follow-up is pushed, then proceed without owner acceptance.

The verified package remains identified by its product candidate commit even
when the subsequent management-only commit creates another workflow run. A
management-only follow-up does not restart candidate verification or require
another self-referential evidence commit. Apply the same rule to ML-09 if its
deployment change requires post-push evidence.

## ML-M1 candidate evidence and handoff — 2026-10-11

**Result: agent-validated, ML-E1 complete.** Candidate commit
`73cdc59f7c11ae9f36a4c7616f9bf5d890eeee5f` is version 3.1. Production publication
is still the owner's action; no translations or ML-E2 implementation are included.

- [Build/deploy run 38141867146](https://github.com/shytamir/DSP_Guide/actions/runs/38141867146),
  run number 167, completed successfully for that exact commit. The associated
  Pages run 38141867152 also succeeded.
- CI artifact `11703117191` contains
  `dsp-practical-progression-guide-3.1.166.73cdc59.zip`.
  Downloaded through the GitHub connector, verified the outer artifact digest,
  and validated the extracted inner package. All 536 expected files match the
  candidate source byte for byte, including the license and sanitized permission.
  Inner ZIP SHA-256:
  `5a6aacb2f3fa5eb0651a66ba3b73f80877928669b7bc6cd97f48dc92d9ad602d`.
- [Development deployment](https://shytamir.github.io/DSP_Guide/) returned version
  3.1. Independent HTTP comparisons matched all 536 package files, with zero
  failures. Navigation passed all six primary/desktop/stable-Chrome profiles;
  interaction passed the primary Android and iPhone profiles. Remote route and
  desktop screenshots were reviewed.
- Exact package check:
  `node scripts/validate-deployment.mjs artifacts/phone-validation/ml-05-ci-site .`.
  Remote checks used `node scripts/validate-phone.mjs --site https://shytamir.github.io/DSP_Guide/`
  with `--mode navigation`, and `--mode interaction --profile android` / `iphone`.
  Reports and the downloaded ZIP are retained under ignored
  `artifacts/phone-validation/ml-05-*` paths. The byte-comparison and touch/visual
  audit scripts there are disposable evidence tools, not deployed dependencies.

Local release checks also passed `node scripts/validate-card-system.mjs`,
`node scripts/validate-checklists.mjs`, and
`node scripts/validate-source-readability.mjs`. The full staged browser matrix
and review are recorded in the ML-05 ledger row. No known blocking defect remains
within this epic. Emulation does not certify real phones, branded iOS Safari,
OS fonts, assistive technology, or independent reader acceptance.

**Next starting point, only after a new execution instruction:** ML-E2 / ML-06.
Preserve all 66 saved identities and aliases, including the 41 still derived
from English text; the ML-04 comparison confirmed unchanged inputs. Inventory
must include the new Route/Close controls, stage accessible labels, table-scroll
hints/region names, and technology-sheet heading. Keep the independently
operable Universe Matrix details button and its associated checklist label.
ML-07–09 then establish terminology, catalogs/generation, and package boundaries
before any bulk translation. Do not treat the three typography samples as
localized editions. The two earlier concepts remain deferred indefinitely.

## ML-G2 evidence and handoff — 2026-10-11

**Result: agent-validated, ML-E2 complete.** Candidate commit
`db0ef6d595a8017ce26983f83145bea08a23a517` remains version 3.1, English only.
The foundation is ready for bulk translation. Production publication remains
the owner's action; no full translated segment or edition is accepted yet.

- The four story commits are `fd213c9` (ML-06), `f904a27` (ML-07),
  `f65ab37` (ML-08), and `db0ef6d` (ML-09), each pushed to `main` with its
  management update.
- [Build/deploy run 38146048439](https://github.com/shytamir/DSP_Guide/actions/runs/38146048439),
  run number 172, succeeded for the exact candidate. Associated Pages run
  38146048245 also succeeded.
- CI artifact `11704303015` contains
  `dsp-practical-progression-guide-3.1.171.db0ef6d.zip`. Downloaded the actual
  artifact, verified its outer SHA-256 against GitHub's digest, and extracted
  the inner package. All 539 files match deterministic generation, including
  authorized assets, license and sanitized permission; authoring catalogs,
  parser dependencies and test fixtures are excluded. Inner ZIP SHA-256:
  `8e8759289f69f99ad624f7aed99898e4193dda034598df82f4bb24da5898e468`.
- Exact package checks passed:
  `node scripts/validate-localization.mjs artifacts/localization/ml09-ci-site`
  and `node scripts/validate-deployment.mjs artifacts/localization/ml09-ci-site .`.
- [Development deployment](https://shytamir.github.io/DSP_Guide/) matched all
  539 package files byte for byte, with zero failures. Disabled `/zh-CN/`,
  `/de/`, and `/ja/` paths each returned 404. The disposable audit command was
  `node artifacts/localization/verify-ml09-development.mjs`; its report is
  `artifacts/localization/ml09-remote-bytes.json`.
- `node scripts/validate-phone.mjs --site https://shytamir.github.io/DSP_Guide/`
  passed `--mode navigation` for six primary/desktop/stable-Chrome profiles and
  `--mode interaction --profile android` / `iphone` for both primary phones.
  Reports and reviewed remote screenshots are under ignored
  `artifacts/localization/ml09-remote-*` paths. Local release, ZIP, 38 English
  browser cases and 96 synthetic language-switching cases are
  recorded in the ML-09 ledger row.

No known blocking defect remains within this epic. Browser emulation does not
certify physical phones, branded iOS Safari or OS fonts. Synthetic editions
exercise delivery and interaction, not language quality; the four private HTML
samples and eight self-reviewed UI strings per language are not bulk translation
acceptance. No game launch or game-file modification occurred.

**Next starting point, only after a new execution instruction: ML-E3 / ML-10,
Simplified Chinese segment A.** Read the segment contract below the ML-09 story,
[localization authoring guide](../localization/README.md), and
[language rules](../localization/style.md). Segment A has 393 of the 1,537 HTML
messages plus eight dynamic UI strings. Reconcile those existing UI strings
and four samples with the complete segment; review each proposition against
English, then independently read the target language and inspect its rendering.
The remaining segments have B 227, C 257, D 228, E 250 and F 182 messages.

Preserve all 66 checklist identities/aliases, public anchors, factual placeholders
and native ID mappings (444 terms per target locale). Respect `rankInside` when
translating an adjacent rank label; never duplicate or alter its numeric token.
Use a fresh ignored output with
`node scripts/build-site.mjs artifacts/preview-ml10 --preview zh-CN --segment A`
for private inspection. All three non-English locales stay disabled and `VERSION`
stays unchanged until ML-28. ML-10 has not started; the two earlier concepts
remain deferred indefinitely.

## Draft review — 2026-10-11

Self-review checked allocation, each story's value/scope/exclusions/DoD,
dependencies, milestone coverage, and delegated authority. Corrections before
presentation: separated terminology from generation; split translations into
six segments per locale; included ancillary/UI text; excluded incomplete
locales from packages; removed owner/device/native-speaker gates; and separated
local commits from evidence available only after candidate pushes. The linked
investigation record preserves evidence and emulation limits.
