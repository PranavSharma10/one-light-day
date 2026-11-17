import { useEffect, useState } from "react";
import Starfield from "./components/Starfield";

type ApiState = "checking" | "ok" | "down";

export default function App() {
  const [api, setApi] = useState<ApiState>("checking");

  useEffect(() => {
    fetch("/api/healthz")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body: { ok: boolean }) => setApi(body.ok ? "ok" : "down"))
      .catch(() => setApi("down"));
  }, []);

  return (
    <>
      <Starfield />
      <div className="page">
        <nav className="nav" aria-label="Main">
          <a className="brand" href="#top">One Light-Day</a>
        </nav>

        <main id="top">
          <header className="hero">
            <p className="eyebrow">Launched 5 Sep 1977 · Cape Canaveral</p>
            <h1>
              Voyager 1 is <em>one light-day</em> from home.
            </h1>
            <p className="lede">
              On 18 November 2026, Voyager 1 is one light-day from Earth. A signal it sends takes a
              full day to reach us, and a command we send takes a day to arrive. No human-made
              object has ever been this far away.
            </p>
          </header>
        </main>

        <footer className="footer">
          <p>
            A fan tribute to Voyager 1 and the team at NASA's Jet Propulsion Laboratory. Not
            affiliated with or endorsed by NASA or JPL.
          </p>
          <p>Built by Pranav Sharma in Dublin · API: {api}</p>
        </footer>
      </div>
    </>
  );
}