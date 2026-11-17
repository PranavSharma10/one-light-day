import { describe, expect, it } from "vitest";
import { AU_KM, C_KMS, model } from "./ephemeris";

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