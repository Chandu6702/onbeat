import { PROGRESSIONS } from "@/data/progressions";
import { PATTERNS } from "@/data/patterns";
import type { Genre } from "@/data/types";

export interface GeneratedLoop {
  chords: string[];
  patternId: string;
  genre: Genre;
}

const PATTERN_FOR_GENRE: Record<Genre, string> = {
  Pop: "pop-duduudu",
  Folk: "folk-down",
  Rock: "rock-drive",
  Ballad: "ballad-slow",
};

function pick<T>(arr: T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Build a theory-safe, playable loop from the chords the user selected.
 * Prefers a known progression template whose chords the user has; otherwise
 * falls back to cycling the selected chords into a 4-bar loop.
 */
export function generateLoop(
  selected: string[],
  genre: Genre,
  rng: () => number = Math.random,
): GeneratedLoop {
  const set = new Set(selected);
  const templates = (PROGRESSIONS[genre] ?? []).filter((t) => t.every((c) => set.has(c)));

  let chords: string[];
  if (templates.length > 0) {
    chords = [...pick(templates, rng)];
  } else {
    const pool = selected.length > 0 ? selected : ["Em", "Am"];
    chords = Array.from({ length: 4 }, (_, i) => pool[i % pool.length]);
  }

  const patternId = PATTERN_FOR_GENRE[genre] ?? PATTERNS[0].id;
  return { chords, patternId, genre };
}
