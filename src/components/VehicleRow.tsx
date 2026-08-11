import { typeById } from '../data/vehicleTypes';
import type { ICar } from '../domain/types';

interface Props {
  car: ICar;
  hovered: boolean;
  onHover: (id: number | null) => void;
  onDelete: (id: number) => void;
}

/**
 * A parked vehicle is drawn as a bay: white outline, no fill. Stacked rather
 * than in one line, because this lives in a narrow sidebar.
 */
export function VehicleRow({ car, hovered, onHover, onDelete }: Props) {
  return (
    <div
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
      className={`border-2 px-4 py-3 transition-colors ${
        hovered ? 'border-accent-strong' : 'border-white'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm font-semibold tracking-widest text-ink-950">
          {car.regNumber}
        </span>
        <button
          type="button"
          onClick={() => onDelete(car.id)}
          className="shrink-0 cursor-pointer bg-surface-200 px-2.5 py-1 text-[10px]
                     font-semibold tracking-[0.12em] text-ink-800 uppercase
                     transition-colors hover:bg-alert hover:text-white"
        >
          Ta bort
        </button>
      </div>
      <p className="mt-1 truncate text-sm text-ink-700">
        {car.brand} · {typeById(car.type).label}
      </p>
    </div>
  );
}
