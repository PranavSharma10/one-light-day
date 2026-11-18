import { useEffect, useRef, useState, type PointerEvent } from "react";
import { PAGES } from "../comic/pages";

const SWIPE_PX = 50;

/** Voyager tells its own story, one comic page per chapter. */
export default function ComicBook() {
  const [index, setIndex] = useState(0);
  const page = PAGES[index];
  const first = index === 0;
  const last = index === PAGES.length - 1;
  const swipeStart = useRef<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const go = (i: number) => setIndex(Math.max(0, Math.min(PAGES.length - 1, i)));

  // Arrow keys turn pages (unless you're typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(PAGES.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // After a page turn, move focus to the new title so screen readers read the new page.
  const turned = useRef(false);
  useEffect(() => {
    if (turned.current) heading.current?.focus({ preventScroll: true });
    turned.current = true;
  }, [index]);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (dx < -SWIPE_PX) go(index + 1);
    if (dx > SWIPE_PX) go(index - 1);
  };

  const { Art, real } = page;

  return (
    <section className="comic" aria-labelledby="comic-h" aria-roledescription="comic book">
      <header className="comic-head">
        <p className="eyebrow">A comic for everyone</p>
        <h1 id="comic-h">The little probe that kept going</h1>
      </header>

      <div className="comic-title">
        <span className="comic-chapter">
          Chapter {page.chapter} of {PAGES.length} · {page.years}
        </span>
        <h2 ref={heading} tabIndex={-1}>
          {page.title}
        </h2>
      </div>

      <div key={page.id} className="comic-sheet" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <Art />
      </div>

      <details className="real-thing">
        <summary>See the real thing</summary>
        <div className="real-body">
          <figure>
            <img src={real.image} alt={real.alt} style={{ objectFit: real.fit ?? "cover" }} />
            <figcaption>
              Image: <a href={real.source} target="_blank" rel="noreferrer">{real.credit}</a>
            </figcaption>
          </figure>
          <ul>
            {real.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      </details>

      <nav className="comic-nav" aria-label="Pages">
        <button type="button" className="btn ghost" onClick={() => go(index - 1)} disabled={first}>
          ← Back
        </button>
        <ol className="comic-dots">
          {PAGES.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className={i === index ? "current" : ""}
                onClick={() => go(i)}
                aria-label={`Chapter ${p.chapter}: ${p.title}`}
                aria-current={i === index ? "page" : undefined}
              />
            </li>
          ))}
        </ol>
        {last ? (
          <button type="button" className="btn" onClick={() => go(0)}>
            Read it again
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => go(index + 1)}>
            Next →
          </button>
        )}
      </nav>
    </section>
  );
}
