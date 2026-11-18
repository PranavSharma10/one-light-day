import Voyager from "../Voyager";
import { Bird, Bolt, Bubble, Caption, ComicPage, Gift, GoldRecord, Note, Panel, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  look: ["Look what I carry!", "A golden record!"],
  sounds: ["Thunder. Birdsong.", "A baby's first cry.", "Music from all over", "the world!"],
  finds: ["If anyone ever finds me,", "they'll know who", "you are."],
  gift: ["A message from all of humanity,", "made to last for ages in space."],
};

function Art() {
  return (
    <ComicPage height={720} label={`A gift for strangers. ${[...say.look, ...say.sounds, ...say.finds].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260}>
        <Stars x={40} y={40} w={600} h={260} n={30} seed={23} />
        <GoldRecord x={480} y={185} r={95} spin />
        <Voyager x={190} y={192} scale={0.8} mood="proud" />
        <Caption x={396} y={52} text="Gold-plated copper · 30 cm wide" />
        <Bubble x={52} y={52} lines={say.look} tail={[160, 140]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#141026">
        <Stars x={40} y={318} w={294} h={292} n={20} seed={29} />
        <Bolt x={78} y={472} />
        <Note x={150} y={452} />
        <Bird x={262} y={452} />
        <Note x={226} y={482} s={0.8} />
        <Voyager x={187} y={545} scale={0.55} mood="happy" look="up" />
        <Bubble x={52} y={330} lines={say.sounds} size={14} tail={[172, 488]} />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={34} seed={31} />
        <Voyager x={493} y={522} scale={0.62} mood="happy" />
        <Bubble x={358} y={330} lines={say.finds} size={14} tail={[482, 456]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page02: ComicPageData = {
  id: "golden-record",
  chapter: 2,
  title: "A gift for strangers",
  years: "1977",
  speech: [say.look, say.sounds, say.finds, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/golden-record.webp",
    alt: "Voyager's gold-plated record, with the words 'The Sounds of Earth' on its label",
    credit: "NASA/JPL",
    source: "https://science.nasa.gov/image-detail/voyager-gold-record-front",
    fit: "contain",
    facts: [
      "Each Voyager carries a 12-inch (30 cm) gold-plated copper record.",
      "It holds greetings in 55 languages, sounds of Earth, music from many cultures and more than 100 images.",
      "A team led by the astronomer Carl Sagan chose what went on it.",
      "Its aluminium cover is engraved with instructions for playing it.",
    ],
  },
  Art,
};
