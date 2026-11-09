// The Learn curriculum, structured into skill modules (Beginner → Intermediate
// → Advanced) the way real guitar syllabi are. Each module mixes chord lessons,
// strumming, theory, and practice — and every unit deep-links to the thing it
// teaches, so you can learn it then immediately go practice it.

export type UnitKind = "setup" | "chord" | "strum" | "theory" | "practice";

export interface Unit {
  id: string;
  kind: UnitKind;
  title: string;
  subtitle: string;
  href: string;
  // For progress ticks: a chord unit completes when its chords are known; a
  // theory unit when its lessons are done. Others are "try it" (no tick).
  chords?: string[];
  lessons?: string[];
}

export interface Module {
  id: "beginner" | "intermediate" | "advanced";
  name: string;
  level: string;
  blurb: string;
  units: Unit[];
}

export const KIND_ICON: Record<UnitKind, string> = {
  setup: "🎤",
  chord: "🎸",
  strum: "🎵",
  theory: "🎓",
  practice: "▶️",
};

export const KIND_LABEL: Record<UnitKind, string> = {
  setup: "Set up",
  chord: "Chord",
  strum: "Strumming",
  theory: "Theory",
  practice: "Practice",
};

export const CURRICULUM: Module[] = [
  {
    id: "beginner",
    name: "Beginner",
    level: "Start here",
    blurb: "Tune up, your first chords, first strum, and your first real loop.",
    units: [
      { id: "b-tune", kind: "setup", title: "Tune your guitar", subtitle: "Use the mic tuner before you play.", href: "/tuner" },
      { id: "b-em", kind: "chord", title: "Em — your first chord", subtitle: "Two fingers, everything open.", href: "/learn?chord=Em", chords: ["Em"] },
      { id: "b-am", kind: "chord", title: "Learn Am", subtitle: "Sits right next to Em.", href: "/learn?chord=Am", chords: ["Am"] },
      { id: "b-drill", kind: "practice", title: "Drill Em ↔ Am", subtitle: "Switch cleanly, hands-free.", href: "/practice?mode=drill" },
      { id: "b-strum", kind: "strum", title: "Your first strum", subtitle: "All down-strokes on a slow beat.", href: "/practice?mode=strum" },
      { id: "b-dgc", kind: "chord", title: "Add D, G and C", subtitle: "Three chords unlock most songs.", href: "/learn?chord=D", chords: ["D", "G", "C"] },
      { id: "b-half", kind: "theory", title: "Half & whole steps", subtitle: "The building blocks of everything.", href: "/theory?lesson=half-whole", lessons: ["half-whole"] },
      { id: "b-loop", kind: "practice", title: "Play Em–C–G–D", subtitle: "Your first four-chord loop.", href: "/practice?mode=play&chords=Em,C,G,D&pattern=folk-down&bpm=75" },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    level: "Level up",
    blurb: "Fuller chords, the down-up feel, 7ths, and how chords fit a key.",
    units: [
      { id: "i-ea", kind: "chord", title: "E and A", subtitle: "Bigger open shapes.", href: "/learn?chord=E", chords: ["E", "A"] },
      { id: "i-updown", kind: "strum", title: "Down-up pop strum", subtitle: "Add up-strokes for a poppier feel.", href: "/practice?mode=strum" },
      { id: "i-fmaj7", kind: "chord", title: "Fmaj7 — the easy F", subtitle: "No barre; a stepping stone to F.", href: "/learn?chord=Fmaj7", chords: ["Fmaj7"] },
      { id: "i-intervals", kind: "theory", title: "Intervals", subtitle: "Name the distances between notes.", href: "/theory?lesson=naming", lessons: ["naming", "major-minor-third"] },
      { id: "i-7ths", kind: "chord", title: "7th chords", subtitle: "G7, E7, A7 — bluesy colour.", href: "/learn?chord=G7", chords: ["G7", "E7", "A7"] },
      { id: "i-scales", kind: "theory", title: "Scales", subtitle: "The major & minor scale patterns.", href: "/theory?lesson=major-scale", lessons: ["major-scale", "minor-scale"] },
      { id: "i-key", kind: "practice", title: "Play in the key of G", subtitle: "G–D–Em–C, faster this time.", href: "/practice?mode=play&chords=G,D,Em,C&pattern=pop-duduudu&bpm=90" },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    level: "Go further",
    blurb: "Barre chords, colour chords, tighter rhythms, and writing your own.",
    units: [
      { id: "a-f", kind: "chord", title: "The full F barre", subtitle: "The classic hurdle — take it slow.", href: "/learn?chord=F", chords: ["F"] },
      { id: "a-bm", kind: "chord", title: "Bm barre", subtitle: "Your first minor barre chord.", href: "/learn?chord=Bm", chords: ["Bm"] },
      { id: "a-triads", kind: "theory", title: "Triads & building chords", subtitle: "How chords are stacked from scales.", href: "/theory?lesson=what-triad", lessons: ["what-triad", "major-minor-triad", "chords-in-key"] },
      { id: "a-colour", kind: "chord", title: "Colour chords: sus & add9", subtitle: "Cadd9, Dsus4 and friends.", href: "/learn?chord=Cadd9", chords: ["Cadd9", "Dsus4", "Asus2"] },
      { id: "a-16th", kind: "strum", title: "16th-note & offbeat rhythms", subtitle: "Busier, funkier strumming.", href: "/practice?mode=strum" },
      { id: "a-prog", kind: "theory", title: "Progressions", subtitle: "Why sequences work; write your own.", href: "/theory?lesson=diatonic", lessons: ["diatonic", "four-chord"] },
      { id: "a-song", kind: "practice", title: "Build a verse/chorus song", subtitle: "Multi-section loops in Create.", href: "/create" },
    ],
  },
];

export interface UnitProgress {
  knownChords: string[];
  completedLessons: string[];
}

/** A unit is "done" when its chords are known / its lessons are completed. */
export function unitDone(u: Unit, p: UnitProgress): boolean | null {
  if (u.chords) return u.chords.every((c) => p.knownChords.includes(c));
  if (u.lessons) return u.lessons.every((l) => p.completedLessons.includes(l));
  return null; // practice/setup units — no completion state
}
