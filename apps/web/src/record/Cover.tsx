import type { KeyboardEvent, ReactNode } from "react";
import { ROTATION_BITS } from "./decode";
import type { PartId } from "./parts";

/**
 * Our own redrawing of the Golden Record's cover (simplified from NASA's diagram).
 * Each engraving is a button: click it, or Tab to it and press Enter, to decode it.
 */

const ENGRAVE = "#3d2b0c";

/** Binary as the cover writes it: "|" is 1, "—" is 0. Laid out in a row. */
function TickRow({ bits, x, y, gap = 5 }: { bits: string; x: number; y: number; gap?: number }) {
  return (
    <g stroke={ENGRAVE} strokeWidth={1.6} strokeLinecap="round">
      {[...bits].map((b, i) => {
        const cx = x + i * gap;
        return b === "1" ? <line key={i} x1={cx} y1={y - 5} x2={cx} y2={y + 5} /> : <line key={i} x1={cx - 2} y1={y} x2={cx + 2} y2={y} />;
      })}
    </g>
  );
}

/** Binary around a circle, counter-clockwise from the top: "|" points outwards, "—" runs along the ring. */
function TickRing({ bits, cx, cy, r }: { bits: string; cx: number; cy: number; r: number }) {
  const step = 330 / bits.length;
  return (
    <g stroke={ENGRAVE} strokeWidth={1.6} strokeLinecap="round">
      {[...bits].map((b, i) => {
        const a = ((-90 - i * step) * Math.PI) / 180;
        const [ux, uy] = [Math.cos(a), Math.sin(a)];
        const [px, py] = [cx + ux * r, cy + uy * r];
        return b === "1" ? (
          <line key={i} x1={px - ux * 5} y1={py - uy * 5} x2={px + ux * 5} y2={py + uy * 5} />
        ) : (
          <line key={i} x1={px - uy * 2.5} y1={py + ux * 2.5} x2={px + uy * 2.5} y2={py - ux * 2.5} />
        );
      })}
    </g>
  );
}

const SIDE_BITS = "1001010011010010010000000100100110000111101"; // one hour in hydrogen units, for the side view

/** The 14 pulsar lines, simplified: [angle in degrees, length]. Their real data is in the pulsar clock below. */
const PULSARS: [number, number][] = [
  [-160, 62], [-135, 96], [-118, 48], [-96, 80], [-70, 58], [-44, 104], [-20, 70],
  [24, 88], [52, 54], [78, 92], [104, 66], [132, 100], [156, 44], [196, 76],
];

interface SpotProps {
  id: PartId;
  label: string;
  hit: [number, number, number, number];
  active: PartId | null;
  onPick: (id: PartId) => void;
  children: ReactNode;
}

function Spot({ id, label, hit, active, onPick, children }: SpotProps) {
  const [x, y, w, h] = hit;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(id);
    }
  };
  return (
    <g
      className={`gr-spot${active === id ? " active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active === id}
      onClick={() => onPick(id)}
      onKeyDown={onKey}
    >
      <rect className="gr-hit" x={x} y={y} width={w} height={h} rx={14} />
      {children}
    </g>
  );
}

export default function Cover({ active, onPick }: { active: PartId | null; onPick: (id: PartId) => void }) {
  const spot = { active, onPick };
  return (
    <svg className="gr-cover" viewBox="0 0 600 600" role="group" aria-label="The Golden Record's cover. Choose an engraving to decode it.">
      <defs>
        <radialGradient id="gr-gold" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f3d98a" />
          <stop offset="0.55" stopColor="#d1a648" />
          <stop offset="1" stopColor="#8f6a22" />
        </radialGradient>
      </defs>

      {/* the gold-coloured aluminium cover, with a brushed-metal shimmer */}
      <circle cx={300} cy={300} r={292} fill="url(#gr-gold)" stroke="#6b4e16" strokeWidth={4} />
      {[250, 205, 160, 115].map((r) => (
        <circle key={r} cx={300} cy={300} r={r} fill="none" stroke="#fff3c4" strokeOpacity={0.12} strokeWidth={10} />
      ))}

      <g fill="none" stroke={ENGRAVE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {/* 1. The record and its stylus, with the time of one turn written around it */}
        <Spot id="record" label="The record and stylus" hit={[78, 66, 200, 200]} {...spot}>
          <circle cx={172} cy={166} r={70} />
          <circle cx={172} cy={166} r={56} strokeOpacity={0.6} />
          <circle cx={172} cy={166} r={42} strokeOpacity={0.6} />
          <circle cx={172} cy={166} r={16} />
          <circle cx={172} cy={166} r={2.5} fill={ENGRAVE} />
          <path d="M262 82 L222 120 L214 113" />
          <rect x={256} y={74} width={16} height={10} rx={2} transform="rotate(-43 264 79)" />
          <TickRing bits={ROTATION_BITS} cx={172} cy={166} r={86} />
        </Spot>

        {/* 2. Side view: play from the outside in; one side takes about an hour */}
        <Spot id="side" label="Side view of the record" hit={[78, 272, 228, 66]} {...spot}>
          <rect x={98} y={290} width={150} height={6} />
          <path d="M240 290 L254 276 L274 284" />
          <TickRow bits={SIDE_BITS} x={92} y={318} gap={4.6} />
        </Spot>

        {/* 3. How to turn the sound back into pictures */}
        <Spot id="pictures" label="How to build the pictures" hit={[328, 64, 210, 330]} {...spot}>
          <path d="M342 106 h22 v-18 h6 v18 h10 c6 -14 10 14 16 0 s10 14 16 0 s10 14 16 0 s10 14 16 0 s10 14 16 0 s10 14 16 0" />
          <TickRow bits="1" x={350} y={128} />
          <TickRow bits="10" x={410} y={128} />
          <TickRow bits="11" x={470} y={128} />
          <path d="M360 146 l14 50 M378 146 l14 50 M396 146 l14 50" />
          <path d="M374 196 L378 146 M392 196 L396 146" strokeDasharray="3 4" strokeOpacity={0.7} />
          <rect x={356} y={214} width={120} height={78} />
          {Array.from({ length: 19 }, (_, i) => (
            <line key={i} x1={362 + i * 6} y1={218} x2={362 + i * 6} y2={288} strokeWidth={1} strokeOpacity={0.7} />
          ))}
          <rect x={356} y={306} width={120} height={78} />
          <circle cx={416} cy={345} r={28} />
        </Spot>

        {/* 4. The pulsar map: where the Sun is */}
        <Spot id="pulsars" label="The pulsar map" hit={[58, 352, 290, 186]} {...spot}>
          {PULSARS.map(([deg, len], i) => {
            const a = (deg * Math.PI) / 180;
            return <line key={i} x1={176} y1={445} x2={176 + Math.cos(a) * len} y2={445 + Math.sin(a) * len} strokeWidth={1.6} />;
          })}
          <line x1={176} y1={445} x2={336} y2={445} strokeWidth={1.6} />
          <circle cx={176} cy={445} r={3} fill={ENGRAVE} />
        </Spot>

        {/* 5. Hydrogen: the unit of time for every number on the cover */}
        <Spot id="hydrogen" label="The hydrogen atom" hit={[374, 412, 140, 84]} {...spot}>
          <circle cx={408} cy={448} r={18} />
          <circle cx={480} cy={448} r={18} />
          <circle cx={408} cy={448} r={3} fill={ENGRAVE} />
          <circle cx={480} cy={448} r={3} fill={ENGRAVE} />
          <path d="M408 424 v-8 l-3 4 M408 416 l3 4 M480 472 v8 l-3 -4 M480 480 l3 -4" strokeWidth={1.5} />
          <line x1={426} y1={448} x2={462} y2={448} />
          <line x1={444} y1={458} x2={444} y2={470} />
        </Spot>

        {/* 6. The uranium clock: a tiny electroplated spot (position simplified) */}
        <Spot id="uranium" label="The uranium spot" hit={[270, 506, 60, 60]} {...spot}>
          <circle cx={300} cy={536} r={11} strokeDasharray="2 3" />
          <circle cx={300} cy={536} r={4} fill={ENGRAVE} fillOpacity={0.5} stroke="none" />
        </Spot>
      </g>
    </svg>
  );
}
