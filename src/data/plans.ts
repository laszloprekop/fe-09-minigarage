import type { Bay, Footprint, Plan } from '../domain/types';

/** Depth of a standard bay, in grid units. Rows are this deep. */
const ROW_DEPTH = 6;

/**
 * The driving lane between two rows, in grid units — one bay-length, so there
 * is room to back out. Raise it to `ROW_DEPTH * 2` for a wider lane: every plan
 * below is expressed in terms of it, and the geometry test enforces that no two
 * rows facing each other sit closer than this.
 */
const LANE = ROW_DEPTH;

/** Where the second row starts, once the first row and its lane are behind it. */
const BACK_ROW = ROW_DEPTH + LANE;

/** Separation between a block of car bays and a block of bus bays. */
const BLOCK_GAP = 3;

/** A run of bays side by side, stepping three units across. */
const row = (
  prefix: string,
  along: number,
  count: number,
  firstAcross: number,
  length: Footprint = 6,
): Bay[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    along,
    across: firstAcross + index * 3,
    length,
  }));

/**
 * Two rows of four with a lane between them, and the bus bays along the east
 * edge. Positions are whole grid units; a bay is always 3 units wide and
 * `length` units long. Empty grid space is road — nothing draws it.
 *
 * Eight standard bays, one 9-bay and one 12-bay, so "full" is reachable in a
 * demo and a coach fits in exactly one place.
 */
export const PLAN_SMALL: Plan = {
  id: 'small',
  name: 'Lilla garaget',
  bays: [
    ...row('a', 0, 4, 0),
    ...row('b', BACK_ROW, 4, 0),
    { id: 'c1', along: 0, across: 12 + BLOCK_GAP, length: 9 },
    { id: 'c2', along: 0, across: 15 + BLOCK_GAP, length: 12 },
  ],
};

/** One long row of commuter bays, with a single long bay at the east end. */
export const PLAN_COMMUTER: Plan = {
  id: 'commuter',
  name: 'Pendlarparkeringen',
  bays: [
    ...row('a', 0, 8, 0),
    // A 12-bay, not a 9: every plan must be able to take a coach, or the
    // generator can suggest a vehicle this session has nowhere to put.
    { id: 'c1', along: 0, across: 24 + BLOCK_GAP, length: 12 },
  ],
};

/** Two short rows tucked east of a pair of long bays on the west edge. */
export const PLAN_COURTYARD: Plan = {
  id: 'courtyard',
  name: 'Innergården',
  bays: [
    { id: 'c1', along: 0, across: 0, length: 12 },
    { id: 'c2', along: 0, across: 3, length: 9 },
    ...row('a', 0, 3, 6 + BLOCK_GAP),
    ...row('b', BACK_ROW, 3, 6 + BLOCK_GAP),
  ],
};

/** Six car bays and the full complement of three bus bays. */
export const PLAN_TERMINAL: Plan = {
  id: 'terminal',
  name: 'Terminalen',
  bays: [
    ...row('a', 0, 3, 0),
    ...row('b', BACK_ROW, 3, 0),
    { id: 'c1', along: 0, across: 9 + BLOCK_GAP, length: 9 },
    { id: 'c2', along: 0, across: 12 + BLOCK_GAP, length: 12 },
    { id: 'c3', along: 0, across: 15 + BLOCK_GAP, length: 9 },
  ],
};

/** The big one: two full rows of five, two bus bays on the east edge. */
export const PLAN_LARGE: Plan = {
  id: 'large',
  name: 'Stora garaget',
  bays: [
    ...row('a', 0, 5, 0),
    ...row('b', BACK_ROW, 5, 0),
    { id: 'c1', along: 0, across: 15 + BLOCK_GAP, length: 9 },
    { id: 'c2', along: 0, across: 18 + BLOCK_GAP, length: 12 },
  ],
};

export const PLANS: Plan[] = [
  PLAN_SMALL,
  PLAN_COMMUTER,
  PLAN_COURTYARD,
  PLAN_TERMINAL,
  PLAN_LARGE,
];

export { LANE };
