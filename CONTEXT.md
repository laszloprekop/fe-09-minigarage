# MiniGarage

A digital garage: vehicles are parked into a fixed set of bays and shown both as a list and as
an isometric plan of the lot. Built for Övning 9, so the assignment's own wording is part of the
domain — but only on screen.

**Language rule.** English for everything a developer reads: identifiers, comments, commits,
documentation. Swedish only for strings the user sees. Each term below therefore has a canonical
English name and, where one exists, the Swedish word that appears in the interface.

**MiniGarage** is the project's name. **Minigaraget** is what the application calls itself on
screen — the assignment's own title, and Swedish like the rest of the UI copy.

## Language

### The vehicle

**Vehicle**:
Anything that can be parked — car, van, truck or bus. The general term for the things themselves.
_On screen_: *fordon*
_Avoid_: automobile, unit

**Car**:
Not a domain term. The assignment quotes the word *bil* in three places — the counter
(*"Antal bilar i garaget"*), the empty state (*"Garaget är helt tomt"*) and the submit button
(*"Parkera bil"*) — so those strings keep it. Everything else, in code and in copy, says
**vehicle**.

**Registration number**:
The plate. Identifies one physical vehicle, so it is unique within the garage.
_On screen_: *regnummer*
_Avoid_: licence number, plate, reg

**Make**:
The manufacturer, entered as free text. Carries no rules — it never determines anything at
runtime.
_On screen_: *märke*
_Avoid_: brand, model, manufacturer

**Vehicle type**:
Which of the twelve kinds a vehicle is. Chosen by the user, and the only thing that decides
which sprite is drawn.
_On screen_: *fordonstyp*
_Avoid_: model, variant, category

| Id | On screen | Footprint | Facings |
|---|---|---|---|
| `compact` | Småbil | 6 | front |
| `sedan` | Sedan | 6 | front |
| `hatchback` | Halvkombi | 6 | front |
| `wagon` | Kombi | 6 | front |
| `suv` | SUV | 6 | front |
| `passenger-van` | Transportbil | 6 | both |
| `small-van` | Liten skåpbil | 6 | both |
| `panel-van` | Skåpbil | 6 | both |
| `truck` | Lastbil | 6 | both |
| `semi-tractor` | Trailerdragare | 6 | both |
| `bus` | Buss | 9 | both |
| `coach` | Turistbuss | 12 | both |

**Facing**:
Which way a vehicle points — front (`f`) or back (`b`). Rolled once when the vehicle is created
and never editable. Only the seven commercial types have both; the five passenger cars are
front-only.
_Avoid_: direction, orientation, rotation

### The lot

**Bay**:
One drawn slot in the plan, three grid units wide and six, nine or twelve long. A vehicle
occupies exactly one bay; a bay holds at most one vehicle.
_On screen_: *plats*
_Avoid_: slot, space, spot, parking place

**Footprint**:
How many grid units long a vehicle needs — 6 for everything from a compact through a
semi-tractor, 9 for a bus, 12 for a coach. A property of the **vehicle type**, not of the
individual vehicle.
_Avoid_: size, length, dimensions

**Plan**:
One premade arrangement of bays: six to ten 6-bays and at most three bus bays, laid out in rows
with roads between them, bus bays at the west or east edge. One plan is picked at random when
the session starts and never changes.
_On screen_: *garageplan*
_Avoid_: layout, map, level, garage

**Grid unit**:
74 px in the source artwork. Every bay dimension and every position is a whole number of these.
_Avoid_: cell, tile, square

**Best fit**:
The rule for choosing a bay: the smallest free bay the vehicle's footprint fits in. A small
vehicle may take a large bay, but only once every smaller bay is taken.
_Avoid_: allocation, packing, first fit

**Full**:
The state where no free bay fits the vehicle being parked. Distinct from "no free bays at all" —
a lot with two free 6-bays is still full for a bus.
_On screen_: *"Garaget är fullt."*

### Artwork

**Sprite**:
One extracted vehicle image, identified by vehicle type plus facing (e.g. `bus-b`). Drawn white;
never recoloured.
_Avoid_: asset, icon, graphic, image

**Canonical id**:
The domain name of a sprite, assigned by the extraction step. Deliberately independent of the
group names in the source artwork, which are inconsistent.
