# DSP Practical Progression Guide

I originally made this guide for myself and thought it might help others. You
are welcome to use and share it.

The published guide is `index.html`. It is a framework-free static website
with no server-side scripts, external dependencies, cookies, or tracking.
Everything used by the page is stored in this repository and can be reviewed
before the guide is opened.

## Static files

```text
index.html
assets/
  css/guide.css
  data/tech-reference.json
  data/tech-tooltip-details.json
  images/
  js/checklists.js
  js/cards.js
  js/navigation.js
  js/producer-types.js
  js/tech-tooltips.js
  DSP_exported assets/
```

- `index.html` contains the guide's semantic content.
- `assets/css/guide.css` contains all presentation rules.
- `assets/js/` contains the small, independent interaction scripts.
- `assets/data/tech-reference.json` contains runtime-derived technology names,
  upgrade ranks, and prerequisites.
- `assets/data/tech-tooltip-details.json` maps concise cube and recipe-unlock labels to their authoritative runtime item IDs.
- `assets/images/` contains guide-original presentation art and locally hosted
  companion-mod media.
- `assets/DSP_exported assets/` contains authorized, unmodified game images used
  by the guide.

Checklist marks use one namespaced `localStorage` record in the reader's own
browser. They are never transmitted, and the guide's reset control removes
only that record.

There is no build step. Serve the repository root with any ordinary static
web server and open `index.html`. A local web server is required for technology
tooltips because browsers do not allow a local `file://` page to fetch the
separate JSON file.

Historical publication snapshots and the authoritative DAG research package
remain in the repository for provenance. They are not loaded by `index.html`.

## Agent environment bootstrap

From a PowerShell shell with the standard agent runtime available, run:

```powershell
.\scripts\Bootstrap-AgentEnvironment.ps1
. .\artifacts\.runtime-tools\Activate-DspGuideTools.ps1
```

The ordinary bootstrap must be launched with npm-registry and Playwright-download
access from the outset. Do not first run it under network restrictions and then
retry. It streams installation progress, installs exact Prettier and Playwright
versions plus managed Chromium only when missing, and reuses a matching existing
installation. Its generated manifest, lockfile, fingerprint, packages, browser,
and activation helper remain under the Git-ignored runtime-tools directory; none
are product files. Use `-ValidateOnly` for a network-free check that makes no
changes.

## Roadmap status

Version 3.0 is the release-ready repository state awaiting manual production
publication and final cold verification. Its 18 reader-facing stories and three
prerelease milestones were completed on 2026-08-27, and the concluded
[`release-candidate roadmap`](docs/archive/version-2.9-release-candidate-roadmap.md)
is archived. Version 2.3 remains the current published release until that
manual publication succeeds. The historical version 2.3 roadmap is preserved in
[`docs/archive/ROADMAP.md`](docs/archive/ROADMAP.md). See
[`CHANGELOG.md`](CHANGELOG.md) for release history and the 3.0 release notes,
and [`docs/PROJECT.md`](docs/PROJECT.md) for product boundaries and validation
contracts. Completed and superseded work remains under `docs/archive/`; the
runtime-derived DAG package remains research provenance.

## Deployment

Pushes to `main` run the GitHub Pages workflow. It validates and deploys the
static site to the development Pages environment for browser review; this is
not production publication. The workflow also produces one downloadable ZIP
containing `index.html`, `assets/`, `LICENSE`, and the sanitized game-asset
permission record at
`docs/management/game-asset-use-permission-sanitized.md`.

`VERSION` stores the manually managed major and minor values. Deployment
versions use `MAJOR.MINOR.RUN.SHA`, where `RUN` starts at zero and increases
with each workflow run, and `SHA` is the short triggering commit hash.

Please keep in mind that the game data and progression advice are only
guaranteed to match the live game version at the time the guide was published.
