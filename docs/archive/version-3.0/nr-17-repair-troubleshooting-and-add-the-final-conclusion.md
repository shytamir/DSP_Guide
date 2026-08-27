# NR-17 — Repair troubleshooting and add the final conclusion

**Status:** Owner-accepted and archived on 2026-08-27.

**Dependency group:** E — Final synchronization
**Assessed workload:** Medium
**Class:** Editorial refinement

## Reader need

As a reader finishing the guide, I want troubleshooting to end with a useful physical diagnostic rule and the guide itself to conclude by recognizing what I learned.

## Authoritative evidence

NR-15 supplies the canonical Statistics walkthrough. The existing final troubleshooting answer and rate-class statements refer to retired build-specification concepts, while the guide has no conclusion.

## Intended outcome

Replace the obsolete troubleshooting ending, hand off to the canonical walkthrough, and add the approved visible conclusion as the guide's actual end.

## In-scope surfaces

- Final troubleshooting question and following rate-class statements
- Link to the Production Statistics walkthrough
- Visible final conclusion after troubleshooting

## Approved specification

### Troubleshooting ending and Statistics Panel handoff

Preserve the troubleshooting section's ordered FAQ format and its first four
questions and answers. Replace only the final question and the three obsolete
rate-class statements that follow the list. Do not turn this repair into the
guide's conclusion; the conclusion remains a separate final topic.

Replace the final question with:

> **Can I find the first place the product stops moving?**
> Start with the item you need and follow its production backward. Look for
> the first machine with a missing input, a full output, no power, or a
> transport connection that is not delivering. Use the [Production Statistics
> walkthrough](#production-statistics-walkthrough) when the factory is too
> spread out to follow by eye. Fix that one problem, let the line run, then
> check again.

This completes the troubleshooting sequence as: missing technology; missing
recipe or machine; unreliable material supply; manual transport dependency;
then the first physical stop inside an otherwise valid chain.

Remove the three standalone statements that classify lines as below minimum,
between minimum and comfortable, or above comfortable. Replace them with this
single rule:

> Fix one visible stop at a time. A quiet machine whose output is already full
> is waiting, not failing, and does not need to be expanded.

Place the canonical collapsed **Quick process — Find a shortage with
Production Statistics** from NR-15 after the ordered questions, using the
stable `#production-statistics-walkthrough` anchor. The final question links to
that one source; do not repeat the walkthrough inside the FAQ answer.

### Reader conclusion

Add one visible final section after troubleshooting. Do not collapse it or add
another objective, checklist, reference, card, link collection, button, or
return-to-top prompt. Its purpose is to recognize the player's work and the
practical skills learned along the route, then let the guide end.

Use this final draft:

> # The road is yours
>
> Mission Completed does not mean the factory is finished. It means you know
> how to finish one.
>
> You began beneath an alien sun with Icarus, a Replicator, and more work than
> answers. You now have a factory that reaches across planets, five cube lines
> converging into white science, a working Dyson project, and Antimatter moving
> without you.
>
> More importantly, you learned how to turn shortages into production lines,
> keep paired outputs moving, carry industry beyond the homeworld, grow power
> beside demand, and trace a stalled product back to its cause. Those skills
> will outlast every figure and factory layout in this guide.
>
> Build a permanent Sphere, expand across the cluster, raise your own
> targets, or begin again with a better plan. Congratulations, engineer. Dyson
> left directions; you built the road.

The **working Dyson project** is satisfied by the prescribed swarm route. The
invitation to build a permanent Sphere remains optional and does not imply an
unfinished requirement. Preserve the final sentence as the guide's actual end.

## Non-goals and preserved contracts

- Do not rewrite the first four troubleshooting questions.
- Do not duplicate the Statistics walkthrough.
- Do not turn the conclusion into another objective, checklist, reference, card, link collection, button, or return-to-top prompt.
- Do not imply that permanent Sphere construction is unfinished required work.

## Owner gates

- The owner approves this bounded story draft before implementation begins.
- Technical validation establishes consistency, not reader acceptance.
- The owner separately accepts or requests refinement after reviewing the
  reader-facing result.

## Acceptance evidence

- The fifth troubleshooting question teaches the first physical stop and links to one walkthrough.
- The three obsolete rate-class statements are replaced by the approved visible-stop rule.
- The final section is visible, concise, and contains no new gate or control.
- The approved final sentence remains the actual end of the guide.

## Validation

**Tier:** 2 — Experience

Validate the walkthrough anchor and final document structure, then review the
complete troubleshooting-to-conclusion flow on the deployed development Pages
site in desktop Chromium.

## Release

Production release, version changes, and production publication are not
included. Development deployment for validation follows
[`docs/PROJECT.md`](../../PROJECT.md) and did not imply owner acceptance.
