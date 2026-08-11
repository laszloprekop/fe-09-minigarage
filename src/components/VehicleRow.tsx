import { typeById } from '../data/vehicleTypes';
import type { ICar } from '../domain/types';

interface Props {
  car: ICar;
  hovered: boolean;
  selected: boolean;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
  onDelete: (id: number) => void;
}

/**
 * A parked vehicle is drawn as a bay: white outline, no fill. Stacked rather
 * than in one line, because this lives in a narrow sidebar.
 */
export function VehicleRow({
  car,
  hovered,
  selected,
  onHover,
  onSelect,
  onDelete,
}: Props) {
  const toggle = () => onSelect(selected ? null : car.id);

  const border = selected
    ? 'border-ink-900 bg-ink-900/6'
    : hovered
      ? 'border-ink-900'
      : 'border-white';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
      className={`cursor-pointer border-2 px-4 py-3 transition-colors
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-accent-strong ${border}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm font-semibold tracking-widest text-ink-950">
          {car.regNumber}
        </span>
        <button
          type="button"
          onClick={(event) => {
            // Removing must not also toggle the row's selection.
            event.stopPropagation();
            onDelete(car.id);
          }}
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
