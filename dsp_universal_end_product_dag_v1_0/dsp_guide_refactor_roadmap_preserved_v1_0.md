# Preserved Guide Refactor Roadmap

No guide edits were made during Phase 0.

## Phase 0 — Universal source-of-truth DAG

**Status: complete**

Build and twice validate a runtime-derived dependency model for every ItemProto target:

- lossless item/recipe hypergraph;
- raw-resource and acquisition sources;
- all alternative producer recipes;
- separate recipe-unlock and technology prerequisite closures;
- SCC condensation DAGs where feedback exists;
- searchable product index and machine-readable per-product closures.

This phase replaces already-edited guide copy as the factual dependency source for the work below.

## Phase 1 — Foundation and progression-boundary repair

**Status: complete**

Repair the early guide's sequencing and scope before performing the larger card rebuild:

- remove surviving debug artifacts;
- revise BOOTSTRAP research order so no-blue technologies and upgrades can be taken while the first mall develops;
- distinguish mall pieces that can be placed before their recipes are researched;
- keep RED focused on the technologies and infrastructure needed to establish sustainable red science;
- move flight research objectives into FLIGHT;
- remove duplicated shared-facility descriptions such as one refinery block being listed once per output;
- establish the final atomic-card/linking contract against the Phase 0 DAG.

Implemented in the published `index.html`: BOOTSTRAP now clears affordable
no-matrix groundwork while the mall develops; RED owns the blue-funded
production unlocks for sustainable red science; FLIGHT owns flight and
post-red preparation research; early shared refinery blocks are listed once;
and every build card has a stable anchor that opens when linked.

## Phase 1.5 — Static-site separation

**Status: complete**

The published guide remains `index.html`, but its presentation, behavior, and
technology reference data now live in auditable static assets under `assets/`.
The guide's reader-facing copy and presentation are unchanged. The repository
requires no framework, dependency installation, or build step.

## Phase 2 — Dependency-driven atomic card rebuild

**Status: complete**

Rebuild the affected card system from the universal DAG:

- give each reusable intermediate its own single-output card;
- replace repeated upstream production blocks with direct card references;
- make every reference a working anchor link;
- keep one source/extractor or intermediary product per bullet;
- retain exact production and draw totals in a consistent footer;
- eliminate duplicated refineries, smelters, chemical plants, and assemblers;
- rebuild PURPLE and GREEN as digestible linked dependency chains rather than monolithic cards;
- apply the same reference system from the first repeated product onward so later cards remain readable.

The guide's route choice, tone, phase structure, navigation, and numerical values remain editorial concerns for these later phases. Phase 0 supplies facts; it does not decide which valid route the guide should recommend.

Implemented in the published `index.html`: reusable intermediate outputs now
have stable linked cards; repeated production blocks are replaced by direct
references; PURPLE and GREEN are decomposed into readable dependency chains;
and rebuilt production cards end with a consistent exact draw/output summary.

## Next user stories

### 1. Bring WARP into the established guide contract

**Status: complete**

**User story:** As a curious new or returning player, I want WARP to explain
personal travel, vessel logistics, and rare-resource shortcuts without treating
the optional route as a progression gate, so I can choose how deeply to engage
with interstellar expansion.

**Acceptance focus:**

- distinguish mecha warp from vessel warp and show their research breakpoints;
- explain early manual scouting, pre-green vessel automation, and the cheaper
  post-green warper route;
- describe each rare resource's acquisition method and the standard production
  chain its alternate recipe replaces;
- use the same linked Input → Pipeline → Output card contract as the rest of the
  guide;
- keep one concise optional-route disclaimer and preserve player-owned phase
  navigation.

### 2. Validate the linked-card system during a complete playthrough

**Status: pending**

**User story:** As a player building directly from the cards, I want every
linked input, scaling instruction, shared-capacity warning, and output buffer to
remain understandable in play, so I can construct a line without reopening an
obsolete monolithic recipe.

**Acceptance focus:**

- test card-to-card navigation at each production tier;
- verify that reused surplus and newly dedicated capacity are distinguishable;
- check fractional scaling and simultaneous shared-input demand in the game;
- record any card whose construction still requires knowledge absent from its
  linked dependency chain;
- keep factual recipe corrections separate from later presentation polish.

### 3. Remember player-owned progress and explain guide vocabulary

**Status: complete**

**User story:** As a player who keeps the guide open across several sessions,
I want my deliberate checklist marks to remain on this device and unfamiliar
guide terms to have one compact explanation, so I can resume the run without an
account, repeated rereading, or the guide pretending to know what I completed.

**Hard scope limits:**

- checklist state is changed only by the reader; no phase detection,
  auto-completion, telemetry, alerts, or game-state integration;
- persistence uses one namespaced browser `localStorage` record only—no
  accounts, cookies, network requests, or external storage;
- reset removes only this guide's checklist record and never other site data;
- storage failure leaves checkboxes usable for the current page and fails
  without blocking the guide;
- the glossary is collapsed by default, contains at most ten guide-specific
  terms, and sits inside “How to use this guide” immediately before the Quick
  Progress Index;
- no progression advice, cards, rates, troubleshooting, seed analysis,
  navigation behavior, or accessibility redesign is included.

**Definition of Done:**

- every existing guide checklist becomes interactive after JavaScript loads;
- checking and unchecking an item survives reloads on the same browser origin;
- one visible reset control clears the saved guide state and unchecks every
  guide checklist item;
- local-storage denial does not throw, disable the guide, or imply that state
  was saved;
- each checklist item receives a deterministic phase-and-label key, with
  duplicate labels disambiguated locally;
- the glossary is semantic, keyboard-operable, concise, and collapsed on first
  load;
- the new static asset is documented, included in deployment, syntax-checked,
  and covered by a focused persistence/reset behavior test.
