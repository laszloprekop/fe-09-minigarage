import type { Bay, Footprint, Plan } from './types';

/** Bays with nothing parked in them, in plan order. */
export function freeBays(plan: Plan, occupiedBayIds: string[]): Bay[] {
  const taken = new Set(occupiedBayIds);
  return plan.bays.filter((bay) => !taken.has(bay.id));
}

/**
 * Best fit: the smallest free bay the footprint fits in. A small vehicle may
 * take a large bay, but only once every smaller bay is gone — so "full" always
 * corresponds to something the user can see.
 *
 * Returns null when nothing fits, which is not the same as "no free bays": a
 * lot with two free 6-bays has nowhere to put a bus.
 */
export function findBay(
  plan: Plan,
  occupiedBayIds: string[],
  footprint: Footprint,
): Bay | null {
  const candidates = freeBays(plan, occupiedBayIds)
    .filter((bay) => bay.length >= footprint)
    // `.sort()` mutates — safe only because `filter` already gave us a new array.
    // The id tie-break keeps the choice stable between equal-length bays.
    .sort((a, b) => a.length - b.length || a.id.localeCompare(b.id));

  return candidates[0] ?? null;
}
