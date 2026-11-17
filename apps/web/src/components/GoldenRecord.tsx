// Voyager's Golden Record: NASA's photo, spinning at 16⅔ rpm (the speed
// engraved on the record's cover, one turn every 3.6 s). The drawn grooves
// underneath show if the photo fails to load.

const C = 200; // centre of the 400 × 400 drawing

// Grooves: thin rings grouped into "tracks", with a brighter gap between tracks.
const GROOVES = Array.from({ length: 53 }, (_, i) => {
  const r = 74 + i * 2.2;
  return { r, inGap: (r - 74) % 16 < 2.2, band: Math.floor((r - 74) / 16) };
});

// Short bright arcs that turn with the disc, so the spin is visible.
const GLINTS = [
  { r: 96, share: 0.1, angle: 20 },
  { r: 132, share: 0.07, angle: 140 },
  { r: 168, share: 0.05, angle: 250 },
  { r: 120, share: 0.06, angle: 300 },
];

export default function GoldenRecord() {
  return (
    <svg
      className="record"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Voyager's Golden Record, spinning at 16⅔ revolutions per minute"
    >
      <defs>
        <clipPath id="record-clip">
          <circle cx={C} cy={C} r={196} />
        </clipPath>
        <radialGradient id="record-gold" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f0d88f" />
          <stop offset="0.55" stopColor="#d9b45a" />
          <stop offset="1" stopColor="#9c7a2e" />
        </radialGradient>
        <linearGradient id="record-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.9" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Everything in this group spins */}
      <g className="record-spin">
        <circle cx={C} cy={C} r={196} fill="url(#record-gold)" />
        {GROOVES.map((g) => (
          <circle
            key={g.r}
            cx={C}
            cy={C}
            r={g.r}
            fill="none"
            stroke={g.inGap ? "#f6e3a8" : "#7a5a1c"}
            strokeOpacity={g.inGap ? 0.35 : 0.18 + (g.band % 2) * 0.08}
            strokeWidth={g.inGap ? 1.2 : 0.8}
          />
        ))}
        {GLINTS.map((g) => {
          const circumference = 2 * Math.PI * g.r;
          return (
            <circle
              key={g.r}
              cx={C}
              cy={C}
              r={g.r}
              fill="none"
              stroke="#fff6d8"
              strokeOpacity={0.35}
              strokeWidth={2}
              strokeDasharray={`${circumference * g.share} ${circumference}`}
              transform={`rotate(${g.angle} ${C} ${C})`}
            />
          );
        })}
        <circle cx={C} cy={C} r={66} fill="#c9a24a" stroke="#7a5a1c" strokeOpacity={0.5} />
        <image
          href="/images/golden-record.webp"
          x={4}
          y={4}
          width={392}
          height={392}
          clipPath="url(#record-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>

      {/* The reflection stays still while the grooves turn, like a real record */}
      <circle cx={C} cy={C} r={196} fill="url(#record-sheen)" />
      <circle cx={C} cy={C} r={6} fill="var(--space)" />
    </svg>
  );
}