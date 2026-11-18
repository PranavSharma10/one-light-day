import Voyager from "../Voyager";
import { Bubble, Caption, ComicPage, Earth, Gift, INK, Jupiter, Panel, Saturn, Stars } from "../kit";
import type { ComicPageData } from "../types";

const say = {
  old: ["I'm old now. I've lost", "my eyes, some of my", "instruments, and a lot", "of my power."],
  keep: ["But I still keep going.", "I never stop."],
  you: ["And neither", "should you."],
  lesson: ["Keep going. Even when it's hard.", "Even when home feels far away."],
};

function Art() {
  return (
    <ComicPage height={720} label={`I never stop. ${[...say.old, ...say.keep, ...say.you, ...say.lesson].join(" ")}`}>
      <Panel x={40} y={40} w={600} h={570} sky="#070812">
        <Stars x={40} y={40} w={600} h={570} n={90} seed={167} />

        {/* the road behind: every place from the story, small and far away */}
        <path d="M60 560 Q200 520 330 430 T560 140" fill="none" stroke="#ffd84d" strokeWidth={3} strokeDasharray="8 8" opacity={0.7} />
        <Earth x={70} y={560} r={14} />
        <Jupiter x={150} y={530} r={16} />
        <Saturn x={238} y={488} r={11} />
        <path d="M290 410 A90 90 0 0 1 372 480" fill="none" stroke="#e9d49a" strokeWidth={2.5} strokeDasharray="6 6" />

        {/* the star ahead */}
        <g stroke={INK} strokeWidth={2.5}>
          <circle cx={590} cy={96} r={30} fill="#fff6d8" opacity={0.25} />
          <circle cx={590} cy={96} r={12} fill="#fff6d8" />
        </g>

        <Voyager x={430} y={300} scale={1.15} mood="brave" look="right" wave />

        <Bubble x={56} y={60} lines={say.old} size={14} tail={[352, 230]} />
        <Bubble x={60} y={200} lines={say.keep} size={17} tail={[354, 270]} />
        <Bubble x={470} y={430} lines={say.you} size={17} tail={[470, 404]} />
        <Caption x={56} y={572} text="In about 40,000 years, I'll pass close to another star." />
      </Panel>

      <Gift y={628} lines={say.lesson} title="The lesson" />
    </ComicPage>
  );
}

export const page13: ComicPageData = {
  id: "never-stop",
  chapter: 13,
  title: "I never stop",
  years: "Still going",
  speech: [say.old, say.keep, say.you, say.lesson].map((lines) => lines.join(" ")),
  real: {
    image: "/images/timeline/one-light-day.jpg",
    alt: "An artist's chart of solar system distances on a scale from the Sun out past Voyager 1 to the Oort Cloud",
    credit: "NASA/JPL-Caltech (PIA17046)",
    source: "https://photojournal.jpl.nasa.gov/catalog/PIA17046",
    facts: [
      "In about 40,000 years, Voyager 1 will be closer to the star AC +79 3888 than to our own Sun.",
      "It is expected to keep working until its power runs out, possibly in the early 2030s. After that it will keep travelling, silently.",
      "It still carries the Golden Record: a message about who we are, for anyone who finds it.",
    ],
  },
  Art,
};
