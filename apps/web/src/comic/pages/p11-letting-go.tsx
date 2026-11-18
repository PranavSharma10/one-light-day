import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, INK, Panel, Sfx, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  goodbye: ["Goodbye, old friend.", "You worked for", "49 years."],
  letgo: ["I'll let go of some", "things, so I can", "keep going."],
  silence: ["..."],
  back: ["I fixed it myself.", "I'm still here!"],
  gift: ["Every watt saved means", "more years of science."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Letting go. ${[...say.goodbye, ...say.letgo, ...say.back].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#0b0d1a">
        <Stars x={40} y={40} w={600} h={260} n={24} seed={137} />
        {/* the instrument, its light going out */}
        <g stroke={INK} strokeWidth={3}>
          <rect x={200} y={176} width={70} height={48} rx={6} fill="#9a9a9a" />
          <circle cx={235} cy={200} r={9} fill="#3b3b3b" />
        </g>
        <Sfx x={196} y={160} text="click" size={24} color="#e9d49a" />
        <Voyager x={440} y={170} scale={0.78} mood="sad" look="left" />
        <Caption x={52} y={52} text="April 2026" />
        <Bubble x={52} y={232} lines={say.goodbye} size={13} tail={[200, 230]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#070812">
        <Stars x={40} y={318} w={294} h={292} n={30} seed={139} />
        <Voyager x={187} y={530} scale={0.6} mood="brave" />
        <Bubble x={52} y={330} lines={say.letgo} size={14} tail={[176, 470]} />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#030409">
        <Stars x={346} y={318} w={294} h={292} n={12} seed={149} />
        <Bubble x={362} y={340} lines={say.silence} tail={[420, 384]} />
        <Sfx x={480} y={372} text="Beep!" size={28} />
        <Voyager x={493} y={530} scale={0.6} mood="proud" />
        <Bubble x={372} y={404} lines={say.back} size={13} tail={[474, 470]} />
        <Caption x={358} y={578} text="October 2026 · two days of silence" size={12} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page11: ComicPageData = {
  id: "letting-go",
  chapter: 11,
  title: "Letting go",
  years: "2026",
  speech: [say.goodbye, say.letgo, say.back, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/power-2026.jpg",
    alt: "An artist's illustration of a Voyager probe speeding away through space",
    credit: "NASA/JPL-Caltech (PIA26353)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA26353",
    facts: [
      "Voyager's nuclear power source makes about 4 watts less each year, and now produces less than half of what it did at launch.",
      "On 17 April 2026, after an unexpected power drop, engineers switched off the Low-energy Charged Particles experiment, which had run almost without a break since 1977.",
      "On 18 and 19 October 2026 the Deep Space Network couldn't hear Voyager 1. On 20 October its signal came back on its own, before engineers sent any commands.",
    ],
  },
  Art,
};
