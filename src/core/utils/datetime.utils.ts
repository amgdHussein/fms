/**
 * Delays execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay execution
 * @return {Promise<void>} A promise that resolves after the specified delay
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
