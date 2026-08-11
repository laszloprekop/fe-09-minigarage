import type { ICar } from '../domain/types';
import { VehicleRow } from './VehicleRow';

interface Props {
  cars: ICar[];
}

export function VehicleList({ cars }: Props) {
  return (
    <section className="space-y-3">
      {cars.map((car) => (
        <VehicleRow key={car.id} car={car} />
      ))}
    </section>
  );
}
