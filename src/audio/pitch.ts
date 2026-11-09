// Pure pitch-detection helpers. No Web Audio imports here so the math stays
// unit-testable; the Tuner component feeds in mic samples at play time.

const A4 = 440;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/** MIDI note number for a frequency (nearest equal-tempered note). */
export function noteFromPitch(freq: number): number {
  return Math.round(12 * Math.log2(freq / A4)) + 69;
}

/** Frequency of a MIDI note number. */
export function frequencyFromNote(midi: number): number {
  return A4 * Math.pow(2, (midi - 69) / 12);
}

/** How far `freq` is from the nearest note, in cents (−50…+50). */
export function centsOff(freq: number, midi: number): number {
  return Math.floor((1200 * Math.log2(freq / frequencyFromNote(midi))));
}

/** Human note name for a MIDI number, e.g. 64 → "E4". */
export function noteName(midi: number): string {
  return NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

/**
 * Autocorrelation pitch detection (the well-known ACF2+ approach): returns a
 * frequency in Hz, or -1 when the signal is too quiet/unclear to be confident.
 */
export function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length;

  // Bail out on near-silence (RMS gate).
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  // Trim leading/trailing samples below a small threshold to sharpen the window.
  let start = 0;
  let end = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      start = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) {
      end = SIZE - i;
      break;
    }
  }

  const trimmed = buf.slice(start, end);
  const n = trimmed.length;
  const c = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      c[i] += trimmed[j] * trimmed[j + i];
    }
  }

  // Find the first dip, then the peak after it.
  let d = 0;
  while (d < n - 1 && c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  if (T0 <= 0) return -1;

  // Parabolic interpolation around the peak for sub-sample accuracy.
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1] ?? x2;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

// Standard guitar tuning, low to high (MIDI). Used to snap the tuner to the
// string you're most likely aiming for.
export const GUITAR_STRINGS = [
  { midi: 40, label: "E", octave: "low E" },
  { midi: 45, label: "A", octave: "A" },
  { midi: 50, label: "D", octave: "D" },
  { midi: 55, label: "G", octave: "G" },
  { midi: 59, label: "B", octave: "B" },
  { midi: 64, label: "E", octave: "high E" },
];

// ── Chord listening (polyphonic) ─────────────────────────────────────────
// Full polyphonic chord recognition is hard; this is a pragmatic peak-picking
// approach: from an FFT magnitude spectrum, take the strongest peaks in the
// guitar's range, fold them to pitch classes, and measure how many of the
// target chord's notes are present. Good enough to tell "right chord vs not".

/** Pitch class (0–11, C=0) for a frequency. */
export function pitchClass(freq: number): number {
  return ((noteFromPitch(freq) % 12) + 12) % 12;
}

/** The distinct pitch classes a chord contains, from its MIDI notes. */
export function chordPitchClasses(midi: number[]): number[] {
  return [...new Set(midi.map((m) => ((m % 12) + 12) % 12))];
}

/**
 * Strong pitch classes present in an FFT magnitude spectrum (dB values, as from
 * AnalyserNode.getFloatFrequencyData). Picks local-maxima peaks above a floor
 * within a guitar-friendly band, keeps the loudest, and folds them to classes.
 */
export function detectPitchClasses(
  freqDb: Float32Array,
  sampleRate: number,
  opts: { floorDb?: number; maxPeaks?: number; minHz?: number; maxHz?: number } = {},
): Set<number> {
  const { floorDb = -70, maxPeaks = 8, minHz = 70, maxHz = 1200 } = opts;
  const bins = freqDb.length;
  const binHz = sampleRate / 2 / bins;
  const peaks: { freq: number; v: number }[] = [];
  for (let i = 2; i < bins - 2; i++) {
    const v = freqDb[i];
    if (
      v > floorDb &&
      v > freqDb[i - 1] &&
      v >= freqDb[i + 1] &&
      v > freqDb[i - 2] &&
      v >= freqDb[i + 2]
    ) {
      const freq = i * binHz;
      if (freq >= minHz && freq <= maxHz) peaks.push({ freq, v });
    }
  }
  peaks.sort((a, b) => b.v - a.v);
  const classes = new Set<number>();
  for (const p of peaks.slice(0, maxPeaks)) classes.add(pitchClass(p.freq));
  return classes;
}

/** Fraction (0–1) of a chord's notes detected — the match score. */
export function chordCoverage(detected: Set<number>, expected: number[]): number {
  if (expected.length === 0) return 0;
  let hit = 0;
  for (const pc of expected) if (detected.has(pc)) hit++;
  return hit / expected.length;
}

/** The standard-tuning guitar string closest to a frequency. */
export function nearestGuitarString(freq: number) {
  const midi = noteFromPitch(freq);
  let best = GUITAR_STRINGS[0];
  let bestDist = Infinity;
  for (const s of GUITAR_STRINGS) {
    const dist = Math.abs(s.midi - midi);
    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }
  return best;
}
