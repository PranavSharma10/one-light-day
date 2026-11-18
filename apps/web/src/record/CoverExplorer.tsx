import { useState } from "react";
import BinaryDecoder from "./BinaryDecoder";
import Cover from "./Cover";
import { PARTS, type PartId } from "./parts";

/** 16a: the cover, with a panel that explains whichever engraving you pick. */
export default function CoverExplorer() {
  const [active, setActive] = useState<PartId>("hydrogen");
  const part = PARTS.find((p) => p.id === active)!;

  return (
    <section className="gr-section" aria-labelledby="gr-cover-h">
      <header className="gr-section-head">
        <p className="eyebrow">Part 1 · The cover</p>
        <h2 id="gr-cover-h">Instructions for someone who has never heard of Earth</h2>
        <p className="gr-lede">
          No words, because no one out there reads English. Just drawings, binary and physics. Pick an engraving to decode it.
        </p>
      </header>

      <div className="gr-explorer">
        <div className="gr-cover-wrap">
          <Cover active={active} onPick={setActive} />
          <p className="gr-note">Redrawn and simplified from NASA's diagram of the cover.</p>
        </div>

        <div className="gr-panel" aria-live="polite">
          <nav className="gr-chips" aria-label="Engravings">
            {PARTS.map((p, i) => (
              <button key={p.id} type="button" className={p.id === active ? "current" : ""} onClick={() => setActive(p.id)} aria-pressed={p.id === active}>
                {i + 1}
              </button>
            ))}
          </nav>
          <h3>{part.title}</h3>
          {part.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
          {active === "record" && <BinaryDecoder />}
        </div>
      </div>
    </section>
  );
}
