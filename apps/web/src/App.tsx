import { useCallback, useEffect, useState } from "react";
import ComicBook from "./components/ComicBook";
import GoldenRecord from "./components/GoldenRecord";
import HeliosphereScale from "./components/HeliosphereScale";
import LiveNow from "./components/LiveNow";
import MorseIntro from "./components/MorseIntro";
import Starfield from "./components/Starfield";
import Timeline from "./components/Timeline";
import { useHash } from "./hooks/useHash";
import { useVoyager } from "./hooks/useVoyager";
import GoldenRecordRoom from "./record/GoldenRecordRoom";
import ComingSoon from "./lab/ComingSoon";

type ApiState = "checking" | "ok" | "down";

const INTRO_KEY = "old:intro-seen";

/** Play the intro on a first visit, never for people who've asked for less motion. */
function shouldPlayIntro(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return localStorage.getItem(INTRO_KEY) === null;
  } catch {
    return false; // storage blocked: don't risk replaying it on every visit
  }
}

export default function App() {
  const [api, setApi] = useState<ApiState>("checking");
  const [intro, setIntro] = useState(shouldPlayIntro);

  // One source of Voyager's position for the whole page (JPL data, fallback model).
  const { stateAt, loading } = useVoyager();

  // A tiny router: "#story" shows the comic, anything else the home page.
  const hash = useHash();
  const view = hash === "#story" ? "story" : hash === "#record" ? "record" : hash === "#lab" ? "lab" : "home";

  // Open the comic and the Golden Record room at the top; on the home page, scroll to the section the link names.
  useEffect(() => {
    if (view !== "home") window.scrollTo({ top: 0 });
    else if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, view]);

  // Stable identity: MorseIntro waits on this inside an effect.
  const finishIntro = useCallback(() => {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage blocked: fine */
    }
    setIntro(false);
  }, []);

  useEffect(() => {
    fetch("/api/healthz")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body: { ok: boolean }) => setApi(body.ok ? "ok" : "down"))
      .catch(() => setApi("down"));
  }, []);

  return (
    <>
      <Starfield />
      {intro && <MorseIntro onDone={finishIntro} />}

      <div className="page" inert={intro}>
        <nav className="nav" aria-label="Main">
          <a className="brand" href="#top">One Light-Day</a>
          <div className="nav-links">
            <a href="#top">Now</a>
            <a href="#journey">Journey</a>
            <a href="#story" aria-current={view === "story" ? "page" : undefined}>
              Story
            </a>
            <a href="#record" aria-current={view === "record" ? "page" : undefined}>
              Golden Record
            </a>
            <a href="#lab" aria-current={view === "lab" ? "page" : undefined}>
              Lab
            </a>
          </div>
        </nav>

        <main id="top">
          {view === "story" ? <ComicBook /> : view === "record" ? <GoldenRecordRoom /> : view === "lab" ? <ComingSoon /> : (
            <>
              <header className="hero">
                <GoldenRecord />
                <p className="eyebrow">Launched 5 Sep 1977 · Cape Canaveral</p>
                <h1>
                  Voyager 1 is <em>one light-day</em> from home.
                </h1>
                <p className="lede">
                  On 18 November 2026, Voyager 1 is one light-day from Earth. A signal it sends
                  takes a full day to reach us, and a command we send takes a day to arrive. No
                  human-made object has ever been this far away.
                </p>
              </header>

              <LiveNow stateAt={stateAt} loading={loading} />
              <Timeline />
              <HeliosphereScale stateAt={stateAt} />
            </>
          )}
        </main>

        <footer className="footer">
          <p>
            A fan tribute to Voyager 1 and the team at NASA's Jet Propulsion Laboratory. Not
            affiliated with or endorsed by NASA or JPL.
          </p>
          <p>Golden Record photo: NASA/JPL</p>
          <p>Built by Pranav Sharma in Dublin · API: {api}</p>
          <p>
            <button type="button" className="linklike" onClick={() => setIntro(true)}>
              Replay the call sign
            </button>
          </p>
        </footer>
      </div>
    </>
  );
}