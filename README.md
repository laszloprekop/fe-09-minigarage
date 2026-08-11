# MiniGarage

**[Live demo →](https://laszloprekop.github.io/fe-09-minigarage/)**

[![](assets/hero.png)](https://laszloprekop.github.io/fe-09-minigarage/)

A digital vehicle catalogue: park vehicles into a garage and watch them appear both as a list
and as an isometric plan of the lot.

Built as **Övning 9 — Minigaraget med React**. The application calls itself *Minigaraget* on
screen and its interface is Swedish; the code and documentation are English.

## What it does

- **Park a vehicle** by registration number and make, choosing from twelve vehicle types
- **Swedish plate validation** — `ABC123` or `ABC12A`, with lowercase input coerced to uppercase
- **Real capacity.** Every garage plan has a fixed set of bays in three lengths. A vehicle takes
  the smallest free bay it fits in, so a bus can be turned away even while car bays sit empty
- **A garage per session.** One of five hand-authored plans is picked at random on load
- **Isometric view** of the lot, drawn from the same array that renders the list, with hover
  linking a row to its bay in both directions

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4, with a palette derived from the artwork in OKLCH |
| Tests | Vitest — 77 tests over the pure functions in `src/domain/` |

## Getting started

```bash
npm install
npm run dev      # development server
npm test         # unit tests
npm run build    # production build
npm run preview  # serve the production build under its deploy subpath
```

Every push to `main` builds, runs the tests, and deploys to GitHub Pages
([workflow](.github/workflows/deploy.yml)).

## How it is put together

- **`src/App.tsx`** owns all state. Adding, removing, counting and rendering the list all happen
  here, in one file.
- **`src/domain/`** is pure: plate validation, best-fit bay assignment, the isometric grid
  conversion, and the random vehicle generator. No React, no state, all tested.
- **`src/data/`** holds the vehicle catalogue, the brand table, the garage plans, and the
  generated sprite geometry.
- **`tools/extract-vehicles.mjs`** cuts the 19 vehicle sprites out of a single source artboard
  (`materials/isometric_vehicles/`) and records where each one sits in its bay. It is run by
  hand and its output is committed — the artwork changes about twice a decade.

Design decisions that would otherwise be puzzling are recorded in [`docs/adr/`](docs/adr), and
the domain vocabulary in [`CONTEXT.md`](CONTEXT.md).

## Language rule

English for everything a developer reads: identifiers, comments, commits, documentation.
Swedish only for strings the user sees on screen.
