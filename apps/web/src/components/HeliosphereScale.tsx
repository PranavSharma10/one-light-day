import { useEffect, useRef } from "react";
import { useNow } from "../hooks/useNow";
import type { VoyagerState } from "../lib/ephemeris";

const MAX_AU = 180;
const PLANETS = [1, 5.2, 9.6, 19.2, 30.1, 39.5]; // Earth, Jupiter, Saturn, Uranus, Neptune, Pluto
const HEIGHT = 240;

/** Read a colour from the CSS variables, so the drawing follows the site's palette. */
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** A to-scale line from the Sun to Voyager 1. */
export default function HeliosphereScale({ stateAt }: { stateAt: (ms: number) => VoyagerState }) {
  const ref = useRef<HTMLCanvasElement>(null);

  // Voyager moves about 0.01 AU a day, so checking once a minute is plenty.
  const now = useNow(60_000);
  const au = Math.round(stateAt(now).helioAu * 100) / 100;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(HEIGHT * dpr);
      const cx = canvas.getContext("2d");
      if (!cx) return;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, HEIGHT);

      const left = 28;
      const right = 44;
      const axisY = 132;
      const top = 70; // top of the grid lines
      const bottom = 190; // bottom of the grid lines
      const x = (a: number) => left + (a / MAX_AU) * (W - left - right);
      const mono = "JetBrains Mono, ui-monospace, monospace";
      const [muted, line, gold, goldSoft, ink] = ["--muted", "--line", "--gold", "--gold-soft", "--ink"].map(css);

      // The heliosheath: the band between the two boundaries.
      cx.fillStyle = "rgba(217, 180, 90, 0.07)";
      cx.fillRect(x(94), top, x(121.6) - x(94), bottom - top);

      // Grid and AU labels every 20 AU.
      cx.font = `12px ${mono}`;
      cx.textAlign = "center";
      for (let a = 0; a <= MAX_AU; a += 20) {
        cx.strokeStyle = line;
        cx.beginPath();
        cx.moveTo(x(a), top);
        cx.lineTo(x(a), bottom);
        cx.stroke();
        cx.fillStyle = muted;
        cx.fillText(`${a}`, x(a), bottom + 22);
      }
      cx.textAlign = "right";
      cx.fillText("AU", x(MAX_AU) + 30, bottom + 22);

      // The axis.
      cx.strokeStyle = muted;
      cx.beginPath();
      cx.moveTo(x(0), axisY);
      cx.lineTo(x(MAX_AU), axisY);
      cx.stroke();

      // The Sun and the planets.
      cx.fillStyle = gold;
      cx.beginPath();
      cx.arc(x(0), axisY, 6, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = ink;
      for (const p of PLANETS) {
        cx.beginPath();
        cx.arc(x(p), axisY, 2.5, 0, Math.PI * 2);
        cx.fill();
      }
      cx.fillStyle = muted;
      cx.textAlign = "left";
      cx.fillText("the Sun and all the planets", x(0), axisY + 26);

      // The two boundaries. Their labels sit on opposite sides of the band so they never collide.
      cx.setLineDash([3, 4]);
      cx.strokeStyle = goldSoft;
      for (const a of [94, 121.6]) {
        cx.beginPath();
        cx.moveTo(x(a), top - 8);
        cx.lineTo(x(a), bottom);
        cx.stroke();
      }
      cx.setLineDash([]);

      cx.textAlign = "right";
      cx.fillStyle = goldSoft;
      cx.fillText("termination shock", x(94) - 8, 26);
      cx.fillStyle = muted;
      cx.fillText("94 AU · 2004", x(94) - 8, 44);

      cx.textAlign = "left";
      cx.fillStyle = goldSoft;
      cx.fillText("heliopause", x(121.6) + 8, 26);
      cx.fillStyle = muted;
      cx.fillText("121.6 AU · 2012", x(121.6) + 8, 44);

      // Voyager 1.
      cx.textAlign = "center";
      cx.fillStyle = gold;
      cx.beginPath();
      cx.arc(x(au), axisY, 6, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = gold;
      cx.beginPath();
      cx.arc(x(au), axisY, 12, 0, Math.PI * 2);
      cx.stroke();
      cx.font = `500 13px ${mono}`;
      cx.fillText("Voyager 1", x(au), axisY - 24);
      cx.fillStyle = ink;
      cx.font = `12px ${mono}`;
      cx.fillText(`${au.toFixed(2)} AU`, x(au), axisY + 32);
    };

    draw();
    window.addEventListener("resize", draw);
    // Fonts may finish loading after the first draw; redraw so the labels use them.
    document.fonts?.ready.then(draw);
    return () => window.removeEventListener("resize", draw);
  }, [au]);

  return (
    <section className="scale-section" aria-labelledby="scale-h">
      <h2 id="scale-h">How far is that?</h2>
      <p className="section-lede">
        To scale. Everything humans explored before Voyager fits in the first quarter of this line.
      </p>
      <div className="scale-wrap">
        <canvas
          ref={ref}
          className="scale"
          style={{ height: HEIGHT }}
          role="img"
          aria-label={`To-scale line from the Sun to Voyager 1 at ${au.toFixed(1)} astronomical units. All the planets lie within 40 AU, the termination shock is at 94 AU and the heliopause at 121.6 AU.`}
        />
      </div>
    </section>
  );
}