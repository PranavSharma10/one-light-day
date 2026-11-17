import { useState } from "react";
import timeline from "../content/timeline.json";
import MomentDialog from "./MomentDialog";

export type Kind = "milestone" | "discovery" | "rescue" | "now";

export interface Moment {
  id: string;
  date: string;
  label: string;
  kind: Kind;
  title: string;
  distance: string;
  summary: string;
  body: string;
  why: string;
  image?: {
    src: string;
    alt: string;
    credit: string;
    source: string;
    fit?: "cover" | "contain"; // contain = show the whole image, never crop
    position?: string; // which part to keep when cropping, e.g. "center 30%"
  };
}

export const MOMENTS = timeline as Moment[];

const KIND_LABEL: Record<Kind, string> = {
  milestone: "Milestone",
  discovery: "Discovery",
  rescue: "Rescue",
  now: "Now",
};

export default function Timeline() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const m = MOMENTS[active];

  const show = (i: number) => {
    setActive(i);
    setOpen(i);
  };

  return (
    <section className="journey" id="journey" aria-labelledby="journey-h">
      <h2 id="journey-h">The journey</h2>
      <p className="section-lede">
        Forty-nine years of discoveries, records and rescues. Hover or tab through them.
      </p>

      <ol className="tl-track">
        {MOMENTS.map((moment, i) => (
          <li
            key={moment.id}
            className={`tl-item kind-${moment.kind}${i === active ? " active" : ""}`}
          >
            <button
              type="button"
              className="tl-node"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => show(i)}
            >
              <span className="tl-year">{moment.date.slice(0, 4)}</span>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-title">{moment.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <article className="tl-preview">
        <div className="tl-media">
          {m.image ? (
            <img
              src={m.image.src}
              alt={m.image.alt}
              style={{ objectFit: m.image.fit ?? "cover", objectPosition: m.image.position ?? "center" }}
            />
          ) : (
            <div className="tl-placeholder" aria-hidden="true">
              {m.date.slice(0, 4)}
            </div>
          )}
        </div>
        <div className="tl-text">
          <p className="tl-meta">
            <time dateTime={m.date}>{m.label}</time>
            <span className="chip">{KIND_LABEL[m.kind]}</span>
          </p>
          <h3>{m.title}</h3>
          <p className="tl-distance">{m.distance}</p>
          <p>{m.summary}</p>
          {m.image && <p className="tl-credit">Image: {m.image.credit}</p>}
          <button type="button" className="btn tl-open" onClick={() => show(active)}>
            Read the full story
          </button>
        </div>
      </article>

      <MomentDialog
        moment={open === null ? null : MOMENTS[open]}
        prev={open !== null && open > 0 ? MOMENTS[open - 1] : null}
        next={open !== null && open < MOMENTS.length - 1 ? MOMENTS[open + 1] : null}
        onClose={() => setOpen(null)}
        onPrev={() => open !== null && open > 0 && show(open - 1)}
        onNext={() => open !== null && open < MOMENTS.length - 1 && show(open + 1)}
      />
    </section>
  );
}