import type { Chord } from "./types";

// Guitar chords. MIDI notes lowest-first; shape is low-E to high-E.
export const CHORDS: Record<string, Chord> = {
  Em: { name: "Em", difficulty: "easy", midi: [40, 47, 52, 55, 59, 64], shape: [0, 2, 2, 0, 0, 0] },
  Am: { name: "Am", difficulty: "easy", midi: [45, 52, 57, 60, 64], shape: ["x", 0, 2, 2, 1, 0] },
  C: { name: "C", difficulty: "easy", midi: [48, 52, 55, 60, 64], shape: ["x", 3, 2, 0, 1, 0] },
  G: { name: "G", difficulty: "easy", midi: [43, 47, 50, 55, 59, 67], shape: [3, 2, 0, 0, 0, 3] },
  D: { name: "D", difficulty: "easy", midi: [50, 57, 62, 66], shape: ["x", "x", 0, 2, 3, 2] },
  E: { name: "E", difficulty: "med", midi: [40, 47, 52, 56, 59, 64], shape: [0, 2, 2, 1, 0, 0] },
  A: { name: "A", difficulty: "med", midi: [45, 52, 57, 61, 64], shape: ["x", 0, 2, 2, 2, 0] },
  Dm: { name: "Dm", difficulty: "med", midi: [50, 57, 62, 65], shape: ["x", "x", 0, 2, 3, 1] },
  F: { name: "F", difficulty: "hard", midi: [41, 48, 53, 57, 60, 65], shape: [1, 3, 3, 2, 1, 1] },
  Bm: { name: "Bm", difficulty: "hard", midi: [47, 54, 59, 62, 66], shape: ["x", 2, 4, 4, 3, 2] },
};

export const CHORD_NAMES = Object.keys(CHORDS);

export function getChord(name: string): Chord | undefined {
  return CHORDS[name];
}
