/**
 * Round the number to two digits
 *
 * ----- examples -----
 * roundToTwo(1.005)     = 1.01
 * roundToTwo(10)        = 10
 * roundToTwo(1.7777777) = 1.78
 * roundToTwo(9.1)       = 9.1
 * roundToTwo(1234.5678) = 1234.57
 */
export function roundToTwo(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

/**
 * Round the number to five digits
 *
 * ----- examples -----
 * roundToFive(1.005)     = 1.005
 * roundToFive(10)        = 10
 * roundToFive(1.7777777) = 1.77778
 * roundToFive(9.1)       = 9.1
 * roundToFive(1234.5678) = 1234.5678
 */
export function roundToFive(number: number): number {
  return Math.round((number + Number.EPSILON) * 100000) / 100000;
}

/**
 * Round the number to zero
 *
 * ----- examples -----
 * roundToZero(1.005)     = 1
 * roundToZero(1.95)      = 1
 * roundToZero(1.45)      = 1
 *
 */
export function roundToZero(number: number): number {
  return Math.trunc(number);
}
