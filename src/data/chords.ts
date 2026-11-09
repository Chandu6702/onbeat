import type { Chord, ChordType } from "./types";

// Guitar chords. MIDI notes lowest-first; shape is low-E to high-E.
// `fingers` aligns to `shape` (1=index, 2=middle, 3=ring, 4=pinky; null = open/muted).
export const CHORDS: Record<string, Chord> = {
  // ── Open majors ────────────────────────────────────────────────────────
  C: {
    name: "C",
    type: "Major",
    difficulty: "easy",
    midi: [48, 52, 55, 60, 64],
    shape: ["x", 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    tip: "Ring on the 3rd fret (A), middle on the 2nd fret (D), index on the 1st fret (B). Skip the low E.",
    mistakes: [
      "Letting the ring finger brush the open D or G string.",
      "Strumming the low E — it's muted (×).",
    ],
  },
  G: {
    name: "G",
    type: "Major",
    difficulty: "easy",
    midi: [43, 47, 50, 55, 59, 67],
    shape: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    tip: "Middle on the 3rd fret (low E), index on the 2nd fret (A), ring on the 3rd fret (high E). Middle strings stay open.",
    mistakes: [
      "Cramping your fingers — spread them out across the neck.",
      "A leaning finger muting the open D, G, or B.",
    ],
  },
  D: {
    name: "D",
    type: "Major",
    difficulty: "easy",
    midi: [50, 57, 62, 66],
    shape: ["x", "x", 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    tip: "Index on the 2nd fret (G), ring on the 3rd fret (B), middle on the 2nd fret (high E). Strum from the D string.",
    mistakes: [
      "Strumming the low E or A — only the top four strings should sound.",
      "Fingers bunched together so the high E buzzes.",
    ],
  },
  E: {
    name: "E",
    type: "Major",
    difficulty: "med",
    midi: [40, 47, 52, 56, 59, 64],
    shape: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    tip: "Index on the 1st fret (G), middle and ring on the 2nd fret (A and D). All six strings ring.",
    mistakes: [
      "A weak index finger letting the G string buzz.",
      "Fingers tilting over and muting the open B or high E.",
    ],
  },
  A: {
    name: "A",
    type: "Major",
    difficulty: "med",
    midi: [45, 52, 57, 61, 64],
    shape: ["x", 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    tip: "Three fingers in a row on the 2nd fret (D, G, B). Squeeze them into one fret space. Skip the low E.",
    mistakes: [
      "Fingers too crowded for one fret — angle them or use a small barre.",
      "The ring finger muting the open high E.",
    ],
  },
  Fmaj7: {
    name: "Fmaj7",
    type: "Major",
    difficulty: "med",
    midi: [53, 57, 60, 64],
    shape: ["x", "x", 3, 2, 1, 0],
    fingers: [null, null, 3, 2, 1, null],
    tip: "The easy F — no barre. Ring on D (3rd), middle on G (2nd), index on B (1st), open high E. Skip the low E and A.",
    mistakes: [
      "Playing the low E or A strings.",
      "The index leaning over and muting the open high E.",
    ],
  },
  F: {
    name: "F",
    type: "Major",
    difficulty: "hard",
    midi: [41, 48, 53, 57, 60, 65],
    shape: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    tip: "Barre all six strings at the 1st fret with your index, then add middle (G, 2nd fret), ring (A, 3rd) and pinky (D, 3rd). Go slow — it's the toughest beginner chord.",
    mistakes: [
      "A weak barre — press the index on its bony side, close to the fret.",
      "Thumb too high; drop it behind the neck for squeezing power.",
      "If it won't ring, use Fmaj7 first.",
    ],
  },

  // ── Open minors ────────────────────────────────────────────────────────
  Em: {
    name: "Em",
    type: "Minor",
    difficulty: "easy",
    midi: [40, 47, 52, 55, 59, 64],
    shape: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    tip: "Two fingers, both on the 2nd fret (A and D strings). Let every other string ring open.",
    mistakes: [
      "Muting the open high strings — arch your fingers so the tips press down.",
      "Fretting too far behind the fret, which makes the notes buzz.",
    ],
  },
  Am: {
    name: "Am",
    type: "Minor",
    difficulty: "easy",
    midi: [45, 52, 57, 60, 64],
    shape: ["x", 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    tip: "Index on the 1st fret (B string); middle and ring on the 2nd fret (D and G). Don't play the low E.",
    mistakes: [
      "Strumming the low E — start your strum from the A string.",
      "The ring finger flattening onto the B string and deadening it.",
    ],
  },
  Dm: {
    name: "Dm",
    type: "Minor",
    difficulty: "med",
    midi: [50, 57, 62, 65],
    shape: ["x", "x", 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    tip: "Index on the 1st fret (high E), middle on the 2nd fret (G), ring on the 3rd fret (B). Top four strings only.",
    mistakes: [
      "Playing the low E or A strings.",
      "The ring finger leaning onto and muting the high E.",
    ],
  },
  Bm: {
    name: "Bm",
    type: "Minor",
    difficulty: "hard",
    midi: [47, 54, 59, 62, 66],
    shape: ["x", 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    tip: "Barre the top five strings at the 2nd fret with your index, then middle (B, 3rd fret), ring (D, 4th) and pinky (G, 4th). Skip the low E.",
    mistakes: [
      "The barre not firm enough — roll the index slightly onto its edge.",
      "Playing the low E string.",
      "The thumb creeping over the top of the neck.",
    ],
  },

  // ── Dominant 7ths ──────────────────────────────────────────────────────
  E7: {
    name: "E7",
    type: "7th",
    difficulty: "easy",
    midi: [40, 47, 50, 56, 59, 64],
    shape: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    tip: "It's E with the D-string finger lifted off: index on G (1st), middle on A (2nd). All six strings ring.",
    mistakes: [
      "Fretting the D string — leave it open for the bluesy 7th.",
      "A weak index buzzing the G string.",
    ],
  },
  A7: {
    name: "A7",
    type: "7th",
    difficulty: "easy",
    midi: [45, 52, 55, 61, 64],
    shape: ["x", 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    tip: "Like A but leave the G string open: middle on D (2nd), ring on B (2nd). Skip the low E.",
    mistakes: [
      "Playing the low E — start from the A string.",
      "Fretting the G string, which loses the 7th flavour.",
    ],
  },
  G7: {
    name: "G7",
    type: "7th",
    difficulty: "med",
    midi: [43, 47, 50, 55, 59, 65],
    shape: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, null, null, null, 1],
    tip: "Like G but bring your index to the 1st fret of the high E: ring on low E (3rd), middle on A (2nd). Open D, G, B ring.",
    mistakes: [
      "A finger leaning onto and muting the open D, G, or B.",
      "Buzzy high E — press just behind the 1st fret.",
    ],
  },
  D7: {
    name: "D7",
    type: "7th",
    difficulty: "med",
    midi: [50, 57, 60, 66],
    shape: ["x", "x", 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    tip: "Index on B (1st), middle on G (2nd), ring on high E (2nd). Top four strings only.",
    mistakes: [
      "Playing the low E or A.",
      "Bunched fingers buzzing the high E.",
    ],
  },
  B7: {
    name: "B7",
    type: "7th",
    difficulty: "hard",
    midi: [47, 51, 57, 59, 66],
    shape: ["x", 2, 1, 2, 0, 2],
    fingers: [null, 2, 1, 3, null, 4],
    tip: "A five-string stretch: index on D (1st), middle on A (2nd), ring on G (2nd), pinky on high E (2nd); open B rings. Skip the low E.",
    mistakes: [
      "Muting the open B string.",
      "Playing the low E.",
      "A weak pinky — build the stretch up slowly.",
    ],
  },

  // ── Minor 7ths ─────────────────────────────────────────────────────────
  Em7: {
    name: "Em7",
    type: "m7",
    difficulty: "easy",
    midi: [40, 47, 50, 55, 59, 64],
    shape: [0, 2, 0, 0, 0, 0],
    fingers: [null, 2, null, null, null, null],
    tip: "The easiest chord here — one finger on the A string, 2nd fret. Every other string open.",
    mistakes: [
      "Muting an open string with a lazy finger.",
      "Strumming timidly — let all six strings ring.",
    ],
  },
  Am7: {
    name: "Am7",
    type: "m7",
    difficulty: "easy",
    midi: [45, 52, 55, 60, 64],
    shape: ["x", 0, 2, 0, 1, 0],
    fingers: [null, null, 2, null, 1, null],
    tip: "Am with the G-string finger lifted: index on B (1st), middle on D (2nd). Open G rings. Skip the low E.",
    mistakes: [
      "Playing the low E.",
      "Fretting the G string, which loses the 7th.",
    ],
  },
  Dm7: {
    name: "Dm7",
    type: "m7",
    difficulty: "med",
    midi: [50, 57, 60, 65],
    shape: ["x", "x", 0, 2, 1, 1],
    fingers: [null, null, null, 3, 1, 1],
    tip: "A small barre: index across the 1st fret (B and high E), ring on G (2nd). Top four strings only.",
    mistakes: [
      "Playing the low E or A.",
      "A weak index barre buzzing the high E.",
    ],
  },

  // ── Suspended ──────────────────────────────────────────────────────────
  Dsus2: {
    name: "Dsus2",
    type: "sus",
    difficulty: "easy",
    midi: [50, 57, 62, 64],
    shape: ["x", "x", 0, 2, 3, 0],
    fingers: [null, null, null, 1, 3, null],
    tip: "It's D without the high-E finger: index on G (2nd), ring on B (3rd), open high E. Top four strings.",
    mistakes: [
      "Playing the low E or A.",
      "Fretting the high E — leave it open for the sus2.",
    ],
  },
  Asus2: {
    name: "Asus2",
    type: "sus",
    difficulty: "easy",
    midi: [45, 52, 57, 59, 64],
    shape: ["x", 0, 2, 2, 0, 0],
    fingers: [null, null, 1, 2, null, null],
    tip: "Like A but lift the B-string finger: index on D (2nd), middle on G (2nd). Open B and high E ring. Skip the low E.",
    mistakes: [
      "Playing the low E.",
      "Fretting the B string — leave it open.",
    ],
  },
  Dsus4: {
    name: "Dsus4",
    type: "sus",
    difficulty: "med",
    midi: [50, 57, 62, 67],
    shape: ["x", "x", 0, 2, 3, 3],
    fingers: [null, null, null, 1, 2, 3],
    tip: "D with the high E fretted too: index on G (2nd), middle on B (3rd), ring on high E (3rd). Great to hammer on/off from D.",
    mistakes: [
      "Playing the low E or A.",
      "Cramped fingers buzzing the top strings.",
    ],
  },
  Asus4: {
    name: "Asus4",
    type: "sus",
    difficulty: "med",
    midi: [45, 52, 57, 62, 64],
    shape: ["x", 0, 2, 2, 3, 0],
    fingers: [null, null, 1, 2, 3, null],
    tip: "A with the ring finger on the B string (3rd fret): index on D (2nd), middle on G (2nd). Skip the low E.",
    mistakes: [
      "Playing the low E.",
      "Muting the open high E.",
    ],
  },
  Esus4: {
    name: "Esus4",
    type: "sus",
    difficulty: "med",
    midi: [40, 47, 52, 57, 59, 64],
    shape: [0, 2, 2, 2, 0, 0],
    fingers: [null, 1, 2, 3, null, null],
    tip: "E with the G-string finger moved up: index on A (2nd), middle on D (2nd), ring on G (2nd). All six strings ring.",
    mistakes: [
      "Leaning onto the open B or high E.",
      "Weak fingers buzzing the middle strings.",
    ],
  },

  // ── add9 ───────────────────────────────────────────────────────────────
  Cadd9: {
    name: "Cadd9",
    type: "add9",
    difficulty: "med",
    midi: [48, 52, 55, 62, 67],
    shape: ["x", 3, 2, 0, 3, 3],
    fingers: [null, 2, 1, null, 3, 4],
    tip: "A great friend of G: middle on A (3rd), index on D (2nd), ring on B (3rd), pinky on high E (3rd). Open G rings. Skip the low E.",
    mistakes: [
      "Playing the low E.",
      "Muting the open G string.",
    ],
  },

  // ── Power chords ───────────────────────────────────────────────────────
  E5: {
    name: "E5",
    type: "Power",
    difficulty: "easy",
    midi: [40, 47, 52],
    shape: [0, 2, 2, "x", "x", "x"],
    fingers: [null, 1, 3, null, null, null],
    tip: "Two notes plus the open low E: index on A (2nd), ring on D (2nd). Only the bottom three strings.",
    mistakes: [
      "Strumming the thin strings — keep it to the low three.",
      "Buzz from not pressing firmly enough.",
    ],
  },
  A5: {
    name: "A5",
    type: "Power",
    difficulty: "easy",
    midi: [45, 52, 57],
    shape: ["x", 0, 2, 2, "x", "x"],
    fingers: [null, null, 1, 3, null, null],
    tip: "Open A plus index on D (2nd) and ring on G (2nd). Only the A, D and G strings.",
    mistakes: [
      "Playing the low E or the thin strings.",
      "Muting one of the three notes.",
    ],
  },
};

export const CHORD_NAMES = Object.keys(CHORDS);

// Display order for the library's grouped sections.
export const CHORD_TYPES: ChordType[] = ["Major", "Minor", "7th", "m7", "sus", "add9", "Power"];

export function getChord(name: string): Chord | undefined {
  return CHORDS[name];
}
