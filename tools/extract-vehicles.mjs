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

// ---------------------------------------------------------------- geometry --

const IDENTITY = [1, 0, 0, 1, 0, 0];

/** Compose two SVG matrices: apply `n` first, then `m`. */
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];

const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const parseMatrix = (value) => (value ? value.match(/-?[\d.]+/g).map(Number) : IDENTITY);

const emptyBox = () => ({
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
});

const grow = (box, x, y) => {
  box.minX = Math.min(box.minX, x);
  box.maxX = Math.max(box.maxX, x);
  box.minY = Math.min(box.minY, y);
  box.maxY = Math.max(box.maxY, y);
};

/**
 * Union of every transformed coordinate below `node`.
 *
 * Pairing the numbers in a `d` attribute works only because this artwork uses
 * no H, V or A commands — those take an odd number of arguments and would knock
 * the x/y alternation out of step for the rest of the path, giving a bounding
 * box that is wrong but still plausible. Re-check the command set before
 * trusting this against a differently exported file.
 *
 * Bezier control points can sit outside the curve they describe, so the box is
 * a slight over-estimate. That is harmless: the same box sets both the sprite's
 * viewBox and its width and height, so the extra margin is transparent padding.
 */
function boundsOf(node, parent = IDENTITY, box = emptyBox()) {
  const m = mul(parent, parseMatrix(node.getAttribute?.('transform')));

  if (node.nodeName === 'path') {
    const numbers = (node.getAttribute('d').match(/-?\d*\.?\d+/g) ?? []).map(Number);
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      const [x, y] = apply(m, numbers[i], numbers[i + 1]);
      grow(box, x, y);
    }
  }

  if (node.nodeName === 'rect') {
    const x = Number(node.getAttribute('x') ?? 0);
    const y = Number(node.getAttribute('y') ?? 0);
    const w = Number(node.getAttribute('width') ?? 0);
    const h = Number(node.getAttribute('height') ?? 0);
    for (const [cx, cy] of [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ]) {
      grow(box, ...apply(m, cx, cy));
    }
  }

  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) boundsOf(child, m, box);
  }

  return box;
}

/** Element children of a node, skipping whitespace text nodes. */
const elementsOf = (node) => {
  const out = [];
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) out.push(child);
  }
  return out;
};

const findById = (nodes, id) => nodes.find((node) => node.getAttribute('id') === id);

// -------------------------------------------------------------------- emit --

/** Gradient ids this subtree actually references, followed transitively. */
function referencedIds(node, found = new Set()) {
  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      const { name, value } = node.attributes[i];
      for (const match of value.matchAll(/url\(#([^)]+)\)/g)) found.add(match[1]);
      if (name.endsWith('href') && value.startsWith('#')) found.add(value.slice(1));
    }
  }
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === 1) referencedIds(child, found);
  }
  return found;
}

/** Two decimals is plenty at this scale and trims about 5% of the bytes. */
const round2 = (svg) =>
  svg.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 100) / 100));

async function main() {
  const { readFileSync, writeFileSync, mkdirSync } = await import('node:fs');
  const { DOMParser, XMLSerializer } = await import('@xmldom/xmldom');

  const doc = new DOMParser().parseFromString(readFileSync(SRC, 'utf8'), 'text/xml');
  const roots = elementsOf(doc.documentElement);
  const cars = findById(roots, 'cars');
  const spots = findById(roots, 'Parking-spots');
  const defs = roots.find((node) => node.nodeName === 'defs');
  if (!cars || !spots || !defs) throw new Error('artwork is missing cars, spots or defs');

  const carGroups = elementsOf(cars);
  const bayGroups = elementsOf(spots);
  const defsById = new Map(elementsOf(defs).map((d) => [d.getAttribute('id'), d]));
  const carsMatrix = parseMatrix(cars.getAttribute('transform'));
  const spotsMatrix = parseMatrix(spots.getAttribute('transform'));
  const serializer = new XMLSerializer();

  mkdirSync(OUT_DIR, { recursive: true });
  const meta = {};

  for (const [sourceId, key, bayIndex] of MAPPING) {
    const group = sourceId.startsWith('@')
      ? carGroups[Number(sourceId.slice(1))]
      : findById(carGroups, sourceId);
    if (!group) throw new Error(`no group "${sourceId}" in the artwork`);

    const sprite = boundsOf(group, carsMatrix);
    const bay = boundsOf(bayGroups[bayIndex], spotsMatrix);
    const width = sprite.maxX - sprite.minX;
    const height = sprite.maxY - sprite.minY;

    const gradients = [...referencedIds(group)]
      .map((id) => defsById.get(id))
      .filter(Boolean)
      .map((node) => serializer.serializeToString(node))
      .join('');

    const svg = round2(
      `<svg xmlns="http://www.w3.org/2000/svg" ` +
        `viewBox="${sprite.minX} ${sprite.minY} ${width} ${height}">` +
        `<g transform="matrix(${carsMatrix.join(',')})">` +
        serializer.serializeToString(group) +
        `</g><defs>${gradients}</defs></svg>`,
    );

    writeFileSync(`${OUT_DIR}/${key}.svg`, svg);
    meta[key] = {
      file: `/vehicles/${key}.svg`,
      dx: Math.round((sprite.minX - bay.minX) * 100) / 100,
      dy: Math.round((sprite.minY - bay.minY) * 100) / 100,
      w: Math.round(width * 100) / 100,
      h: Math.round(height * 100) / 100,
    };
    console.log(`${key.padEnd(18)} ${(svg.length / 1024).toFixed(1).padStart(6)} KB`);
  }

  const entries = Object.entries(meta)
    .map(([key, m]) => `  '${key}': ${JSON.stringify(m)},`)
    .join('\n');

  writeFileSync(
    OUT_META,
    `// Generated by tools/extract-vehicles.mjs — do not edit by hand.\n` +
      `// dx/dy are offsets from the bay's axis-aligned box, in the same px\n` +
      `// units the isometric grid uses (74 px = one grid unit).\n\n` +
      `export interface SpriteMeta {\n` +
      `  file: string;\n  dx: number;\n  dy: number;\n  w: number;\n  h: number;\n}\n\n` +
      `export const SPRITES: Record<string, SpriteMeta> = {\n${entries}\n};\n\n` +
      `/** How far the tallest sprite reaches above its bay. */\n` +
      `export const MAX_OVERHANG = ${Math.ceil(Math.max(...Object.values(meta).map((m) => -m.dy)))};\n`,
  );

  console.log(`\n${MAPPING.length} sprites -> ${OUT_DIR}\nmetadata   -> ${OUT_META}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

export {
  apply,
  boundsOf,
  elementsOf,
  findById,
  IDENTITY,
  MAPPING,
  mul,
  OUT_DIR,
  OUT_META,
  parseMatrix,
  SRC,
};
