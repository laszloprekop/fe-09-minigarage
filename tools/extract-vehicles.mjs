/**
 * Cuts the 19 vehicle sprites out of the master artboard and writes down where
 * each one sits in its bay.
 *
 * Run by hand — `node tools/extract-vehicles.mjs` — and commit the output.
 * The artwork changes about twice a decade; there is no reason to pay for this
 * on every build.
 *
 * Verified properties of the source file that this script relies on:
 *   - only <path>, <g>, <rect> and <linearGradient> elements
 *   - every transform is a matrix(...)
 *   - path data uses only M, L, C and Z, so every number in a `d` attribute is
 *     one half of an x,y pair
 *   - no embedded bitmaps, clip paths, masks or filters
 */

const SRC = 'materials/isometric_vehicles/isometric-vehicles_165_.svg';
const OUT_DIR = 'public/vehicles';
const OUT_META = 'src/data/sprites.generated.ts';

/**
 * Source group id -> [canonical sprite key, index of the bay it is parked in].
 *
 * '@0' is the one group Affinity exported without an id — the kombi.
 *
 * The two `minivan-f` groups are a naming collision in the design file: one is
 * the compact, the other is the small van, and Affinity broke the tie by
 * appending a 1. `minivan-b` belongs to the small van, not the compact. This
 * table is the only place in the project that knows any of that; everything
 * downstream sees canonical ids only.
 *
 * Bay indices were derived by rendering every group and every bay separately
 * and matching them by position — each sprite matched exactly one bay, nearest
 * at 27-126 px with the runner-up 177-959 px away. Re-derive them if the
 * artwork is ever re-exported.
 */
const MAPPING = [
  ['minivan-f-03-06', 'compact-f', 0],
  ['sedan5-f-03-06', 'hatchback-f', 2],
  ['van-f-03-06', 'passenger-van-f', 4],
  ['van-b-03-06', 'passenger-van-b', 5],
  ['minivan-f-03-061', 'small-van-f', 6],
  ['minivan-b-03-06', 'small-van-b', 7],
  ['multivan-f-03-06', 'panel-van-f', 10],
  ['multivan-b-03-06', 'panel-van-b', 11],
  ['truck-f-03-06', 'truck-f', 13],
  ['truck-b-03-06', 'truck-b', 14],
  ['semi-f-03-06', 'semi-tractor-f', 15],
  ['semi-b-03-06', 'semi-tractor-b', 16],
  ['sedan-f-03-06', 'sedan-f', 18],
  ['@0', 'wagon-f', 19],
  ['suv-f-03-06', 'suv-f', 20],
  ['bus2-f-03-12', 'coach-f', 21],
  ['bus2-b-03-12', 'coach-b', 22],
  ['bus-f-03-09', 'bus-f', 23],
  ['bus-b-03-09', 'bus-b', 24],
];

export { MAPPING, OUT_DIR, OUT_META, SRC };
