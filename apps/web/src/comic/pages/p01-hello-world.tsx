import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Earth, Gift, INK, Panel, Sfx, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  launch: ["Here I go!", "Hold on tight,", "Golden Record!"],
  hello: ["Hi! I'm Voyager 1.", "I'm off to meet", "the giant planets!"],
  twin: ["My twin left 16 days", "before me. But I'm", "faster. I'll catch up!"],
  gift: ["The first step of the longest journey", "anything made by people has ever taken."],
};

/** A Titan IIIE-Centaur, cartoon style: core stage, two side boosters, payload fairing. */
function Rocket({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      {/* flames */}
      <path d={`M${x - 26} ${y} Q${x - 30} ${y + 50} ${x - 19} ${y + 90} Q${x - 10} ${y + 50} ${x - 12} ${y}`} fill="#ff8a3d" />
      <path d={`M${x + 12} ${y} Q${x + 10} ${y + 50} ${x + 19} ${y + 90} Q${x + 30} ${y + 50} ${x + 26} ${y}`} fill="#ff8a3d" />
      <path d={`M${x - 10} ${y} Q${x - 14} ${y + 70} ${x} ${y + 120} Q${x + 14} ${y + 70} ${x + 10} ${y}`} fill="#ffd84d" />
      {/* side boosters */}
      <path d={`M${x - 33} ${y} V${y - 110} Q${x - 26} ${y - 128} ${x - 19} ${y - 110} V${y} Z`} fill="#e9e4d8" />
      <path d={`M${x + 19} ${y} V${y - 110} Q${x + 26} ${y - 128} ${x + 33} ${y - 110} V${y} Z`} fill="#e9e4d8" />
      {/* core stage and Centaur */}
      <rect x={x - 12} y={y - 150} width={24} height={150} fill="#f4f1e8" />
      <rect x={x - 12} y={y - 70} width={24} height={10} fill="#3b3b3b" />
      {/* payload fairing: Voyager is inside */}
      <path d={`M${x - 14} ${y - 150} V${y - 175} Q${x} ${y - 205} ${x + 14} ${y - 175} V${y - 150} Z`} fill="#f4f1e8" />
    </g>
  );
}

function Art() {
  return (
    <ComicPage height={720} label={`Hello, world! ${[...say.launch, ...say.hello, ...say.twin].join(" ")}`}>
      {/* Panel 1: lift-off */}
      <Panel x={40} y={40} w={600} h={260} sky="#1b2647">
        <Stars x={40} y={40} w={600} h={150} n={24} seed={3} />
        <rect x={40} y={262} width={600} height={40} fill="#2a2a2e" />
        {/* the launch tower */}
        <g stroke="#6b6b70" strokeWidth={3}>
          <line x1={232} y1={80} x2={232} y2={262} />
          <line x1={252} y1={80} x2={252} y2={262} />
          {[100, 130, 160, 190, 220, 250].map((y) => (
            <line key={y} x1={232} y1={y} x2={252} y2={y - 20} />
          ))}
        </g>
        <Rocket x={312} y={252} />
        {/* smoke */}
        <g fill="#f4f1e8" stroke={INK} strokeWidth={3}>
          {[
            [250, 282, 22],
            [282, 290, 26],
            [345, 290, 26],
            [378, 282, 22],
            [312, 296, 28],
          ].map(([cx, cy, r]) => (
            <circle key={cx} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <Caption x={52} y={52} text="5 September 1977 · Cape Canaveral" />
        <Bubble x={420} y={84} lines={say.launch} tail={[336, 102]} />
        <Sfx x={440} y={244} text="Whoosh!" size={40} />
      </Panel>

      {/* Panel 2: hello */}
      <Panel x={40} y={318} w={294} h={292}>
        <Stars x={40} y={318} w={294} h={200} n={26} seed={11} />
        <Earth x={72} y={612} r={92} />
        <Voyager x={196} y={500} scale={0.72} mood="happy" wave />
        <Bubble x={52} y={330} lines={say.hello} tail={[178, 432]} />
      </Panel>

      {/* Panel 3: the twin */}
      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={34} seed={19} />
        <Voyager x={598} y={396} scale={0.3} mood="happy" twin look="left" />
        <text x={566} y={450} fontFamily="'Comic Neue', cursive" fontWeight={700} fontSize={12} fill="#9cc3e0">
          my twin!
        </text>
        <Voyager x={452} y={508} scale={0.62} mood="brave" look="right" />
        <Bubble x={358} y={330} lines={say.twin} size={14} tail={[438, 452]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page01: ComicPageData = {
  id: "hello-world",
  chapter: 1,
  title: "Hello, world!",
  years: "1977",
  speech: [say.launch, say.hello, say.twin, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/launch.jpg",
    alt: "A Titan IIIE-Centaur rocket lifting off from Cape Canaveral on a column of flame, carrying Voyager 1",
    credit: "NASA/JPL-Caltech/KSC (PIA21746)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA21746",
    facts: [
      "Voyager 1 launched on 5 September 1977 on a Titan IIIE-Centaur rocket from Cape Canaveral, Florida.",
      "Its twin, Voyager 2, launched first, on 20 August 1977. Voyager 1 took a faster path and overtook it by December.",
      "Both spacecraft were built at NASA's Jet Propulsion Laboratory in Pasadena, California.",
    ],
  },
  Art,
};
