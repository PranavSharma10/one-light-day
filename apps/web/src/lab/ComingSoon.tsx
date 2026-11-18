import { useEffect, useRef } from "react";
import "./lab.css";

const GITHUB = "https://github.com/PranavSharma10";
const LINKEDIN = "https://www.linkedin.com/in/pranav-sharma-4320591a7/";

interface Project {
  name: string;
  tag: string;
  pitch: string;
  bullets: string[];
  stack: string[];
  stage: number; // index into STAGES
  stages: string[];
}

const PROJECTS: Project[] = [
  {
    name: "Ask Voyager",
    tag: "AI · retrieval-augmented generation",
    pitch: "Ask anything about the mission and get an answer built only from NASA's own documents, with the sources linked so you can check it.",
    bullets: [
      "Mission reports, press releases and science papers, split up and indexed",
      "Answers that cite their sources, and say “I don't know” when the documents don't cover it",
      "An evaluation set of real questions, so every change is measured, not guessed",
    ],
    stack: ["Python", "FastAPI", "Vertex AI", "embeddings", "evals"],
    stage: 0,
    stages: ["Gathering documents", "Indexing", "Evaluating answers", "Launch"],
  },
  {
    name: "The Data Lab",
    tag: "ML · Voyager's real instrument data",
    pitch: "Voyager 1's cosmic-ray and magnetic-field readings, from launch to today. Watch the day it left the heliosphere appear in the data.",
    bullets: [
      "Real data from NASA's space physics archives",
      "A change-point model that finds the August 2012 heliopause crossing on its own",
      "Hear the data: decades of readings turned into sound",
    ],
    stack: ["pandas", "SciPy", "change-point detection", "Web Audio"],
    stage: 0,
    stages: ["Fetching data", "Cleaning", "Modelling", "Launch"],
  },
  {
    name: "Mission Control",
    tag: "AI agent · fault recovery simulation",
    pitch: "A simulated Voyager breaks down, like the memory-chip fault of 2023. An AI agent has to diagnose it, using the same one-day delay as the real team.",
    bullets: [
      "A spacecraft simulator with realistic faults and a light-delay between commands and replies",
      "An agent that reads telemetry, forms a theory, and sends commands through tools",
      "Every step shown, so you can follow its reasoning",
    ],
    stack: ["agents", "tool calling", "simulation", "TypeScript"],
    stage: 0,
    stages: ["Designing the simulator", "Building tools", "Testing the agent", "Launch"],
  },
];

/** A decorative "model training" animation: a loss curve that keeps learning. */
function TrainingCurve() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [w, h] = [el.width, el.height];
    let seed = 11;
    const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5);
    const points = Array.from({ length: 240 }, (_, i) => {
      const t = i / 239;
      return 0.12 + 0.78 * Math.exp(-4.2 * t) + noise() * 0.07 * (1 - t * 0.6);
    });

    let frame = 0;
    let shown = still ? points.length : 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(217,180,90,0.15)";
      ctx.lineWidth = 1;
      for (let gy = 1; gy < 4; gy++) {
        ctx.beginPath();
        ctx.moveTo(0, (gy * h) / 4);
        ctx.lineTo(w, (gy * h) / 4);
        ctx.stroke();
      }
      ctx.strokeStyle = "#d9b45a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < Math.min(shown, points.length); i++) {
        const x = (i / (points.length - 1)) * w;
        const y = h - points[i] * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (!still) {
        shown += 1;
        if (shown > points.length + 90) shown = 0; // pause at the end, then train again
        frame = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvas} width={560} height={150} className="lab-curve" aria-hidden="true" />;
}

/** 17a: what's coming next. Honest about status: nothing here is live yet. */
export default function ComingSoon() {
  return (
    <div className="lab">
      <header className="lab-hero">
        <p className="eyebrow">The Lab · coming soon</p>
        <h1>Something exciting is in training</h1>
        <p className="lab-lede">
          The next part of One Light-Day is the AI and data science: an assistant that answers from NASA's own documents, a model that
          finds the edge of the Solar System in Voyager's real data, and an agent that tries to rescue a broken spacecraft.
        </p>
        <div className="lab-terminal" role="img" aria-label="Decorative animation of a model training">
          <div className="lab-terminal-bar">
            <span />
            <span />
            <span />
            <code>one-light-day / lab</code>
          </div>
          <TrainingCurve />
          <code className="lab-terminal-line">
            status: <b>building</b> · first release: <b>soon</b>
            <i className="lab-cursor" />
          </code>
        </div>
      </header>

      <ul className="lab-projects">
        {PROJECTS.map((p) => (
          <li key={p.name} className="lab-card">
            <span className="lab-tag">{p.tag}</span>
            <h2>{p.name}</h2>
            <p>{p.pitch}</p>
            <ul className="lab-bullets">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <ol className="lab-stages" aria-label="Progress">
              {p.stages.map((s, i) => (
                <li key={s} className={i < p.stage ? "done" : i === p.stage ? "now" : ""} aria-current={i === p.stage ? "step" : undefined}>
                  {s}
                </li>
              ))}
            </ol>
            <div className="lab-stack">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <section className="lab-follow">
        <h2>Watch it being built</h2>
        <p>Every part of this site is built in the open, one step at a time.</p>
        <div className="lab-links">
          <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">
            Code on GitHub
          </a>
          <a className="btn ghost" href={LINKEDIN} target="_blank" rel="noreferrer">
            Follow on LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
