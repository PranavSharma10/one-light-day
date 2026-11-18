import type { ComponentType } from "react";

/** The real NASA picture and facts shown under a comic page. */
export interface RealThing {
  image: string;
  alt: string;
  credit: string;
  source: string;
  fit?: "cover" | "contain";
  facts: string[];
}

export interface ComicPageData {
  id: string;
  chapter: number;
  title: string;
  years: string;
  /** Everything said on the page, in reading order. Used for screen readers and read-aloud. */
  speech: string[];
  real: RealThing;
  Art: ComponentType;
}
