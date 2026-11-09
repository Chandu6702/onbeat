export interface PathStep {
  n: number;
  title: string;
  desc: string;
  href?: string;
  cta?: string;
  difficulty: "easy" | "med" | "hard";
}

// The suggested learning path. Guidance only — nothing here is locked.
// Research-backed order: Em → Am → D → G → C, one chord at a time, and drill
// each *transition* before adding the next chord (four smooth chords beat ten
// shaky ones). Em–C–G–D is the first real four-chord loop.
export const LEARNING_PATH: PathStep[] = [
  {
    n: 1,
    title: "Start with Em",
    desc: "The single easiest shape — two fingers, everything else open. (Em7 is even a one-finger option.)",
    difficulty: "easy",
  },
  {
    n: 2,
    title: "Add Am — then drill the change",
    desc: "Am sits right next to Em. Don't rush ahead: switch Em ↔ Am cleanly and count your changes.",
    href: "/practice?mode=drill",
    cta: "Open change drill",
    difficulty: "easy",
  },
  {
    n: 3,
    title: "Add D — the tricky jump",
    desc: "D uses only the top four strings, so Am → D is the first jump worth drilling slowly.",
    href: "/practice?mode=drill",
    cta: "Drill it",
    difficulty: "easy",
  },
  {
    n: 4,
    title: "Add G, then C",
    desc: "Now you have five chords. Drill D → G and the classic G ↔ C — the change most beginners fumble.",
    href: "/practice?mode=drill",
    cta: "Drill G ↔ C",
    difficulty: "med",
  },
  {
    n: 5,
    title: "Your first strum",
    desc: "Keep it to all down-strokes on a slow metronome. Time first, fancy later.",
    href: "/practice?mode=strum",
    cta: "Open strum trainer",
    difficulty: "easy",
  },
  {
    n: 6,
    title: "Your first real loop: Em–C–G–D",
    desc: "The four-chord loop behind countless songs. Play along slowly and let it count you in.",
    href: "/practice?mode=play&chords=Em,C,G,D&pattern=folk-down&bpm=75",
    cta: "Play the loop",
    difficulty: "med",
  },
  {
    n: 7,
    title: "Level up: down-up strumming",
    desc: "Add up-strokes for a poppier feel. Push the tempo only once it stays clean.",
    href: "/practice?mode=strum",
    cta: "Try it",
    difficulty: "med",
  },
  {
    n: 8,
    title: "Add colour: 7ths & sus chords",
    desc: "Em7, Cadd9, Asus2 and friends spice up your loops with almost no extra effort.",
    href: "/learn",
    cta: "Browse the library",
    difficulty: "med",
  },
  {
    n: 9,
    title: "Tackle F — via Fmaj7 first",
    desc: "The classic hurdle. Start with the no-barre Fmaj7, then build up to the full F barre.",
    difficulty: "hard",
  },
];
