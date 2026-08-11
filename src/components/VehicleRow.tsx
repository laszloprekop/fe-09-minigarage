import { typeById } from '../data/vehicleTypes';
import type { ICar } from '../domain/types';

interface Props {
  car: ICar;
  hovered: boolean;
  onHover: (id: number | null) => void;
  onDelete: (id: number) => void;
}

/** A parked vehicle is drawn as a bay: white outline, no fill. */
export function VehicleRow({ car, hovered, onHover, onDelete }: Props) {
  return (
    <div
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center justify-between gap-4 border-2 px-4 py-3
                  transition-colors ${
                    hovered ? 'border-accent-strong' : 'border-white'
                  }`}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm font-semibold tracking-widest text-ink-950">
          {car.regNumber}
        </span>
        <span className="font-semibold text-ink-900">{car.brand}</span>
        <span className="text-xs tracking-wide text-ink-700">
          {typeById(car.type).label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDelete(car.id)}
        className="cursor-pointer border-2 border-white bg-surface-200 px-3 py-1.5
                   text-xs font-semibold tracking-wider text-ink-800 uppercase
                   transition-colors hover:border-alert hover:text-alert"
      >
        Ta bort
      </button>
    </div>
  );
}
