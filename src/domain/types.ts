export type VehicleTypeId =
  | 'compact'
  | 'sedan'
  | 'hatchback'
  | 'wagon'
  | 'suv'
  | 'passenger-van'
  | 'small-van'
  | 'panel-van'
  | 'truck'
  | 'semi-tractor'
  | 'bus'
  | 'coach';

/** Which way a vehicle points. Only commercial types have a back-facing sprite. */
export type Facing = 'f' | 'b';

/** How many grid units long a vehicle needs, and how long a bay is. */
export type Footprint = 6 | 9 | 12;

export interface ICar {
  id: number;
  regNumber: string;
  brand: string;
  type: VehicleTypeId;
  facing: Facing;
  /** Chosen once, when the vehicle is created. See ADR-0001. */
  bayId: string;
}

export interface Bay {
  id: string;
  /** Grid units along the bay's length axis. */
  along: number;
  /** Grid units across it. */
  across: number;
  length: Footprint;
}

export interface Plan {
  id: string;
  name: string;
  bays: Bay[];
}
