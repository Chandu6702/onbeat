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
];

export const PATTERNS_BY_ID: Record<string, StrumPattern> = Object.fromEntries(
  PATTERNS.map((p) => [p.id, p]),
);

export function getPattern(id: string): StrumPattern {
  return PATTERNS_BY_ID[id] ?? PATTERNS[0];
}
