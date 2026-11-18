import type { ComicPageData } from "../types";
import { page01 } from "./p01-hello-world";
import { page02 } from "./p02-golden-record";
import { page03 } from "./p03-looking-back";
import { page04 } from "./p04-jupiter";
import { page05 } from "./p05-hardest-choice";

/** The comic, in reading order. Add each new page here. */
export const PAGES: ComicPageData[] = [page01, page02, page03, page04, page05];
