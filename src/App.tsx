import { useState } from 'react';
import { GarageView } from './components/GarageView';
import { ParkingForm } from './components/ParkingForm';
import { VehicleList } from './components/VehicleList';
import { PLAN_SMALL } from './data/plans';
import { typeById } from './data/vehicleTypes';
import { findBay, freeBays } from './domain/parking';
import type { Facing, ICar, Plan, VehicleTypeId } from './domain/types';
import { isValidRegNumber } from './domain/validation';

interface Seed {
  regNumber: string;
  brand: string;
  type: VehicleTypeId;
}

const SEEDS: Seed[] = [
  { regNumber: 'ABC123', brand: 'Volvo', type: 'wagon' },
  { regNumber: 'XYZ789', brand: 'Saab', type: 'sedan' },
];

/**
 * The seeds go through the same assignment the form uses, so a broken
 * `findBay` shows up on load rather than on the first click.
 */
function seedGarage(plan: Plan): ICar[] {
  return SEEDS.reduce<ICar[]>((parked, seed, index) => {
    const occupied = parked.map((car) => car.bayId);
    const bay = findBay(plan, occupied, typeById(seed.type).footprint);
    if (!bay) return parked;
    return [...parked, { ...seed, id: index + 1, facing: 'f', bayId: bay.id }];
  }, []);
}

const rollFacing = (facings: Facing[]): Facing =>
  facings[Math.floor(Math.random() * facings.length)];

export default function App() {
  const plan = PLAN_SMALL;

  const [cars, setCars] = useState<ICar[]>(() => seedGarage(plan));
  const [regNumber, setRegNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<VehicleTypeId>('sedan');
  const [error, setError] = useState('');

  const handleAddCar = () => {
    const trimmedReg = regNumber.trim();
    const trimmedBrand = brand.trim();

    if (!trimmedReg || !trimmedBrand) {
      setError('Fyll i både regnummer och märke.');
      return;
    }

    if (!isValidRegNumber(trimmedReg)) {
      setError(
        `"${trimmedReg}" är inte ett giltigt regnummer. Använd ABC123 eller ABC12A.`,
      );
      return;
    }

    if (cars.some((car) => car.regNumber === trimmedReg)) {
      setError(`${trimmedReg} står redan i garaget.`);
      return;
    }

    const vehicleType = typeById(type);
    const occupied = cars.map((car) => car.bayId);
    const bay = findBay(plan, occupied, vehicleType.footprint);

    if (!bay) {
      setError(
        freeBays(plan, occupied).length === 0
          ? 'Garaget är fullt.'
          : `Ingen ledig plats för ${vehicleType.label.toLowerCase()}.`,
      );
      return;
    }

    setError('');

    const newCar: ICar = {
      id: Date.now(),
      regNumber: trimmedReg,
      brand: trimmedBrand,
      type,
      facing: rollFacing(vehicleType.facings),
      bayId: bay.id,
    };

    setCars((prev) => [...prev, newCar]);
    setRegNumber('');
    setBrand('');
  };

  const handleDeleteCar = (id: number) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface-200 p-8 text-ink-900">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="mb-2 text-3xl font-semibold">Minigaraget</h1>
          <p className="text-ink-700">
            Antal bilar i garaget:{' '}
            <span className="font-semibold text-ink-950">{cars.length}</span>
          </p>
        </header>

        <GarageView plan={plan} />

        <ParkingForm
          regNumber={regNumber}
          brand={brand}
          type={type}
          error={error}
          onRegNumberChange={(value) => {
            setRegNumber(value);
            setError('');
          }}
          onBrandChange={(value) => {
            setBrand(value);
            setError('');
          }}
          onTypeChange={(value) => {
            setType(value);
            setError('');
          }}
          onSubmit={handleAddCar}
        />

        <VehicleList cars={cars} onDelete={handleDeleteCar} />
      </div>
    </div>
  );
}
