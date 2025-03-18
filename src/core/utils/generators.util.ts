/**
 * Generates a custom ID of the specified length.
 *
 * @param {number} length - The length of the ID to be generated.
 * @return {string} The generated custom ID.
 */
export function customID(length: number): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    id += charset[randomIndex];
  }

  return id;
}

/**
 * Generate a unique GUID
 *
 * returns {string}
 */
export function GUID(): string {
  const S4 = (): string =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return 'i' + S4() + S4() + S4();
}

/**
 * Generates a complex numeric ID consisting of random digits.
 *
 * @param {number} [length=12] - The length of the ID. Defaults to 12.
 * @return {string} The generated ID.
 */
export function complexNumericId(length = 12): string {
  // Create an array to hold the ID digits
  const digits: number[] = [];

  // Generate cryptographically strong random values
  // from 0 to 9 for each digit
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Shuffle the array to randomize the digits
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = digits[i];
    digits[i] = digits[j];
    digits[j] = temp;
  }

  // Join the array into a string
  return digits.join('');
}
