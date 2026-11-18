import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Earth, Gift, Panel, Puff, Sfx, Stars, Waves } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  tired: ["My thrusters are", "wearing out. I can't", "keep my dish on home..."],
  earth: ["Message from Earth:", "Try your old thrusters,", "the ones from Saturn!"],
  works: ["They work! After", "37 years asleep!", "Thank you, friends!"],
  gift: ["Proof that teamwork works across", "more than 20 billion kilometres."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Getting old. ${[...say.tired, ...say.earth, ...say.works].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#0b0d1a">
        <Stars x={40} y={40} w={600} h={260} n={28} seed={103} />
        <g transform="rotate(-14 420 170)">
          <Voyager x={420} y={170} scale={0.72} mood="tired" look="down" />
        </g>
        <Puff x={300} y={250} s={0.6} />
        <Sfx x={268} y={234} text="pff..." size={22} color="#e9d49a" />
        <Caption x={52} y={52} text="2017 · about 21 billion km from Earth" />
        <Bubble x={52} y={96} lines={say.tired} size={14} tail={[352, 140]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#070812">
        <Stars x={40} y={318} w={294} h={292} n={20} seed={107} />
        <Earth x={60} y={600} r={60} />
        <Waves x={70} y={560} r={30} n={4} angle={-50} />
        <rect x={110} y={340} width={210} height={84} fill="#ffd84d" stroke="#111" strokeWidth={2.5} />
        {say.earth.map((line, i) => (
          <text key={line} x={122} y={364 + i * 22} fontFamily="'Comic Neue', cursive" fontWeight={700} fontSize={14} fill="#111">
            {line}
          </text>
        ))}
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#120f22">
        <Stars x={346} y={318} w={294} h={292} n={30} seed={109} />
        <Puff x={380} y={570} s={1.1} />
        <Sfx x={358} y={480} text="Fssshh!" size={30} />
        <Voyager x={500} y={530} scale={0.6} mood="proud" />
        <Bubble x={358} y={330} lines={say.works} size={14} tail={[486, 470]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page09: ComicPageData = {
  id: "getting-old",
  chapter: 9,
  title: "Getting old",
  years: "2017",
  speech: [say.tired, say.earth, say.works, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/thrusters-2017.jpg",
    alt: "An illustration of a Voyager spacecraft in deep space, its dish antenna turned back towards the distant Sun",
    credit: "NASA/JPL-Caltech (PIA21839)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA21839",
    facts: [
      "By 2017, the small thrusters that keep Voyager 1's antenna pointed at Earth were wearing out.",
      "On 28 November 2017, engineers fired a set of thrusters that hadn't been used since the Saturn flyby in 1980. They worked.",
      "Keeping the antenna pointed at Earth is what keeps Voyager talking to us.",
    ],
  },
  Art,
};
