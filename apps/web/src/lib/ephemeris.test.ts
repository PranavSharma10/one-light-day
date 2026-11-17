import { describe, expect, it } from "vitest";
import { AU_KM, C_KMS, interpolate, model, type Sample } from "./ephemeris";

const at = (hour: number) => Date.UTC(2026, 10, 17, hour);

describe("fallback model vs JPL Horizons", () => {
  it("matches JPL exactly at the anchor", () => {
    expect(model(at(19)).rangeKm).toBeCloseTo(173.125507000362 * AU_KM, 0);
  });

  it("stays within 1,000 km of JPL three hours later", () => {
    const error = model(at(22)).rangeKm - 173.127357615258 * AU_KM;
    expect(Math.abs(error)).toBeLessThan(1000);
  });

  it("matches JPL's speed away from Earth", () => {
    expect(model(at(22)).rangeRateKms).toBeCloseTo(25.6106871, 1);
  });

  it("light time is distance divided by c", () => {
    const s = model(at(19));
    expect(s.owltS).toBeCloseTo(s.rangeKm / C_KMS, 6);
  });
});
// Your real JPL rows from services/api/tests/fixtures/horizons_real.txt
const jpl = (hour: number, au: number, rate: number): Sample => ({
  t: at(hour),
  helioAu: 172.37,
  rangeKm: au * AU_KM,
  rangeRateKms: rate,
});
const row19 = jpl(19, 173.125507000362, 25.6603489);
const row20 = jpl(20, 173.126124270317, 25.6437993);
const row21 = jpl(21, 173.126741141983, 25.6272453);

describe("Hermite interpolation on real JPL data", () => {
  it("predicts the 20:00 row from 19:00 and 21:00 to within 100 metres", () => {
    const s = interpolate([row19, row21], at(20))!;
    expect(Math.abs(s.rangeKm - row20.rangeKm)).toBeLessThan(0.1);
    expect(s.source).toBe("horizons");
  });

  it("hits the samples exactly", () => {
    expect(interpolate([row19, row21], at(19))!.rangeKm).toBeCloseTo(row19.rangeKm, 3);
  });

  it("returns null outside the samples, so the model takes over", () => {
    expect(interpolate([row19, row21], at(22))).toBeNull();
  });
});