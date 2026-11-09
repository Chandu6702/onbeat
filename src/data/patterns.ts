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
  {
    id: "fingerpick-arp",
    name: "Fingerstyle arpeggio",
    genre: "Folk",
    difficulty: "med",
    style: "fingerpick",
    // Thumb rolls the bass, then fingers climb through the chord — twice per bar.
    steps: ["P", "P", "P", "P", "P", "P", "P", "P"],
    picks: [[0], [2], [3], [-1], [1], [2], [3], [-1]],
  },
  {
    id: "fingerpick-travis",
    name: "Travis picking",
    genre: "Folk",
    difficulty: "hard",
    style: "fingerpick",
    // Alternating bass (root ↔ next bass string) under a steady treble pulse.
    steps: ["P", "P", "P", "P", "P", "P", "P", "P"],
    picks: [[0, -1], [-2], [1], [-1], [0], [-2], [1], [-1]],
  },
  {
    id: "fingerpick-ballad",
    name: "Fingerstyle ballad",
    genre: "Ballad",
    difficulty: "easy",
    style: "fingerpick",
    // Sparse and gentle — bass note, let the top strings ring.
    steps: ["P", "", "P", "P", "P", "", "P", "P"],
    picks: [[0], null, [-2], [-1], [1], null, [-2], [-1]],
  },
];

export const PATTERNS_BY_ID: Record<string, StrumPattern> = Object.fromEntries(
  PATTERNS.map((p) => [p.id, p]),
);

export function getPattern(id: string): StrumPattern {
  return PATTERNS_BY_ID[id] ?? PATTERNS[0];
}
