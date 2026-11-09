import type { StrumPattern } from "./types";

// Strumming patterns, one entry per eighth-note (8 = one 4/4 bar).
// D = down, U = up, "" = rest/miss.
export const PATTERNS: StrumPattern[] = [
  {
    id: "folk-down",
    name: "All down",
    genre: "Folk",
    difficulty: "easy",
    steps: ["D", "", "D", "", "D", "", "D", ""],
  },
  {
    id: "pop-duduudu",
    name: "Down-up pop",
    genre: "Pop",
    difficulty: "med",
    steps: ["D", "", "D", "U", "", "U", "D", "U"],
  },
  {
    id: "rock-drive",
    name: "Rock drive",
    genre: "Rock",
    difficulty: "med",
    steps: ["D", "", "", "U", "D", "", "D", "U"],
  },
  {
    id: "ballad-slow",
    name: "Slow ballad",
    genre: "Ballad",
    difficulty: "easy",
    steps: ["D", "", "", "", "D", "U", "", ""],
  },
  {
    id: "metronome-only",
    name: "Metronome only",
    genre: "Folk",
    difficulty: "easy",
    // No strums — just the click. Good for building time before adding a hand.
    steps: ["", "", "", "", "", "", "", ""],
  },
  {
    id: "offbeat-reggae",
    name: "Offbeat (reggae)",
    genre: "Rock",
    difficulty: "med",
    // Up-strokes on the "and" of each beat — the reggae/ska skank.
    steps: ["", "U", "", "U", "", "U", "", "U"],
  },
  {
    id: "rock-eighths",
    name: "Palm-mute drive",
    genre: "Rock",
    difficulty: "med",
    // Steady down-strokes on every eighth — chug it with a palm mute.
    steps: ["D", "D", "D", "D", "D", "D", "D", "D"],
  },
  {
    id: "pop-16th",
    name: "16th-note pop",
    genre: "Pop",
    difficulty: "hard",
    subdivision: "16n",
    // One bar on a 16th grid (16 slots).
    steps: ["D", "", "", "U", "", "U", "D", "U", "D", "", "", "U", "", "U", "D", "U"],
  },
];

export const PATTERNS_BY_ID: Record<string, StrumPattern> = Object.fromEntries(
  PATTERNS.map((p) => [p.id, p]),
);

export function getPattern(id: string): StrumPattern {
  return PATTERNS_BY_ID[id] ?? PATTERNS[0];
}
