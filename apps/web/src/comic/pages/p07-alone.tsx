import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, Panel, Sfx, Stars, Waves } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  quiet: ["It's very quiet", "out here."],
  listen: ["Sometimes I miss my", "twin. But I keep", "listening for home."],
  farthest: ["Wait... nobody has", "ever been this far.", "I'm the farthest!"],
  gift: ["The farthest any human-made", "object has ever travelled."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Alone in the dark. ${[...say.quiet, ...say.listen, ...say.farthest].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#030409">
        <Stars x={40} y={40} w={600} h={260} n={14} seed={79} />
        <Voyager x={470} y={190} scale={0.3} mood="sad" look="left" />
        <Caption x={52} y={52} text="The 1990s · year after year" />
        <Bubble x={300} y={96} lines={say.quiet} size={14} tail={[452, 160]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#070812">
        <Stars x={40} y={318} w={294} h={292} n={18} seed={83} />
        <circle cx={66} cy={584} r={6} fill="#4a86e8" stroke="#111" strokeWidth={2} />
        <Waves x={70} y={580} r={26} n={4} angle={-40} color="#9cc3e0" />
        <Voyager x={220} y={500} scale={0.58} mood="teary" look="left" />
        <Bubble x={52} y={330} lines={say.listen} size={14} tail={[200, 444]} />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#120f22">
        <Stars x={346} y={318} w={294} h={292} n={30} seed={89} />
        <Voyager x={493} y={530} scale={0.6} mood="wow" />
        <Bubble x={358} y={330} lines={say.farthest} size={14} tail={[480, 470]} />
        <Sfx x={566} y={440} text="Ding!" size={28} />
        <Caption x={358} y={578} text="17 February 1998" />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page07: ComicPageData = {
  id: "alone",
  chapter: 7,
  title: "Alone in the dark",
  years: "1990–1998",
  speech: [say.quiet, say.listen, say.farthest, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/most-distant.jpg",
    alt: "An illustration of the Voyager spacecraft with its large white dish antenna, against a field of stars",
    credit: "NASA/JPL-Caltech (PIA17049)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA17049",
    facts: [
      "On 17 February 1998, Voyager 1 overtook Pioneer 10 to become the most distant human-made object, about 69 times Earth's distance from the Sun.",
      "It travels at about 17 kilometres per second relative to the Sun.",
      "It has broken its own distance record every day since.",
    ],
  },
  Art,
};
