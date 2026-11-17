import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MORSE, stateAt, toPulses, totalUnits } from "../lib/morse";

const CALL_SIGN = "VGR1";
const UNIT_MS = 120; // about 17 words per minute
const HOLD_MS = 1800; // pause on the finished call sign
const LEAVE_MS = 900; // fade into the page
const TONE_HZ = 660;

/** First visit: a gold lamp blinks VGR1 in Morse, then fades into the Golden Record. */
export default function MorseIntro({ onDone }: { onDone: () => void }) {
  const pulses = useMemo(() => toPulses(CALL_SIGN), []);
  const totalMs = totalUnits(pulses) * UNIT_MS;

  const [lamp, setLamp] = useState(false);
  const [charsDone, setCharsDone] = useState(0);
  const [finished, setFinished] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [run, setRun] = useState(0); // bump to replay
  const audio = useRef<AudioContext | null>(null);
  const enterButton = useRef<HTMLButtonElement>(null);

  const leave = useCallback(() => setLeaving(true), []);

  // Animation loop: each frame, work out where we are in the Morse sequence.
  useEffect(() => {
    if (leaving) return;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const s = stateAt(pulses, elapsed / UNIT_MS);
      setLamp(s.on);
      setCharsDone(s.charsDone);
      setFinished(s.done);
      if (s.done && elapsed > totalMs + HOLD_MS) {
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [run, leaving, pulses, totalMs]);

  // Once the fade-out has played, hand over to the page.
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, LEAVE_MS);
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  // Keyboard: focus "Enter", and let Esc skip.
  useEffect(() => {
    enterButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leave]);

  // Release the audio device when the intro goes away.
  useEffect(
    () => () => {
      audio.current?.close();
      audio.current = null;
    },
    [],
  );

  // Sound must start from a click: browsers block audio that plays on its own.
  const playWithSound = () => {
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = TONE_HZ;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      let t = ctx.currentTime + 0.05;
      for (const p of pulses) {
        const seconds = (p.units * UNIT_MS) / 1000;
        if (p.on) {
          gain.gain.setTargetAtTime(0.18, t, 0.004); // soft edges, no clicks
          gain.gain.setTargetAtTime(0, t + seconds, 0.004);
        }
        t += seconds;
      }
      osc.start();
      osc.stop(t + 0.1);
    } catch {
      // No audio available: the lamp still plays.
    }
    setRun((n) => n + 1); // restart the lamp in step with the sound
  };

  return (
    <div
      className={`intro${leaving ? " leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Voyager 1's call sign, VGR1, in Morse code"
    >
      <div className={`intro-lamp${lamp || leaving ? " on" : ""}`} aria-hidden="true" />

      <div className="intro-code" aria-hidden="true">
        {CALL_SIGN.split("").map((ch, i) => (
          <span key={i} className={`intro-letter${i < charsDone ? " shown" : ""}`}>
            <span className="intro-symbols">{MORSE[ch]}</span>
            <span className="intro-char">{ch}</span>
          </span>
        ))}
      </div>

      <p className={`intro-caption${finished ? " shown" : ""}`}>
        VGR1: the Deep Space Network's call sign for Voyager 1
      </p>

      <div className="intro-actions">
        <button type="button" className="btn ghost" onClick={playWithSound}>
          Play with sound
        </button>
        <button type="button" className="btn" ref={enterButton} onClick={leave}>
          Enter
        </button>
      </div>
    </div>
  );
}