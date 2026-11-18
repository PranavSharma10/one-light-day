import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, Io, Jupiter, Panel, Sfx, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  whoa: ["Whoa! You're", "enormous!"],
  volcano: ["A volcano!"],
  first: ["Nobody had ever seen", "a volcano beyond", "Earth before!"],
  gift: ["The first active volcanoes ever seen", "anywhere beyond Earth."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Jupiter! ${[...say.whoa, ...say.volcano, ...say.first].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260}>
        <Stars x={40} y={40} w={600} h={260} n={30} seed={43} />
        <Jupiter x={470} y={232} r={172} />
        <Voyager x={140} y={174} scale={0.7} mood="wow" look="right" />
        <Caption x={52} y={52} text="5 March 1979 · Jupiter" />
        <Bubble x={182} y={88} lines={say.whoa} tail={[164, 150]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#120d1f">
        <Stars x={40} y={318} w={294} h={292} n={22} seed={47} />
        <Io x={180} y={480} r={40} erupting />
        <Sfx x={56} y={392} text="Fwoom!" size={32} color="#ff8a3d" />
        <Voyager x={288} y={560} scale={0.38} mood="wow" look="left" />
        <Bubble x={222} y={332} lines={say.volcano} tail={[284, 520]} />
        <Caption x={52} y={578} text="Io, a moon of Jupiter" />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={34} seed={53} />
        <Voyager x={493} y={522} scale={0.62} mood="proud" />
        <Bubble x={358} y={330} lines={say.first} size={14} tail={[482, 456]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page04: ComicPageData = {
  id: "jupiter",
  chapter: 4,
  title: "Jupiter!",
  years: "1979",
  speech: [say.whoa, say.volcano, say.first, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/jupiter.jpg",
    alt: "Close-up of Jupiter's swirling clouds, with the Great Red Spot at the top and a white oval storm below it",
    credit: "NASA/JPL (PIA01512)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA01512",
    facts: [
      "Voyager 1 made its closest approach to Jupiter on 5 March 1979.",
      "It found active volcanoes on the moon Io, the first ever seen beyond Earth.",
      "It also discovered a faint ring around Jupiter and lightning in its clouds.",
    ],
  },
  Art,
};
