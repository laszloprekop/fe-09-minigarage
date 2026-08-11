import type { Bay } from './types';

/**
 * The lot is a flat grid drawn at an angle. One step *along* a bay moves right
 * and up on screen; one step *across* moves right and down. Both at 30°.
 *
 * Measured from the source artwork: the length axis sits at -30.045°, the width
 * axis at +29.955°, and one grid unit is 74 px. Deriving the constants from an
 * exact 30° differs from the artwork by under half a pixel across the whole lot,
 * so we use the exact figures rather than the measured ones.
 */
export const UNIT = 74;

/** Every bay is three grid units wide; only the length varies. */
export const BAY_WIDTH = 3;

export const ISO_X = UNIT * Math.cos(Math.PI / 6); // 64.0859…
export const ISO_Y = UNIT * Math.sin(Math.PI / 6); // 37

export interface Point {
  x: number;
  y: number;
}

export function toScreen(along: number, across: number): Point {
  return {
    x: (along + across) * ISO_X,
    y: (across - along) * ISO_Y,
  };
}

/** The bay's four corners, in order, ready to become an SVG polygon. */
export function bayCorners(bay: Bay): Point[] {
  return [
    toScreen(bay.along, bay.across),
    toScreen(bay.along + bay.length, bay.across),
    toScreen(bay.along + bay.length, bay.across + BAY_WIDTH),
    toScreen(bay.along, bay.across + BAY_WIDTH),
  ];
}

/** The axis-aligned box around a bay — what sprite offsets are measured from. */
export function bayBox(bay: Bay): { x: number; y: number; width: number; height: number } {
  const corners = bayCorners(bay);
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

/**
 * Larger means nearer the viewer. Paint vehicles in ascending order so distant
 * ones go down first and nearer ones cover them.
 */
export function depthOf(bay: Bay): number {
  return bay.across + BAY_WIDTH - bay.along;
}
