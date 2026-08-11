import { ALL_BRANDS } from '../data/brands';
import { VEHICLE_TYPES } from '../data/vehicleTypes';
import type { VehicleTypeId } from '../domain/types';

interface Props {
  regNumber: string;
  brand: string;
  type: VehicleTypeId;
  error: string;
  onRegNumberChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onTypeChange: (value: VehicleTypeId) => void;
  onGenerate: () => void;
  onSubmit: () => void;
}

const inputClasses =
  'w-full rounded-lg border border-surface-400 bg-white px-4 py-2 ' +
  'text-ink-900 placeholder:text-surface-600 focus:border-accent focus:outline-none';

export function ParkingForm({
  regNumber,
  brand,
  type,
  error,
  onRegNumberChange,
  onBrandChange,
  onTypeChange,
  onGenerate,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-xl border border-surface-300 bg-surface-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Parkera nytt fordon</h2>
        <button
          type="button"
          onClick={onGenerate}
          title="Fyll i ett slumpat fordon"
          aria-label="Fyll i ett slumpat fordon"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border
                     border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium
                     text-accent-strong transition-colors hover:bg-accent hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h4.2a2 2 0 0 1 1.9 1.5L16 11h.5a1.5
                     1.5 0 0 1 1.5 1.5V17h-2v-1.5H5V17H3v-4.5A1.5 1.5 0 0 1 4.5 11H5Zm2.1
                     0h6.8l-1-3H8.1l-1 3ZM6 14.5h2V13H6v1.5Zm7 0h2V13h-2v1.5Z" />
            <path d="M19 5h1.5v2H22v1.5h-1.5V10H19V8.5h-1.5V7H19V5Z" />
          </svg>
          Slumpa
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-alert/40 bg-alert-soft p-3 text-sm text-alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="regNumber"
            className="mb-1 block text-sm font-medium text-ink-800"
          >
            Regnummer
          </label>
          <input
            id="regNumber"
            type="text"
            value={regNumber}
            onChange={(event) => onRegNumberChange(event.target.value.toUpperCase())}
            placeholder="t.ex. ABC123"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="brand" className="mb-1 block text-sm font-medium text-ink-800">
            Märke
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            placeholder="t.ex. Volvo"
            list="brands"
            className={inputClasses}
          />
          <datalist id="brands">
            {ALL_BRANDS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-ink-800">
            Fordonstyp
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) => onTypeChange(event.target.value as VehicleTypeId)}
            className={inputClasses}
          >
            {VEHICLE_TYPES.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full cursor-pointer rounded-lg bg-accent-strong py-2.5 font-semibold
                     text-white transition-colors hover:bg-accent"
        >
          Parkera bil
        </button>
      </div>
    </section>
  );
}
