import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Earth, Gift, INK, Panel, SPEECH_FONT, Stars, Waves, YELLOW } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  gibberish: ["#@%! 0101... &?!", "Why can't I say", "what I mean?"],
  earth: ["Message from Earth:", "We found the broken chip.", "We're moving your", "memory around it."],
  fixed: ["I can think clearly", "again! You fixed me", "from 24 billion km!"],
  gift: ["The farthest software repair", "ever made."],
};

function Art() {
  return (
    <ComicPage height={720} label={`When I got confused. ${[...say.gibberish, ...say.earth, ...say.fixed].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={260} sky="#1a0d16">
        <Stars x={40} y={40} w={600} h={260} n={24} seed={113} />
        <Voyager x={440} y={170} scale={0.78} mood="confused" />
        <Caption x={52} y={52} text="November 2023" />
        <Bubble x={60} y={110} lines={say.gibberish} tail={[380, 150]} />
      </Panel>

      <Panel x={40} y={318} w={294} h={292} sky="#070812">
        <Stars x={40} y={318} w={294} h={292} n={20} seed={127} />
        <Earth x={60} y={600} r={60} />
        <Waves x={70} y={560} r={30} n={4} angle={-50} />
        <rect x={98} y={336} width={222} height={104} fill={YELLOW} stroke={INK} strokeWidth={2.5} />
        {say.earth.map((line, i) => (
          <text key={line} x={110} y={360 + i * 22} fontFamily={SPEECH_FONT} fontWeight={700} fontSize={14} fill={INK}>
            {line}
          </text>
        ))}
        <Caption x={150} y={578} text="22.5 light-hours away" />
      </Panel>

      <Panel x={346} y={318} w={294} h={292} sky="#120f22">
        <Stars x={346} y={318} w={294} h={292} n={30} seed={131} />
        <Voyager x={493} y={530} scale={0.6} mood="proud" />
        <Bubble x={358} y={330} lines={say.fixed} size={14} tail={[480, 470]} />
        <Caption x={358} y={578} text="April-June 2024" />
      </Panel>

      <Gift y={628} lines={say.gift} />
    </ComicPage>
  );
}

export const page10: ComicPageData = {
  id: "confused",
  chapter: 10,
  title: "When I got confused",
  years: "2023–2024",
  speech: [say.gibberish, say.earth, say.fixed, say.gift].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/memory-fix.jpg",
    alt: "An artist's rendering of the Voyager spacecraft showing its dish antenna and instrument boom",
    credit: "NASA/JPL-Caltech (PIA14111)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA14111",
    facts: [
      "From 14 November 2023, Voyager 1 stopped sending readable data. The cause was a single failed chip in its flight data computer.",
      "Engineers rewrote and moved the affected code to other parts of its memory, with every test taking about two days to answer.",
      "Readable engineering data returned on 20 April 2024, and science data by June 2024.",
    ],
  },
  Art,
};
