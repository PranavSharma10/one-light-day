import { useEffect, useRef, useState } from "react";

/** Is the browser's built-in speech (Web Speech API) available? It's free and works offline in most browsers. */
export const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const START_MS = 700; // let the page-turn animation finish first
const PAUSE_MS = 350; // a breath between bubbles
const SILENCE_MS = 1200; // how long a "..." bubble lasts

export type Finish = "end" | "blocked";

/** Turn comic text into something a speech engine reads nicely: "#@%! 0101..." becomes "! beep boop...". */
export function toSpoken(text: string): string {
  return text
    .replace(/\b[01]{4,}\b/g, " beep boop ")
    .replace(/[#@%&*^~_<>|\\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if there's anything to actually say (a lone "..." isn't). */
export const hasWords = (text: string) => /[\p{L}\p{N}]/u.test(text);

/** Prefer a natural-sounding English voice, Irish or British first. Voices differ per browser and OS. */
function pickVoice(): SpeechSynthesisVoice | undefined {
  const english = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  const natural = (v: SpeechSynthesisVoice) => /natural|neural|google|online|siri/i.test(v.name);
  return (
    english.find((v) => /en-(gb|ie)/i.test(v.lang) && natural(v)) ??
    english.find(natural) ??
    english.find((v) => v.default) ??
    english[0]
  );
}

/**
 * Reads `script` aloud one line at a time while `playing` is true.
 * Returns the index of the line being read (or -1), so the page can highlight it.
 * Calls `onFinish("end")` after the last line, or `onFinish("blocked")` if the browser refuses to speak.
 */
export function useReadAloud(script: string[], playing: boolean, onFinish: (why: Finish) => void): number {
  const [state, setState] = useState({ script, line: -1 });

  // Keep the latest callback without restarting the speech every render.
  const finish = useRef(onFinish);
  useEffect(() => {
    finish.current = onFinish;
  });

  useEffect(() => {
    if (!canSpeak || !playing) return;
    const synth = window.speechSynthesis;
    let stopped = false;
    let timer = 0;
    // Hold a reference to the current utterance: Chrome can lose its "end" event if it's garbage-collected.
    let utterance: SpeechSynthesisUtterance | null = null;

    const say = (i: number) => {
      if (stopped) return;
      if (i >= script.length) {
        setState({ script, line: -1 });
        finish.current("end");
        return;
      }
      setState({ script, line: i });

      const text = toSpoken(script[i]);
      if (!hasWords(text)) {
        timer = window.setTimeout(() => say(i + 1), SILENCE_MS);
        return;
      }

      utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = 0.9; // a little slower, for young listeners
      utterance.pitch = 1.1; // a little brighter: Voyager is cute
      utterance.onend = () => {
        if (!stopped) timer = window.setTimeout(() => say(i + 1), PAUSE_MS);
      };
      utterance.onerror = (e) => {
        if (stopped || e.error === "interrupted" || e.error === "canceled") return;
        if (e.error === "not-allowed") {
          setState({ script, line: -1 });
          finish.current("blocked");
          return;
        }
        timer = window.setTimeout(() => say(i + 1), PAUSE_MS); // skip a line that failed
      };
      synth.speak(utterance);
    };

    synth.cancel(); // stop anything left over from the previous page
    timer = window.setTimeout(() => say(0), START_MS);

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      if (utterance) utterance.onend = utterance.onerror = null;
      synth.cancel();
    };
  }, [script, playing]);

  // A line index from an older page (or after stopping) means nothing now.
  return playing && state.script === script ? state.line : -1;
}
