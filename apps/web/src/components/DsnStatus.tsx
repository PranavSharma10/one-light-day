import { useEffect, useState } from "react";

// The shape of /api/v1/dsn/voyager1 (DsnStatus in services/api/app/dsn.py)
interface Signal {
  direction: "up" | "down";
  band: string | null;
  data_rate_bps: number | null;
}
interface Link {
  station: string | null;
  dish: string;
  active_signals: Signal[];
}
interface Status {
  in_contact: boolean;
  links: Link[];
}

const POLL_MS = 15_000;

/** Is a Deep Space Network dish talking to Voyager 1 right now? */
export default function DsnStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/v1/dsn/voyager1");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: Status = await res.json();
        if (!cancelled) {
          setStatus(body);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (failed && !status) {
    return <p className="dsn">Live dish status is unavailable right now.</p>;
  }
  if (!status) {
    return <p className="dsn">Checking the Deep Space Network…</p>;
  }

  const link = status.links.find((l) => l.active_signals.length > 0);
  if (!status.in_contact || !link) {
    return (
      <p className="dsn">
        <span className="dot" aria-hidden="true" />
        No dish is in contact with Voyager 1 this minute. Contact comes in scheduled passes.
      </p>
    );
  }

  const down = link.active_signals.find((s) => s.direction === "down");
  return (
    <p className="dsn live">
      <span className="dot" aria-hidden="true" />
      <span>
        <strong>
          {link.station ?? "A DSN station"} {link.dish.replace(/^DSS/, "DSS-")}
        </strong>{" "}
        is in contact with Voyager 1 right now
        {down?.data_rate_bps ? `, receiving ${down.data_rate_bps} bits per second` : ""}.
      </span>
    </p>
  );
}