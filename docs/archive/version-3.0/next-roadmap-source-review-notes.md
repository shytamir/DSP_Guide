# Roadmap Source Review Notes

**Archived:** Converted into the bounded NR story set on 2026-08-27. These
notes preserve the review findings and original WIP mapping that produced that
decomposition.

The WIP labels below identify the original planning headings as approved on
2026-08-27. The decomposition mapped them as follows:

| Original outcome | Resulting story |
| --- | --- |
| SPHERE prerequisite | NR-01 through NR-03 |
| WIP-1 through WIP-3 | NR-04 |
| WIP-4 and WIP-5 | NR-05 |
| WIP-6 | NR-06 |
| WIP-7 | NR-07 |
| WIP-8 | NR-08 |
| WIP-9 | NR-09 and NR-10 |
| WIP-10 | NR-11 |
| WIP-11 | NR-12 |
| WIP-12 | NR-13 |
| WIP-13 | NR-14 |
| WIP-14 | NR-15 |
| WIP-15 | NR-16 |
| WIP-16 | NR-18 |
| WIP-17 and WIP-18 | NR-17 |

The notes below preserve the playthrough findings that produced the roadmap.
Historical WIP references use the mapping above. The resulting NR drafts
replaced these notes as implementation specifications.

## 1. Introduction scope and closing line

- The final introductory paragraph does not mention Dark Fog. A blanket scope
  exclusion would also be inaccurate because the guide already contains
  bounded Dark Fog advice and may later enhance it.
- The prose does not clearly distinguish the prescribed Solar Sail swarm from
  optional permanent Sphere construction. The prerequisite story was assigned
  that distinction and removal of SPHERE from numbered progression.
- The closing line asks the reader to select optional paths according to
  problems they can name. At this point, a new reader does not yet know which
  problems will arise or why an optional path would solve them. The finish does
  not match the substance of the introduction.

### Planning resolution

- The scope distinction was accepted: the default route uses a Solar Sail
  swarm, permanent Sphere construction is a supported optional path, Dark Fog
  receives bounded practical coverage, and other capabilities are introduced
  only when relevant.
- The first proposed wording was rejected as too abstract and technical for the
  guide's new-player audience.
- The final player-facing candidate was preserved as WIP-1.

## 2. Introductory terminology and Glossary placement

- The introductory prose uses terms before the Glossary defines them.
- Moving the collapsed Glossary earlier would be tolerable, but the preferred
  direction is to make the introduction understandable to a completely new
  reader without relying on jargon.

## 3. BLUE Goal prose

- The first paragraph begins in useful player-facing language, but its second
  sentence is long, fragmented, and technical. Preserve the opening voice and
  replace that sentence with two simpler sentences.
- The entire second paragraph has the same problem: complex ideas are
  compressed into fragmented user-manual language. It faces the player but
  did not deliver useful guidance at review time.
- The desired style is concise, substantive, player-facing, and appropriate
  for a new or returning player.
- Owner-authored final draft preserved as WIP-3.

## 4. Small Tools table

- Rename **Latitude-aware building** to **East-West Construction**. Preserve
  its existing explanation.
- The blueprint entry recommends saving repeatable branches and stations but
  gives neither an example nor the minimum process needed to follow the advice.
- Add one simple reusable-branch example.
- Add a compact process: open the Blueprint interface, use `Ctrl+C` to enter
  capture mode, drag a box over the branch, then click elements to add or remove
  them until only the intended build remains.
- Do not turn this into a comprehensive Blueprint-interface guide.
- Final candidate and reusable collapsed-procedure convention preserved as
  WIP-4.

## 5. RED Goal and omitted sorter-filter process

- The Goal correctly identifies combined Refined Oil and Hydrogen management
  as the phase's major learning curve.
- “Give each product its own belt” implies selecting sorter filters, but the
  guide does not explain that the player can cycle through filters while
  previewing sorter placement.
- Consider a reusable mini-tutorial format for small procedures of this kind.
  It should remain collapsed by default and avoid interrupting prose flow.
- Preserve the accepted refinery-output procedure and broader RED-purpose
  interpretation as WIP-5.

## 6. ILS rush research order

- The first research discussion mentions five technologies, assumes completed
  dependencies, and then presents the minimum technologies needed to fly and
  smelt titanium. Steel Smelting is a valid implicit dependency because RED's
  required Oil Refineries consume Steel. Basic Chemical Engineering was not
  similarly proved and had to be explicit in ILS. Later NR-06 review found
  that RED's required Signal Towers also needed an omitted explicit Crystal
  Smelting instruction; the approved NR-06 draft placed that prerequisite in
  RED instead of ILS.
- The following section then acknowledges two prerequisite technologies,
  undermining the earlier presentation as the primary order.
- The detailed priority list reviewed at the time was valuable, but it was
  presented in full
  during pre-flight preparation even though different technologies gate
  different ILS stages.
- Later ILS stages do not revisit research, apart from the appropriately placed
  yellow-cube technologies at the rush's final bridge gate.

### Settled direction

- Use the proof-checked chronological priority recommendation in WIP-6.
- Keep three stages. Split Stage III internally into a transport-package
  checkpoint followed by route deployment and verification.
- Place each stage's recommendation consistently after that stage's Goal
  prose.
- Preserve the then-current compact, ordered branch-chain pattern and its meaningful
  branch choices, limited to the relevant stage.
- Do not add explanatory flavor text for why each technology is selected.
- Preserve technology hover-tooltip behavior.
- Remove ILS-rush technologies from YELLOW's **Research first** material.
- Remove the false pre-departure yellow-cube claim. Preserve the three existing
  intra-navigation anchors.

## 7. YELLOW Research first

- The reviewed prose named technologies already unlocked during the ILS rush
  and therefore does not serve its heading or purpose.
- Design a genuine YELLOW-phase research-priority recommendation to replace it.
- The remainder of YELLOW is considered straightforward, simple, and
  exemplary.
- Preserve the agreed dashboard, visible-prose, accumulator, stopping-rank,
  gate, and discard-rule decisions as WIP-7.
- Do not expose individual research costs. Preserve only WIP-7's short
  aggregate-cost explanation for rejecting the higher stopping point.

## 8. PURPLE Research first

- The Goal is good.
- The research recommendation is probably too short.
- Explain why High-Strength Material is prioritized: it supports Particle
  Collider construction.
- Deuterium becomes required soon, and fusion-power planning matters, but the
  actual production requirement belongs to the GREEN branch rather than
  PURPLE. The section needs a clearer reason for introducing this preparation
  here.
- The remainder of PURPLE is solid. The Processors card's presentation is
  especially effective and may be a reusable pattern for other key cards.
- Preserve the agreed phase-owned three-group dashboard, detailed prose,
  prose-only resource-horizon recommendation, stopping ranks, gate, and
  discard rule as WIP-8.
- Do not expose individual research costs. Preserve only WIP-8's short
  aggregate-cost explanations for rejected higher stopping points.

## 9. GREEN section

- The original no-change assessment was premature. Preserve GREEN's excellent
  dashboard, four-part research summary, cube-production descriptions, cards,
  and gate.
- Add only the agreed Collider-route rationale, simplified alternatives,
  supporting fusion research order, and player-facing Deuterium–fuel–power
  loop preserved as WIP-9.
- Treat the Collider's Frame Material and Super Magnetic Ring costs as material
  proof of the complete solar-orbit and frame branch. Do not repeat that branch
  later. GREEN owns the explicit Mini Fusion research and fuel instruction;
  optional SPHERE guidance may refer back to it without repeating it.

## 10. DYSON — How much is enough

- The second paragraph is long and dense.
- Replace its penultimate sentence with simpler, player-facing language that
  gives a short general accuracy disclaimer based on varying playthrough
  conditions without naming those conditions.
- Its final sentence is unrelated to the reference calculation and feels
  appended.
- Consider splitting the material into:
  1. the reference calculation;
  2. the baseline exception plus the short accuracy disclaimer;
  3. continuous antimatter banking by the eventual receiver array, including
     the 2,000-antimatter midway marker before the WHITE transition.
- Present the midway marker in context: it is not the DYSON phase gate and is
  not part of the preceding calculation.
- Preserve the agreed chosen-route explanation, upgraded-swarm reference,
  simplified disclaimer, Antimatter context, and future Receiver-baseline
  ownership as WIP-10.

## 11. DYSON–Receiver–PHOTON structure and optional SPHERE

- Graviton-lens receiver operation can begin during DYSON, before PHOTON, and
  can materially increase antimatter production while continuous reception is
  still being established.
- Optional SPHERE construction may contribute live Dyson generation, but it
  does not own a separate PHOTON transition or Receiver target.
- Preserve the agreed single-source Receiver bridge, prescribed DYSON
  transition, and research ownership as WIP-11.
- The bridge must own Ray Receiver before Planetary Ionosphere Utilization and
  Dirac Inversion Mechanism; GREEN does not prove Ray Receiver.

## 12. SPHERE optional-path boundary

- SPHERE must no longer establish, lens, or gate progression on a Receiver
  array. It provides sufficient permanent-construction guidance without a
  completion requirement.
- A reader using optional permanent generation returns to the same canonical
  Receiver and Antimatter bridge used by the prescribed DYSON route.
- The prerequisite story above controls SPHERE's navigation, content boundary,
  exact-figure retirement, and preserved `#sphere` anchor.

## 13. PHOTON purpose, research, and gate

- Review the PHOTON research recommendation. The canonical bridge owns Dirac
  Inversion Mechanism before PHOTON stabilization begins.
- The guide does not mention Ray Receiver Efficiency upgrades. These can reduce
  receiver-array power demand and help stabilize a 48/min antimatter rate
  sooner.
- Ray receiver placement, graviton-lens supply, photon-generation mode, and
  antimatter breakdown belong in the canonical bridge after DYSON.
- Do not duplicate that procedure inside DYSON, optional SPHERE, or PHOTON.
- Preserve the existing procedure's prose and presentation when relocating it
  into the canonical bridge after DYSON.
- Refocus PHOTON on stabilizing and strengthening the prescribed DYSON path:
  - expand and monitor earlier cube production so every cube sustains at least
    40/min;
  - establish reliable receiver-array antimatter output of 48/min;
  - prepare both conditions for WHITE's final push.
- Preserve the correct 2,000-antimatter midway storage marker.
- Move the split production-rate requirement into its own checklist item:
  verify at least 40/min across every cube and antimatter before entering WHITE
  comfortably.
- WIP-11 settles the canonical procedure ownership, exactly two Ray Transmission
  Efficiency ranks, 48/min as design headroom, and a sustained 40/min
  Antimatter gate paired with 2,000 stored Antimatter and 40/min from every
  colored cube. WIP-12 preserves the PHOTON stabilization prose and placement.
- WIP-12 must use catch-up language for Vein Utilization because earlier ranks
  are discardable. Carrier upgrades remain outside the PHOTON phase gate; no
  exact target rank is selected.

## 14. WHITE

- No changes requested.

## 15. WARP

- Rewrite the Mission Brief in closer, more player-facing language.
- Add **Cosmic Exploration Lv3** as the first row of the capability-explanation
  table, using the existing row format.
- Add one stack of 1,000 Foundation to the Pack list for optional terraforming
  around veins.
- Mention carrier-capacity technology upgrades as a powerful optional
  multiplier for longer routes.

## 16. LOGISTICS Goal

- The Goal opens with an unsupported claim, compresses a dense set of concerns
  into one fragmented sentence, and then blurs important distinctions to stay
  brief.
- Later material does not expand those omitted instructions; it provides only
  an effective troubleshooting guide.
- Rewrite the introduction so it properly prepares the reader for the
  capability in both style and substance while preserving the strong
  troubleshooting material.

## 17. One-Screen Default Checklist

- Update this last, after every other accepted guide change is decided and
  implemented, so it reflects the resulting guide accurately.

## 18. Troubleshooting ending

- The FAQ format and question selection are good except for the final question.
- The final answer and the three following standalone statements refer
  historically to full build-specification cards with precise rate classes.
  Remove those references.
- Discuss and provide an appropriate replacement rather than deleting the
  ending without substitution.

## 19. Missing conclusion

- The reviewed guide ended on troubleshooting, which was an unsatisfying final
  note.
- Add a conclusion that congratulates the reader on what they have learned and
  recognizes the effort required to complete the game with the guide.
