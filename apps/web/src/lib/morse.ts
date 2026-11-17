// International Morse code. Timing in "units": dot = 1, dash = 3,
// gap inside a letter = 1, between letters = 3, between words = 7.

export const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

export interface Pulse {
  on: boolean;   // lamp lit?
  units: number; // how long
  char: number;  // which letter it belongs to
}

/** Turn text into the on/off pulses that blink it in Morse. */
export function toPulses(text: string): Pulse[] {
  const pulses: Pulse[] = [];
  const chars = text.toUpperCase().split("");
  chars.forEach((ch, ci) => {
    if (ch === " ") {
      if (pulses.length) pulses[pulses.length - 1].units += 4; // 3 already added -> 7
      return;
    }
    const code = MORSE[ch];
    if (!code) throw new Error(`No Morse code for ${JSON.stringify(ch)}`);
    code.split("").forEach((symbol, si) => {
      pulses.push({ on: true, units: symbol === "." ? 1 : 3, char: ci });
      if (si < code.length - 1) pulses.push({ on: false, units: 1, char: ci });
    });
    if (ci < chars.length - 1) pulses.push({ on: false, units: 3, char: ci });
  });
  return pulses;
}

export const totalUnits = (pulses: Pulse[]) => pulses.reduce((sum, p) => sum + p.units, 0);

/** Where playback is after `units` have passed: is the lamp on, and how many letters are complete? */
export function stateAt(pulses: Pulse[], units: number): { on: boolean; charsDone: number; done: boolean } {
  let t = 0;
  for (let i = 0; i < pulses.length; i++) {
    const p = pulses[i];
    if (units < t + p.units) {
      // A letter is complete once we're in the 3-unit gap after its last signal.
      const charsDone = !p.on && p.units >= 3 ? p.char + 1 : p.char;
      return { on: p.on, charsDone, done: false };
    }
    t += p.units;
  }
  return { on: false, charsDone: (pulses.at(-1)?.char ?? -1) + 1, done: true };
}