/**
 * A Swedish plate in this exercise: three letters, then either three digits
 * or two digits and a letter. Expects an already-uppercased value.
 */
const REG_PATTERN = /^[A-Z]{3}(\d{3}|\d{2}[A-Z])$/;

export function isValidRegNumber(value: string): boolean {
  return REG_PATTERN.test(value);
}
