import { describe, expect, it } from "vitest";
import { PULSARS, U238_HALF_LIFE_YEARS, daughtersPerMillion, hydrogenUnits, periodAfter, uraniumLeft, yearsFromPeriod } from "./clocks";

const crab = PULSARS.find((p) => p.nickname === "Crab")!;

describe("the pulsar clock", () => {
  it("has all 14 pulsars, in map order", () => {
    expect(PULSARS.map((p) => p.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it("matches the hydrogen-unit numbers engraved on the plaque", () => {
    expect(hydrogenUnits(PULSARS[0])).toBe(1_178_486_506);
    expect(hydrogenUnits(crab)).toBe(47_057_538);
  });

  it("the Crab pulsar has slowed to about 33.8 ms by today", () => {
    expect(periodAfter(crab, 2026 - 1971) * 1000).toBeCloseTo(33.85, 1);
  });

  it("can work backwards from a measured period to the age", () => {
    for (const years of [10, 55, 40_000]) {
      expect(yearsFromPeriod(crab, periodAfter(crab, years))).toBeCloseTo(years, 3);
    }
  });
});

describe("the uranium clock", () => {
  it("half is left after one half-life", () => {
    expect(uraniumLeft(U238_HALF_LIFE_YEARS)).toBeCloseTo(0.5, 10);
    expect(daughtersPerMillion(U238_HALF_LIFE_YEARS)).toBeCloseTo(1e6, 3);
  });

  it("barely changes in a human lifetime", () => {
    expect(uraniumLeft(100)).toBeGreaterThan(0.99999998);
  });
});
