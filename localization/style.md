# Native terminology and editorial rules

The retained terminology snapshots cover all 314 technology records and 130
distinct item IDs consumed by HTML, tooltip prerequisites, cube labels and
unlocks. This extends the planning probe's 427 records to 444 per language.
Full official item names replace English compact unlock abbreviations such as
`HFuelRod`, `Assembler1`, `PLS` and `Warper`; do not translate those abbreviations
as though they were native names. Cube labels use their native matrix item name.
Producer explanations and UI words are guide prose, not new game facts.

Snapshots retain only requested names, numeric IDs, native keys, technology rank,
English technology aliases and source hashes. The native source is Steam build
25599610; `base.txt` and `prototype.txt` supply the requested keys. The retained
DAG supplies ID/key relationships; the website supplies current technology
names/ranks. Empty DAG English names are not errors or invented aliases.
This is terminology provenance, not a game-compatibility update.

Validate offline: `node scripts/validate-terminology.mjs`.
For an explicitly requested refresh only:
`node scripts/extract-terminology.mjs <game-Locale-directory> <Steam-build-id>`.
Extraction reads the supplied directory and writes only the repository's three
snapshots. It validates all locales before writing any snapshot. It never
launches the game, writes to its directory, or refreshes gameplay relationships.
Ordinary generation and validation need no installed game or locale files.

## Language rules

- **简体中文:** use Simplified characters and direct instructions. Prefer natural
  Chinese word order; avoid mechanical pronouns and unnecessary transliteration.
  Keep official terms unchanged. Separate a reference production pace from an
  actual prerequisite; do not turn 建议 into 必须.
- **Deutsch:** use `du` consistently in explanatory prose, neutral concise UI,
  and idiomatic compounds. Preserve native labels even where their terminology
  differs from a literal English translation. Decline surrounding words without
  modifying protected names. Use `optional`/`kannst` for choices, not commands.
- **日本語:** use natural `です・ます` explanations and concise neutral UI. Avoid
  translating English sentence structure word by word or inventing katakana
  when an official term exists. Keep recommendations distinct from prerequisites
  (`目安`, `おすすめ`, `必要`) and optional paths explicitly optional.

Ranks are separate from the base name: `等级 {n}`, `Stufe {n}`, `レベル {n}`.
All current native technology names are base names. The shared formatter removes
only a recognized suffix matching the retained integer before appending rank;
it never guesses a level from prose. Mk.I/II/III remain part of official item
names. Quantities, precision, ranges, rates, technical symbols and units stay
source-owned; surrounding language may move their named placeholders.

Expand ILS/PLS and other useful acronyms in the localized glossary using the
official native station name, then use a consistent abbreviation where useful.
Do not scatter English aliases throughout prose. A deliberately labelled English
technology alias is allowed for cross-reference; it is not a fallback for missing
native terminology. Proper names (DSP, Icarus where native, tool/project names),
game-native Latin strings, external destination titles, and legal originals are
the only general English exceptions. Any further exception needs an explicit
catalog justification and target-language review.

## Reviewed small prose samples

### Chinese edition conventions

Use 建筑超市 for mall, 缓冲库存 for buffer, 支线 for branch, 汇合点 for
convergence, and 兜底供应 for backstop. Route/color labels are 蓝糖、红糖、
黄糖、紫糖、绿糖、戴森云、光子、白糖、戴森球、曲速 and 物流.
Native item links retain official matrix names; prose may use color nicknames.
The introduction explains this display distinction instead of implying that
the generated native item labels are color aliases. Expand ILS/PLS as 星际物流运输站 /
行星内物流运输站 on first relevant use; keep the abbreviations only where useful.
Transport names remain distinct: 配送运输机、物流运输机、星际物流运输船.

Use Chinese punctuation around protected tokens. Keep source-owned units,
Mk.I/II/III and expedition I/II/III labels. Preserve the exact English
`Install with Mod Manager` action beside a Chinese explanation so readers can
find it on Thunderstore. Product/tool names, the image's quoted English title,
keyboard keys and the legal credit remain deliberate exceptions. Put the native
completion technology name in quotation marks when needed to avoid a repeated
“完成任务完成” phrase. These choices introduce no new gameplay conditions.

Source meaning: Keep the guide open while playing; there is no need to memorize
it. Production targets are reference points, not permission to ignore shortages.

- Chinese: 玩的时候可以把这份指南放在一旁，随时查阅，不必背下来。产量目标只是参考；如果已经出现缺料，仍然要及时处理。
- German: Lass den Leitfaden beim Spielen geöffnet und schlage bei Bedarf nach.
  Du musst ihn nicht auswendig lernen. Die Produktionsziele sind Richtwerte;
  erkennbare Engpässe solltest du trotzdem beheben.
- Japanese: プレイ中にこのガイドを開いておき、必要なときに参照してください。内容を覚える必要はありません。生産量の目標は目安です。すでに材料が不足しているなら、目標に達していても対処しましょう。

Self-review preserved optional reading, reference targets and the instruction
to address shortages; revised the German into two natural clauses and avoided
an English-shaped Japanese negative. These are editorial samples, not accepted
segment translations or independent native-speaker endorsement. Subsequent
stories still require proposition comparison, a separate target-language read,
and rendered review of every message.
