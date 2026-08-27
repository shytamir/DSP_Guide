# NR-03 — Limit SPHERE research to route-specific ownership

**Status:** Owner-approved on 2026-08-27. Inactive pending separate activation.

**Dependency group:** A — Route foundation
**Assessed workload:** Medium
**Class:** Data or research change

## Reader need

As a reader entering optional SPHERE guidance after GREEN, I want only research that is still relevant to permanent construction so completed prerequisites are not presented as new work.

## Authoritative evidence

Use the retained runtime-derived technology and recipe data. NR-09 owns GREEN's material proof for the solar-orbit and frame branches.

## Intended outcome

Derive and present only SPHERE-specific research after accounting for technology and material proof established by GREEN.

## In-scope surfaces

- SPHERE research list and technology tooltips
- Runtime-derived prerequisite and material-proof checks
- Directly affected research relationship validators

## Approved specification

- Remove research already proved by GREEN from SPHERE's research list.
- Retain only route-specific research supported by retained technology and
  recipe data.
- Preserve technology hover behavior.
- Treat useful, optional, filler, and discardable recommendations as
  insufficient proof of completion.
- Check both technology prerequisites and material recipes before assigning
  research ownership.

## Non-goals and preserved contracts

- Do not change SPHERE's editorial structure or navigation; NR-01 and NR-02 own those layers.
- Do not infer research completion from practical memory or community shorthand.
- Do not add unrelated Sphere technologies or broaden the optional path.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- Every retained SPHERE technology is route-specific and supported by authoritative data.
- No technology proved by GREEN is repeated as new SPHERE research.
- Technology hover behavior remains intact.
- The ownership decision is recorded separately from practical interpretation.

## Validation

**Tier:** 1 — Contract

Validate the affected technology relationships and tooltip bindings against retained runtime-derived data. Record any unresolved factual gap instead of guessing.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and does not imply owner acceptance.
