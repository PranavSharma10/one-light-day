/**
 * The two clocks on the Golden Record's cover.
 *
 * 1. The pulsar map. Each pulsar slows down by a tiny, steady amount (its "P-dot"). If you measure
 *    its period now and compare it with the period on the map, you can work out how long ago the
 *    map was made. For a pulsar slowing down by magnetic braking, P × dP/dt stays roughly constant,
 *    so P² grows in a straight line:  P(t)² = P₀² + 2·P₀·Ṗ₀·t.
 *
 * 2. The uranium spot. Half of any uranium-238 decays in 4.468 billion years.
 *
 * Pulsar identities, map periods, angles and distances: Wm. Robert Johnston, "Interpreting the
 * pulsar map" (johnstonsarchive.net), matched against Taylor & Manchester (1975). P-dot values are
 * from the ATNF pulsar catalogue, as listed there.
 */
import { HYDROGEN_HZ } from "./decode";

export const MAP_YEAR = 1971; // the map was designed for the Pioneer plaque, launched 1972
export const YEAR_S = 365.25 * 86400;
export const U238_HALF_LIFE_YEARS = 4.468e9;

export interface Pulsar {
  n: number; // order around the map, clockwise from the galactic-centre line
  name: string; // B1950 name, as astronomers knew them in 1971
  jname: string;
  period: number; // seconds, as engraved on the map
  pdot: number; // seconds per second
  l: number; // galactic longitude, degrees: sets the line's direction
  distancePc: number; // sets the line's length
  nickname?: string;
}

export const PULSARS: Pulsar[] = [
  { n: 1, name: "B1727-47", jname: "J1731-4744", period: 0.8296830003, pdot: 163.626e-15, l: 342.57, distancePc: 5900 },
  { n: 2, name: "B1451-68", jname: "J1456-6843", period: 0.2633767643, pdot: 0.1013e-15, l: 313.87, distancePc: 290 },
  { n: 3, name: "B1240-64", jname: "J1243-6423", period: 0.3880000002, pdot: 4.4997e-15, l: 302.05, distancePc: 8300 },
  { n: 4, name: "B0833-45", jname: "J0835-4510", period: 0.0892187481, pdot: 124.88e-15, l: 263.55, distancePc: 500, nickname: "Vela" },
  { n: 5, name: "B0950+08", jname: "J0953+0755", period: 0.2530650432, pdot: 0.22915e-15, l: 228.91, distancePc: 100 },
  { n: 6, name: "B0823+26", jname: "J0826+2637", period: 0.5306595992, pdot: 1.7094e-15, l: 196.96, distancePc: 790 },
  { n: 7, name: "B0531+21", jname: "J0534+2200", period: 0.0331296448, pdot: 420.5188e-15, l: 184.56, distancePc: 2000, nickname: "Crab" },
  { n: 8, name: "B0525+21", jname: "J0528+2200", period: 3.7454907997, pdot: 40.046e-15, l: 183.86, distancePc: 1900 },
  { n: 9, name: "B0329+54", jname: "J0332+5434", period: 0.7145186427, pdot: 2.04959e-15, l: 145.0, distancePc: 1300 },
  { n: 10, name: "B2217+47", jname: "J2219+4754", period: 0.538467378, pdot: 2.76503e-15, l: 98.38, distancePc: 1600 },
  { n: 11, name: "B2016+28", jname: "J2018+2839", period: 0.5579533903, pdot: 0.14936e-15, l: 68.1, distancePc: 480 },
  { n: 12, name: "B1933+16", jname: "J1935+1616", period: 0.35873542, pdot: 6.00354e-15, l: 52.44, distancePc: 6000 },
  { n: 13, name: "B1929+10", jname: "J1932+1059", period: 0.2265170382, pdot: 1.15661e-15, l: 47.38, distancePc: 110 },
  { n: 14, name: "B1642-03", jname: "J1645-0317", period: 0.3876887792, pdot: 1.781e-15, l: 14.11, distancePc: 160 },
];

/** The period as the cover writes it: a whole number of hydrogen flips. */
export const hydrogenUnits = (p: Pulsar) => Math.round(p.period * HYDROGEN_HZ);

/** The period someone would measure `years` after the map was made. */
export function periodAfter(p: Pulsar, years: number): number {
  return Math.sqrt(p.period ** 2 + 2 * p.period * p.pdot * years * YEAR_S);
}

/** Working backwards: how many years since the map, from a measured period? */
export function yearsFromPeriod(p: Pulsar, measured: number): number {
  return (measured ** 2 - p.period ** 2) / (2 * p.period * p.pdot * YEAR_S);
}

/** Fraction of the uranium-238 spot still left after `years`. */
export const uraniumLeft = (years: number) => 0.5 ** (years / U238_HALF_LIFE_YEARS);

/** Atoms of decay products per million uranium atoms still left. */
export const daughtersPerMillion = (years: number) => (2 ** (years / U238_HALF_LIFE_YEARS) - 1) * 1e6;
