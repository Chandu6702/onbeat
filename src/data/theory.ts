// Music-theory curriculum — a "GeeksforGeeks for music" track. Research-backed
// beginner order: Intervals → Scales → Triads → Diatonic progressions.
// Demos are MIDI arrays played by the guitar engine (melodic or harmonic).

export interface TheoryDemo {
  label: string;
  midi: number[];
  /** play as a chord (together) instead of one note at a time */
  harmonic?: boolean;
}

export interface TheoryLesson {
  id: string;
  title: string;
  minutes: number;
  /** paragraphs; a line beginning with "- " renders as a bullet */
  body: string[];
  keyPoints: string[];
  demos?: TheoryDemo[];
  quiz?: { q: string; answer: string };
}

export interface TheoryModule {
  id: string;
  name: string;
  blurb: string;
  lessons: TheoryLesson[];
}

// MIDI helpers for readability: C4 = 60.
export const THEORY: TheoryModule[] = [
  {
    id: "intervals",
    name: "Intervals",
    blurb: "The distances between notes — the building blocks of everything else.",
    lessons: [
      {
        id: "half-whole",
        title: "Half steps & whole steps",
        minutes: 3,
        body: [
          "An interval is just the distance between two notes. The two smallest are the half step and the whole step.",
          "- A half step is the smallest move in Western music — one fret on the guitar, or one key on a piano (including the black keys).",
          "- A whole step is two half steps — two frets.",
          "Almost all of music theory is built by stacking these two distances in patterns. Learn them and scales stop being memorisation.",
        ],
        keyPoints: [
          "Half step = 1 fret. Whole step = 2 frets.",
          "C to C# is a half step; C to D is a whole step.",
          "The major scale is a fixed pattern of whole and half steps.",
        ],
        demos: [
          { label: "Half step: C → C#", midi: [60, 61] },
          { label: "Whole step: C → D", midi: [60, 62] },
        ],
        quiz: {
          q: "How many frets is a whole step?",
          answer: "Two frets — a whole step is two half steps.",
        },
      },
      {
        id: "naming",
        title: "Naming intervals",
        minutes: 4,
        body: [
          "We count intervals by how many letter names they span. C up to E spans C-D-E = a 3rd. C up to G spans C-D-E-F-G = a 5th.",
          "The two you'll meet constantly:",
          "- The major 3rd (4 half steps) — the interval that makes a chord sound happy.",
          "- The perfect 5th (7 half steps) — the strong, stable interval at the bottom of most chords and every power chord.",
          "An octave is the same note higher — 12 half steps up, and it sounds like 'the same note'.",
        ],
        keyPoints: [
          "Count letter names to get the number (3rd, 5th…).",
          "Major 3rd = 4 half steps; perfect 5th = 7 half steps.",
          "An octave is 12 half steps and sounds like the same note.",
        ],
        demos: [
          { label: "Major 3rd: C → E", midi: [60, 64] },
          { label: "Perfect 5th: C → G", midi: [60, 67] },
          { label: "Octave: C → C", midi: [60, 72] },
        ],
        quiz: {
          q: "How many half steps is a perfect 5th?",
          answer: "Seven half steps (e.g. C up to G).",
        },
      },
      {
        id: "major-minor-third",
        title: "Major vs minor 3rd",
        minutes: 3,
        body: [
          "One interval decides whether a chord sounds happy or sad: the 3rd.",
          "- A major 3rd is 4 half steps (C to E). Chords built on it sound bright and happy.",
          "- A minor 3rd is 3 half steps (C to E♭). Chords built on it sound darker and sad.",
          "That single semitone — E vs E♭ — is the whole difference between a C major and a C minor chord.",
        ],
        keyPoints: [
          "Major 3rd = 4 half steps (happy).",
          "Minor 3rd = 3 half steps (sad).",
          "Lowering the 3rd by one fret turns major into minor.",
        ],
        demos: [
          { label: "Major 3rd (happy): C–E", midi: [60, 64], harmonic: true },
          { label: "Minor 3rd (sad): C–E♭", midi: [60, 63], harmonic: true },
        ],
        quiz: {
          q: "What makes a chord minor instead of major?",
          answer: "A minor 3rd — the 3rd is lowered a half step (one fret).",
        },
      },
    ],
  },
  {
    id: "scales",
    name: "Scales",
    blurb: "Ordered sets of notes that give a key its sound and its chords.",
    lessons: [
      {
        id: "major-scale",
        title: "The major scale",
        minutes: 4,
        body: [
          "A scale is a set of notes in order, built by a pattern of whole (W) and half (H) steps.",
          "The major scale pattern is: W – W – H – W – W – W – H.",
          "Start on C and follow it and you get C D E F G A B C — the C major scale, with no sharps or flats (all the white keys).",
          "This scale is the reference point for almost everything: chords, keys, and the 'do-re-mi' sound.",
        ],
        keyPoints: [
          "Major scale pattern: W W H W W W H.",
          "C major = C D E F G A B — no sharps or flats.",
          "Every major key uses the same pattern from a different starting note.",
        ],
        demos: [{ label: "C major scale", midi: [60, 62, 64, 65, 67, 69, 71, 72] }],
        quiz: {
          q: "What is the step pattern of a major scale?",
          answer: "Whole, whole, half, whole, whole, whole, half.",
        },
      },
      {
        id: "minor-scale",
        title: "The natural minor scale",
        minutes: 3,
        body: [
          "The natural minor scale uses a different pattern: W – H – W – W – H – W – W. It sounds darker and more serious.",
          "Starting on A gives A B C D E F G A — the A minor scale, which (like C major) uses only the white keys.",
          "In fact A minor and C major share the same notes — they're 'relatives'. Where you start (and rest) decides which one you hear.",
        ],
        keyPoints: [
          "Natural minor pattern: W H W W H W W.",
          "A minor = A B C D E F G — same notes as C major, different home note.",
          "Minor keys sound darker; major keys sound bright.",
        ],
        demos: [{ label: "A minor scale", midi: [57, 59, 60, 62, 64, 65, 67, 69] }],
        quiz: {
          q: "Which major key shares its notes with A minor?",
          answer: "C major — they're relative major/minor.",
        },
      },
    ],
  },
  {
    id: "triads",
    name: "Triads & chords",
    blurb: "How chords are built by stacking notes from a scale.",
    lessons: [
      {
        id: "what-triad",
        title: "What a triad is",
        minutes: 3,
        body: [
          "A basic chord is a triad: three notes — a root, a 3rd above it, and a 5th above the root.",
          "Take C, skip a note to E, skip a note to G: C–E–G is a C major triad. That 'stack of 3rds' is how chords are built.",
          "Every open chord you already play is a triad (sometimes with notes doubled across the strings).",
        ],
        keyPoints: [
          "A triad = root + 3rd + 5th.",
          "C major triad = C E G.",
          "Build it by stacking every other note of the scale.",
        ],
        demos: [{ label: "C major triad: C–E–G", midi: [60, 64, 67], harmonic: true }],
        quiz: {
          q: "Which three notes make a C major triad?",
          answer: "C, E, and G (root, major 3rd, perfect 5th).",
        },
      },
      {
        id: "major-minor-triad",
        title: "Major vs minor triads",
        minutes: 3,
        body: [
          "Whether a triad is major or minor comes down to its 3rd (from the intervals module).",
          "- Major triad: root + major 3rd + 5th (C–E–G).",
          "- Minor triad: root + minor 3rd + 5th (C–E♭–G).",
          "Lower the middle note one half step and a happy chord becomes a sad one. That's the whole trick.",
        ],
        keyPoints: [
          "Major triad has a major 3rd; minor triad has a minor 3rd.",
          "Only the middle note (the 3rd) changes.",
          "C major = C E G; C minor = C E♭ G.",
        ],
        demos: [
          { label: "C major: C–E–G", midi: [60, 64, 67], harmonic: true },
          { label: "C minor: C–E♭–G", midi: [60, 63, 67], harmonic: true },
        ],
        quiz: {
          q: "How do you turn a major triad into a minor one?",
          answer: "Lower the 3rd (the middle note) by a half step.",
        },
      },
      {
        id: "chords-in-key",
        title: "The chords in a key",
        minutes: 5,
        body: [
          "Build a triad on each note of a scale and you get the family of chords that belong to that key.",
          "In C major the family is: C (I), Dm (ii), Em (iii), F (IV), G (V), Am (vi), and a diminished B° (vii°).",
          "The big three are I, IV, and V (C, F, G) — major and bright — plus vi (Am), the relative minor. Most beginner songs live inside this family.",
        ],
        keyPoints: [
          "Stack a triad on every scale note → the key's chord family.",
          "C major family: C Dm Em F G Am B°.",
          "I, IV, V (C F G) and vi (Am) do most of the work.",
        ],
        demos: [
          { label: "C (I)", midi: [60, 64, 67], harmonic: true },
          { label: "Dm (ii)", midi: [62, 65, 69], harmonic: true },
          { label: "Em (iii)", midi: [64, 67, 71], harmonic: true },
          { label: "F (IV)", midi: [65, 69, 72], harmonic: true },
          { label: "G (V)", midi: [67, 71, 74], harmonic: true },
          { label: "Am (vi)", midi: [69, 72, 76], harmonic: true },
        ],
        quiz: {
          q: "In the key of C major, what are the I, IV and V chords?",
          answer: "C, F and G.",
        },
      },
    ],
  },
  {
    id: "progressions",
    name: "Progressions",
    blurb: "Why some chord sequences just work — and how to build your own.",
    lessons: [
      {
        id: "diatonic",
        title: "Diatonic progressions",
        minutes: 4,
        body: [
          "When a chord sequence uses only chords from one key's family, it's called diatonic — and it tends to sound 'right' because every chord shares the same scale.",
          "That's why C – G – Am – F sounds smooth: all four are in the key of C.",
          "You don't need to memorise songs — pick a key, stay in its family, and you'll almost always sound musical.",
        ],
        keyPoints: [
          "Diatonic = all chords come from one key.",
          "Chords from the same key share notes, so they blend.",
          "Stay in the family and progressions sound natural.",
        ],
        demos: [
          { label: "C", midi: [60, 64, 67], harmonic: true },
          { label: "G", midi: [67, 71, 74], harmonic: true },
          { label: "Am", midi: [69, 72, 76], harmonic: true },
          { label: "F", midi: [65, 69, 72], harmonic: true },
        ],
        quiz: {
          q: "What does 'diatonic' mean?",
          answer: "The progression uses only chords from a single key's scale.",
        },
      },
      {
        id: "four-chord",
        title: "The four-chord song (I–V–vi–IV)",
        minutes: 4,
        body: [
          "One progression powers a huge number of pop songs: I – V – vi – IV.",
          "In the key of G that's G – D – Em – C. The vi chord (Em) adds an emotional dip before IV lifts it back up.",
          "Learn this one shape of movement and you can play along with countless songs by ear.",
        ],
        keyPoints: [
          "I–V–vi–IV is the 'four-chord song' progression.",
          "In G major: G D Em C.",
          "Roman numerals let you move it to any key.",
        ],
        demos: [
          { label: "G (I)", midi: [67, 71, 74], harmonic: true },
          { label: "D (V)", midi: [62, 66, 69], harmonic: true },
          { label: "Em (vi)", midi: [64, 67, 71], harmonic: true },
          { label: "C (IV)", midi: [60, 64, 67], harmonic: true },
        ],
        quiz: {
          q: "Write the four-chord progression in the key of G.",
          answer: "G – D – Em – C (I – V – vi – IV).",
        },
      },
    ],
  },
];

export function getTheoryLesson(id: string): { module: TheoryModule; lesson: TheoryLesson } | undefined {
  for (const m of THEORY) {
    const lesson = m.lessons.find((l) => l.id === id);
    if (lesson) return { module: m, lesson };
  }
  return undefined;
}
