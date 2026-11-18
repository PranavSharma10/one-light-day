import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Dish, Earth, Gift, INK, Panel, SPEECH_FONT, Stars, Waves } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  hello: ["Hello, Voyager!"],
  hear: ["Hello! I hear you...", "a whole day later!"],
  far: ["Light is the fastest", "thing there is. Even", "light takes a day", "to reach me now."],
  gift: ["The farthest conversation", "in history."],
};

function Art() {
  return (
    <ComicPage height={720} label={`One light-day. ${[...say.far, ...say.hello, ...say.hear].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#0b0d1a">
        <Stars x={40} y={40} w={600} h={260} n={30} seed={151} />
        <Earth x={96} y={190} r={44} />
        <path d="M150 190 L520 190" stroke="#ffd84d" strokeWidth={3} strokeDasharray="4 10" />
        <rect x={290} y={198} width={88} height={26} fill="#ffd84d" stroke={INK} strokeWidth={2} />
        <text x={300} y={216} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={14} fill={INK}>
          1 light-day
        </text>
        <Voyager x={570} y={185} scale={0.42} mood="happy" look="left" />
        <Caption x={52} y={52} text="18 November 2026 · 25.9 billion km" />
        <Bubble x={384} y={52} lines={say.far} size={13} tail={[556, 162]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#1b2647">
        <Stars x={40} y={318} w={294} h={160} n={16} seed={157} />
        <rect x={40} y={560} width={294} height={50} fill="#2a2a2e" />
        <Dish x={130} y={520} s={1.3} />
        <Waves x={160} y={470} r={26} n={3} angle={-35} />
        <Bubble x={150} y={340} lines={say.hello} tail={[150, 456]} />
        <Caption x={52} y={578} text="Earth, today" />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={34} seed={163} />
        <Waves x={380} y={500} r={24} n={3} angle={0} />
        <Voyager x={510} y={530} scale={0.58} mood="proud" look="left" />
        <Bubble x={358} y={330} lines={say.hear} size={14} tail={[496, 474]} />
        <Caption x={358} y={578} text="Voyager, tomorrow" />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page12: ComicPageData = {
  id: "one-light-day",
  chapter: 12,
  title: "One light-day",
  years: "2026",
  speech: [say.far, say.hello, say.hear, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/silence-2026.jpg",
    alt: "The 70-metre Deep Space Station 14 antenna at Goldstone silhouetted against an orange sunset",
    credit: "NASA/JPL-Caltech (PIA26150)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA26150",
    facts: [
      "On 18 November 2026, Voyager 1 reached one light-day from Earth: about 25.9 billion kilometres.",
      "A command sent from Earth now takes a day to arrive, and Voyager's reply takes another day to come back.",
      "Voyager's radio is about as powerful as a fridge light bulb, so NASA listens with giant 70-metre dishes like this one in California.",
    ],
  },
  Art,
};
