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
- `assets/data/tech-reference.json` contains runtime-derived technology names and prerequisites.
- `assets/data/tech-tooltip-details.json` maps concise cube and recipe-unlock labels to their authoritative runtime item IDs.
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

## Maintenance status

Version 2.1 is published and the project is in maintenance mode. Current
product boundaries, validation contracts, and deferred maintenance are tracked
in [`docs/PROJECT.md`](docs/PROJECT.md). Completed and superseded plans are
retained under `docs/archive/`; the runtime-derived DAG package is retained as
research provenance.

## Deployment

Pushes to `main` run the GitHub Pages workflow. It validates and deploys the
static site while also producing one downloadable ZIP containing only
`index.html` and `assets/`.

`VERSION` stores the manually managed major and minor values. Deployment
versions use `MAJOR.MINOR.RUN.SHA`, where `RUN` starts at zero and increases
with each workflow run, and `SHA` is the short triggering commit hash.

Please keep in mind that the game data and progression advice are only
guaranteed to match the live game version at the time the guide was published.
