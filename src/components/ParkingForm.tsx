interface Props {
  regNumber: string;
  brand: string;
  error: string;
  onRegNumberChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSubmit: () => void;
}

const inputClasses =
  'w-full rounded-lg border border-surface-400 bg-white px-4 py-2 ' +
  'text-ink-900 placeholder:text-surface-600 focus:border-accent focus:outline-none';

export function ParkingForm({
  regNumber,
  brand,
  error,
  onRegNumberChange,
  onBrandChange,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-xl border border-surface-300 bg-surface-50 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Parkera nytt fordon</h2>

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
            className={inputClasses}
          />
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
