# MiniGarage

![](assets/hero.png)

A digital vehicle catalogue: park vehicles into a garage and watch them appear both as a list
and as an isometric plan of the lot.

Built as **Övning 9 — Minigaraget med React**. The application calls itself *Minigaraget* on
screen and its interface is Swedish; the code and documentation are English.

## What it does

- **Park a vehicle** by registration number and make, choosing from twelve vehicle types
- **Swedish plate validation** — `ABC123` or `ABC12A`, with lowercase input coerced to uppercase
- **Real capacity.** Every garage plan has a fixed set of bays in three lengths. A vehicle takes
  the smallest free bay it fits in, so a bus can be turned away even while car bays sit empty
- **Isometric view** of the lot, drawn from the same array that renders the list

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4, with a palette derived from the artwork in OKLCH |
| Tests | Vitest, over the pure functions in `src/domain/` |

## Status

Design is settled and written down. Implementation has not started — the repository currently
holds the artwork, the domain glossary and the planning material.

## Getting started

```bash
npm install
npm run dev      # development server
npm test         # unit tests
npm run build    # production build
```

## Artwork

The vehicles are isometric illustrations cut out of a shared source file
(`materials/isometric_vehicles/`) by a script in `tools/`, together with the geometry needed to
place each one correctly in its bay. The output is committed — the script is run by hand, not on
every build.

## Language rule

English for everything a developer reads: identifiers, comments, commits, documentation.
Swedish only for strings the user sees on screen.
