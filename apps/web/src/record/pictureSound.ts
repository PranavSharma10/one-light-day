/**
 * Pictures as sound, the Golden Record way.
 *
 * A picture is cut into vertical lines. Each line becomes a short burst of sound: first a sync
 * pulse (a sharp dip that says "a new line starts here"), then the line's pixels from top to
 * bottom, with brighter pixels as higher voltages. Play the lines one after another and you hear
 * the picture. To get it back, find each sync pulse and read the samples after it as pixels.
 *
 * The real record also has 512 lines per picture, each about 8 milliseconds long. (It also
 * interlaces the lines; we keep them in order to keep things simple.)
 */
export const LINES = 512; // vertical lines (columns) per picture
export const ROWS = 384; // pixels per line, so pictures are 4:3
export const SYNC = 16; // samples of sync pulse before each line
export const LINE_SAMPLES = SYNC + ROWS;
export const SAMPLE_RATE = 48_000; // 400 samples at 48 kHz = 8.3 ms per line, close to the record's 8 ms

export const SYNC_LEVEL = -1;
export const BLACK = -0.6;
export const WHITE = 1;
const SYNC_THRESHOLD = -0.8; // anything below this is a sync pulse, never a pixel

/** Seconds of sound for one picture. */
export const PICTURE_SECONDS = (LINES * LINE_SAMPLES) / SAMPLE_RATE;

/** Grey pixels (0 = black, 1 = white), row by row, LINES wide and ROWS tall. */
export type Grey = Float32Array;

/** Picture → sound. */
export function encode(grey: Grey): Float32Array {
  const signal = new Float32Array(LINES * LINE_SAMPLES);
  let i = 0;
  for (let col = 0; col < LINES; col++) {
    for (let s = 0; s < SYNC; s++) signal[i++] = SYNC_LEVEL;
    for (let row = 0; row < ROWS; row++) {
      const v = Math.min(1, Math.max(0, grey[row * LINES + col]));
      signal[i++] = BLACK + v * (WHITE - BLACK);
    }
  }
  return signal;
}

/**
 * Sound → picture. Hunts for sync pulses, then reads each line's pixels.
 * Also returns where each line starts in the signal, so playback can draw lines as they're heard.
 */
export function decode(signal: Float32Array): { grey: Grey; lineStarts: number[] } {
  const grey = new Float32Array(LINES * ROWS);
  const lineStarts: number[] = [];
  let i = 0;
  while (i < signal.length && lineStarts.length < LINES) {
    if (signal[i] >= SYNC_THRESHOLD) {
      i++;
      continue;
    }
    const start = i;
    while (i < signal.length && signal[i] < SYNC_THRESHOLD) i++; // skip the pulse
    if (i + ROWS > signal.length) break;
    const col = lineStarts.length;
    for (let row = 0; row < ROWS; row++) {
      grey[row * LINES + col] = (signal[i + row] - BLACK) / (WHITE - BLACK);
    }
    lineStarts.push(start);
    i += ROWS;
  }
  return { grey, lineStarts };
}

/** The cover's first picture: a white circle on black, to check the picture isn't stretched. */
export function circlePicture(): Grey {
  const grey = new Float32Array(LINES * ROWS);
  const [cx, cy, r] = [LINES / 2, ROWS / 2, ROWS * 0.36];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < LINES; col++) {
      const d = Math.hypot(col - cx, row - cy);
      grey[row * LINES + col] = Math.abs(d - r) < 7 ? 1 : 0;
    }
  }
  return grey;
}
