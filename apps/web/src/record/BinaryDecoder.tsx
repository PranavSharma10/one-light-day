import { useEffect, useState } from "react";
import { HYDROGEN_UNIT_S, ROTATION_BITS, binaryToNumber, rpm, unitsToSeconds } from "./decode";

const units = binaryToNumber(ROTATION_BITS);
const seconds = unitsToSeconds(units);

/** Each step of the decoding, revealed one at a time like a calculator working. */
const STEPS: { label: string; value: string }[] = [
  { label: "Read the marks: | is 1, — is 0", value: ROTATION_BITS },
  { label: "As an ordinary number", value: units.toLocaleString("en-IE") + " hydrogen flips" },
  { label: "One flip lasts", value: (HYDROGEN_UNIT_S * 1e9).toFixed(3) + " billionths of a second" },
  { label: "Multiply them", value: seconds.toFixed(3) + " seconds per turn" },
  { label: "Turns per minute (60 ÷ " + seconds.toFixed(1) + ")", value: rpm(seconds).toFixed(2) + " rpm, or 16⅔" },
];

/** Decodes the binary around the record drawing, step by step. */
export default function BinaryDecoder() {
  const [shown, setShown] = useState(0);
  const running = shown > 0 && shown < STEPS.length;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 900);
    return () => window.clearTimeout(t);
  }, [running, shown]);

  return (
    <div className="gr-decoder">
      <ol aria-live="polite">
        {STEPS.slice(0, shown).map((step) => (
          <li key={step.label}>
            <span>{step.label}</span>
            <code>{step.value}</code>
          </li>
        ))}
      </ol>
      {shown === STEPS.length ? (
        <p className="gr-punch">
          That's exactly how fast the record on our home page spins. <button type="button" className="linklike" onClick={() => setShown(0)}>Decode again</button>
        </p>
      ) : (
        <button type="button" className="btn" onClick={() => setShown(1)} disabled={running}>
          {running ? "Decoding…" : "Decode it"}
        </button>
      )}
    </div>
  );
}
