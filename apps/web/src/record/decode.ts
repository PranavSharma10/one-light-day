/**
 * The maths an alien would do to read the Golden Record's cover.
 * Every number on the cover is counted in one unit: the time for a hydrogen atom to flip
 * between its two lowest energy states. That flip gives off radio waves at 1420.405751768 MHz,
 * so one unit is 1 / 1420405751.768 seconds, about 0.704 billionths of a second.
 */
export const HYDROGEN_HZ = 1_420_405_751.768;
export const HYDROGEN_UNIT_S = 1 / HYDROGEN_HZ;

/** The binary number engraved around the record drawing: the time of one turn. */
export const ROTATION_BITS = "100110000110010000000000000000000";

/** Read a string of 1s and 0s as a whole number. BigInt-safe for long cover numbers. */
export function binaryToNumber(bits: string): number {
  if (!/^[01]+$/.test(bits)) throw new Error(`not binary: ${bits}`);
  return Number(BigInt("0b" + bits));
}

/** Hydrogen units to seconds. */
export const unitsToSeconds = (units: number) => units * HYDROGEN_UNIT_S;

/** Seconds per turn to turns per minute. */
export const rpm = (secondsPerTurn: number) => 60 / secondsPerTurn;
