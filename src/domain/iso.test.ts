import { describe, expect, it } from 'vitest';
import { bayBox, bayCorners, depthOf, ISO_X, ISO_Y, parkingBox, toScreen } from './iso';
import type { Bay } from './types';

const bay = (over: Partial<Bay> = {}): Bay => ({
  id: 'x',
  along: 0,
  across: 0,
  length: 6,
  ...over,
});

describe('toScreen', () => {
  it('puts the grid origin at the screen origin', () => {
    expect(toScreen(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it('moves right and up along a bay', () => {
    const { x, y } = toScreen(1, 0);
    expect(x).toBeCloseTo(64.086, 3);
    expect(y).toBeCloseTo(-37, 10);
  });

  it('moves right and down across bays', () => {
    const { x, y } = toScreen(0, 1);
    expect(x).toBeCloseTo(64.086, 3);
    expect(y).toBeCloseTo(37, 10);
  });

  it('matches the artwork: one unit is 74 px on the ground', () => {
    expect(Math.hypot(ISO_X, ISO_Y)).toBeCloseTo(74, 10);
  });
});

describe('bayCorners', () => {
  it('returns four corners', () => {
    expect(bayCorners(bay())).toHaveLength(4);
  });

  it('spans the bay length along its long edge', () => {
    const [origin, end] = bayCorners(bay({ length: 6 }));
    expect(Math.hypot(end.x - origin.x, end.y - origin.y)).toBeCloseTo(6 * 74, 6);
  });

  it('spans three units across its short edge', () => {
    const [, endFar, endNear] = bayCorners(bay());
    expect(Math.hypot(endNear.x - endFar.x, endNear.y - endFar.y)).toBeCloseTo(3 * 74, 6);
  });

  it('makes a longer bay longer, not wider', () => {
    const short = bayBox(bay({ length: 6 }));
    const long = bayBox(bay({ length: 12 }));
    expect(long.width).toBeGreaterThan(short.width);
    expect(long.height).toBeGreaterThan(short.height);
  });
});

describe('depthOf', () => {
  it('counts a bay nearer as it moves across', () => {
    expect(depthOf(bay({ across: 3 }))).toBeGreaterThan(depthOf(bay({ across: 0 })));
  });

  it('counts a bay further as it moves along', () => {
    expect(depthOf(bay({ along: 8 }))).toBeLessThan(depthOf(bay({ along: 0 })));
  });
});

describe('parkingBox', () => {
  const at = (length: Bay['length']): Bay => ({
    id: 'x',
    along: 0,
    across: 15,
    length,
  });

  it('anchors a vehicle to a box its own size, not the bay it sits in', () => {
    const inOwnBay = bayBox(at(6));
    const spilledIntoBusBay = parkingBox(at(9), 6);
    const spilledIntoCoachBay = parkingBox(at(12), 6);

    expect(spilledIntoBusBay).toEqual(inOwnBay);
    expect(spilledIntoCoachBay).toEqual(inOwnBay);
  });

  it('leaves a vehicle that exactly fills its bay untouched', () => {
    expect(parkingBox(at(12), 12)).toEqual(bayBox(at(12)));
  });

  it('would otherwise drift upward by three units per extra three of bay', () => {
    // The bug this guards: a bay's box grows upward as it gets longer.
    expect(bayBox(at(6)).y - bayBox(at(12)).y).toBeCloseTo(222, 0);
  });
});
