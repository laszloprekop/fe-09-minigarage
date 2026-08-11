import type { ICar } from '../domain/types';
import { VehicleRow } from './VehicleRow';

interface Props {
  cars: ICar[];
  hoveredId: number | null;
  selectedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
  onDelete: (id: number) => void;
}

export function VehicleList({
  cars,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onDelete,
}: Props) {
  return (
    <section>
      <h2 className="mb-6 text-lg font-semibold tracking-tight">Parkerade fordon</h2>

      {cars.length === 0 ? (
        <p className="py-10 text-center text-ink-700">Garaget är helt tomt.</p>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <VehicleRow
              key={car.id}
              car={car}
              hovered={car.id === hoveredId}
              selected={car.id === selectedId}
              onHover={onHover}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
