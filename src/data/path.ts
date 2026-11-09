export interface PathStep {
  n: number;
  title: string;
  desc: string;
  href?: string;
  cta?: string;
  difficulty: "easy" | "med" | "hard";
}

// The suggested learning path. Guidance only — nothing here is locked.
export const LEARNING_PATH: PathStep[] = [
  {
    n: 1,
    title: "Your first two chords: Em & Am",
    desc: "The easiest open chords. Learn the shapes and hear them below.",
    difficulty: "easy",
  },
  {
    n: 2,
    title: "Your first change: Em ↔ Am",
    desc: "Switch cleanly between the two. Count how many you get in a minute.",
    href: "/practice?mode=drill",
    cta: "Open change drill",
    difficulty: "easy",
  },
  {
    n: 3,
    title: "Add C, G, and D",
    desc: "Three more open chords unlock most beginner songs.",
    difficulty: "easy",
  },
  {
    n: 4,
    title: "Your first strum",
    desc: "Start with all down-strokes on a slow metronome.",
    href: "/practice?mode=strum",
    cta: "Open strum trainer",
    difficulty: "easy",
  },
  {
    n: 5,
    title: "Your first play-along",
    desc: "Put it together — play along to a loop built from your chords.",
    href: "/practice?mode=play",
    cta: "Open play-along",
    difficulty: "easy",
  },
  {
    n: 6,
    title: "Level up: down-up strumming",
    desc: "Add up-strokes for a poppier feel. Push the tempo when it's clean.",
    href: "/practice?mode=strum",
    cta: "Try it",
    difficulty: "med",
  },
  {
    n: 7,
    title: "Tackle the F barre chord",
    desc: "The classic beginner hurdle. Take it slow — it clicks with practice.",
    difficulty: "hard",
  },
];
