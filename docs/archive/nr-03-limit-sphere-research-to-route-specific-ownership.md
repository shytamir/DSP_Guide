# NR-03 — Limit SPHERE research to route-specific ownership

**Status:** Completed and owner-accepted on 2026-08-27. Archived historical
record; this file no longer defines active work.

**Dependency group:** A — Route foundation
**Assessed workload:** Medium
**Class:** Data or research change

## Reader need

As a reader entering optional SPHERE guidance after GREEN, I want only research that is still relevant to permanent construction so completed prerequisites are not presented as new work.

## Authoritative evidence

Use the retained runtime-derived technology and recipe data. NR-09 owns GREEN's
material proof for the solar-orbit and frame branches. Runtime data confirms
that Dyson Sphere Stress System Lv1 requires Vertical Launching Silo and
unlocks function 26 with value 15; the retained package does not assign human
semantics to that function. The owner identified Lv1 as the bounded rank needed
before the first shell.

## Intended outcome

NR-03 derived and presented only SPHERE-specific research after accounting for
technology and material proof established by GREEN.

## In-scope surfaces

- SPHERE research list and technology tooltips
- Runtime-derived prerequisite and material-proof checks
- Directly affected research relationship validators

## Approved specification

- Remove research already proved by GREEN from SPHERE's research list.
- Retain only route-specific research supported by retained technology and
  recipe data.
- Present **Vertical Launching Silo → Dyson Sphere Stress System Lv1** and stop
  after the first Stress System rank.
- Preserve technology hover behavior.
- Treat useful, optional, filler, and discardable recommendations as
  insufficient proof of completion.
- Check both technology prerequisites and material recipes before assigning
  research ownership.

## Non-goals and preserved contracts

- Do not change SPHERE's editorial structure or navigation; NR-01 and NR-02 own those layers.
- Do not infer research completion from practical memory or community shorthand.
- Do not add unrelated Sphere technologies or broaden the optional path.
- Do not prescribe a second or higher Dyson Sphere Stress System rank.

## Gates satisfied

- The owner approved the bounded story before implementation began.
- Technical validation established contract and presentation consistency.
- The owner accepted the deployed reader-facing result on 2026-08-27.

## Acceptance evidence

- Every retained SPHERE technology is route-specific and supported by authoritative data.
- The retained route ends at Dyson Sphere Stress System Lv1.
- No technology proved by GREEN is repeated as new SPHERE research.
- Technology hover behavior remains intact.
- The ownership decision is recorded separately from practical interpretation.

## Validation

**Tier:** 1 — Contract

Technical validation checked the affected technology relationships and tooltip
bindings against retained runtime-derived data.

## Release

Production release, version changes, and production publication were not
included. Development deployment for validation followed
[`docs/PROJECT.md`](../PROJECT.md) and did not imply owner acceptance.
