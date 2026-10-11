# Localization Corrections — Final Handoff

LC-01–07 and LC-E1–E3 are complete and agent-validated on 2026-10-11 under
the owner's through-completion delegation. Confirmed in-scope findings are
resolved. Optional polish and native-term substitutions remain excluded; both
deferred concepts remain deferred. Production publication was not performed.

## Result and delivery correction

Corrections cover 161 distinct German, 43 Japanese and 37 Chinese messages.
German numerical display reverses to exact source facts; producer/designation/UI
labels match retained native records; matrix, stage, metadata and convergence
explanations are consistent. All 123 convergence occurrences and 335 distinct
German grammar/colon candidates have dispositions; 72 German prose entries were
corrected and 263 retained. Native spellings, recipes, checklist keys, optional
routes and advice strength remain protected. The [roadmap](ROADMAP.md) records
each story's scope, checks and handoff.

Candidate checks exposed an ML-09 delivery error: the artifact workflow and the
existing branch/Jekyll publisher could overwrite each other. The first LC-07
development comparison failed although its ZIP was correct. The owner directed
preserving branch publication and committing static translations. No Pages
setting or credential changed. Commit `04c6e4c` removes the competing deploy job,
commits three editions and nine data files, makes English's language links
static, and adds source freshness/staging checks. Commit `a73a6a5` narrows Jekyll
exclusions to retain the asset-permission document. The `22fea9b` package is
superseded by the candidate below.

The full 152-case matrix ran before materialization. All four final documents
have the same semantic DOM (elements, attributes and text) as that tested
candidate. Fresh local switching and live checks validate the resulting delivery.
Earlier ML evidence remains historical; it did not establish protection against
competing publishers. Future source/catalog edits must refresh and commit the
generated editions/data together, as required by the current authoring contract.

## Exact publication candidate

- Product/delivery commit: `a73a6a546d75818915012514949f6ec31932ff2d`.
- [Package run 38165898040](https://github.com/shytamir/DSP_Guide/actions/runs/38165898040),
  run 201: authoring, freshness, staging, extraction and package steps passed.
- [Branch Pages run 38165897289](https://github.com/shytamir/DSP_Guide/actions/runs/38165897289):
  Jekyll build and deployment passed for the same commit.
- [Artifact 11711699616](https://github.com/shytamir/DSP_Guide/actions/runs/38165898040/artifacts/11711699616):
  `dsp-practical-progression-guide-3.2.200.a73a6a5.zip`, 21,209,190 bytes.
  Artifact retention expires 2026-11-10 18:56:54 UTC.
- ZIP SHA-256:
  `6755171642b5cf65a601e2dec7294cf503937ec718cf76c87ae40598704164aa`.
  Download wrapper SHA-256 matched GitHub's recorded digest
  `81c3e5d314a7658b2303db5f6e8e973057dfe4ff53b6574192ec9abd5c4bbb1b`.
- The extracted ZIP contains 551 files, byte-identical to committed publication
  files and fresh generation: four editions, shared assets, LICENSE and the
  sanitized permission. Authoring inputs and dependencies are excluded.
- [Development site](https://shytamir.github.io/DSP_Guide/): all 551 package files
  match over HTTP, all four routes return 200, and five representative authoring
  and management inputs return 404. Live switching/interaction checks passed.
- The branch hosting artifact contains 553 files: those 551 plus Jekyll's
  `assets/css/style.css` and an HTML rendering of the sanitized permission.
  No guide HTML/CSS/JS references either addition. The release validator correctly
  rejected that hosting archive as a release ZIP; the actual release ZIP passes.
  These host-generated additions do not change the guide bytes.

## Validation performed

All required candidate checks passed after the delivery repair. The existing
runtime was activated; no game launch/write or toolchain upgrade was needed.
Ignored reports, fixtures, packages and screenshots remain in `artifacts/lc/`.

| Command / check | Result |
| --- | --- |
| `node scripts/validate-source-readability.mjs` | Passed; 31 first-party files after adding source delivery. |
| `node scripts/validate-card-system.mjs` | Passed: 19 cards, two references, 120 transformations and 206 ranks. |
| `node scripts/validate-checklists.mjs` | Passed: 66 identities, persistence/reset/denied storage and route contracts. |
| `node scripts/validate-terminology.mjs` | Passed: 444 identities per language and 206 composed ranks; retained data only. |
| `node scripts/localization-source.mjs` | Passed: 1,537 current source messages. |
| `node scripts/test-localization.mjs` | Passed: catalogs, negative fixtures, reversible quantities/designations, deterministic generation, static English/selector and root/prefix contracts. |
| `node scripts/build-site.mjs artifacts/lc/LC07-site` | Initial candidate generation passed; full-matrix input. |
| `node scripts/sync-static-editions.mjs --write` and `--stage artifacts/lc/LC07-source-final` | Materialized/staged the verified committed 551-file publication set. |
| `node scripts/validate-localization.mjs <site>` and `node scripts/validate-deployment.mjs <site> .` | Passed on generated, staged, locally extracted and final CI ZIP output; final extraction: `artifacts/lc/ci-final-site`. The separate hosting archive has the two additions described above. |
| `node artifacts/lc/stale-edit.mjs` | A disposable English edit/inventory refresh rejected stale translations before output. |
| `node artifacts/lc/test-source-delivery.mjs` | Current source passed; stale HTML/data, missing edition and unexpected file rejected; restored fixture passed. |
| `node artifacts/lc/run-matrix.mjs <locale>` for en/zh-CN/de/ja | 152 passed: navigation, layout and interaction at 12 profiles each per locale, plus two navigation-edge cases. Wraps `validate-phone.mjs --site ... --locale ... --mode ... --full --output ...`. |
| `node scripts/validate-localization-browser.mjs artifacts/lc/LC07-source-switching --candidate` | 96 real-catalog root/prefix paths passed after materialization. |
| `node artifacts/lc/remote-final-bytes.mjs a73a6a546d75818915012514949f6ec31932ff2d` | 551/551 exact final ZIP files matched the live site; four enabled routes returned 200. |
| `node artifacts/lc/remote-browser.mjs artifacts/lc/LC07-remote-final-switching --candidate` | 48 live paths passed across desktop/Android/iPhone: hashes, progress/reset, localized UI, route/card/table/details, no-JS, denied storage and fail-closed data. |
| Screenshots and reconciliation | Reviewed desktop/phone dashboards, production maps, enlarged layouts and live selectors/details. Final semantic DOM matches the full-matrix candidate in every edition. |
| `node artifacts/lc/check-docs.mjs` and `git diff --check` | Passed before the evidence closure commit. |

Actual engines: Playwright 1.64.0, managed Chromium 156.0.8078.4, WebKit 27.2,
and installed stable Chrome 155.0.8059.39. The refreshed target was Safari 27.0 /
iOS 27.0.1, checked against [Apple's release list](https://support.apple.com/en-us/100100)
and [WebKit's Safari 27 notes](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/).
The matrix includes primary widths, 360–480 px, landscape, 200% text, 320 px
stress, tablet smoke and desktop/wide desktop. Emulation and agent linguistic
self-review do not certify physical S23/iOS devices, OS fonts, assistive
technologies or independent native-speaker endorsement.

## Handoff boundary

The tested package is ready for the owner's publication decision. A subsequent
management-only commit records this evidence without replacing its identity.
Version remains 3.2; the last recorded production publication is 3.0. No decision
remains pending within this scope; the completed roadmap authorizes no new work.
