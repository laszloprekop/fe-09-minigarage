import type { Plan } from '../domain/types';

/**
 * Two rows of standard bays with a road between them, and the bus bays along
 * the east edge. Positions are whole grid units; a bay is always 3 units wide
 * and `length` units long. Empty grid space is road — nothing draws it.
 *
 * Eight standard bays, one 9-bay and one 12-bay, so "full" is reachable in a
 * demo and a coach fits in exactly one place.
 */
export const PLAN_SMALL: Plan = {
  id: 'small',
  name: 'Lilla garaget',
  bays: [
    { id: 'a1', along: 0, across: 0, length: 6 },
    { id: 'a2', along: 0, across: 3, length: 6 },
    { id: 'a3', along: 0, across: 6, length: 6 },
    { id: 'a4', along: 0, across: 9, length: 6 },

    { id: 'b1', along: 8, across: 0, length: 6 },
    { id: 'b2', along: 8, across: 3, length: 6 },
    { id: 'b3', along: 8, across: 6, length: 6 },
    { id: 'b4', along: 8, across: 9, length: 6 },

    { id: 'c1', along: 0, across: 14, length: 9 },
    { id: 'c2', along: 0, across: 17, length: 12 },
  ],
};

/** One long row of commuter bays, with a single bus bay at the east end. */
export const PLAN_COMMUTER: Plan = {
  id: 'commuter',
  name: 'Pendlarparkeringen',
  bays: [
    { id: 'a1', along: 0, across: 0, length: 6 },
    { id: 'a2', along: 0, across: 3, length: 6 },
    { id: 'a3', along: 0, across: 6, length: 6 },
    { id: 'a4', along: 0, across: 9, length: 6 },
    { id: 'a5', along: 0, across: 12, length: 6 },
    { id: 'a6', along: 0, across: 15, length: 6 },
    { id: 'a7', along: 0, across: 18, length: 6 },
    { id: 'a8', along: 0, across: 21, length: 6 },

    // A 12-bay, not a 9: every plan must be able to take a coach, or the
    // generator can suggest a vehicle this session has nowhere to put.
    { id: 'c1', along: 0, across: 25, length: 12 },
  ],
};

/** Two short rows tucked east of a pair of long bays on the west edge. */
export const PLAN_COURTYARD: Plan = {
  id: 'courtyard',
  name: 'Innergården',
  bays: [
    { id: 'c1', along: 0, across: 0, length: 12 },
    { id: 'c2', along: 0, across: 3, length: 9 },

    { id: 'a1', along: 0, across: 7, length: 6 },
    { id: 'a2', along: 0, across: 10, length: 6 },
    { id: 'a3', along: 0, across: 13, length: 6 },
    { id: 'b1', along: 8, across: 7, length: 6 },
    { id: 'b2', along: 8, across: 10, length: 6 },
    { id: 'b3', along: 8, across: 13, length: 6 },
  ],
};

/** Six car bays and the full complement of three bus bays. */
export const PLAN_TERMINAL: Plan = {
  id: 'terminal',
  name: 'Terminalen',
  bays: [
    { id: 'a1', along: 0, across: 0, length: 6 },
    { id: 'a2', along: 0, across: 3, length: 6 },
    { id: 'a3', along: 0, across: 6, length: 6 },
    { id: 'b1', along: 8, across: 0, length: 6 },
    { id: 'b2', along: 8, across: 3, length: 6 },
    { id: 'b3', along: 8, across: 6, length: 6 },

    { id: 'c1', along: 0, across: 12, length: 9 },
    { id: 'c2', along: 0, across: 15, length: 12 },
    { id: 'c3', along: 0, across: 18, length: 9 },
  ],
};

/** The big one: two full rows of five, two bus bays on the east edge. */
export const PLAN_LARGE: Plan = {
  id: 'large',
  name: 'Stora garaget',
  bays: [
    { id: 'a1', along: 0, across: 0, length: 6 },
    { id: 'a2', along: 0, across: 3, length: 6 },
    { id: 'a3', along: 0, across: 6, length: 6 },
    { id: 'a4', along: 0, across: 9, length: 6 },
    { id: 'a5', along: 0, across: 12, length: 6 },
    { id: 'b1', along: 8, across: 0, length: 6 },
    { id: 'b2', along: 8, across: 3, length: 6 },
    { id: 'b3', along: 8, across: 6, length: 6 },
    { id: 'b4', along: 8, across: 9, length: 6 },
    { id: 'b5', along: 8, across: 12, length: 6 },

    { id: 'c1', along: 0, across: 16, length: 9 },
    { id: 'c2', along: 0, across: 19, length: 12 },
  ],
};

export const PLANS: Plan[] = [
  PLAN_SMALL,
  PLAN_COMMUTER,
  PLAN_COURTYARD,
  PLAN_TERMINAL,
  PLAN_LARGE,
];
