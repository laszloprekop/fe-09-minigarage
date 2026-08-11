import type { VehicleTypeId } from '../domain/types';

const SMALL_CARS = ['Volkswagen', 'Toyota', 'Kia', 'Hyundai', 'Renault', 'Peugeot', 'Škoda', 'MG'];
const BIG_CARS = ['Volvo', 'Saab', 'BMW', 'Audi', 'Mercedes-Benz', 'Tesla', 'Škoda'];
const SUVS = ['Volvo', 'Polestar', 'Tesla', 'Kia', 'Toyota', 'BMW', 'Hyundai', 'BYD'];
const VANS = ['Volkswagen', 'Mercedes-Benz', 'Ford', 'Renault', 'Fiat', 'Toyota'];
const HEAVY = ['Scania', 'Volvo', 'MAN', 'Mercedes-Benz', 'Iveco'];

/**
 * Who plausibly builds what, for the prefill only. Volvo and Scania appearing
 * across cars, trucks and buses is correct — both genuinely build all three.
 *
 * Typed as a full Record, so adding a vehicle type without giving it brands is
 * a compile error rather than an empty dropdown at runtime.
 */
export const BRANDS_BY_TYPE: Record<VehicleTypeId, string[]> = {
  compact: SMALL_CARS,
  hatchback: SMALL_CARS,
  sedan: BIG_CARS,
  wagon: BIG_CARS,
  suv: SUVS,
  'passenger-van': VANS,
  'small-van': VANS,
  'panel-van': VANS,
  truck: HEAVY,
  'semi-tractor': ['Scania', 'Volvo', 'MAN', 'Mercedes-Benz', 'Tesla'],
  bus: ['Scania', 'Volvo', 'MAN', 'Mercedes-Benz'],
  coach: ['Scania', 'Volvo', 'MAN', 'Setra'],
};

/** Every brand in the table, for the Märke datalist. */
export const ALL_BRANDS = [...new Set(Object.values(BRANDS_BY_TYPE).flat())].sort();
