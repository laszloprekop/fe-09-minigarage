import { MAX_OVERHANG } from '../data/sprites.generated';
import { bayCorners } from '../domain/iso';
import type { Plan } from '../domain/types';

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

interface Props {
  plan: Plan;
}

export function GarageView({ plan }: Props) {
  return (
    <svg
      viewBox={lotViewBox(plan)}
      className="w-full rounded-xl bg-surface-300"
      role="img"
      aria-label="Garageplan"
    >
      {/* Bay markings are paint on the ground: one pass, before any vehicle. */}
      <g fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round">
        {plan.bays.map((bay) => (
          <polygon
            key={bay.id}
            points={bayCorners(bay)
              .map((point) => `${point.x},${point.y}`)
              .join(' ')}
          />
        ))}
      </g>
    </svg>
  );
}
