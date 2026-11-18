import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Voyager from "../comic/Voyager";
import { PAGES } from "../comic/pages";

/**
 * The whole comic laid out as a printable book: a cover, then one A4 sheet per chapter
 * with the real NASA picture and facts underneath.
 *
 * It's rendered into <body> (outside the app) only while printing. The print CSS hides
 * everything else, so the browser's print dialog shows just the book. "Save as PDF" works too.
 */
export default function PrintBook({ onDone }: { onDone: () => void }) {
  const book = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    let cancelled = false;
    const after = () => done.current();
    window.addEventListener("afterprint", after);

    // Wait for the fonts and every photo, or they'd print as blank boxes.
    const images = [...(book.current?.querySelectorAll("img") ?? [])];
    Promise.all([document.fonts.ready, ...images.map((img) => img.decode().catch(() => undefined))]).then(() => {
      if (!cancelled) window.print();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return createPortal(
    <div ref={book} className="print-book" aria-hidden="true" inert>
      <section className="pb-cover">
        <p className="pb-eyebrow">One Light-Day</p>
        <h1>The little probe that kept going</h1>
        <p className="pb-sub">The true story of Voyager 1, told by Voyager itself</p>
        <svg className="pb-hero" viewBox="0 0 320 260" aria-hidden="true">
          <circle cx="160" cy="130" r="118" fill="#0b0d1a" />
          <Voyager x={160} y={140} scale={1} mood="happy" wave />
        </svg>
        <p className="pb-small">
          {PAGES.length} chapters · 1977 to today · Read it together
        </p>
        <p className="pb-credit">Story and drawings: Pranav Sharma · Photos: NASA/JPL-Caltech</p>
      </section>

      {PAGES.map(({ id, chapter, title, years, real, Art }) => (
        <section key={id} className="pb-chapter">
          <header>
            <span>
              Chapter {chapter} · {years}
            </span>
            <h2>{title}</h2>
          </header>
          <Art />
          <aside className="pb-real">
            <img src={real.image} alt="" loading="eager" style={{ objectFit: real.fit ?? "cover" }} />
            <div>
              <h3>The real thing</h3>
              <ul>
                {real.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <p className="pb-credit">Image: {real.credit}</p>
            </div>
          </aside>
        </section>
      ))}
    </div>,
    document.body,
  );
}
