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

export const PLANS: Plan[] = [PLAN_SMALL];
