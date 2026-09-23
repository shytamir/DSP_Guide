# DSP Practical Progression Guide

I originally made this guide for myself and thought it might help others. You
are welcome to use and share it.

The guide is a framework-free static website. It offers one practical route
from the first factory through Mission Completed, with optional paths,
production references, technology tooltips, and local checklists for readers
who want additional detail.

## Privacy and dependencies

The guide has no server-side code, accounts, cookies, or repository-supplied
analytics. Its scripts, data, styles, and images are stored locally in the
repository and can be reviewed before the guide is opened.

Checklist marks use one namespaced `localStorage` record in the reader's own
browser. They are never transmitted, and the reset control removes only that
record.

## Repository contents

```text
index.html                     Guide content
assets/css/                    Presentation
assets/js/                     Navigation, cards, tooltips, and checklists
assets/data/                   Runtime-derived technology data
assets/images/                 Guide-original artwork
assets/DSP_exported assets/    Authorized unmodified game images
docs/                          Project and management documentation
scripts/                       Static validation
dsp_universal_end_product_dag_v1_0/  Research provenance
```

Historical project records and the runtime-derived DAG research package remain
in the repository for provenance. Neither is loaded by `index.html`.

## Opening the guide locally

Serve the repository root with any ordinary static web server and open
`index.html`. A local web server is required for technology tooltips because
browsers do not allow a local `file://` page to fetch the separate JSON data.

The guide fully supports Dyson Sphere Program Early Access `0.10.35.29057`.
The project owner confirmed that all existing validations pass and the guide
works unchanged after the update. See the
[game compatibility record](docs/PROJECT.md#game-compatibility) for the build
and assembly hash.

## Project documentation

- [`docs/PROJECT.md`](docs/PROJECT.md) defines the product and governance
  boundaries.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) records the current planning state.
- [`docs/management/README.md`](docs/management/README.md) indexes durable
  management records.
- [`docs/archive/README.md`](docs/archive/README.md) indexes historical records.
