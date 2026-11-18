import { useEffect, useRef, useState } from "react";

const KEY = "old:my-record";

const SOUNDS = [
  "Rain on a window", "Waves on a beach", "Birdsong at dawn", "A cat purring", "A baby laughing", "A city street",
  "A football crowd", "A kettle boiling", "Wind in the trees", "A heartbeat", "Thunder", "Friends laughing",
];

interface MyRecordData {
  name: string;
  hello: string;
  sounds: string[];
  song: string;
  picture: string;
  message: string;
}

const EMPTY: MyRecordData = { name: "", hello: "", sounds: [], song: "", picture: "", message: "" };
const MAX_SOUNDS = 3;

function load(): MyRecordData {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<MyRecordData>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Break text into lines of about `width` characters, for SVG (which doesn't wrap text itself). */
function wrap(text: string, width: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    if ((line + " " + word).trim().length > width && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, "…");
  }
  return lines;
}

/** The shareable card, drawn as SVG so it can be turned into a PNG. Uses system fonts so the PNG matches. */
function Card({ data }: { data: MyRecordData }) {
  const rows: { label: string; lines: string[] }[] = [
    { label: "Hello, in my words", lines: wrap(data.hello || "…", 56, 2) },
    { label: "Sounds of my Earth", lines: wrap(data.sounds.join(" · ") || "…", 56, 2) },
    { label: "A song I'd send", lines: wrap(data.song || "…", 56, 2) },
    { label: "A picture I'd send", lines: wrap(data.picture || "…", 56, 2) },
    { label: "My message to whoever finds it", lines: wrap(data.message || "…", 56, 3) },
  ];
  let y = 410;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width={1080} height={1080} className="gr-card">
      <defs>
        <radialGradient id="mr-gold" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f3d98a" />
          <stop offset="0.55" stopColor="#d1a648" />
          <stop offset="1" stopColor="#8f6a22" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1080} fill="#060608" />
      <rect x={24} y={24} width={1032} height={1032} rx={28} fill="none" stroke="#d9b45a" strokeOpacity={0.5} strokeWidth={2} />
      <circle cx={540} cy={175} r={105} fill="url(#mr-gold)" />
      {[88, 72, 56].map((r) => (
        <circle key={r} cx={540} cy={175} r={r} fill="none" stroke="#3d2b0c" strokeOpacity={0.5} strokeWidth={2} />
      ))}
      <circle cx={540} cy={175} r={22} fill="#3d2b0c" fillOpacity={0.35} />
      <circle cx={540} cy={175} r={4} fill="#060608" />
      <text x={540} y={340} textAnchor="middle" fill="#f1ecdf" fontFamily="Georgia, serif" fontSize={52}>
        {data.name ? `${data.name}'s Golden Record` : "My Golden Record"}
      </text>
      {rows.map((row) => {
        const top = y;
        y += 30 + row.lines.length * 34 + 22;
        return (
          <g key={row.label}>
            <text x={110} y={top} fill="#d9b45a" fontFamily="ui-monospace, Menlo, Consolas, monospace" fontSize={20} letterSpacing={3}>
              {row.label.toUpperCase()}
            </text>
            {row.lines.map((line, i) => (
              <text key={i} x={110} y={top + 38 + i * 34} fill="#f1ecdf" fontFamily="system-ui, Segoe UI, sans-serif" fontSize={27}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
      <text x={540} y={1030} textAnchor="middle" fill="#958e7c" fontFamily="system-ui, Segoe UI, sans-serif" fontSize={22}>
        One Light-Day · inspired by Voyager 1's Golden Record (1977)
      </text>
    </svg>
  );
}

/** 16d, part two: make your own Golden Record. Saved only in this browser, like Talk to Voyager. */
export default function MyRecord() {
  const [data, setData] = useState<MyRecordData>(load);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* private mode or storage full: the card still works for this visit */
    }
  }, [data]);

  const set = <K extends keyof MyRecordData>(key: K, value: MyRecordData[K]) => setData((d) => ({ ...d, [key]: value }));

  const toggleSound = (s: string) =>
    setData((d) => ({
      ...d,
      sounds: d.sounds.includes(s) ? d.sounds.filter((x) => x !== s) : d.sounds.length < MAX_SOUNDS ? [...d.sounds, s] : d.sounds,
    }));

  async function download() {
    const svg = card.current?.querySelector("svg");
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1080;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!png) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(png);
      a.download = "my-golden-record.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <section className="gr-section" aria-labelledby="gr-mine-h">
      <header className="gr-section-head">
        <p className="eyebrow">Part 5 · Your turn</p>
        <h2 id="gr-mine-h">Make your own Golden Record</h2>
        <p className="gr-lede">
          If you could send one record to the stars, what would be on it? Fill it in and download your card. It's saved only in
          this browser: nothing is sent anywhere.
        </p>
      </header>

      <div className="gr-mine">
        <form className="gr-panel gr-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Your first name (optional)
            <input value={data.name} maxLength={24} onChange={(e) => set("name", e.target.value)} autoComplete="given-name" />
          </label>
          <label>
            Say hello to the universe
            <textarea value={data.hello} maxLength={105} rows={2} onChange={(e) => set("hello", e.target.value)} placeholder="Hello from Dublin! We like music and the sea." />
          </label>
          <fieldset>
            <legend>
              Pick up to {MAX_SOUNDS} sounds of your Earth ({data.sounds.length}/{MAX_SOUNDS})
            </legend>
            <div className="gr-sound-chips">
              {SOUNDS.map((s) => {
                const on = data.sounds.includes(s);
                return (
                  <button key={s} type="button" className={on ? "current" : ""} aria-pressed={on} onClick={() => toggleSound(s)} disabled={!on && data.sounds.length >= MAX_SOUNDS}>
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label>
            One song you'd send
            <input value={data.song} maxLength={56} onChange={(e) => set("song", e.target.value)} placeholder="Title and artist" />
          </label>
          <label>
            One picture you'd send
            <input value={data.picture} maxLength={100} onChange={(e) => set("picture", e.target.value)} placeholder="My grandmother's kitchen on a Sunday" />
          </label>
          <label>
            Your message to whoever finds it
            <textarea value={data.message} maxLength={160} rows={3} onChange={(e) => set("message", e.target.value)} />
          </label>
          <div className="gr-form-actions">
            <button type="button" className="btn" onClick={download}>
              Download my card
            </button>
            <button type="button" className="btn ghost" onClick={() => setData(EMPTY)}>
              Start again
            </button>
          </div>
        </form>

        <div ref={card} className="gr-card-wrap" aria-label="Preview of your card">
          <Card data={data} />
        </div>
      </div>
    </section>
  );
}
