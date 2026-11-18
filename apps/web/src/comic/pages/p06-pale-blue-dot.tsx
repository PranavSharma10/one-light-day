import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Gift, INK, Panel, SPEECH_FONT, Snapshot, Stars, SunBeam } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  last: ["One last picture", "of home. Smile!"],
  dot: ["Everyone I know", "is in that tiny dot."],
  goodbye: ["Now I'll close my", "camera eyes to save", "power for the long", "road. Goodbye, eyes."],
  gift: ["The photo that changed how", "we see our home."],
};

function Art() {
  return (
    <ComicPage height={720} label={`Pale Blue Dot. ${[...say.last, ...say.dot, ...say.goodbye].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#05060c">
        <Stars x={40} y={40} w={600} h={260} n={30} seed={71} />
        <SunBeam points="40,96 640,214 640,262 40,148" />
        <circle cx={150} cy={125} r={3.5} fill="#8fb8ff" />
        <circle cx={150} cy={125} r={11} fill="none" stroke="#8fb8ff" strokeWidth={1.5} strokeDasharray="3 3" />
        <Voyager x={500} y={170} scale={0.78} mood="happy" look="left" />
        <Caption x={52} y={262} text="14 February 1990 · 6 billion km from home" />
        <Bubble x={270} y={56} lines={say.last} tail={[440, 128]} />
        <Bubble x={236} y={184} lines={say.dot} size={14} tail={[444, 196]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#1a1530">
        <Snapshot x={66} y={340} w={220} h={196} tilt={3}>
          <SunBeam points="76,410 276,462 276,486 76,434" />
          <circle cx={170} cy={440} r={2.5} fill="#8fb8ff" />
          <text x={186} y={444} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={11} fill="#8fb8ff">
            you are here
          </text>
          <text x={102} y={560} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={14} fill={INK}>
            Pale Blue Dot, 1990
          </text>
        </Snapshot>
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#070812">
        <Stars x={346} y={318} w={294} h={292} n={30} seed={73} />
        <Voyager x={493} y={530} scale={0.6} mood="tired" />
        <Bubble x={358} y={330} lines={say.goodbye} size={14} tail={[480, 470]} />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page06: ComicPageData = {
  id: "pale-blue-dot",
  chapter: 6,
  title: "Pale Blue Dot",
  years: "1990",
  speech: [say.last, say.dot, say.goodbye, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/pale-blue-dot.jpg",
    alt: "Earth as a tiny pale blue speck inside a faint beam of scattered sunlight, surrounded by dark space",
    credit: "NASA/JPL-Caltech (PIA23645)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA23645",
    fit: "contain",
    facts: [
      "Voyager 1 took the photo on 14 February 1990, about 6 billion kilometres from the Sun.",
      "It was one of 60 images making up a 'family portrait' of the solar system.",
      "Earth is smaller than a single pixel. Soon afterwards, the cameras were switched off to save power.",
    ],
  },
  Art,
};
