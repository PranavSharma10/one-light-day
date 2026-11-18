import { describe, expect, it } from "vitest";
import { LINES, LINE_SAMPLES, PICTURE_SECONDS, ROWS, circlePicture, decode, encode } from "./pictureSound";

describe("pictures as sound", () => {
  it("one picture is a few seconds of sound, about 8 ms per line", () => {
    expect(PICTURE_SECONDS).toBeCloseTo(4.27, 2);
    expect((PICTURE_SECONDS / LINES) * 1000).toBeCloseTo(8.33, 1);
  });

  it("a picture survives the trip through sound", () => {
    const grey = circlePicture();
    const { grey: back, lineStarts } = decode(encode(grey));
    expect(lineStarts).toHaveLength(LINES);
    let worst = 0;
    for (let i = 0; i < grey.length; i++) worst = Math.max(worst, Math.abs(grey[i] - back[i]));
    expect(worst).toBeLessThan(1e-5);
  });

  it("finds each line by its sync pulse", () => {
    const { lineStarts } = decode(encode(circlePicture()));
    expect(lineStarts[0]).toBe(0);
    expect(lineStarts[1]).toBe(LINE_SAMPLES);
    expect(lineStarts[LINES - 1]).toBe((LINES - 1) * LINE_SAMPLES);
  });

  it("still finds the lines if the sound starts late", () => {
    const signal = encode(circlePicture());
    const late = new Float32Array(signal.length + 1000);
    late.set(signal, 1000);
    const { lineStarts, grey } = decode(late);
    expect(lineStarts[0]).toBe(1000);
    expect(grey[Math.round(ROWS / 2) * LINES + LINES / 2]).toBeCloseTo(0, 5); // centre of the circle is black
  });
});
