import type { ICar } from '../domain/types';

interface Props {
  car: ICar;
  onDelete: (id: number) => void;
}

export function VehicleRow({ car, onDelete }: Props) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border border-surface-300
                 bg-surface-50 p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span
          className="rounded border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono
                     text-xs font-semibold uppercase text-accent-strong"
        >
          {car.regNumber}
        </span>
        <h3 className="text-lg font-bold">{car.brand}</h3>
      </div>

      <button
        type="button"
        onClick={() => onDelete(car.id)}
        className="cursor-pointer rounded-lg border border-alert/30 bg-alert-soft px-4 py-2
                   text-sm font-medium text-alert transition-colors hover:bg-alert
                   hover:text-white"
      >
        Ta bort
      </button>
    </div>
  );
}
