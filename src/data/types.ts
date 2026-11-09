// Shared music-domain types. Pure data — no UI, no audio library imports.

export type Difficulty = "easy" | "med" | "hard";

export type Genre = "Pop" | "Folk" | "Rock" | "Ballad";

// Chord families, used to group the library. Ordered easiest-concept first.
export type ChordType = "Major" | "Minor" | "7th" | "m7" | "sus" | "add9" | "Power";

// A single slot within a bar: down-strum, up-strum, a fingerpicked pluck, or a rest.
export type StrumStep = "D" | "U" | "P" | "";

export interface Chord {
  name: string;
  // MIDI note numbers, lowest string/pitch first. Convert to frequency at play time.
  midi: number[];
  // Guitar shape, low-E to high-E: fret number, 0 = open, "x" = muted.
  shape: (number | "x")[];
  difficulty: Difficulty;
  // Chord family for library grouping.
  type: ChordType;
  // Optional teaching data (chord detail pages). Aligned to `shape`, low-E to
  // high-E: fretting finger 1–4 (1=index … 4=pinky), or null for open/muted.
  fingers?: (number | null)[];
  // One-line "how to fret this" coaching tip.
  tip?: string;
  // Common beginner mistakes for this shape.
  mistakes?: string[];
}

export interface StrumPattern {
  id: string;
  name: string;
  genre: Genre;
  difficulty: Difficulty;
  // One entry per grid slot. With the default "8n" grid, 8 entries = one 4/4
  // bar; with "16n", 16 entries = one bar.
  steps: StrumStep[];
  // Grid resolution. Defaults to "8n" (eighth-notes).
  subdivision?: "8n" | "16n";
  // Playback style. "strum" (default) sweeps the whole chord per D/U step.
  // "fingerpick" plucks only the strings named in `picks` for each slot.
  style?: "strum" | "fingerpick";
  // Fingerpicking: one entry per slot, each a list of string indices into the
  // chord's sounding notes (0 = lowest/bass). Negative counts from the top
  // (-1 = highest string). null/empty = rest. Only used when style is "fingerpick".
  picks?: (number[] | null)[];
}

export interface Progression {
  // Chord names, one per bar.
  chords: string[];
}
