import { useEffect, useRef } from "react";
import type { Moment } from "./Timeline";

interface Props {
  moment: Moment | null;
  prev: Moment | null;
  next: Moment | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** The full story of one moment, in the browser's built-in modal <dialog>. */
export default function MomentDialog({ moment, prev, next, onClose, onPrev, onNext }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // React decides *whether* it's open; the browser handles focus, Esc and the backdrop.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (moment && !dialog.open) dialog.showModal();
    if (!moment && dialog.open) dialog.close();
  }, [moment]);

  // Left/right arrow keys step through the journey while the dialog is open.
  useEffect(() => {
    if (!moment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) onPrev();
      if (e.key === "ArrowRight" && next) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moment, prev, next, onPrev, onNext]);

  return (
    <dialog
      ref={ref}
      className="moment-dialog"
      aria-labelledby="moment-title"
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {moment && (
        <div className="md-inner">
          <div className="md-head">
            <p className="tl-meta">
              <time dateTime={moment.date}>{moment.label}</time>
              <span className="chip">{moment.kind}</span>
            </p>
            <button type="button" className="md-close" onClick={() => ref.current?.close()} aria-label="Close">
              ✕
            </button>
          </div>

          <h3 id="moment-title">{moment.title}</h3>
          <p className="tl-distance">{moment.distance}</p>

          {moment.image && (
            <figure className="md-media">
              <img src={moment.image.src} alt={moment.image.alt} />
              <figcaption>
                Image: <a href={moment.image.source} target="_blank" rel="noreferrer">{moment.image.credit}</a>
              </figcaption>
            </figure>
          )}

          <p className="md-body">{moment.body}</p>
          <p className="md-why">
            <strong>Why it mattered:</strong> {moment.why}
          </p>

          <nav className="md-nav" aria-label="Other moments">
            <button type="button" className="btn ghost" onClick={onPrev} disabled={!prev}>
              ← {prev?.title ?? "Start"}
            </button>
            <button type="button" className="btn ghost" onClick={onNext} disabled={!next}>
              {next?.title ?? "Now"} →
            </button>
          </nav>
        </div>
      )}
    </dialog>
  );
}