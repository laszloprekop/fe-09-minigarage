import { GarageView } from './components/GarageView';
import { ParkingForm } from './components/ParkingForm';
import { VehicleList } from './components/VehicleList';
import type { ICar } from './domain/types';

const SEED: ICar[] = [
  { id: 1, regNumber: 'ABC123', brand: 'Volvo' },
  { id: 2, regNumber: 'XYZ789', brand: 'Saab' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-surface-200 p-8 text-ink-900">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">Minigaraget</h1>
          <p className="text-ink-700">Antal bilar i garaget: {SEED.length}</p>
        </header>
        <GarageView />
        <ParkingForm />
        <VehicleList cars={SEED} />
      </div>
    </div>
  );
}
