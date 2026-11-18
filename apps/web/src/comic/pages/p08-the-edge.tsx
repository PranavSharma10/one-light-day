import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, Panel, Sfx, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  slow: ["Whoa! The solar wind", "just slowed right down!"],
  push: ["Almost... there..."],
  outside: ["I'm outside the", "Sun's bubble!", "Hello, stars!"],
  gift: ["The first measurements ever made", "of the space between the stars."],
};

/** A scatter of small particles: gold ones from the Sun, blue ones from the galaxy. */
function Particles({ x, y, w, h, color, seed }: { x: number; y: number; w: number; h: number; color: string; seed: number }) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return (
    <g fill={color}>
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={x + rnd() * w} cy={y + rnd() * h} r={1.5 + rnd() * 1.5} />
      ))}
    </g>
  );
}

function Art() {
  return (
    <ComicPage height={720} label={`The edge. ${[...say.slow, ...say.push, ...say.outside].join(" ")}`}>
      {/* The Sun's bubble, seen from outside */}
      <Panel x={40} y={40} w={600} h={260} sky="#0b0d1a">
        <Stars x={40} y={40} w={600} h={260} n={24} seed={97} />
        <ellipse cx={210} cy={170} rx={250} ry={160} fill="#d9b45a" fillOpacity={0.1} stroke="#e9d49a" strokeWidth={3} strokeDasharray="10 8" />
        <circle cx={130} cy={170} r={14} fill="#ffd84d" stroke="#111" strokeWidth={3} />
        <Particles x={60} y={60} w={340} h={220} color="#e9c46a" seed={5} />
        <Voyager x={420} y={140} scale={0.45} mood="wow" look="right" />
        <Sfx x={470} y={250} text="Bump!" size={30} />
        <Caption x={52} y={52} text="December 2004 · the solar wind slows" />
        <Bubble x={444} y={56} lines={say.slow} size={13} tail={[452, 120]} />
      </Panel>

      {/* Pushing through the edge */}
      <Panel x={40} y={318} w={294} h={292} sky="#0b0d1a">
        <Particles x={40} y={330} w={130} h={270} color="#e9c46a" seed={7} />
        <Particles x={200} y={330} w={130} h={270} color="#7cc1e8" seed={9} />
        <path d="M186 318 Q170 464 186 610" fill="none" stroke="#e9d49a" strokeWidth={3} strokeDasharray="10 8" />
        <Voyager x={186} y={500} scale={0.55} mood="brave" look="right" />
        <Bubble x={52} y={340} lines={say.push} size={14} tail={[160, 448]} />
        <Caption x={52} y={578} text="25 August 2012" />
      </Panel>

      {/* Outside */}
      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={60} seed={101} />
        <Voyager x={493} y={530} scale={0.6} mood="proud" />
        <Bubble x={358} y={330} lines={say.outside} size={14} tail={[480, 470]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page08: ComicPageData = {
  id: "the-edge",
  chapter: 8,
  title: "The edge",
  years: "2004–2012",
  speech: [say.slow, say.push, say.outside, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/heliopause.jpg",
    alt: "An illustration of Voyager 1 entering interstellar space, with an orange glow of interstellar gas ahead of it",
    credit: "NASA/JPL-Caltech (PIA17462)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA17462",
    facts: [
      "In December 2004, at about 94 times Earth's distance from the Sun, Voyager 1 crossed the termination shock, where the solar wind suddenly slows.",
      "On 25 August 2012, at about 121.6 times Earth's distance, it crossed the heliopause, the edge of the Sun's bubble.",
      "The key evidence that it had left was a jump in the density of the gas around it, measured by its plasma wave instrument.",
    ],
  },
  Art,
};
