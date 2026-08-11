import type { Facing, Footprint, VehicleTypeId } from '../domain/types';

export interface VehicleType {
  id: VehicleTypeId;
  /** Display copy — the one place Swedish is allowed in `data/`. */
  label: string;
  footprint: Footprint;
  facings: Facing[];
}

/** Ordered for the dropdown: passenger cars, then commercial, then buses. */
export const VEHICLE_TYPES: VehicleType[] = [
  { id: 'compact', label: 'Småbil', footprint: 6, facings: ['f'] },
  { id: 'sedan', label: 'Sedan', footprint: 6, facings: ['f'] },
  { id: 'hatchback', label: 'Halvkombi', footprint: 6, facings: ['f'] },
  { id: 'wagon', label: 'Kombi', footprint: 6, facings: ['f'] },
  { id: 'suv', label: 'SUV', footprint: 6, facings: ['f'] },
  { id: 'passenger-van', label: 'Transportbil', footprint: 6, facings: ['f', 'b'] },
  { id: 'small-van', label: 'Liten skåpbil', footprint: 6, facings: ['f', 'b'] },
  { id: 'panel-van', label: 'Skåpbil', footprint: 6, facings: ['f', 'b'] },
  { id: 'truck', label: 'Lastbil', footprint: 6, facings: ['f', 'b'] },
  { id: 'semi-tractor', label: 'Trailerdragare', footprint: 6, facings: ['f', 'b'] },
  { id: 'bus', label: 'Buss', footprint: 9, facings: ['f', 'b'] },
  { id: 'coach', label: 'Turistbuss', footprint: 12, facings: ['f', 'b'] },
];

const BY_ID = new Map(VEHICLE_TYPES.map((type) => [type.id, type]));

export function typeById(id: VehicleTypeId): VehicleType {
  const type = BY_ID.get(id);
  if (!type) throw new Error(`Unknown vehicle type: ${id}`);
  return type;
}
