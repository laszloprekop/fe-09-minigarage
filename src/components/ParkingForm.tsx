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

/**
 * Fields are the one place a fill is allowed: a light panel, no border, so an
 * editable field never reads as one of the outlined bays around it.
 */
const fieldClasses =
  'w-full border-0 bg-surface-100 px-4 py-2.5 text-ink-900 ' +
  'placeholder:text-surface-600 focus:bg-surface-50 focus:outline-2 ' +
  'focus:-outline-offset-2 focus:outline-accent-strong';

const labelClasses =
  'mb-2 block text-xs font-semibold tracking-wider text-ink-700 uppercase';

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
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Parkera nytt fordon</h2>
        <button
          type="button"
          onClick={onGenerate}
          title="Fyll i ett slumpat fordon"
          aria-label="Fyll i ett slumpat fordon"
          className="cursor-pointer border-2 border-white bg-surface-200 px-3 py-1.5
                     text-xs font-semibold tracking-wider text-ink-800 uppercase
                     transition-colors hover:bg-surface-100"
        >
          Slumpa
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 border-2 border-alert px-4 py-3 text-sm font-medium text-alert"
        >
          {error}
        </p>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="regNumber" className={labelClasses}>
            Regnummer
          </label>
          <input
            id="regNumber"
            type="text"
            value={regNumber}
            onChange={(event) => onRegNumberChange(event.target.value.toUpperCase())}
            placeholder="t.ex. ABC123"
            className={`${fieldClasses} font-mono tracking-widest`}
          />
        </div>

        <div>
          <label htmlFor="brand" className={labelClasses}>
            Märke
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            placeholder="t.ex. Volvo"
            list="brands"
            className={fieldClasses}
          />
          <datalist id="brands">
            {ALL_BRANDS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="type" className={labelClasses}>
            Fordonstyp
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) => onTypeChange(event.target.value as VehicleTypeId)}
            className={fieldClasses}
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
          className="w-full cursor-pointer border-2 border-accent-strong bg-accent-strong
                     px-4 py-3 text-sm font-semibold tracking-wider text-white uppercase
                     transition-colors hover:border-accent hover:bg-accent"
        >
          Parkera bil
        </button>
      </div>
    </section>
  );
}
