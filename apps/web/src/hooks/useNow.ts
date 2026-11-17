import { useEffect, useState } from "react";

/** The current time in ms, refreshed every `intervalMs`. Once a second if motion is reduced. */
export function useNow(intervalMs = 100): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setNow(Date.now()), reduce ? 1000 : intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}