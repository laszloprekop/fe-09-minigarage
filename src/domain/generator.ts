import { BRANDS_BY_TYPE } from '../data/brands';
import type { VehicleTypeId } from './types';

/**
 * Real Swedish plates never use I, Q, V, Å, Ä or Ö. The Nivå 2 regex still
 * accepts them, exactly as the brief specifies — the generator is deliberately
 * stricter than the validator, never looser.
 */
const LETTERS = 'ABCDEFGHJKLMNOPRSTUWXYZ';

/**
 * Cars are common, buses are not — but buses are common enough that anyone
 * pressing the button a few times will meet the bus-bay rule on their own.
 * Weights sum to 100: cars 55, light commercial 30, heavy and buses 15.
 */
const WEIGHTS: Array<[VehicleTypeId, number]> = [
  ['compact', 11],
  ['sedan', 11],
  ['hatchback', 11],
  ['wagon', 11],
  ['suv', 11],
  ['passenger-van', 10],
  ['small-van', 10],
  ['panel-van', 10],
  ['truck', 4],
  ['semi-tractor', 4],
  ['bus', 4],
  ['coach', 3],
];

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export function randomType(): VehicleTypeId {
  const total = WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [id, weight] of WEIGHTS) {
    roll -= weight;
    if (roll < 0) return id;
  }
  return WEIGHTS[WEIGHTS.length - 1][0];
}

export function brandFor(type: VehicleTypeId): string {
  return pick(BRANDS_BY_TYPE[type]);
}

/** A plate matching the Nivå 2 format, not already parked. */
export function randomPlate(taken: string[] = []): string {
  const digit = () => String(Math.floor(Math.random() * 10));
  const letter = () => pick([...LETTERS]);

  for (let attempt = 0; attempt < 100; attempt++) {
    const tail =
      Math.random() < 0.5
        ? `${digit()}${digit()}${digit()}`
        : `${digit()}${digit()}${letter()}`;
    const plate = `${letter()}${letter()}${letter()}${tail}`;
    if (!taken.includes(plate)) return plate;
  }

  throw new Error('could not find an unused registration number');
}

export interface GeneratedVehicle {
  regNumber: string;
  brand: string;
  type: VehicleTypeId;
}

/**
 * A plausible configuration for the form. The brand follows from the type here
 * and only here — once the values are in the fields they are independent, so
 * the user can change either without the other chasing it.
 */
export function generateVehicle(takenPlates: string[] = []): GeneratedVehicle {
  const type = randomType();
  return { regNumber: randomPlate(takenPlates), brand: brandFor(type), type };
}
