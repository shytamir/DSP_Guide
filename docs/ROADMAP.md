# Localization Correction Roadmap

**Status:** Approved and authorized through LC-01–07 completion on 2026-10-11.
Implementation is active. The owner authorized the full sequence; epic handoffs
are recorded without stopping between epics. Per-story validation, management
updates and commit/push to `main` follow the established execution workflow.
Production publication remains the owner's action.

**Outcome:** Remove confirmed ambiguity, naming inconsistencies and unnatural
protected-name constructions from the complete Chinese, German and Japanese
editions, preserving native game terminology and the English route. Deliver
one corrected four-language candidate for owner-controlled publication.

## Baseline and authority

The external localization review is evidence to test, not automatic intake.
Its truncated captures did not cover the full editions, and its author had no
native tables or project history. Claims were checked against complete
catalogs, generated editions, retained terminology, authoring rules and,
for disputed UI labels, installed locale tables read-only. The game was
neither launched nor modified.

Planning baseline: `a82672accf3ee0dcd6a3515dcb0effd46ecd4357` on `main`.
The retained ML-M5 package contains product commit
`a4136692bbc3d5a300891dde3dd0a16bdc808bc3`:
`dsp-practical-progression-guide-3.2.191.a413669.zip`.
On 2026-10-11, terminology validation passed 444 identities per language;
localization validation confirmed all three 1,537-message catalogs and all
551 retained package files against current generation. These checks establish
structural consistency, not satisfactory phrasing.

ML-01–28 remains completed history. Its
[handoff](archive/version-3.2/ROADMAP.md#ml-m5-handoff--2026-10-11) retains the
original evidence and limitations. The findings below qualify that candidate's
editorial readiness; it is not the corrected candidate promised by this plan.
Do not rewrite archived acceptance or reuse that package identity for a new
result. Version 3.0 is the last recorded production publication.

## Investigation results and dispositions

The pattern scan covered all 1,537 source messages, all 1,537 entries in each
translation, all eight dynamic UI strings per language and generated native-name
surfaces. Segments A–F cover opening/references/BLUE; RED/ILS;
YELLOW/PURPLE/GREEN; DYSON/receiver bridge/PHOTON/WHITE/SPHERE; WARP/LOGISTICS;
and final references/checklists/statistics/footer respectively. This is a
complete-edition check of the reported patterns, not an independent
native-speaker audit or new game-mechanics verification.

| Finding | Full-edition evidence | Disposition |
| --- | --- | --- |
| German numerical punctuation | 28 protected values in 27 messages: A 0, B 0, C 9, D 13, E 3, F 2. Includes `10,500`, `22.5/min`, `1.655 GW`, late reserves and WARP packing quantities. | Required, LC-01. The early English-format disclaimer does not remove deep-link ambiguity. No wrong numerical value was found. |
| Native names versus prose substitutes | Chinese `b.ils.li.027` says 制造面板; the native Replicator title is 合成器, already used in E/F. German has three `Depot Mk.I` messages, one technology-reference `Wärmekraft`, and `Dunklem Nebel` in `a.top.p.013`; native names are `Depot Typ I`, `Wärmeenergie` and `Dunkelnebel`. | Required, LC-02. Generic power-generation prose using Wärmekraft remains valid. |
| German producer designations | 70 messages contain `Herstellung: Montagemaschine`; another WARP packing row names the machine. There are 77 source-owned `Mk.I` tokens in 74 messages, including the three Depot references. Prior style deliberately permitted the alias/notation. | Required alignment, LC-02. Exact producer labels identify the native machine; ordinary generic prose need not repeat an abbreviation. |
| Matrix-name explanation | Chinese already states the native item-link exception. Japanese/German still imply that a formal matrix name identifies only a technology, contradicting their native item labels. | Required, LC-03. Correct the explanation; preserve native labels and natural color shorthand. |
| Japanese numbered stages | All 12 ILS/WARP navigation title/aria entries use 段階; three ILS overview rows use 工程 I–III despite a 段階 column heading. | Required, LC-03. Use 段階 for numbered expedition stages; ordinary production 工程 stays valid. |
| Missing tagline meaning | Japanese substitutes “landed” for “lost”; German omits it. Each has three description copies: ordinary metadata, Open Graph and Twitter. Chinese retains it. | Small, confirmed meaning omission, LC-03. Restore the proposition without general tone restoration. |
| Convergence explanation versus labels | 40 English messages contain `convergence`: A 7, B 11, C 8, D 8, E 6, F 0. Many translations lose the glossary connection. Some retain it, so the review's “never” claim is false. | Required pedagogical consistency, LC-04. Reconcile labels/explanations without replacing every crafting or assembly term. |
| German protected-name grammar | 49 messages contain `vom Typ`, `des Typs` or `der Typen`; 36 are in D–F. A separate 26-message `Produkt` word-family scan overlaps once. Wider native-name prose inspection exposes invariant singulars outside those keywords. | Required naturalness, LC-05/06. Hits are review candidates, not 74 automatic replacements. Preserve valid structured labels. |

Reproduce the numeric pool from baseline `localization/source.json` by selecting
`fact_*` values with a digit, comma or point, then a digit (`\d[,.]\d`). The
designation pool selects `fact_*` values equal to `Mk.I`; the convergence pool
selects source text containing `convergence`, case-insensitively. Preserve these
baseline message IDs in story evidence so corrected wording cannot shrink the
review pool silently. Counts describe candidates, not required edit totals.

The German review pool is reproducible from the baseline: union the 49
type-construction entries and 26 whole-word `Produkt`, `Produkts`, `Produkte`,
`Produkten`, `Produktes` entries with messages whose ID kind is `p`, `li`, `dd`
or `div`, containing a native term placeholder and whose English source does
not contain `Produced in`. This produces **317 distinct candidates**:
A 48, B 59, C 61, D 67, E 45, F 37. Many are correct supply lists, research
chains or captions and should remain unchanged. Separately inspect the 22
entries where an item/technology placeholder precedes a colon; most are valid
tables. These overlapping review sets are not edit quotas.

Additional examples include `c.purple.p.001/.011`, `e.warp.p.008/.013`,
`e.logistics.p.011` and `f.production-statistics-walkthrough.li.006`. They
expose the same singular-name or artificial category-word pattern beyond the
original review's range.

### Preserved terms, acceptable choices and excluded polish

- Keep native German `Brennbareis`, `KristallSilizium`, `Rückgewinnung`,
  `Raum-Warper`, `Strahlen-Receiver` and `Zusammens.-Masch. Typ I`, including
  spelling. Keep Japanese 合成機, 通過量計測機, X線崩壊 and 分留施設.
  Native completion names' unusual punctuation is protected too. Recast
  surrounding grammar when needed; do not “repair” the game labels.
- Keep native matrix item labels, color shorthand in suitable prose and
  equivalent route headings/tooltips. Different wording at the same destination
  is not itself a navigation defect. Do not force identical headings.
- Chinese 后方阵地 occurs twice and fits the fixed-battery explanation.
  阶段 serving both phase and stage is understandable; 通用产线 is defensible.
  Japanese 建設用品工場 intentionally explains mall to novices; 枝ライン is
  understandable. Generic 重力 versus native 引力 is not a wrong game name.
- Quotes, dashes, CJK–Latin spacing, Japanese 二本目 versus 二基目,
  “simplest”/“measured reserves” nuances and humor restoration are optional
  polish, excluded here. Concrete haulback quantities remain correct. Corner
  quotes are not exclusive to Traditional Chinese/Japanese. Do not replace all
  94 枝ライン entries by preference.
- German `ungefragtes Nebenprodukt`, defined Mall, contextual Seed, Receiver
  shorthand and Proliferation are not automatic defects. `Prozessor: 130 Stück`
  is valid table labeling; surrounding sentences are judged separately.
- Retain legal originals, recognizable external tool/action names and the
  preview image's actual English wording. No translated artwork, legal rewrite,
  new language, gameplay advice, phone feature or deferred concept.

Optional polish has no story ID, weight, prerequisite or release gate here.
It is not silently queued for implementation.

## Approved decisions

1. **Numbers:** German prose displays decimal commas and grouping dots:
   `10.500`, `22,5/min`, `1,655 GW`. Preserve source precision, units, ranges,
   operators and magnitude. All affected integers are already source-grouped;
   no additional rounding/grouping policy is needed. Other editions retain
   their display. Format at generation, not through editable catalog numbers
   or runtime JavaScript.
2. **Names:** Native labels stay exact. Existing `Mk.I` tokens may display
   `Typ I` in German where they describe the same native machine/storage grade.
   This is an explicit designation mapping, not decimal formatting or global
   replacement. German producer descriptions use the native assembler label;
   generic Montagemaschine remains valid ordinary explanatory prose.
3. **Guide vocabulary:** Keep 汇合点 / 合流工程 / Zusammenführung and make
   matching production-map labels recognizable uses of these glossary concepts.
   Preserve specific processes such as smelting. Explain native matrix
   item/technology names versus color shorthand. Japanese may naturally use
   color + マトリクス; no global キューブ conversion.
4. **Grammar:** Recast around immutable native placeholders using natural
   verbs, quantities, production/storage references or an explicit label where
   helpful. No inflection engine, aliases inside protected names or requirement
   that every `Typ`/`Produkt` disappear. Preserve propositions/advice strength.
5. **Delivery:** Keep version 3.2 and all four editions enabled. Deliver one
   corrected candidate after the sequence with a fresh commit/build/ZIP
   identity. Authorized story pushes update the existing development site;
   they do not constitute owner production publication. No intermediate
   publication recommendation or staged locale launch.

At the planning baseline, the [authoring contract](../localization/README.md)
and [style rules](../localization/style.md) preserved English fact punctuation
and permitted German workarounds. LC-01/02/05 revise these rules alongside
implementation and validation; the execution ledger records completed changes.

## Allocation and sequence

Weights include implementation, linguistic review and validation, not days:
**M = 3**, **L = 5**. Renderer/name-boundary changes and later German material
receive larger allocations than small convention repairs. Seven stories total
**31 units**; no story exceeds L.

| Epic | Reader value | Stories | Weight |
| --- | --- | --- | ---: |
| LC-E1 — Numerical and naming accuracy | Read quantities unambiguously and find the same item/control in the game. | LC-01–02 | 10 |
| LC-E2 — Clear, consistent explanations | Follow glossary concepts and instructions without misleading conventions or template-shaped German. | LC-03–06 | 16 |
| LC-E3 — Corrected combined candidate | Receive one checked package with traceable evidence and a publication handoff. | LC-07 | 5 |
| **Total** | Bounded corrections across complete editions. | **7 stories** | **31** |

Execute in ID order; every story depends on its predecessor. LC-01 establishes
the value/display boundary before LC-02 adds designation handling. LC-03/04
settle conventions before German sentence repair. LC-05 establishes natural
constructions in the early guide; LC-06 addresses the larger late-game defect
concentration and repeated closing checklists.

| Gate / milestone | After | Exit evidence | Enables |
| --- | --- | --- | --- |
| LC-G0 — Scope authorized | Draft review and subsequent implementation instruction | Approved bounds and explicit execution scope. Git actions require explicit authorization. | Authorized stories/epic only |
| LC-G1 / LC-M1 — Accurate display | LC-02 | Numeric/identity tests pass; affected values/designations and named UI repairs reviewed in context. | Editorial sequence |
| LC-G2 / LC-M2 — Editorial reconciliation | LC-06 | Pattern pools have corrected/retained dispositions; no confirmed in-scope defect remains; changed copy passes bilingual and target-only review. | Candidate freeze |
| LC-G3 / LC-M3 — Corrected candidate | LC-07 | Full four-edition checks and exact new package/development evidence pass; limits recorded. | Owner publication decision |

Authorized execution policy: agent-owned language decisions,
self-review, technical acceptance and story closure, recorded as
`agent-validated`, with no physical-device, native-speaker or repeated owner
language gate. The owner reviews this roadmap and retains publication.
Use one coherent commit per completed story and push to `main` **only when the
execution instruction authorizes those Git actions**. Record an epic handoff and continue within the owner-authorized full sequence. Preserve IDs
if a newly evidenced scope increase requires a reviewed split. Do not silently
absorb unrelated findings.

## Story contracts

Shared completion/validation requirements below form part of every story's
definition of done. File scopes include directly affected tests/documentation,
not unrestricted neighboring cleanup.

### LC-01 — Localize German numerical display (L, 5)

**Value:** Deep-linked quantities and power requirements are readable without
an English-format warning elsewhere in the guide.

**Scope:** The 27-message numeric inventory, its 28 values and `a.top.p.016`'s
obsolete disclaimer. Add deterministic German formatting for source-owned
numeric fact tokens in `scripts/lib/localization.mjs`; update the catalog note,
authoring rules and focused localization tests. Separate canonical facts from
display without letting catalogs supply numbers. Replace punctuation-sensitive
rendered-number comparison with checks retaining each token's value, unit,
precision and identity. Preserve structural signatures and fail-closed coverage.

**Out of scope:** Recalculating figures; translating units, versions, URLs,
IDs, names, ranks or Mk notation; runtime formatting; dependencies;
Chinese/Japanese restyling. Tooltips display names/ranks rather than these
costs, so no tooltip feature is needed.

**Done when:** All 28 values render correctly, including `1.655` becoming
`1,655`, not a grouped integer. Negative cases reject changed magnitude, unit,
precision, missing/duplicate tokens and literal number injection. Root/prefix
generation stays deterministic; the formatter leaves English/Chinese/Japanese
outputs unchanged. Read every affected German message; review decimal cards,
reserves, power and packing tables on desktop and primary phones at 200% text.

### LC-02 — Reconcile native names and grade notation (L, 5)

**Value:** UI references and production descriptions identify the same native
objects as the game's labels without sacrificing readable prose.

**Scope:** Chinese `b.ils.li.027`; German `a.top.p.013`, `a.blue.p.003`,
the three Depot messages (`a.card-bootstrap-mall-storage.li.010`,
`a.blue.li.005`, `f.top.li.024`) and assembler producer/packing labels.
Review all 77 Mk.I tokens in 74 messages against retained item IDs/native
names. Preserve source grade identity and other locale displays. Add narrow,
explicit designation handling to the existing renderer/tests, separately from
decimals. Align producer labels with `Zusammens.-Masch. Typ I`; keep generic
assembly/power terms where describing activities rather than naming objects.

**Out of scope:** Changing native snapshots to preferred spellings; a general
alias/morphology framework; new extraction; unrelated UI terminology;
changing gameplay or producer identities.

**Done when:** Native name/ID/grade relationships match throughout A–F;
Replicator references agree with 合成器; German no longer uses the identified
hybrids or substitute technology name. Non-German displays and native tokens
stay exact. Test designation and numeric/structural invariants; inspect producer
labels, accessible text, packing tables and corresponding cards on desktop
and primary phones. Update the directly affected authoring/style rules.

### LC-03 — Make introductory and stage conventions truthful (M, 3)

**Value:** Readers understand displayed matrix names and expedition labels;
metadata retains the source premise.

**Scope:** Reconcile `a.top.h3.001`, `a.top.p.009/.011` and relevant color
examples with actual labels in all editions. Chinese's existing exception may
remain; repair only contradictions. Align Japanese `b.ils.td.001/.003/.005`
with 段階; verify ILS/WARP across rail, route sheet, titles and accessible names.
Restore “lost” naturally in Japanese/German `a.opening.attr.001.content`,
`.004.content` and `.007.content`.

**Out of scope:** Replacing native matrix labels with colors; global キューブ
substitution; changing stage anchors or navigation; forced identical headings;
other humor or marketing rewrites.

**Done when:** Introductory claims describe the complete editions; numbered
stages agree across entry points; all six metadata copies retain the premise.
Compare changed messages to source, read target text separately and check
generated metadata and visible/accessibility pairs. Review affected
opening/route/table views on desktop and primary phones.

### LC-04 — Connect production-map labels to the glossary (L, 5)

**Value:** The taught concept of ingredient branches meeting remains useful
through every relevant card and production reference.

**Scope:** All 40 source `convergence` messages in each target edition plus
`a.top.dd.005`. Align relevant labels with 汇合点 / 合流工程 / Zusammenführung
using natural phrases, preserving correct uses and specific processes. Cover
reusable references, affected cards, the ILS build sequence and WHITE's
dashboard/quick reference, through LOGISTICS.

**Out of scope:** Renaming every 合成, 組み立て, 精錬 or Endfertigung occurrence;
unrelated branch vocabulary; changes to recipes, supply/output, icons, build
order or phase obligations; a global prose linter.

**Done when:** Each occurrence has a corrected/retained disposition per language;
labels connect to the glossary while describing the actual process. Protected
facts/objects pass; review every changed rendered message, expanded card and
narrow-view label. Update only directly affected vocabulary guidance.

### LC-05 — Repair German protected-name prose in A–C (M, 3)

**Value:** Early progression and middle research phases read naturally while
retaining findable native item names.

**Scope:** The 168 A–C candidates in the defined German pool and related
colon-label entries. Repair confirmed type scaffolding, false singular syntax
and unnecessary Produkt constructions. Retain valid recipe/quantity labels
and mass nouns. Include ILS assembly and the wider scan's PURPLE examples.
Revise the style rule recommending `vom Typ` as the routine solution.

**Out of scope:** Editing all 168 entries by quota; declining native names;
changing table data or station/haulback advice; humor/typography polish;
rewriting other languages; D–F, owned by LC-06.

**Done when:** Candidates have contextual review and a reason for retained
questionable constructions. Source comparisons and a separate German-only
read preserve spelled quantities and optionality. Structured tables remain
legible/accurate; no replacement merely creates another repetitive template.
Verify contracts and inspect changed paragraphs/cards/tables on desktop and
primary phones. Hand conventions and early/closing checklist pairs to LC-06.

### LC-06 — Repair German protected-name prose in D–F (L, 5)

**Value:** Late-game, optional-route and reference instructions meet the same
naturalness standard as the reviewer's early-game sample.

**Scope:** The 149 D–F candidates and related colon-label entries, including
36 of the 49 type constructions. Cover receivers/PHOTON, WHITE/SPHERE,
WARP/LOGISTICS, energy references, statistics and the final checklist. Use
LC-05's conventions; reconcile repeated meaning without forcing identical
sentence forms.

**Out of scope:** Broad late-game rewriting, changed energy/expedition advice,
edited native labels, new mechanics, optional style substitutions or tooling
beyond a directly necessary existing validation repair.

**Done when:** Remaining candidates have corrected/retained dispositions;
source comparisons preserve inventories, timing, optional routes and soft
targets. German-only/rendered review finds no confirmed pattern defect. Read
complete affected sections/checklists in order, then recheck consistency across
A–F. Inspect changes on desktop/primary phones and at 200% text; pass
localization and affected content/checklist contracts. LC-G2 records reviewed
coverage and actual corrections, not keyword-zero claims.

### LC-07 — Validate and hand off the corrected candidate (L, 5)

**Value:** Deliver one reproducible corrected package with evidence that
editorial repairs preserve all four editions and phone behavior.

**Scope:** Freeze the result and perform Tier 3 validation under the
[phone and language contract](management/validation-and-tooling.md#phone-and-language-acceptance-contract).
Reconcile required findings, full-edition pattern pools, changed copy, native
terms, metadata and repeated references. Run source validators, deterministic
generation, staged/extracted-ZIP validation, the full four-edition phone/desktop
matrix and real-catalog switching at root/prefix URLs. After an authorized
product push, inspect its CI result, download that exact ZIP, verify its
contents/checksum and compare development deployment bytes and representative
browser behavior. Do not substitute a later docs-only build.

**Out of scope:** Production publication, tags/releases, new device support,
physical-device/native-speaker certification, optional polish, unrelated
improvements and rewriting historical ML evidence.

**Done when:** Required checks have zero errors, screenshots are reviewed,
language/identity/value checks pass and no confirmed correction remains open.
Record product commit, CI run, ZIP/build identity, checksum, coverage and
limitations in the handoff. An authorized management-only follow-up commit may
record post-push evidence; retain the tested product identity. Update current
status and archive only after authorized closure. Stop at the candidate handoff;
publication remains the owner's action.

## Shared definition of done and validation

- Compare meaning, facts, negation, advice strength and optional/default
  distinctions; then read changed target text without English; finally inspect
  rendered output and correct/recheck it. Review full affected sections and
  duplicates, not isolated substitutions. Retaining acceptable wording is valid.
  Self-review is not independent native-speaker evidence.
- Preserve 19 cards, 66 checklist identities/storage behavior, public anchors,
  native IDs/ranks, recipes, progression and language paths. English owns
  factual values. Do not weaken placeholder, stale-source/term, escaping or
  deployment checks to make copy pass.
- Start with directly affected tests. Catalog/renderer changes require
  `node scripts/validate-localization.mjs`; renderer/contract changes also need
  `node scripts/test-localization.mjs` and
  `node scripts/validate-terminology.mjs`. Check source inventory if its model
  changes. Stage with `node scripts/build-site.mjs <fresh-ignored-directory>`
  and run localization/deployment validators on that output. Check affected
  card/checklist contracts. Repeat successful checks only when subsequent
  changes or new concerns justify it.
- Review changed presentation in desktop Chromium and Android Chromium /
  iPhone WebKit emulation at primary widths and high-risk 200% text states,
  using existing layout/navigation tools where applicable. Inspect every
  changed message. LC-07 runs the full contracted matrix. Record actual
  engines; do not claim physical S23/iOS, OS-font or assistive-technology
  validation. No game launch/write is required.
- Keep evidence in ignored artifacts and concise findings in this ledger.
  Update affected docs, check links, review the final diff and record actual
  commands/results, limits and the next boundary. No permanent exact-wording
  linter or dependency is planned. Extend only the existing generator's
  value/designation presentation contract and focused regression tests.
- Outside-pattern findings are not automatic intake. Report them; stop for a
  scope decision if they block a truthful handoff. Never defer a failed required
  check to eventual readers or infer language quality from structural checks.

## Execution ledger

| Story | State | Validation / disposition | Next boundary |
| --- | --- | --- | --- |
| LC-01 | Agent-validated | Localization tests/terminology passed; staged 551-file localization/deployment checks passed. Only German HTML differs from the previous package. All 28 affected messages reviewed in Chromium desktop/Android and WebKit iPhone, including enlarged text; numeric/card/power/table screenshots reviewed. Evidence: `artifacts/lc/LC01-*`. | LC-02 |
| LC-02 | Agent-validated; LC-G1 / LC-M1 reached | Native terminology and localization tests passed; 551-file staged deployment passed. Reviewed 76 German messages and all three Chinese Replicator references in desktop/Android Chromium and iPhone WebKit with 200% text. English/Japanese HTML byte-identical to LC-01. Evidence: `artifacts/lc/LC02-*`. | LC-E1 handoff recorded; continue LC-03 |
| LC-03 | Agent-validated | Corrected 15 messages (de 5, ja 9, zh-CN 1); checked all 12 Japanese stage title/aria entries. Localization, staged deployment and checklist validators passed; nine desktop/Android/iPhone review cases passed with enlarged text and screenshots. All six metadata copies retain “lost”. Evidence: `artifacts/lc/LC03-*`. | LC-04 |
| LC-04 | Agent-validated | Reviewed all 123 convergence occurrences: zh-CN 35 corrected / 6 retained, ja 34 / 7, de 36 / 5. Glossary connections restored without changing recipes or specific smelting processes. Catalog, staged 551-file localization/deployment and card checks passed; all nine desktop/Android/iPhone cases passed, including enlarged text and reviewed screenshots. Evidence: `artifacts/lc/LC04-*`. | LC-05 |
| LC-05 | Authorized — not started | Pending implementation | LC-06 |
| LC-06 | Authorized — not started | Pending implementation | LC-M2 / LC-E2 handoff |
| LC-07 | Authorized — not started | Pending implementation | LC-M3 / final handoff |

Draft preparation checked complete-edition pattern inventories, native
exceptions, source/renderer constraints, weights, sequence, exclusions and exit
evidence. No product change or implementation validation is claimed here.

The Dark Fog control and YELLOW/PURPLE resolvers remain
[deferred indefinitely](archive/deferred-indefinitely/). Current governance is
in [PROJECT.md](PROJECT.md), [work management](management/work-management.md)
and [validation and tooling](management/validation-and-tooling.md).

## LC-M1 handoff — 2026-10-11

LC-01–02 passed their numerical, terminology, generated-package and rendered
review gates. Native snapshots, source inventory, English/Japanese output and
all identities remain unchanged. LC-03 receives the verified display rules;
remaining convention and prose findings retain their approved scope. Continue
within the full-sequence authorization; no production publication occurred.
