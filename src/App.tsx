import { useState } from 'react';
import { GarageView } from './components/GarageView';
import { ParkingForm } from './components/ParkingForm';
import { VehicleList } from './components/VehicleList';
import type { ICar } from './domain/types';

const SEED: ICar[] = [
  { id: 1, regNumber: 'ABC123', brand: 'Volvo' },
  { id: 2, regNumber: 'XYZ789', brand: 'Saab' },
];

export default function App() {
  const [cars, setCars] = useState<ICar[]>(SEED);
  const [regNumber, setRegNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [error, setError] = useState('');

  const handleAddCar = () => {
    const trimmedReg = regNumber.trim();
    const trimmedBrand = brand.trim();

    if (!trimmedReg || !trimmedBrand) {
      setError('Fyll i både regnummer och märke.');
      return;
    }

    setError('');

    const newCar: ICar = {
      id: Date.now(),
      regNumber: trimmedReg,
      brand: trimmedBrand,
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

        <GarageView />

        <ParkingForm
          regNumber={regNumber}
          brand={brand}
          error={error}
          onRegNumberChange={(value) => {
            setRegNumber(value);
            setError('');
          }}
          onBrandChange={(value) => {
            setBrand(value);
            setError('');
          }}
          onSubmit={handleAddCar}
        />

        <VehicleList cars={cars} onDelete={handleDeleteCar} />
      </div>
    </div>
  );
}
