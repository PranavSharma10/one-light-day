import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, Panel, Saturn, Stars, Titan } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  saturn: ["Saturn!"],
  choice: ["If I fly close to", "Titan, I'll be flung", "away from all the", "other planets.", "I'll never see them."],
  go: ["You go on to Uranus", "and Neptune, twin.", "I'll go see Titan."],
  twin: ["Be brave!", "I'll miss you!"],
  gift: ["Titan's thick orange sky: a world", "a later spacecraft went back to land on."],
};

function Art() {
  return (
    <ComicPage height={720} label={`The hardest choice. ${[...say.saturn, ...say.choice, ...say.go, ...say.twin].join(" ")}`}>
      {/* Saturn and Titan */}
      <Panel x={40} y={40} w={294} h={292} sky="#120f22">
        <Stars x={40} y={40} w={294} h={292} n={26} seed={59} />
        <Saturn x={178} y={178} r={50} />
        <Titan x={282} y={262} r={20} />
        <Voyager x={95} y={278} scale={0.4} mood="wow" look="right" />
        <Caption x={52} y={52} text="November 1980 · Saturn" />
        <Bubble x={140} y={286} lines={say.saturn} tail={[122, 300]} />
      </Panel>

      {/* The choice */}
      <Panel x={346} y={40} w={294} h={292} sky="#070812">
        <Stars x={346} y={40} w={294} h={292} n={30} seed={61} />
        <Titan x={604} y={86} r={16} />
        <Voyager x={493} y={252} scale={0.6} mood="sad" look="up" />
        <Bubble x={358} y={52} lines={say.choice} size={14} tail={[478, 196]} />
      </Panel>

      {/* Two twins, two paths */}
      <Panel x={40} y={350} w={600} h={260}>
        <Stars x={40} y={350} w={600} h={260} n={40} seed={67} />
        <path d="M240 446 Q300 390 380 372" fill="none" stroke="#ffd84d" strokeWidth={3} strokeDasharray="8 7" />
        <path d="M528 520 L632 540" fill="none" stroke="#9cc3e0" strokeWidth={3} strokeDasharray="8 7" />
        <Voyager x={180} y={500} scale={0.6} mood="brave" look="right" />
        <Voyager x={468} y={507} scale={0.55} mood="teary" twin look="left" />
        <Bubble x={52} y={362} lines={say.go} size={14} tail={[170, 444]} />
        <Bubble x={500} y={380} lines={say.twin} size={14} tail={[478, 452]} />
        <Caption x={262} y={572} text="Two twins, two paths" />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page05: ComicPageData = {
  id: "hardest-choice",
  chapter: 5,
  title: "The hardest choice",
  years: "1980",
  speech: [say.saturn, say.choice, say.go, say.twin, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/saturn.jpg",
    alt: "Saturn as a thin crescent, its rings and their shadows seen from behind the planet as Voyager 1 departed",
    credit: "NASA/JPL/USGS (PIA00335)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA00335",
    facts: [
      "Voyager 1 flew close past Titan on 12 November 1980 and found an atmosphere thicker than Earth's, made mostly of nitrogen.",
      "That flyby bent its path up and out of the plane of the planets, so it could never visit another planet.",
      "Voyager 2 carried on to Uranus in 1986 and Neptune in 1989.",
      "In 2005, the Huygens probe landed on Titan.",
    ],
  },
  Art,
};
