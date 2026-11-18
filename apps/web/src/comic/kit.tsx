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
