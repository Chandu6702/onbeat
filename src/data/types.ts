// Shared music-domain types. Pure data — no UI, no audio library imports.

export type Difficulty = "easy" | "med" | "hard";

export type Genre = "Pop" | "Folk" | "Rock" | "Ballad";

// A single strum slot within a bar: down, up, or a rest.
export type StrumStep = "D" | "U" | "";

export interface Chord {
  name: string;
  // MIDI note numbers, lowest string/pitch first. Convert to frequency at play time.
  midi: number[];
  // Guitar shape, low-E to high-E: fret number, 0 = open, "x" = muted.
  shape: (number | "x")[];
  difficulty: Difficulty;
}

export interface StrumPattern {
  id: string;
  name: string;
  genre: Genre;
  difficulty: Difficulty;
  // One entry per eighth-note. 8 entries = one 4/4 bar.
  steps: StrumStep[];
}

export interface Progression {
  // Chord names, one per bar.
  chords: string[];
}
