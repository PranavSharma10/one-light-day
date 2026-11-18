import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Crescent, Gift, INK, Panel, SPEECH_FONT, Sfx, Snapshot, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  wait: ["Wait... let me look", "back, just once."],
  there: ["There you are.", "Both of you, together.", "Home."],
  gift: ["The first photo ever taken of Earth", "and the Moon together in one frame."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Looking back. ${[...say.wait, ...say.there].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260}>
        <Stars x={40} y={40} w={600} h={260} n={40} seed={37} />
        <Crescent x={120} y={180} r={22} fill="#4a86e8" />
        <Crescent x={170} y={128} r={9} fill="#d0d0d0" />
        <Voyager x={470} y={180} scale={0.8} mood="happy" look="left" />
        <Caption x={52} y={52} text="18 September 1977" />
        <Bubble x={250} y={60} lines={say.wait} tail={[410, 140]} />
        <Sfx x={548} y={120} text="Click!" size={32} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#1a1530">
        <Snapshot x={70} y={344} w={214} h={200} tilt={-4}>
          <Crescent x={170} y={480} r={36} fill="#4a86e8" />
          <Crescent x={226} y={398} r={13} fill="#d0d0d0" />
          <text x={92} y={566} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={14} fill={INK}>
            Earth and Moon, 1977
          </text>
        </Snapshot>
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={34} seed={41} />
        <Voyager x={493} y={522} scale={0.62} mood="teary" />
        <Bubble x={358} y={330} lines={say.there} size={14} tail={[482, 456]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page03: ComicPageData = {
  id: "looking-back",
  chapter: 3,
  title: "Looking back",
  years: "1977",
  speech: [say.wait, say.there, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/earth-moon.jpg",
    alt: "Crescent Earth and, beyond it, a smaller crescent Moon against black space, photographed together by Voyager 1",
    credit: "NASA/JPL (PIA00013)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA00013",
    fit: "contain",
    facts: [
      "Voyager 1 took this picture on 18 September 1977, 13 days after launch, from 11.66 million km away.",
      "It was the first image ever to show the whole Earth and Moon together in a single frame.",
      "The Moon was brightened three times so it would show up next to the much brighter Earth.",
    ],
  },
  Art,
};
