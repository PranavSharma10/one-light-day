const NASA_CONTENTS = "https://science.nasa.gov/mission/voyager/golden-record-contents/";

const ITEMS: { title: string; big: string; text: string }[] = [
  {
    title: "Greetings",
    big: "55 languages",
    text: "Hello from Earth in 55 ancient and modern languages, from Akkadian, spoken around 4,000 years ago, to English and Mandarin. One greeting is from Carl Sagan's six-year-old son, Nick.",
  },
  {
    title: "Sounds of Earth",
    big: "About 12 minutes",
    text: "Surf, wind and thunder, birdsong, humpback whales, footsteps and laughter, and the Latin motto “Per aspera ad astra” (through hardships to the stars) in Morse code.",
  },
  {
    title: "Music",
    big: "27 pieces · 90 minutes",
    text: "Bach, Beethoven and Mozart next to Chuck Berry's “Johnny B. Goode”, Louis Armstrong, Blind Willie Johnson, a Navajo night chant, Javanese gamelan, an Indian raga and Japanese shakuhachi.",
  },
  {
    title: "Pictures",
    big: "115 images",
    text: "Stored as sound, like the decoder above. Diagrams of maths, DNA and the human body, then landscapes, animals, food, cities and people, plus one extra picture to calibrate colour.",
  },
  {
    title: "Messages",
    big: "From Earth's leaders",
    text: "A spoken greeting from UN Secretary-General Kurt Waldheim, and a printed message from US President Jimmy Carter.",
  },
  {
    title: "Hidden extras",
    big: "Off the label",
    text: "An hour of Ann Druyan's brainwaves, compressed into about a minute of sound. And scratched by hand into the blank space at the end of the grooves: “To the makers of music – all worlds, all times.”",
  },
];

/** 16d, part one: what's actually on the record. */
export default function WhatsOnIt() {
  return (
    <section className="gr-section" aria-labelledby="gr-on-h">
      <header className="gr-section-head">
        <p className="eyebrow">Part 4 · What's on it</p>
        <h2 id="gr-on-h">A mixtape for the universe</h2>
        <p className="gr-lede">
          A committee led by Carl Sagan spent almost a year choosing what to send. The record plays at 16⅔ rpm, and both
          Voyagers carry an identical copy.
        </p>
      </header>

      <blockquote className="gr-quote">
        <p>
          “This is a present from a small, distant world, a token of our sounds, our science, our images, our music, our thoughts
          and our feelings.”
        </p>
        <footer>From President Jimmy Carter's message on the record</footer>
      </blockquote>

      <ul className="gr-items">
        {ITEMS.map((item) => (
          <li key={item.title}>
            <span className="gr-item-title">{item.title}</span>
            <strong>{item.big}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>

      <p className="gr-small">
        Most of the music and many of the photos are still under copyright, so we don't play or show them here. You can listen to
        the sounds and see the images NASA is allowed to share on{" "}
        <a href={NASA_CONTENTS} target="_blank" rel="noreferrer">
          NASA's Golden Record pages
        </a>
        .
      </p>
    </section>
  );
}
