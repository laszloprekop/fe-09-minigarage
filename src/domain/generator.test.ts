import { describe, expect, it } from 'vitest';
import { BRANDS_BY_TYPE } from '../data/brands';
import { VEHICLE_TYPES } from '../data/vehicleTypes';
import { brandFor, generateVehicle, randomPlate, randomType } from './generator';
import { isValidRegNumber } from './validation';

const KNOWN_TYPES = VEHICLE_TYPES.map((type) => type.id);

describe('randomPlate', () => {
  it('always produces a plate the validator accepts', () => {
    for (let i = 0; i < 1000; i++) {
      const plate = randomPlate();
      expect(isValidRegNumber(plate), plate).toBe(true);
    }
  });

  it('never uses letters that do not appear on Swedish plates', () => {
    for (let i = 0; i < 1000; i++) {
      expect(randomPlate()).not.toMatch(/[IQV]/);
    }
  });

  it('avoids plates already parked', () => {
    const taken = Array.from({ length: 50 }, () => randomPlate());
    for (let i = 0; i < 200; i++) {
      expect(taken).not.toContain(randomPlate(taken));
    }
  });

  it('produces both plate formats', () => {
    const plates = Array.from({ length: 200 }, () => randomPlate());
    expect(plates.some((p) => /\d{3}$/.test(p))).toBe(true);
    expect(plates.some((p) => /\d{2}[A-Z]$/.test(p))).toBe(true);
  });
});

describe('randomType', () => {
  it('only returns types in the catalogue', () => {
    for (let i = 0; i < 500; i++) expect(KNOWN_TYPES).toContain(randomType());
  });

  it('leans towards cars but still produces buses', () => {
    const rolls = Array.from({ length: 3000 }, () => randomType());
    const buses = rolls.filter((t) => t === 'bus' || t === 'coach').length;
    expect(buses).toBeGreaterThan(60);
    expect(buses).toBeLessThan(600);
  });
});

describe('brandFor', () => {
  it('only suggests brands that plausibly build that type', () => {
    for (const type of KNOWN_TYPES) {
      for (let i = 0; i < 20; i++) {
        expect(BRANDS_BY_TYPE[type]).toContain(brandFor(type));
      }
    }
  });

  it('never suggests a car maker for a coach', () => {
    for (let i = 0; i < 100; i++) expect(brandFor('coach')).not.toBe('Polestar');
  });
});

describe('generateVehicle', () => {
  it('produces a configuration the form would accept', () => {
    for (let i = 0; i < 300; i++) {
      const vehicle = generateVehicle();
      expect(isValidRegNumber(vehicle.regNumber)).toBe(true);
      expect(KNOWN_TYPES).toContain(vehicle.type);
      expect(BRANDS_BY_TYPE[vehicle.type]).toContain(vehicle.brand);
    }
  });
});
