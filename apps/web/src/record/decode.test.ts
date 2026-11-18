import { describe, expect, it } from "vitest";
import { HYDROGEN_UNIT_S, ROTATION_BITS, binaryToNumber, rpm, unitsToSeconds } from "./decode";

describe("decoding the Golden Record cover", () => {
  it("one hydrogen unit is about 0.704 billionths of a second", () => {
    expect(HYDROGEN_UNIT_S * 1e9).toBeCloseTo(0.704, 3);
  });

  it("reads the binary around the record", () => {
    expect(binaryToNumber(ROTATION_BITS)).toBe(5_113_380_864);
  });

  it("gives 3.6 seconds per turn, which is 16 2/3 rpm", () => {
    const seconds = unitsToSeconds(binaryToNumber(ROTATION_BITS));
    expect(seconds).toBeCloseTo(3.6, 3);
    expect(rpm(seconds)).toBeCloseTo(16.667, 2);
  });

  it("refuses things that aren't binary", () => {
    expect(() => binaryToNumber("1021")).toThrow();
  });
});
