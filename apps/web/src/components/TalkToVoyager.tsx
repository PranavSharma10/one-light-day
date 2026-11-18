import { useState, type FormEvent } from "react";
import { C_KMS, replyArrivesMs, uplinkSeconds, type VoyagerState } from "../lib/ephemeris";
import { hms, km, when } from "../lib/format";
import { loadJson, saveJson } from "../lib/storage";
import DsnStatus from "./DsnStatus";

interface Message {
  id: string;
  text: string;
  sent: number; // ms
  arrives: number; // ms
  km: number;
}

const KEY = "old:messages";
const MAX_MESSAGES = 12;

interface Props {
  now: number;
  stateAt: (ms: number) => VoyagerState;
}

export default function TalkToVoyager({ now, stateAt }: Props) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => loadJson<Message[]>(KEY, []));

  // The three moments that make a light-day real.
  const leftVoyager = now - stateAt(now).owltS * 1000;
  const commandArrives = now + uplinkSeconds(stateAt, now) * 1000;
  const replyArrives = replyArrivesMs(stateAt, commandArrives);

  const update = (next: Message[]) => {
    setMessages(next);
    saveJson(KEY, next);
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const sent = Date.now();
    const seconds = uplinkSeconds(stateAt, sent);
    const message: Message = {
      id: String(sent),
      text: trimmed,
      sent,
      arrives: sent + seconds * 1000,
      km: seconds * C_KMS,
    };
    update([...messages, message].slice(-MAX_MESSAGES));
    setText("");
  };

  return (
    <section className="talk" aria-labelledby="talk-h">
      <h2 id="talk-h">Talk to Voyager</h2>
      <div className="talk-grid">
        <div className="card">
          <DsnStatus />
          <dl className="signal-times">
            <dt>The signal reaching Earth right now left Voyager</dt>
            <dd>{when(leftVoyager)}</dd>
            <dt>A command sent this second reaches Voyager</dt>
            <dd>{when(commandArrives)}</dd>
            <dt>Its reply would be back on Earth</dt>
            <dd>{when(replyArrives)}</dd>
          </dl>
        </div>

        <form className="card" onSubmit={send}>
          <label htmlFor="message">Send Voyager a message</label>
          <textarea
            id="message"
            maxLength={280}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hello from Dublin. Thank you for 49 years."
          />
          <div className="row">
            <span className="hint">Private: it stays in this browser and is never sent anywhere.</span>
            <button type="submit" className="btn" disabled={!text.trim()}>
              Transmit at light speed
            </button>
          </div>

          <ol className="messages">
            {[...messages].reverse().map((m) => {
              const progress = Math.min(1, (now - m.sent) / (m.arrives - m.sent));
              const arrived = progress >= 1;
              return (
                <li key={m.id} className={`message${arrived ? " arrived" : ""}`}>
                  <p className="message-text">{m.text}</p>
                  <div
                    className="bar"
                    role="progressbar"
                    aria-label="Distance travelled"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress * 100)}
                  >
                    <i style={{ width: `${progress * 100}%` }} />
                  </div>
                  <p className="message-meta">
                    <span>{arrived ? `Reached Voyager ${when(m.arrives)}` : `${hms((m.arrives - now) / 1000, 0)} to go`}</span>
                    <span>
                      {km(progress * m.km)} of {km(m.km)} km
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>

          {messages.length > 0 && (
            <button type="button" className="btn ghost clear" onClick={() => update([])}>
              Clear my messages
            </button>
          )}
        </form>
      </div>
    </section>
  );
}