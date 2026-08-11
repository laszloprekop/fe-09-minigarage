import type { ICar } from '../domain/types';

interface Props {
  car: ICar;
}

export function VehicleRow({ car }: Props) {
  return (
    <div className="rounded-xl bg-surface-50 p-4">
      {car.regNumber} {car.brand}
    </div>
  );
}
