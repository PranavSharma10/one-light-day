// Voyager, the character. Its dish antenna is its face (it's how Voyager talks to us),
// the antenna feed is a tuft of hair, the magnetometer boom is a waving arm, and the
// Golden Record sits on its chest. Drawn at natural size around the dish centre (0, 0).

export type Mood =
  | "happy"
  | "wow"
  | "proud"
  | "teary"
  | "sad"
  | "scared"
  | "tired"
  | "confused"
  | "brave";

export type Look = "center" | "left" | "right" | "up" | "down";

interface Props {
  x: number;
  y: number;
  scale?: number;
  mood?: Mood;
  look?: Look;
  twin?: boolean; // Voyager 2: same design, blue body
  wave?: boolean;
  flip?: boolean; // mirror left-right
}

const INK = "#111";
const DISH = "#f4f1e8";
const GOLD = "#e9c46a";
const BLUSH = "#f2a1a1";
const TEAR = "#8fb8ff";
const MOUTH = "#5c1f1f";
const BOOM = "#d9d4c5";

/** A boom drawn twice, dark then light, so it shows against both paper and black space. */
function Boom({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" strokeWidth={8} />
      <path d={d} fill="none" stroke={BOOM} strokeWidth={3.5} />
    </>
  );
}

const LOOK: Record<Look, [number, number]> = {
  center: [0, 0],
  left: [-4, 0],
  right: [4, 0],
  up: [0, -4],
  down: [0, 4],
};

export default function Voyager({
  x,
  y,
  scale = 1,
  mood = "happy",
  look = "center",
  twin = false,
  wave = false,
  flip = false,
}: Props) {
  const body = twin ? "#5f8fb0" : "#b8862f";
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      stroke={INK}
      strokeWidth={3.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* magnetometer boom: the waving arm */}
      <g className={wave ? "vg-wave" : undefined}>
        <Boom d="M30 66 L108 18" />
        <circle cx={112} cy={15} r={9} fill={DISH} />
      </g>
      {/* power-source boom: the other arm */}
      <Boom d="M-30 72 L-90 94" />
      <rect x={-114} y={86} width={26} height={18} rx={5} fill="#9a9a9a" />
      {/* body, with the Golden Record on its chest */}
      <polygon points="-38,58 38,58 46,74 38,92 -38,92 -46,74" fill={body} />
      <circle cx={0} cy={75} r={12} fill={GOLD} />
      <circle cx={0} cy={75} r={4} fill="#5c4313" strokeWidth={2} />
      {/* antenna feed: a tuft of hair */}
      <Boom d="M0 -60 L0 -80" />
      <circle cx={0} cy={-84} r={6} fill={GOLD} />
      {/* the dish: Voyager's face */}
      <circle r={62} fill={DISH} />
      <circle r={48} fill="none" stroke="#d6cfba" strokeWidth={2} />
      <Face mood={mood} look={LOOK[look]} />
    </g>
  );
}

function Face({ mood, look: [px, py] }: { mood: Mood; look: [number, number] }) {
  const wide = mood === "wow" || mood === "scared";
  const eyeRy = wide ? 17 : 14;
  const pupil = wide ? 4.5 : 6.5;
  const down = mood === "teary" || mood === "sad" || mood === "tired" ? 3 : 0;
  const cheeks = mood === "happy" || mood === "proud" || mood === "brave" || mood === "wow";

  return (
    <g>
      {mood === "proud" ? (
        // eyes closed in a happy squint
        <>
          <path d="M-31 -6 Q-20 -19 -9 -6" fill="none" strokeWidth={4} />
          <path d="M9 -6 Q20 -19 31 -6" fill="none" strokeWidth={4} />
        </>
      ) : (
        <g className="vg-eyes">
          {[-20, 20].map((ex) => {
            const ry = mood === "confused" && ex > 0 ? 10 : eyeRy;
            return (
              <g key={ex}>
                <ellipse cx={ex} cy={-8} rx={11} ry={ry} fill="#fff" />
                <circle cx={ex + px} cy={-6 + py + down} r={pupil} fill={INK} stroke="none" />
                <circle cx={ex + px + 2} cy={-9 + py + down} r={2.2} fill="#fff" stroke="none" />
                {mood === "tired" && <path d={`M${ex - 12} -8 A12 12 0 0 1 ${ex + 12} -8 Z`} fill={DISH} />}
              </g>
            );
          })}
        </g>
      )}

      {/* eyebrows */}
      {mood === "brave" && (
        <>
          <path d="M-33 -29 L-10 -23" />
          <path d="M33 -29 L10 -23" />
        </>
      )}
      {(mood === "sad" || mood === "teary") && (
        <>
          <path d="M-31 -24 L-10 -29" />
          <path d="M31 -24 L10 -29" />
        </>
      )}
      {mood === "scared" && (
        <>
          <path d="M-31 -31 Q-20 -38 -9 -31" fill="none" />
          <path d="M9 -31 Q20 -38 31 -31" fill="none" />
        </>
      )}
      {mood === "confused" && (
        <>
          <path d="M-31 -27 Q-20 -35 -9 -27" fill="none" />
          <path d="M10 -22 L30 -24" />
        </>
      )}

      {cheeks && (
        <>
          <ellipse cx={-34} cy={14} rx={7} ry={4} fill={BLUSH} stroke="none" />
          <ellipse cx={34} cy={14} rx={7} ry={4} fill={BLUSH} stroke="none" />
        </>
      )}

      <Mouth mood={mood} />

      {mood === "teary" && <path d="M-31 6 Q-35 18 -29 22 Q-23 18 -31 6 Z" fill={TEAR} strokeWidth={2} />}
      {mood === "scared" && <path d="M44 -36 Q40 -26 46 -23 Q52 -26 44 -36 Z" fill={TEAR} strokeWidth={2} />}
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case "wow":
      return <ellipse cx={0} cy={24} rx={9} ry={11} fill={MOUTH} />;
    case "proud":
      return <path d="M-16 15 Q0 37 16 15 Z" fill={MOUTH} />;
    case "brave":
      return <path d="M-14 19 Q2 31 15 14" fill="none" strokeWidth={3} />;
    case "teary":
      return <path d="M-12 25 Q-6 20 0 25 Q6 30 12 25" fill="none" strokeWidth={3} />;
    case "sad":
      return <path d="M-12 27 Q0 17 12 27" fill="none" strokeWidth={3} />;
    case "scared":
      return <path d="M-15 25 l5 -4 l5 4 l5 -4 l5 4 l5 -4" fill="none" strokeWidth={3} />;
    case "tired":
      return <path d="M-10 23 L10 23" fill="none" strokeWidth={3} />;
    case "confused":
      return <path d="M-12 23 Q-5 17 1 23 T14 23" fill="none" strokeWidth={3} />;
    default:
      return <path d="M-13 17 Q0 31 13 17" fill="none" strokeWidth={3} />;
  }
}
