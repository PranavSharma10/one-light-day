import { useState } from "react";
import { MAP_YEAR, PULSARS, daughtersPerMillion, periodAfter, uraniumLeft, yearsFromPeriod, type Pulsar } from "./clocks";

const MAX_POWER = 9; // the slider runs from 1 year to 1 billion years (log scale)
const TODAY_YEARS = new Date().getUTCFullYear() - MAP_YEAR;

const PRESETS: { label: string; years: number }[] = [
  { label: "Today", years: TODAY_YEARS },
  { label: "40,000 years: Voyager passes another star", years: 40_000 },
  { label: "1 million years", years: 1e6 },
  { label: "1 billion years", years: 1e9 },
];

/** Line length on the drawing. Real distances run from 100 to 8,300 parsecs, so we squash them with a square root to fit. */
const lineLength = (pc: number) => 16 + Math.sqrt(pc / 8300) * 168;

function ms(seconds: number) {
  return (seconds * 1000).toPrecision(7) + " ms";
}

function change(p: Pulsar, now: number) {
  const ppm = ((now - p.period) / p.period) * 1e6;
  if (ppm < 1000) return `+${ppm.toPrecision(3)} ppm`;
  if (now < 2 * p.period) return `+${(ppm / 1e4).toPrecision(3)}%`;
  return `×${(now / p.period).toPrecision(3)} slower`;
}

function formatYears(y: number) {
  if (y >= 1e9) return `${(y / 1e9).toLocaleString("en-IE", { maximumFractionDigits: 2 })} billion years`;
  if (y >= 1e6) return `${(y / 1e6).toLocaleString("en-IE", { maximumFractionDigits: 2 })} million years`;
  return `${Math.round(y).toLocaleString("en-IE")} years`;
}

/** The real pulsar map, drawn from each pulsar's galactic longitude and distance. */
function PulsarMap({ focus, onFocus }: { focus: number | null; onFocus: (n: number | null) => void }) {
  const [cx, cy] = [196, 180];
  return (
    <svg className="gr-map" viewBox="0 0 470 360" role="img" aria-label="The pulsar map, drawn from real pulsar data">
      <line x1={cx} y1={cy} x2={cx + 250} y2={cy} className="gr-map-gc" />
      <text x={cx + 250} y={cy - 8} textAnchor="end" className="gr-map-label">
        to the galactic centre
      </text>
      {PULSARS.map((p) => {
        const a = (-p.l * Math.PI) / 180; // longitude measured from the galactic-centre line
        const len = lineLength(p.distancePc);
        const [x, y] = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
        const on = focus === p.n;
        return (
          <g key={p.n} className={`gr-map-psr${on ? " on" : ""}`} onPointerEnter={() => onFocus(p.n)} onPointerLeave={() => onFocus(null)}>
            <line x1={cx} y1={cy} x2={x} y2={y} className="gr-map-hit" />
            <line x1={cx} y1={cy} x2={x} y2={y} />
            <circle cx={x} cy={y} r={on ? 5 : 3} />
            {(p.nickname || on) && (
              <text x={x + (Math.cos(a) >= 0 ? 8 : -8)} y={y + 4} textAnchor={Math.cos(a) >= 0 ? "start" : "end"} className="gr-map-label">
                {p.nickname ?? p.name}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={5} className="gr-map-sun" />
      <text x={cx - 8} y={cy + 20} textAnchor="end" className="gr-map-label">
        the Sun
      </text>
    </svg>
  );
}

/** 16c: the pulsar clock and the uranium clock. */
export default function TwoClocks() {
  const [power, setPower] = useState(Math.log10(TODAY_YEARS));
  const [focus, setFocus] = useState<number | null>(null);
  const years = 10 ** power;
  const foundIn = MAP_YEAR + years;
  const crab = PULSARS.find((p) => p.nickname === "Crab")!;
  const crabNow = periodAfter(crab, years);
  const left = uraniumLeft(years);

  return (
    <section className="gr-section" aria-labelledby="gr-clock-h">
      <header className="gr-section-head">
        <p className="eyebrow">Part 3 · Two clocks</p>
        <h2 id="gr-clock-h">The cover also says when we sent it</h2>
        <p className="gr-lede">
          The pulsar map is real data: 14 spinning dead stars, each with its exact period engraved in hydrogen units. Pulsars
          slow down by a tiny, steady amount, so a finder who measures them again can tell how long ago the map was made. For
          very long times there's a second clock: the uranium spot. Pick when Voyager is found.
        </p>
      </header>

      <div className="gr-clocks">
        <div className="gr-map-wrap">
          <PulsarMap focus={focus} onFocus={setFocus} />
          <p className="gr-note">Line lengths are squashed to fit: the real distances run from 330 to 27,000 light-years.</p>
        </div>

        <div className="gr-panel">
          <label className="gr-slider">
            <span>
              Found <strong>{formatYears(years)}</strong> after the map was made
              {years < 1e5 && <> (around the year {Math.round(foundIn)})</>}
            </span>
            <input type="range" min={0} max={MAX_POWER} step={0.01} value={power} onChange={(e) => setPower(Number(e.target.value))} />
          </label>
          <div className="gr-presets">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" className="btn ghost" onClick={() => setPower(Math.log10(p.years))}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="gr-readouts">
            <div>
              <span>Crab pulsar, on the cover</span>
              <code>{ms(crab.period)}</code>
            </div>
            <div>
              <span>Crab pulsar, measured by the finder</span>
              <code>{ms(crabNow)}</code>
            </div>
            <div>
              <span>Working backwards from that</span>
              <code>{formatYears(yearsFromPeriod(crab, crabNow))} ago</code>
            </div>
            <div>
              <span>Uranium-238 still left</span>
              <code>{(left * 100).toFixed(left > 0.9999 ? 7 : 3)}%</code>
            </div>
            <div>
              <span>Decay atoms per million uranium atoms</span>
              <code>{daughtersPerMillion(years).toLocaleString("en-IE", { maximumSignificantDigits: 4 })}</code>
            </div>
          </div>
          <p className="gr-small">
            {years < 1e6
              ? "Over thousands of years the pulsars change measurably, but the uranium barely does: the pulsars are the sharper clock."
              : "Pulsars fade after millions of years and the galaxy rearranges itself, so the map stops working. The uranium keeps counting for billions of years."}
          </p>
        </div>
      </div>

      <div className="gr-table-wrap">
        <table className="gr-table">
          <caption>All 14 pulsars on the map, as a finder would measure them</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Pulsar</th>
              <th scope="col">On the cover</th>
              <th scope="col">Measured then</th>
              <th scope="col">Slowed by</th>
            </tr>
          </thead>
          <tbody>
            {PULSARS.map((p) => {
              const now = periodAfter(p, years);
              return (
                <tr key={p.n} className={focus === p.n ? "on" : ""} onPointerEnter={() => setFocus(p.n)} onPointerLeave={() => setFocus(null)}>
                  <td>{p.n}</td>
                  <td>
                    {p.name}
                    {p.nickname && <small> ({p.nickname})</small>}
                  </td>
                  <td>{ms(p.period)}</td>
                  <td>{ms(now)}</td>
                  <td>{change(p, now)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="gr-note gr-left">
        Pulsar data: W. R. Johnston's identification of the map's pulsars, with slow-down rates from the ATNF pulsar catalogue.
        We assume each pulsar keeps slowing the same way (magnetic braking), which is a simplification over millions of years.
      </p>
    </section>
  );
}
