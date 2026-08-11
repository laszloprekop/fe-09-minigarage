import { describe, expect, it } from 'vitest';
import { isValidRegNumber } from './validation';

describe('isValidRegNumber', () => {
  it.each(['ABC123', 'XYZ789', 'ABC12A', 'AAA111', 'AAA11A'])(
    'accepts %s',
    (value) => {
      expect(isValidRegNumber(value)).toBe(true);
    },
  );

  it.each([
    'abc123',
    'AB123',
    'ABCD123',
    'ABC1234',
    'ABC1A2',
    'ABC12',
    'ABC 123',
    '123ABC',
    '',
  ])('rejects %s', (value) => {
    expect(isValidRegNumber(value)).toBe(false);
  });

  it('does not carry state between calls', () => {
    expect(isValidRegNumber('ABC123')).toBe(true);
    expect(isValidRegNumber('ABC123')).toBe(true);
  });
});
