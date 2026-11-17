// Where Voyager 1 is, estimated in the browser.
//
// Voyager 1 coasts on an almost straight line away from the Sun, so the model
// is that line plus Earth's orbit, which is what makes the Earth–Voyager
// distance grow faster or slower through the year. It's anchored to a real
// JPL Horizons sample: services/api/tests/fixtures/horizons_real.txt.

export const C_KMS = 299_792.458;
export const AU_KM = 149_597_870.7;

export interface VoyagerState {
  rangeKm: number;      // distance from Earth
  rangeRateKms: number; // + means moving apart
  helioAu: number;      // distance from the Sun
  owltS: number;        // one-way light time
  source: "horizons" | "model";
}

// Anchor: JPL Horizons, 2026-11-17 19:00 UTC
const ANCHOR_MS = Date.UTC(2026, 10, 17, 19, 0, 0); // months count from 0, so 10 = November
const ANCHOR_RANGE_KM = 173.125507000362 * AU_KM;
const ANCHOR_HELIO_KM = 172.3733148257 * AU_KM;
const HELIO_RATE_KMS = 16.8815698;

// Voyager 1's direction (ecliptic longitude and latitude), fitted to the same JPL rows.
const DEG = Math.PI / 180;
const LON = 257.14 * DEG;
const LAT = 35.16 * DEG;
const U = [Math.cos(LAT) * Math.cos(LON), Math.cos(LAT) * Math.sin(LON), Math.sin(LAT)];

/** Earth's position around the Sun in km (low-precision formula, about 0.01°). */
function earthKm(ms: number): number[] {
  const d = ms / 86_400_000 - 10_957.5; // days since 1 Jan 2000, 12:00 UTC
  const g = (357.528 + 0.9856003 * d) * DEG;
  const sunLon = (280.46 + 0.9856474 * d + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG;
  const r = (1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g)) * AU_KM;
  const lon = sunLon + Math.PI; // Earth is opposite the Sun as seen from Earth
  return [r * Math.cos(lon), r * Math.sin(lon), 0];
}

const helioKm = (ms: number) => ANCHOR_HELIO_KM + (HELIO_RATE_KMS * (ms - ANCHOR_MS)) / 1000;

function rawRangeKm(ms: number): number {
  const r = helioKm(ms);
  const e = earthKm(ms);
  return Math.hypot(r * U[0] - e[0], r * U[1] - e[1], r * U[2] - e[2]);
}

// The simple model is ~2,500 km off at the anchor; this constant removes that.
const OFFSET_KM = ANCHOR_RANGE_KM - rawRangeKm(ANCHOR_MS);

export function model(ms: number): VoyagerState {
  const rangeKm = rawRangeKm(ms) + OFFSET_KM;
  return {
    rangeKm,
    rangeRateKms: (rawRangeKm(ms + 60_000) - rawRangeKm(ms - 60_000)) / 120,
    helioAu: helioKm(ms) / AU_KM,
    owltS: rangeKm / C_KMS,
    source: "model",
  };
}
// ---- Live data: JPL Horizons samples from our API --------------------------

/** One sample as the API sends it (see SampleOut in services/api/app/main.py). */
export interface ApiSample {
  t: string;
  helio_au: number;
  helio_rate_kms: number;
  range_km: number;
  range_rate_kms: number;
  owlt_s: number;
}

export interface Sample {
  t: number; // ms since 1970, UTC
  helioAu: number;
  rangeKm: number;
  rangeRateKms: number;
}

export const fromApi = (rows: ApiSample[]): Sample[] =>
  rows
    .map((r) => ({
      t: Date.parse(r.t),
      helioAu: r.helio_au,
      rangeKm: r.range_km,
      rangeRateKms: r.range_rate_kms,
    }))
    .sort((a, b) => a.t - b.t);

/**
 * Cubic Hermite interpolation between hourly samples. It uses each sample's
 * range-rate as the curve's slope, which keeps it within metres of JPL.
 * Returns null outside the sampled window, so callers can fall back to the model.
 */
export function interpolate(samples: Sample[], ms: number): VoyagerState | null {
  if (samples.length < 2 || ms < samples[0].t || ms > samples[samples.length - 1].t) return null;

  let i = 0;
  while (i < samples.length - 2 && samples[i + 1].t < ms) i++;
  const a = samples[i];
  const b = samples[i + 1];

  const h = (b.t - a.t) / 1000;      // gap between samples, seconds
  const s = (ms - a.t) / 1000 / h;   // 0 at a, 1 at b
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;

  const rangeKm =
    h00 * a.rangeKm + h10 * h * a.rangeRateKms + h01 * b.rangeKm + h11 * h * b.rangeRateKms;

  return {
    rangeKm,
    rangeRateKms: a.rangeRateKms + (b.rangeRateKms - a.rangeRateKms) * s,
    helioAu: a.helioAu + (b.helioAu - a.helioAu) * s,
    owltS: rangeKm / C_KMS,
    source: "horizons",
  };
}