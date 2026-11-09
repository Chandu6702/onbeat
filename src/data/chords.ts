import type { Chord } from "./types";

// Guitar chords. MIDI notes lowest-first; shape is low-E to high-E.
// `fingers` aligns to `shape` (1=index, 2=middle, 3=ring, 4=pinky; null = open/muted).
export const CHORDS: Record<string, Chord> = {
  Em: {
    name: "Em",
    difficulty: "easy",
    midi: [40, 47, 52, 55, 59, 64],
    shape: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    tip: "Two fingers, both on the 2nd fret (A and D strings). Let every other string ring open.",
    mistakes: [
      "Muting the open high strings — arch your fingers so the tips press down.",
      "Fretting too far behind the fret, which makes the notes buzz.",
    ],
  },
  Am: {
    name: "Am",
    difficulty: "easy",
    midi: [45, 52, 57, 60, 64],
    shape: ["x", 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    tip: "Index on the 1st fret (B string); middle and ring on the 2nd fret (D and G). Don't play the low E.",
    mistakes: [
      "Strumming the low E — start your strum from the A string.",
      "The ring finger flattening onto the B string and deadening it.",
    ],
  },
  C: {
    name: "C",
    difficulty: "easy",
    midi: [48, 52, 55, 60, 64],
    shape: ["x", 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    tip: "Ring on the 3rd fret (A), middle on the 2nd fret (D), index on the 1st fret (B). Skip the low E.",
    mistakes: [
      "Letting the ring finger brush the open D or G string.",
      "Strumming the low E — it's muted (×).",
    ],
  },
  G: {
    name: "G",
    difficulty: "easy",
    midi: [43, 47, 50, 55, 59, 67],
    shape: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    tip: "Middle on the 3rd fret (low E), index on the 2nd fret (A), ring on the 3rd fret (high E). Middle strings stay open.",
    mistakes: [
      "Cramping your fingers — spread them out across the neck.",
      "A leaning finger muting the open D, G, or B.",
    ],
  },
  D: {
    name: "D",
    difficulty: "easy",
    midi: [50, 57, 62, 66],
    shape: ["x", "x", 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    tip: "Index on the 2nd fret (G), ring on the 3rd fret (B), middle on the 2nd fret (high E). Strum from the D string.",
    mistakes: [
      "Strumming the low E or A — only the top four strings should sound.",
      "Fingers bunched together so the high E buzzes.",
    ],
  },
  E: {
    name: "E",
    difficulty: "med",
    midi: [40, 47, 52, 56, 59, 64],
    shape: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    tip: "Index on the 1st fret (G), middle and ring on the 2nd fret (A and D). All six strings ring.",
    mistakes: [
      "A weak index finger letting the G string buzz.",
      "Fingers tilting over and muting the open B or high E.",
    ],
  },
  A: {
    name: "A",
    difficulty: "med",
    midi: [45, 52, 57, 61, 64],
    shape: ["x", 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    tip: "Three fingers in a row on the 2nd fret (D, G, B). Squeeze them into one fret space. Skip the low E.",
    mistakes: [
      "Fingers too crowded for one fret — angle them or use a small barre.",
      "The ring finger muting the open high E.",
    ],
  },
  Dm: {
    name: "Dm",
    difficulty: "med",
    midi: [50, 57, 62, 65],
    shape: ["x", "x", 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    tip: "Index on the 1st fret (high E), middle on the 2nd fret (G), ring on the 3rd fret (B). Top four strings only.",
    mistakes: [
      "Playing the low E or A strings.",
      "The ring finger leaning onto and muting the high E.",
    ],
  },
  F: {
    name: "F",
    difficulty: "hard",
    midi: [41, 48, 53, 57, 60, 65],
    shape: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    tip: "Barre all six strings at the 1st fret with your index, then add middle (G, 2nd fret), ring (A, 3rd) and pinky (D, 3rd). Go slow — it's the toughest beginner chord.",
    mistakes: [
      "A weak barre — press the index on its bony side, close to the fret.",
      "Thumb too high; drop it behind the neck for squeezing power.",
      "If it won't ring, try Fmaj7 or a mini-F first.",
    ],
  },
  Bm: {
    name: "Bm",
    difficulty: "hard",
    midi: [47, 54, 59, 62, 66],
    shape: ["x", 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    tip: "Barre the top five strings at the 2nd fret with your index, then middle (B, 3rd fret), ring (D, 4th) and pinky (G, 4th). Skip the low E.",
    mistakes: [
      "The barre not firm enough — roll the index slightly onto its edge.",
      "Playing the low E string.",
      "The thumb creeping over the top of the neck.",
    ],
  },
};

export const CHORD_NAMES = Object.keys(CHORDS);

export function getChord(name: string): Chord | undefined {
  return CHORDS[name];
}
