import type { Genre } from "./types";

export interface GenrePrimer {
  name: Genre;
  blurb: string;
  feel: string;
  chords: string[];
  patternId: string;
}

export const GENRES: GenrePrimer[] = [
  {
    name: "Pop",
    blurb: "Bright, catchy, built on four repeating chords. Most modern hits live here.",
    feel: "Steady down-up groove with a bit of bounce.",
    chords: ["G", "D", "Em", "C"],
    patternId: "pop-duduudu",
  },
  {
    name: "Folk",
    blurb: "Warm and simple — the classic campfire sound. Great for your very first songs.",
    feel: "Even down-strums, relaxed and open.",
    chords: ["G", "Em", "C", "D"],
    patternId: "folk-down",
  },
  {
    name: "Rock",
    blurb: "Driving and punchy. Fewer, stronger strums with attitude.",
    feel: "Accented downs with syncopated ups.",
    chords: ["Em", "C", "G", "D"],
    patternId: "rock-drive",
  },
  {
    name: "Ballad",
    blurb: "Slow and emotional. Space between chords lets each one ring.",
    feel: "Sparse, gentle, lots of sustain.",
    chords: ["C", "G", "Am", "F"],
    patternId: "ballad-slow",
  },
];
