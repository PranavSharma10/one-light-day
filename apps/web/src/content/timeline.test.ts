import { describe, expect, it } from "vitest";
import timeline from "./timeline.json";
/// <reference types="node" />
import { existsSync } from "node:fs";

describe("timeline content", () => {
  it("has a file in public/ for every image", () => {
    for (const m of timeline as Array<{ image?: { src: string } }>) {
      if (m.image) expect(existsSync(`public${m.image.src}`), m.image.src).toBe(true);
    }
  });
  it("has a unique id for every moment", () => {
    const ids = timeline.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is in date order", () => {
    const dates = timeline.map((m) => m.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("keeps summaries short enough for the preview card", () => {
    for (const m of timeline) expect(m.summary.length).toBeLessThanOrEqual(120);
  });

  it("credits every image with its source", () => {
    for (const m of timeline as Array<{ image?: { credit: string; source: string } }>) {
      if (m.image) {
        expect(m.image.credit).toBeTruthy();
        expect(m.image.source).toMatch(/^https:\/\//);
      }
    }
  });
});