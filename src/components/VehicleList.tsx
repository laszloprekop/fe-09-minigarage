import type { ICar } from '../domain/types';
import { VehicleRow } from './VehicleRow';

interface Props {
  cars: ICar[];
  onDelete: (id: number) => void;
}

export function VehicleList({ cars, onDelete }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Parkerade fordon</h2>

      {cars.length === 0 ? (
        <p
          className="rounded-xl border border-surface-300 bg-surface-100 py-8 text-center
                     text-ink-700"
        >
          Garaget är helt tomt.
        </p>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <VehicleRow key={car.id} car={car} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
