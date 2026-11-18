import { describe, expect, it } from "vitest";
import { C_KMS, replyArrivesMs, uplinkSeconds, type VoyagerState } from "./ephemeris";

const DAY_KM = C_KMS * 86_400;

// A fake Voyager exactly one light-day away, moving away at 25 km/s.
const fake = (ms: number): VoyagerState => {
  const rangeKm = DAY_KM + 25 * (ms / 1000);
  return { rangeKm, rangeRateKms: 25, helioAu: 172, owltS: rangeKm / C_KMS, source: "model" };
};

describe("signal timing", () => {
  it("takes longer to catch a receding Voyager than light takes to cover today's distance", () => {
    const up = uplinkSeconds(fake, 0);
    expect(up).toBeGreaterThan(86_400);
    // While the signal flies for a day, Voyager moves on 25 km/s × 86,400 s = 2.16 million km,
    // which adds about 7.2 seconds.
    expect(up - 86_400).toBeCloseTo((25 * 86_400) / C_KMS, 1);
  });

  it("delivers Voyager's reply a little over a day later", () => {
    const back = replyArrivesMs(fake, 0) / 1000;
    expect(back).toBeGreaterThan(86_400);
    expect(back).toBeLessThan(86_400 + 20);
  });
});