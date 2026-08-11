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

const pointsOf = (bay: Bay) =>
  bayCorners(bay)
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

interface Props {
  plan: Plan;
  cars: ICar[];
  hoveredId: number | null;
  selectedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}

export function GarageView({
  plan,
  cars,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}: Props) {
  const placed = placeVehicles(plan, cars);
  const bayIdOf = (id: number | null) => cars.find((car) => car.id === id)?.bayId;
  const selectedBayId = bayIdOf(selectedId);
  const hoveredBayId = bayIdOf(hoveredId);

  const selectedBay = plan.bays.find((bay) => bay.id === selectedBayId);
  const hoveredBay = plan.bays.find(
    (bay) => bay.id === hoveredBayId && bay.id !== selectedBayId,
  );

  const toggle = (id: number) => onSelect(id === selectedId ? null : id);

  return (
    <svg
      viewBox={lotViewBox(plan)}
      className="w-full"
      role="img"
      aria-label="Garageplan"
      onClick={() => onSelect(null)}
    >
      <defs>
        {/* Two passes: a tight core and a wide halo. Literal colour rather than
            a custom property — flood-color does not reliably resolve var(). */}
        <filter id="bay-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="10"
            floodColor="#6f92da"
            floodOpacity="0.95"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="26"
            floodColor="#6f92da"
            floodOpacity="0.55"
          />
        </filter>
      </defs>

      {/* Bay markings are paint on the ground: one pass, before any vehicle. */}
      <g fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round">
        {plan.bays
          .filter((bay) => bay.id !== selectedBayId && bay.id !== hoveredBay?.id)
          .map((bay) => (
            <polygon key={bay.id} points={pointsOf(bay)} />
          ))}
      </g>

      {/* Hover is the lighter cue: the outline darkens, nothing more. */}
      {hoveredBay && (
        <polygon
          points={pointsOf(hoveredBay)}
          fill="none"
          stroke="var(--color-ink-900)"
          strokeWidth={7}
          strokeLinejoin="round"
        />
      )}

      {/* Selection gets the full treatment, and is drawn after the others so
          its outline covers the boundary it shares with the bay next door. */}
      {selectedBay && (
        <polygon
          points={pointsOf(selectedBay)}
          fill="var(--color-ink-900)"
          fillOpacity={0.14}
          stroke="var(--color-ink-900)"
          strokeWidth={9}
          strokeLinejoin="round"
          filter="url(#bay-glow)"
        />
      )}

      {/* Whole-bay hit areas, under the vehicles: the parts of an occupied bay
          the sprite does not cover stay clickable. */}
      <g fill="transparent" className="cursor-pointer">
        {placed.map(({ car, bay }) => (
          <polygon
            key={car.id}
            points={pointsOf(bay)}
            onMouseEnter={() => onHover(car.id)}
            onMouseLeave={() => onHover(null)}
            onClick={(event) => {
              event.stopPropagation();
              toggle(car.id);
            }}
          />
        ))}
      </g>

      <g>
        {placed.map(({ car, bay }) => {
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
              onClick={(event) => {
                event.stopPropagation();
                toggle(car.id);
              }}
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
