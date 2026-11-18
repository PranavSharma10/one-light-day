import { describe, expect, it } from "vitest";
import { hasWords, toSpoken } from "./useReadAloud";
import { PAGES } from "../comic/pages";

describe("toSpoken", () => {
  it("turns robot gibberish into something sayable", () => {
    expect(toSpoken("#@%! 0101... &?! Why can't I say")).toBe("! beep boop ... ?! Why can't I say");
  });

  it("leaves ordinary sentences alone", () => {
    expect(toSpoken("Hello! I hear you... a whole day later!")).toBe("Hello! I hear you... a whole day later!");
  });

  it("keeps numbers and years", () => {
    expect(toSpoken("You worked for 49 years.")).toBe("You worked for 49 years.");
  });
});

describe("hasWords", () => {
  it("knows a silent bubble from a spoken one", () => {
    expect(hasWords("...")).toBe(false);
    expect(hasWords("Beep!")).toBe(true);
  });
});

describe("every page can be read aloud", () => {
  it.each(PAGES.map((p) => [p.chapter, p] as const))("chapter %i has something to say", (_, page) => {
    expect(page.speech.length).toBeGreaterThan(0);
    expect(page.speech.some((line) => hasWords(toSpoken(line)))).toBe(true);
  });
});
