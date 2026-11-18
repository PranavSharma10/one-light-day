/** What each engraving on the cover means. Written from NASA's explanation of the cover diagram. */
export type PartId = "record" | "side" | "pictures" | "pulsars" | "hydrogen" | "uranium";

export interface CoverPart {
  id: PartId;
  title: string;
  body: string[];
}

export const PARTS: CoverPart[] = [
  {
    id: "hydrogen",
    title: "Hydrogen: the key to every number",
    body: [
      "Start here. The two circles are a hydrogen atom in its two lowest energy states. The line and the single “|” between them say: the flip from one state to the other is our unit of time.",
      "That flip takes about 0.70 billionths of a second, and it gives off the famous 21-centimetre radio waves. Hydrogen is the most common element in the universe, so any scientist, anywhere, should know it.",
      "Every number on the cover is counted in these hydrogen units, written in binary: “|” means 1 and “—” means 0.",
    ],
  },
  {
    id: "record",
    title: "The record and its stylus",
    body: [
      "A drawing of the record, with the stylus already in the right place to start playing from the beginning.",
      "The marks around it are a binary number: the time one turn of the record should take. Decode it below.",
    ],
  },
  {
    id: "side",
    title: "Side view: which way to play",
    body: [
      "The record seen edge-on, with the stylus showing it plays from the outside in.",
      "The binary number underneath is the time to play one side: about an hour. In hydrogen units that's about 5.1 trillion flips.",
    ],
  },
  {
    id: "pictures",
    title: "How to turn the sound into pictures",
    body: [
      "The pictures on the record are stored as sound. The top drawing is the signal that starts a picture.",
      "Each picture is made of vertical lines, a bit like an old TV turned on its side. Lines 1, 2 and 3 are numbered in binary, and each line lasts about 8 milliseconds. The zigzag shows the lines are interlaced.",
      "The box of stripes says a full picture has 512 lines. The last box is the first picture on the record: a circle. If it comes out round, you're decoding it right.",
    ],
  },
  {
    id: "pulsars",
    title: "The pulsar map: where we live",
    body: [
      "The same map was sent on the Pioneer 10 and 11 plaques. It shows where our Sun is compared with 14 pulsars: dead stars that spin and flash like lighthouses, each with its own exact rhythm.",
      "The length of each line shows roughly how far away that pulsar is, and the binary along it gives its period in hydrogen units. The long line points to the centre of our galaxy.",
      "Pulsars slow down very slightly over time, so the map is also a clock. More on that further down.",
    ],
  },
  {
    id: "uranium",
    title: "The uranium clock",
    body: [
      "A tiny spot of ultra-pure uranium-238 is electroplated onto the cover. Half of any uranium-238 decays in about 4.5 billion years.",
      "By measuring how much of the spot has turned into other elements, a finder could work out how long ago the record left Earth. It's a second clock, to check against the pulsar map.",
    ],
  },
];
