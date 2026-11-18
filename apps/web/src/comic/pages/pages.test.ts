/// <reference types="node" />
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PAGES } from "./index";

describe("comic pages", () => {
  it("has a unique id for every page", () => {
    const ids = PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers the chapters 1, 2, 3… in order", () => {
    expect(PAGES.map((p) => p.chapter)).toEqual(PAGES.map((_, i) => i + 1));
  });

  it("gives every page words to read aloud", () => {
    for (const p of PAGES) expect(p.speech.length, p.id).toBeGreaterThan(0);
  });

  it("backs every page with a real NASA image, credit and facts", () => {
    for (const p of PAGES) {
      expect(existsSync(`public${p.real.image}`), p.real.image).toBe(true);
      expect(p.real.source, p.id).toMatch(/^https:\/\//);
      expect(p.real.facts.length, p.id).toBeGreaterThanOrEqual(2);
    }
  });
});
