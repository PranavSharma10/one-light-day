import { useEffect, useRef } from "react";

/** A fixed starfield. Seeded, so every visitor sees the same sky. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Same seed, same stars: 1977 is Voyager's launch year.
      let seed = 1977;
      const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

      const count = Math.round((w * h) / 3200);
      for (let i = 0; i < count; i++) {
        const big = random() < 0.07;
        ctx.fillStyle = `rgba(255, 244, 220, ${0.12 + random() * 0.5})`;
        ctx.fillRect(random() * w, random() * h, big ? 1.6 : 1, big ? 1.6 : 1);
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}