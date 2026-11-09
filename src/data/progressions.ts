import type { Genre } from "./types";

// Theory-safe progression templates by genre. Each is a list of chord names,
// one per bar. The Phase 4 generator will filter these to the user's known
// chords; for now they double as demo/play-along content.
export const PROGRESSIONS: Record<Genre, string[][]> = {
  Pop: [
    ["G", "D", "Em", "C"],
    ["C", "G", "Am", "F"],
    ["Em", "C", "G", "D"],
  ],
  Folk: [
    ["G", "Em", "C", "D"],
    ["C", "G", "D", "G"],
    ["Am", "G", "C", "C"],
  ],
  Rock: [
    ["Em", "C", "G", "D"],
    ["A", "D", "E", "E"],
    ["Em", "Am", "D", "G"],
  ],
  Ballad: [
    ["C", "G", "Am", "F"],
    ["G", "D", "Em", "C"],
    ["Am", "F", "C", "G"],
  ],
};

// A simple starter loop that only uses the most common beginner chords.
export const DEMO_PROGRESSION = ["G", "D", "Em", "C"];
