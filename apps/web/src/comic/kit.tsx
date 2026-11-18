// The comic kit: the building blocks every page is made from.
import { useId, type ReactNode } from "react";

export const INK = "#111";
export const PAPER = "#f5efe0";
export const YELLOW = "#ffd84d";
export const SPACE = "#0b0d1a";
export const SPEECH_FONT = "'Comic Neue', 'Comic Sans MS', cursive";
export const SFX_FONT = "Bangers, Impact, sans-serif";

/** Rough width of a line of Comic Neue, used to size boxes around text. */
const textWidth = (text: string, size: number) => text.length * size * 0.53;

/** A whole comic page: paper background, 680 units wide. */
export function ComicPage({ height, label, children }: { height: number; label: string; children: ReactNode }) {
  return (
    <svg className="comic-page" viewBox={`0 0 680 ${height}`} role="img" aria-label={label}>
      <defs>
        <pattern id="halftone" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#fff" opacity="0.13" />
        </pattern>
      </defs>
      <rect width={680} height={height} rx={14} fill={PAPER} />
      {children}
    </svg>
  );
}

/** A panel: a framed window. Anything inside is clipped to the frame. */
export function Panel(props: { x: number; y: number; w: number; h: number; sky?: string; children?: ReactNode }) {
  const { x, y, w, h, sky = SPACE, children } = props;
  const clip = "clip" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      <clipPath id={clip}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect x={x} y={y} width={w} height={h} fill={sky} />
        <rect x={x} y={y} width={w} height={h} fill="url(#halftone)" />
        {children}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
}

/** A yellow caption box: where and when. */
export function Caption({ x, y, text, size = 13 }: { x: number; y: number; text: string; size?: number }) {
  const w = textWidth(text, size) + 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={size + 12} fill={YELLOW} stroke={INK} strokeWidth={2.5} />
      <text x={x + 9} y={y + size + 4} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={size} fill={INK}>
        {text}
      </text>
    </g>
  );
}

/** A speech bubble. `tail` is the point the bubble's tail aims at (the speaker). */
export function Bubble(props: { x: number; y: number; lines: string[]; tail: [number, number]; size?: number }) {
  const { x, y, lines, tail, size = 15 } = props;
  const w = Math.max(...lines.map((l) => textWidth(l, size))) + 26;
  const lineH = size + 5;
  const h = lines.length * lineH + 16;
  const [tx, ty] = tail;

  // The tail leaves from whichever side faces the speaker. Its base is tucked 3 units
  // inside the border so the white fill hides the border line where they join.
  let tailPath: string;
  if (ty > y + h || ty < y) {
    const baseY = ty > y + h ? y + h - 3 : y + 3;
    const bx = Math.min(Math.max(tx, x + 22), x + w - 34);
    tailPath = `M${bx} ${baseY} L${tx} ${ty} L${bx + 16} ${baseY}`;
  } else {
    const baseX = tx < x ? x + 3 : x + w - 3;
    const by = Math.min(Math.max(ty, y + 10), y + h - 26);
    tailPath = `M${baseX} ${by} L${tx} ${ty} L${baseX} ${by + 16}`;
  }

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#fff" stroke={INK} strokeWidth={2.5} />
      <path d={tailPath} fill="#fff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      {lines.map((line, i) => (
        <text key={i} x={x + 13} y={y + 8 + size + i * lineH} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={size} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

/** A sound effect: WHOOSH! */
export function Sfx({ x, y, text, size = 34, color = YELLOW }: { x: number; y: number; text: string; size?: number; color?: string }) {
  return (
    <text x={x} y={y} fontFamily={SFX_FONT} fontSize={size} fill={color} stroke={INK} strokeWidth={1.5} paintOrder="stroke" letterSpacing={1}>
      {text}
    </text>
  );
}

/** The "Gift to humanity" card at the bottom of each page. */
export function Gift({ y, lines }: { y: number; lines: string[] }) {
  return (
    <g>
      <rect x={40} y={y} width={600} height={72} fill={YELLOW} stroke={INK} strokeWidth={4} />
      <text x={56} y={y + 44} fontFamily={SFX_FONT} fontSize={26} fill={INK} letterSpacing={0.5}>
        Gift to humanity
      </text>
      {lines.map((line, i) => (
        <text key={i} x={250} y={y + 32 + i * 22} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={14} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

/** A scatter of stars, the same every time (seeded). */
export function Stars({ x, y, w, h, n = 30, seed = 7 }: { x: number; y: number; w: number; h: number; n?: number; seed?: number }) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return (
    <g fill="#fff">
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + rnd() * w} cy={y + rnd() * h} r={rnd() < 0.15 ? 1.8 : 1} opacity={0.5 + rnd() * 0.5} />
      ))}
    </g>
  );
}

/** Planet Earth, cartoon style. */
export function Earth({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g stroke={INK} strokeWidth={4}>
      <circle cx={x} cy={y} r={r} fill="#2f6fd0" />
      <path
        d={`M${x - r * 0.6} ${y - r * 0.35} q${r * 0.25} ${-r * 0.25} ${r * 0.5} 0 q${r * 0.15} ${r * 0.2} ${r * 0.45} ${-r * 0.05}`}
        fill="#4fa35a"
        strokeWidth={3}
      />
      <path d={`M${x - r * 0.2} ${y + r * 0.2} q${r * 0.3} ${-r * 0.15} ${r * 0.55} ${r * 0.1} q${-r * 0.1} ${r * 0.3} ${-r * 0.45} ${r * 0.15} z`} fill="#4fa35a" strokeWidth={3} />
    </g>
  );
}

// ---- More scenery ----------------------------------------------------------

/** The Golden Record, drawn: gold disc, grooves, label. */
export function GoldRecord({ x, y, r, spin = false }: { x: number; y: number; r: number; spin?: boolean }) {
  return (
    <g className={spin ? "spin-slow" : undefined} stroke={INK} strokeWidth={3}>
      <circle cx={x} cy={y} r={r} fill="#d9b45a" />
      {[0.86, 0.74, 0.62].map((f) => (
        <circle key={f} cx={x} cy={y} r={r * f} fill="none" stroke="#9c7a2e" strokeWidth={1.5} />
      ))}
      <circle cx={x} cy={y} r={r * 0.4} fill="#f4f1e8" />
      <path d={`M${x - r * 0.25} ${y - r * 0.1} h${r * 0.5}`} stroke="#5c4313" strokeWidth={2} />
      <path d={`M${x - r * 0.18} ${y + r * 0.08} h${r * 0.36}`} stroke="#5c4313" strokeWidth={2} />
      <circle cx={x} cy={y} r={r * 0.05} fill={INK} />
    </g>
  );
}

/** Jupiter with its stripes and the Great Red Spot. */
export function Jupiter({ x, y, r }: { x: number; y: number; r: number }) {
  const band = (dy: number, ry: number, fill: string) => {
    const half = Math.sqrt(Math.max(0, r * r - dy * dy)) - 2;
    return <ellipse cx={x} cy={y + dy} rx={half} ry={ry} fill={fill} stroke="none" />;
  };
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#d9a066" stroke={INK} strokeWidth={4} />
      {band(-r * 0.55, r * 0.07, "#b9733f")}
      {band(-r * 0.25, r * 0.09, "#e8c48e")}
      {band(r * 0.05, r * 0.08, "#b9733f")}
      {band(r * 0.35, r * 0.09, "#e8c48e")}
      {band(r * 0.62, r * 0.06, "#b9733f")}
      <ellipse cx={x + r * 0.3} cy={y + r * 0.22} rx={r * 0.2} ry={r * 0.11} fill="#c2452d" stroke={INK} strokeWidth={2.5} />
    </g>
  );
}

/** Io, Jupiter's volcanic moon, optionally erupting. */
export function Io({ x, y, r, erupting = false }: { x: number; y: number; r: number; erupting?: boolean }) {
  return (
    <g stroke={INK} strokeWidth={3}>
      {erupting && (
        <g className="erupt">
          <path d={`M${x - r * 1.1} ${y - r * 0.7} Q${x} ${y - r * 3.2} ${x + r * 1.1} ${y - r * 0.7}`} fill="#ff8a3d" fillOpacity={0.35} stroke="#ff8a3d" strokeWidth={3} />
          <path d={`M${x} ${y - r} L${x} ${y - r * 2.1}`} stroke="#ff8a3d" strokeWidth={4} />
        </g>
      )}
      <circle cx={x} cy={y} r={r} fill="#f2d14b" />
      <circle cx={x - r * 0.35} cy={y + r * 0.2} r={r * 0.18} fill="#c2452d" strokeWidth={2} />
      <circle cx={x + r * 0.3} cy={y - r * 0.3} r={r * 0.12} fill="#8a5a1c" strokeWidth={2} />
    </g>
  );
}

/** Saturn with rings: back half of the ring, the planet, then the front half over it. */
export function Saturn({ x, y, r }: { x: number; y: number; r: number }) {
  const rx = r * 2.1;
  const ry = r * 0.55;
  return (
    <g stroke={INK} strokeWidth={4}>
      <path d={`M${x - rx} ${y} A${rx} ${ry} 0 0 1 ${x + rx} ${y}`} fill="none" stroke="#e8d3a1" strokeWidth={14} />
      <circle cx={x} cy={y} r={r} fill="#e3c27a" />
      <ellipse cx={x} cy={y - r * 0.35} rx={r * 0.9} ry={r * 0.08} fill="#cfa55a" stroke="none" />
      <ellipse cx={x} cy={y + r * 0.3} rx={r * 0.92} ry={r * 0.08} fill="#cfa55a" stroke="none" />
      <path d={`M${x - rx} ${y} A${rx} ${ry} 0 0 0 ${x + rx} ${y}`} fill="none" stroke="#e8d3a1" strokeWidth={14} />
      <path d={`M${x - rx} ${y} A${rx} ${ry} 0 0 0 ${x + rx} ${y}`} fill="none" stroke={INK} strokeWidth={2} />
    </g>
  );
}

/** A hazy orange moon: Titan. */
export function Titan({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.18} fill="#e8a24a" opacity={0.35} />
      <circle cx={x} cy={y} r={r} fill="#d98c3a" stroke={INK} strokeWidth={3} />
      <path d={`M${x - r * 0.7} ${y - r * 0.2} q${r * 0.7} ${-r * 0.25} ${r * 1.4} 0`} fill="none" stroke="#f0b866" strokeWidth={3} />
    </g>
  );
}

/** A sunlit crescent, for Earth or the Moon seen from far away. */
export function Crescent({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} A${r * 0.55} ${r} 0 0 0 ${x} ${y - r} Z`}
      fill={fill}
      stroke={INK}
      strokeWidth={2}
    />
  );
}

/** A snapshot: a photo Voyager took, in a white frame. Children are drawn inside. */
export function Snapshot(props: { x: number; y: number; w: number; h: number; tilt?: number; children?: ReactNode }) {
  const { x, y, w, h, tilt = 0, children } = props;
  return (
    <g transform={`rotate(${tilt} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h + 26} fill="#fff" stroke={INK} strokeWidth={3} />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 10} fill="#05060c" />
      {children}
    </g>
  );
}

/** A thought bubble: a cloud with little trailing circles. */
export function Thought(props: { x: number; y: number; w: number; h: number; from: [number, number]; children?: ReactNode }) {
  const { x, y, w, h, from, children } = props;
  const cx = x + w / 2;
  const cy = y + h;
  return (
    <g stroke={INK} strokeWidth={2.5} fill="#fff">
      <rect x={x} y={y} width={w} height={h} rx={h / 2.4} />
      <circle cx={(cx * 2 + from[0]) / 3} cy={(cy * 2 + from[1]) / 3} r={7} />
      <circle cx={(cx + from[0] * 2) / 3} cy={(cy + from[1] * 2) / 3} r={4.5} />
      {children}
    </g>
  );
}

/** Little icons for the sounds of Earth. */
export function Note({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={2.5} fill={YELLOW}>
      <path d="M6 -2 V-30 L18 -24" fill="none" strokeWidth={6} />
      <path d="M6 -2 V-30 L18 -24" fill="none" stroke={YELLOW} strokeWidth={2.5} />
      <ellipse cx={0} cy={0} rx={7} ry={5} transform="rotate(-20)" />
    </g>
  );
}
export function Bolt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <polygon
      transform={`translate(${x} ${y}) scale(${s})`}
      points="6,-24 -8,2 2,2 -4,24 12,-4 2,-4"
      fill={YELLOW}
      stroke={INK}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}
export function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={2.5}>
      <ellipse cx={0} cy={0} rx={13} ry={9} fill="#7cc1e8" />
      <circle cx={10} cy={-8} r={6} fill="#7cc1e8" />
      <path d="M15 -9 l7 2 l-7 2" fill="#ffb347" />
      <path d="M-4 -2 q-10 -12 -18 -4" fill="#5aa8d6" />
      <circle cx={11} cy={-9} r={1.3} fill={INK} stroke="none" />
    </g>
  );
}
