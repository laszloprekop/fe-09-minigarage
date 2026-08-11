import { describe, expect, it } from 'vitest';
import type { Bay } from '../domain/types';
import { LANE, PLANS } from './plans';

/** Two bays clash if they overlap on both axes. Bays are always 3 units wide. */
const clash = (a: Bay, b: Bay) =>
  a.along < b.along + b.length &&
  b.along < a.along + a.length &&
  a.across < b.across + 3 &&
  b.across < a.across + 3;

describe.each(PLANS.map((plan) => [plan.name, plan] as const))('%s', (_name, plan) => {
  it('gives every bay a unique id', () => {
    const ids = plan.bays.map((bay) => bay.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no overlapping bays', () => {
    const clashes = plan.bays.flatMap((a, i) =>
      plan.bays.slice(i + 1).filter((b) => clash(a, b)).map((b) => `${a.id}/${b.id}`),
    );
    expect(clashes).toEqual([]);
  });

  it('holds six to ten standard bays', () => {
    const standard = plan.bays.filter((bay) => bay.length === 6).length;
    expect(standard).toBeGreaterThanOrEqual(6);
    expect(standard).toBeLessThanOrEqual(10);
  });

  it('holds at most three bus bays, and at least one', () => {
    const bus = plan.bays.filter((bay) => bay.length > 6).length;
    expect(bus).toBeGreaterThanOrEqual(1);
    expect(bus).toBeLessThanOrEqual(3);
  });

  it('can take a coach — every plan needs one 12-bay', () => {
    expect(plan.bays.some((bay) => bay.length === 12)).toBe(true);
  });

  it('leaves a full lane between bays that face each other', () => {
    const tooClose = plan.bays.flatMap((a, i) =>
      plan.bays.slice(i + 1).flatMap((b) => {
        // Only bays sharing an across range face each other down a lane.
        const sharesAcross = a.across < b.across + 3 && b.across < a.across + 3;
        if (!sharesAcross) return [];
        const [front, back] = a.along <= b.along ? [a, b] : [b, a];
        const gap = back.along - (front.along + front.length);
        return gap > 0 && gap < LANE ? [`${a.id}/${b.id} gap ${gap}`] : [];
      }),
    );
    expect(tooClose).toEqual([]);
  });
});

describe('PLANS', () => {
  it('gives every plan a unique id', () => {
    const ids = PLANS.map((plan) => plan.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
