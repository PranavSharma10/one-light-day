import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { LINES, LINE_SAMPLES, PICTURE_SECONDS, ROWS, SAMPLE_RATE, circlePicture, decode, encode, type Grey } from "./pictureSound";

type Source = "circle" | "record" | "launch" | "yours";

const PICTURES: { id: Source; label: string; src?: string }[] = [
  { id: "circle", label: "The first picture: a circle" },
  { id: "record", label: "The Golden Record", src: "/images/golden-record.webp" },
  { id: "launch", label: "Voyager's launch", src: "/images/timeline/launch.jpg" },
  { id: "yours", label: "Your own photo" },
];

/** Load an image and squash it to LINES × ROWS grey pixels (cropped to fill, like a TV). */
async function toGrey(src: string): Promise<Grey> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = LINES;
  canvas.height = ROWS;
  const ctx = canvas.getContext("2d")!;
  const scale = Math.max(LINES / img.naturalWidth, ROWS / img.naturalHeight);
  const [w, h] = [img.naturalWidth * scale, img.naturalHeight * scale];
  ctx.drawImage(img, (LINES - w) / 2, (ROWS - h) / 2, w, h);
  const { data } = ctx.getImageData(0, 0, LINES, ROWS);
  const grey = new Float32Array(LINES * ROWS);
  for (let i = 0; i < grey.length; i++) {
    grey[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  }
  return grey;
}

/** Grey pixels to a gold-tinted image, to match the site. */
function toImageData(grey: Grey): ImageData {
  const out = new ImageData(LINES, ROWS);
  for (let i = 0; i < grey.length; i++) {
    const v = Math.min(1, Math.max(0, grey[i])) * 255;
    out.data[i * 4] = v;
    out.data[i * 4 + 1] = v * 0.88;
    out.data[i * 4 + 2] = v * 0.62;
    out.data[i * 4 + 3] = 255;
  }
  return out;
}

/** 16b: turn a picture into sound, play it, and rebuild the picture from that sound, line by line. */
export default function PictureToSound() {
  const [source, setSource] = useState<Source>("circle");
  const [file, setFile] = useState<File | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // lines decoded so far
  const [error, setError] = useState<string | null>(null);

  const screen = useRef<HTMLCanvasElement>(null);
  const scope = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef<() => void>(() => {});

  // Stop the sound if you leave the page mid-picture.
  useEffect(() => () => stopRef.current(), []);

  const pick = (id: Source) => {
    stopRef.current();
    setSource(id);
    setProgress(0);
    setError(null);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    pick("yours");
  };

  async function send() {
    setError(null);
    let grey: Grey;
    let objectUrl: string | null = null;
    try {
      if (source === "circle") grey = circlePicture();
      else if (source === "yours") {
        if (!file) return setError("Choose a photo first.");
        objectUrl = URL.createObjectURL(file); // stays on your device: nothing is uploaded
        grey = await toGrey(objectUrl);
      } else grey = await toGrey(PICTURES.find((p) => p.id === source)!.src!);
    } catch {
      return setError("That picture couldn't be opened. Try another one.");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }

    // 1. Picture → sound
    const signal = encode(grey);
    // 2. Sound → picture (this is what a finder would do with the record)
    const { grey: decoded, lineStarts } = decode(signal);
    const picture = toImageData(decoded);

    // 3. Play the sound, and draw each line as soon as it has been heard.
    const audio = new AudioContext({ sampleRate: SAMPLE_RATE });
    const buffer = audio.createBuffer(1, signal.length, SAMPLE_RATE);
    buffer.copyToChannel(signal, 0);
    const node = audio.createBufferSource();
    node.buffer = buffer;
    const gain = audio.createGain();
    gain.gain.value = muted ? 0 : 0.18; // it's a harsh buzz: keep it quiet
    node.connect(gain).connect(audio.destination);

    const ctx = screen.current!.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, LINES, ROWS);
    const sctx = scope.current!.getContext("2d")!;

    let frame = 0;
    let drawn = 0;
    const startAt = audio.currentTime + 0.1;
    const tick = () => {
      const heard = Math.max(0, (audio.currentTime - startAt) * SAMPLE_RATE);
      let lines = drawn;
      while (lines < lineStarts.length && lineStarts[lines] + LINE_SAMPLES <= heard) lines++;
      if (lines > drawn) {
        ctx.putImageData(picture, 0, 0, drawn, 0, lines - drawn, ROWS);
        drawn = lines;
        setProgress(lines);
      }
      drawScope(sctx, signal, Math.min(lineStarts.length - 1, lines));
      if (drawn < lineStarts.length) frame = requestAnimationFrame(tick);
      else stop();
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      node.onended = null;
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
      void audio.close();
      setPlaying(false);
      stopRef.current = () => {};
    };
    stopRef.current = stop;

    setPlaying(true);
    setProgress(0);
    node.start(startAt);
    frame = requestAnimationFrame(tick);
  }

  function drawScope(sctx: CanvasRenderingContext2D, signal: Float32Array, line: number) {
    const { width, height } = sctx.canvas;
    sctx.clearRect(0, 0, width, height);
    sctx.strokeStyle = "#d9b45a";
    sctx.lineWidth = 1.5;
    sctx.beginPath();
    const start = line * LINE_SAMPLES;
    for (let s = 0; s < LINE_SAMPLES; s++) {
      const x = (s / LINE_SAMPLES) * width;
      const y = height / 2 - signal[start + s] * (height / 2 - 4);
      if (s === 0) sctx.moveTo(x, y);
      else sctx.lineTo(x, y);
    }
    sctx.stroke();
  }

  return (
    <section className="gr-section" aria-labelledby="gr-pic-h">
      <header className="gr-section-head">
        <p className="eyebrow">Part 2 · The pictures</p>
        <h2 id="gr-pic-h">Hear a picture, then watch it come back</h2>
        <p className="gr-lede">
          The record's pictures aren't printed on it. They're stored as sound: each picture is cut into 512 vertical lines, and each
          line becomes about 8 milliseconds of signal. Choose a picture, send it, and watch it being rebuilt from nothing but that
          sound.
        </p>
      </header>

      <div className="gr-pic">
        <div className="gr-pic-controls">
          <fieldset>
            <legend>Picture</legend>
            {PICTURES.map((p) => (
              <label key={p.id} className={source === p.id ? "current" : ""}>
                <input type="radio" name="gr-picture" checked={source === p.id} onChange={() => pick(p.id)} disabled={playing} />
                {p.label}
              </label>
            ))}
            {source === "yours" && (
              <div className="gr-file">
                <input type="file" accept="image/*" onChange={onFile} disabled={playing} aria-label="Choose your photo" />
                <small>Your photo never leaves your device. Everything happens in your browser.</small>
              </div>
            )}
          </fieldset>

          <label className="gr-mute">
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} disabled={playing} /> Decode silently
          </label>

          {playing ? (
            <button type="button" className="btn ghost" onClick={() => stopRef.current()}>
              Stop
            </button>
          ) : (
            <button type="button" className="btn" onClick={send}>
              Send it as sound
            </button>
          )}
          {error && <p className="gr-error">{error}</p>}
          <p className="gr-small">
            {progress > 0 ? `${progress} of ${LINES} lines decoded.` : `One picture is ${PICTURE_SECONDS.toFixed(1)} seconds of sound.`}
            {!muted && " It sounds like a buzz: that's the picture."}
          </p>
        </div>

        <div className="gr-pic-out">
          <canvas ref={screen} width={LINES} height={ROWS} className="gr-screen" aria-label="The rebuilt picture" role="img" />
          <canvas ref={scope} width={512} height={90} className="gr-scope" aria-hidden="true" />
          <p className="gr-small">
            Above: the signal for the line being decoded. The deep dip at the start is the sync pulse that marks a new line.
          </p>
        </div>
      </div>
    </section>
  );
}
