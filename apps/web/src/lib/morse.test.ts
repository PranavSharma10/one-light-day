import { describe, expect, it } from "vitest";
import { MORSE, stateAt, toPulses, totalUnits } from "./morse";

describe("Morse code", () => {
  it("encodes Voyager 1's call sign", () => {
    expect("VGR1".split("").map((c) => MORSE[c]).join(" ")).toBe("...- --. .-. .----");
  });

  it("uses standard timing: VGR1 is 51 units long", () => {
    // V 9 + G 9 + R 7 + 1 17, plus three 3-unit gaps between letters
    expect(totalUnits(toPulses("VGR1"))).toBe(51);
  });

  it("starts with the lamp on and finishes with all four letters", () => {
    const p = toPulses("VGR1");
    expect(stateAt(p, 0)).toEqual({ on: true, charsDone: 0, done: false });
    expect(stateAt(p, 9.5)).toEqual({ on: false, charsDone: 1, done: false }); // gap after V
    expect(stateAt(p, 51)).toEqual({ on: false, charsDone: 4, done: true });
  });

  it("rejects characters it can't send", () => {
    expect(() => toPulses("V!")).toThrow();
  });
});