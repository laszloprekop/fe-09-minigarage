import { describe, expect, it } from 'vitest';
import { PLAN_SMALL } from '../data/plans';
import { findBay, freeBays } from './parking';

const idsOfLength = (length: number) =>
  PLAN_SMALL.bays.filter((bay) => bay.length === length).map((bay) => bay.id);

const allCarBays = idsOfLength(6);

describe('findBay', () => {
  it('gives a car the smallest bay that fits', () => {
    expect(findBay(PLAN_SMALL, [], 6)?.length).toBe(6);
  });

  it('gives a bus the 9-bay rather than the larger 12-bay', () => {
    expect(findBay(PLAN_SMALL, [], 9)?.id).toBe('c1');
  });

  it('gives a coach the only bay long enough', () => {
    expect(findBay(PLAN_SMALL, [], 12)?.id).toBe('c2');
  });

  it('spills a car into a bus bay only when every car bay is taken', () => {
    expect(findBay(PLAN_SMALL, [], 6)?.id).toBe('a1');
    expect(findBay(PLAN_SMALL, allCarBays, 6)?.id).toBe('c1');
  });

  it('refuses a coach when the only 12-bay is taken', () => {
    expect(findBay(PLAN_SMALL, ['c2'], 12)).toBeNull();
  });

  it('refuses a bus while car bays are still free', () => {
    expect(findBay(PLAN_SMALL, ['c1', 'c2'], 9)).toBeNull();
    expect(findBay(PLAN_SMALL, ['c1', 'c2'], 6)).not.toBeNull();
  });

  it('refuses everything once the lot is full', () => {
    const everything = PLAN_SMALL.bays.map((bay) => bay.id);
    expect(findBay(PLAN_SMALL, everything, 6)).toBeNull();
  });

  it('does not reorder the plan it was given', () => {
    const before = PLAN_SMALL.bays.map((bay) => bay.id);
    findBay(PLAN_SMALL, [], 6);
    expect(PLAN_SMALL.bays.map((bay) => bay.id)).toEqual(before);
  });

  it('is stable — the same inputs give the same bay', () => {
    expect(findBay(PLAN_SMALL, ['a1'], 6)?.id).toBe(findBay(PLAN_SMALL, ['a1'], 6)?.id);
  });
});

describe('freeBays', () => {
  it('counts every bay when nothing is parked', () => {
    expect(freeBays(PLAN_SMALL, [])).toHaveLength(PLAN_SMALL.bays.length);
  });

  it('leaves out the occupied ones', () => {
    expect(freeBays(PLAN_SMALL, ['a1', 'c2']).map((bay) => bay.id)).not.toContain('a1');
    expect(freeBays(PLAN_SMALL, ['a1', 'c2'])).toHaveLength(PLAN_SMALL.bays.length - 2);
  });

  it('ignores ids that are not bays in this plan', () => {
    expect(freeBays(PLAN_SMALL, ['nope'])).toHaveLength(PLAN_SMALL.bays.length);
  });
});
