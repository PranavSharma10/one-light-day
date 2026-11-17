import { useCallback, useEffect, useState } from "react";
import {
  fromApi,
  interpolate,
  model,
  type ApiSample,
  type Sample,
  type VoyagerState,
} from "../lib/ephemeris";

const REFRESH_MS = 60 * 60 * 1000; // the API caches for an hour, so ask hourly

/** Voyager's position: live JPL data from our API, with the model as a fallback. */
export function useVoyager() {
  const [samples, setSamples] = useState<Sample[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/v1/voyager1/ephemeris");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: { samples: ApiSample[] } = await res.json();
        if (!cancelled) setSamples(fromApi(body.samples));
      } catch {
        // Keep any samples we already have: they cover the next 54 hours.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const stateAt = useCallback(
    (ms: number): VoyagerState => (samples && interpolate(samples, ms)) ?? model(ms),
    [samples],
  );

  return { stateAt, loading };
}