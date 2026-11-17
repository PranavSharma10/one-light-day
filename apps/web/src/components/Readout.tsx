import { useNow } from "../hooks/useNow";
import { useVoyager } from "../hooks/useVoyager";
import { hms, km } from "../lib/format";

export default function Readout() {
  const now = useNow(100);
  const { stateAt, loading } = useVoyager();
  const s = stateAt(now);

  const badge =
    s.source === "horizons" ? "Live · JPL Horizons" : loading ? "Connecting to JPL…" : "Estimate";

  return (
    <section className="readout" aria-label="Voyager 1 right now">
      <div className="readout-head">
        <span className="label">Distance from Earth</span>
        <span className={`source${s.source === "horizons" ? " live" : ""}`}>{badge}</span>
      </div>
      <div className="big">
        {km(s.rangeKm)} <small>km</small>
      </div>

      <span className="label">One-way light time</span>
      <div className="big signal">{hms(s.owltS)}</div>

      <p className="readout-note">
        Moving away from Earth at {s.rangeRateKms.toFixed(2)} km/s · {s.helioAu.toFixed(3)} AU from the Sun
      </p>
    </section>
  );
}