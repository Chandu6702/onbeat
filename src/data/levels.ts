import { THEORY } from "./theory";

// The subset of progress state the milestones read.
export interface LevelProgress {
  knownChords: string[];
  bestChangesPerMin: number;
  creations: number;
  streak: number;
  sessions: number;
  completedLessons: string[];
}

export interface Milestone {
  id: string;
  label: string;
  done: (p: LevelProgress) => boolean;
}

export interface Level {
  n: number;
  name: string;
  tagline: string;
  milestones: Milestone[];
}

const moduleDone = (modId: string, p: LevelProgress) => {
  const mod = THEORY.find((m) => m.id === modId);
  return !!mod && mod.lessons.every((l) => p.completedLessons.includes(l.id));
};
const allTheoryDone = (p: LevelProgress) =>
  THEORY.every((m) => m.lessons.every((l) => p.completedLessons.includes(l.id)));

// A real curriculum: each level completes when its milestones are met, drawn
// from actual progress across Learn, Practice, and Theory — not just XP.
export const LEVELS: Level[] = [
  {
    n: 1,
    name: "First strings",
    tagline: "Get a clean sound out of the guitar.",
    milestones: [
      { id: "chords2", label: "Learn your first 2 chords", done: (p) => p.knownChords.length >= 2 },
      { id: "practice1", label: "Finish a practice session", done: (p) => p.sessions >= 1 },
      { id: "lesson1", label: "Read a theory lesson", done: (p) => p.completedLessons.length >= 1 },
    ],
  },
  {
    n: 2,
    name: "Clean changes",
    tagline: "Switch chords without stopping.",
    milestones: [
      { id: "chords4", label: "Know 4 open chords", done: (p) => p.knownChords.length >= 4 },
      { id: "cpm20", label: "Hit 20 changes/min in the drill", done: (p) => p.bestChangesPerMin >= 20 },
      { id: "streak3", label: "Practice 3 days in a row", done: (p) => p.streak >= 3 },
    ],
  },
  {
    n: 3,
    name: "Strum & play",
    tagline: "Play along and make your own loops.",
    milestones: [
      { id: "create1", label: "Create and save a loop", done: (p) => p.creations >= 1 },
      { id: "cpm40", label: "Hit 40 changes/min", done: (p) => p.bestChangesPerMin >= 40 },
      { id: "intervals", label: "Finish the Intervals module", done: (p) => moduleDone("intervals", p) },
    ],
  },
  {
    n: 4,
    name: "Chords & keys",
    tagline: "Bigger shapes and how chords fit a key.",
    milestones: [
      { id: "chords8", label: "Know 8 chords", done: (p) => p.knownChords.length >= 8 },
      { id: "triads", label: "Finish the Triads & chords module", done: (p) => moduleDone("triads", p) },
      { id: "cpm60", label: "Hit 60 changes/min", done: (p) => p.bestChangesPerMin >= 60 },
    ],
  },
  {
    n: 5,
    name: "Musician",
    tagline: "Theory, barre chords, and full songs.",
    milestones: [
      { id: "chords10", label: "Know 10+ chords", done: (p) => p.knownChords.length >= 10 },
      { id: "alltheory", label: "Finish every theory module", done: allTheoryDone },
      { id: "sessions15", label: "Log 15 practice sessions", done: (p) => p.sessions >= 15 },
    ],
  },
];

export interface LevelState extends Level {
  total: number;
  doneCount: number;
  complete: boolean;
  metIds: string[];
}

export interface LevelStatus {
  levels: LevelState[];
  current: LevelState;
  currentLevelNumber: number;
  completedLevels: number;
}

// The user's level = the first level they haven't fully completed (they're
// "working on" it). Everything below is done; progress within is the fraction.
export function levelStatus(p: LevelProgress): LevelStatus {
  const levels: LevelState[] = LEVELS.map((lv) => {
    const met = lv.milestones.filter((m) => m.done(p));
    return {
      ...lv,
      total: lv.milestones.length,
      doneCount: met.length,
      complete: met.length === lv.milestones.length,
      metIds: met.map((m) => m.id),
    };
  });
  const firstIncomplete = levels.findIndex((l) => !l.complete);
  const current = firstIncomplete === -1 ? levels[levels.length - 1] : levels[firstIncomplete];
  return {
    levels,
    current,
    currentLevelNumber: current.n,
    completedLevels: levels.filter((l) => l.complete).length,
  };
}
