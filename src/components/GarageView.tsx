import { MAX_OVERHANG, SPRITES } from '../data/sprites.generated';
import { bayBox, bayCorners, depthOf } from '../domain/iso';
import type { Bay, ICar, Plan } from '../domain/types';

/** Breathing room around the lot, in the same px units as the grid. */
const PAD = 40;

/**
 * The lot's extent, widened at the top by however far the tallest sprite
 * reaches above its bay. That figure is generated from the artwork, so adding
 * a taller vehicle later widens the frame on its own.
 */
function lotViewBox(plan: Plan): string {
  const points = plan.bays.flatMap(bayCorners);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  const minX = Math.min(...xs) - PAD;
  const maxX = Math.max(...xs) + PAD;
  const minY = Math.min(...ys) - MAX_OVERHANG;
  const maxY = Math.max(...ys) + PAD;

  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
}

interface Placed {
  car: ICar;
  bay: Bay;
}

/**
 * Vehicles paired with their bays, ordered back to front. Painting in this
 * order lets a nearer vehicle cover a more distant one — without it, a bus in
 * a far bay draws over the car in front of it, and only sometimes, depending
 * on the order things were parked.
 */
function placeVehicles(plan: Plan, cars: ICar[]): Placed[] {
  const byId = new Map(plan.bays.map((bay) => [bay.id, bay]));

  return cars
    .flatMap((car) => {
      const bay = byId.get(car.bayId);
      return bay ? [{ car, bay }] : [];
    })
    .sort((a, b) => depthOf(a.bay) - depthOf(b.bay));
}

interface Props {
  plan: Plan;
  cars: ICar[];
  hoveredId: number | null;
  onHover: (id: number | null) => void;
}

export function GarageView({ plan, cars, hoveredId, onHover }: Props) {
  const hoveredBayId = cars.find((car) => car.id === hoveredId)?.bayId;

  return (
    <svg
      viewBox={lotViewBox(plan)}
      className="w-full"
      role="img"
      aria-label="Garageplan"
    >
      {/* Bay markings are paint on the ground: one pass, before any vehicle. */}
      <g strokeLinejoin="round">
        {plan.bays.map((bay) => {
          const lit = bay.id === hoveredBayId;
          return (
            <polygon
              key={bay.id}
              points={bayCorners(bay)
                .map((point) => `${point.x},${point.y}`)
                .join(' ')}
              fill={lit ? 'var(--color-accent)' : 'none'}
              fillOpacity={lit ? 0.22 : 0}
              stroke={lit ? 'var(--color-accent-strong)' : 'white'}
              strokeWidth={lit ? 10 : 5}
            />
          );
        })}
      </g>

      <g>
        {placeVehicles(plan, cars).map(({ car, bay }) => {
          const sprite = SPRITES[`${car.type}-${car.facing}`];
          if (!sprite) return null;

          // Offsets are measured from the bay's axis-aligned box, not from a
          // corner of the parallelogram.
          const box = bayBox(bay);

          return (
            <image
              key={car.id}
              href={`${import.meta.env.BASE_URL}${sprite.file}`}
              x={box.x + sprite.dx}
              y={box.y + sprite.dy}
              width={sprite.w}
              height={sprite.h}
              className="cursor-pointer"
              onMouseEnter={() => onHover(car.id)}
              onMouseLeave={() => onHover(null)}
            >
              <title>
                {car.regNumber} {car.brand}
              </title>
            </image>
          );
        })}
      </g>
    </svg>
  );
}
