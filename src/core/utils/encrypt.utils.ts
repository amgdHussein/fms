import { randomBytes } from 'crypto';

/**
 * Generates a string of the given length using the given string of characters.
 *
 * @example
 * generateId('0123456789', 8) // => 84193702
 *
 * @param {string} characters The string of characters to use.
 * @param {number} length The length of the desired output.
 * @returns {string} The generated string.
 */
export function generateId(characters: string, length: number): string {
  const charactersLength = characters.length;
  let result = '';

  const bytes = randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += characters[bytes[i] % charactersLength];
  }

  return result;
}
