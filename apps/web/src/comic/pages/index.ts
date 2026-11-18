import type { ComicPageData } from "../types";
import { page01 } from "./p01-hello-world";
import { page02 } from "./p02-golden-record";
import { page03 } from "./p03-looking-back";
import { page04 } from "./p04-jupiter";
import { page05 } from "./p05-hardest-choice";
import { page06 } from "./p06-pale-blue-dot";
import { page07 } from "./p07-alone";
import { page08 } from "./p08-the-edge";
import { page09 } from "./p09-getting-old";
import { page10 } from "./p10-confused";
import { page11 } from "./p11-letting-go";
import { page12 } from "./p12-one-light-day";
import { page13 } from "./p13-never-stop";

/** The comic, in reading order. Add each new page here. */
export const PAGES: ComicPageData[] = [
  page01, page02, page03, page04, page05, page06, page07,
  page08, page09, page10, page11, page12, page13,
];
