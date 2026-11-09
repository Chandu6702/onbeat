import * as Tone from "tone";

export type InstrumentType = "acoustic" | "electric";

export interface Guitar {
  type: InstrumentType;
  /** Pluck a single note at a scheduled time (a strum is several of these). */
  pluck(note: string, time: number): void;
  /** Resolves once the samples are loaded and the instrument can make sound. */
  loaded: Promise<void>;
  dispose(): void;
}

// Real recorded guitar samples (CC-BY, nbrosowsky/tonejs-instruments) served
// from the jsDelivr CDN. Tone.Sampler pitch-shifts between them to cover every
// note — this is how apps like Yousician/JustinGuitar get a real guitar sound
// instead of a synth. Sharps are named with "s" in the filenames (As2 = A#2).
const CDN = "https://cdn.jsdelivr.net/npm";

function urlMap(notes: string[]): Record<string, string> {
  return Object.fromEntries(notes.map((n) => [n, n.replace("#", "s") + ".mp3"]));
}

const SAMPLES: Record<InstrumentType, { baseUrl: string; urls: Record<string, string> }> = {
  acoustic: {
    baseUrl: `${CDN}/tonejs-instrument-guitar-acoustic-mp3@1.1.2/`,
    urls: urlMap([
      "A2", "A3", "A4", "A#2", "A#3", "A#4", "B2", "B3", "B4",
      "C3", "C4", "C5", "C#3", "C#4", "C#5", "D2", "D3", "D4", "D5",
      "D#2", "D#3", "D#4", "E2", "E3", "E4", "F2", "F3", "F4",
      "F#2", "F#3", "F#4", "G2", "G3", "G4", "G#2", "G#3", "G#4",
    ]),
  },
  electric: {
    baseUrl: `${CDN}/tonejs-instrument-guitar-electric-mp3@1.1.1/`,
    urls: urlMap([
      "A2", "A3", "A4", "A5", "C3", "C4", "C5", "C6", "C#2",
      "D#3", "D#4", "D#5", "E2", "F#2", "F#3", "F#4", "F#5",
    ]),
  },
};

/**
 * A sampled guitar through a light master chain (compressor → limiter + a
 * touch of reverb) so strummed chords stay clean and never clip. Electric adds
 * a subtle amp colour. Real samples need far less shaping than a synth did.
 */
export function createGuitar(type: InstrumentType = "acoustic"): Guitar {
  // Master safety: hard limiter into the output so a 6-note strum can't clip.
  const limiter = new Tone.Limiter(-2).toDestination();
  const reverb = new Tone.Reverb({
    decay: type === "electric" ? 1.2 : 1.6,
    wet: type === "electric" ? 0.06 : 0.12,
  }).connect(limiter);
  // Glue compressor to even out stacked notes before the limiter.
  const comp = new Tone.Compressor({ threshold: -24, ratio: 3, attack: 0.004, release: 0.2 }).connect(reverb);
  // EQ: trim boom, lift presence/air so recorded chords read as clear strings.
  const eq = new Tone.EQ3({
    low: -3,
    mid: type === "electric" ? 2 : 1,
    high: type === "electric" ? 3 : 5,
    lowFrequency: 250,
    highFrequency: 2600,
  }).connect(comp);
  // High-pass tames the boomy low fundamentals of recorded low strings.
  const highpass = new Tone.Filter(100, "highpass").connect(eq);

  const extra: Tone.ToneAudioNode[] = [eq, highpass];
  let head: Tone.ToneAudioNode = highpass;
  if (type === "electric") {
    const cabinet = new Tone.Filter({ type: "lowpass", frequency: 6000, rolloff: -12 }).connect(highpass);
    const drive = new Tone.Distortion({ distortion: 0.06, wet: 0.35 }).connect(cabinet);
    extra.push(cabinet, drive);
    head = drive;
  }

  let resolveLoaded: () => void;
  const loaded = new Promise<void>((r) => (resolveLoaded = r));

  const set = SAMPLES[type];
  const sampler = new Tone.Sampler({
    urls: set.urls,
    baseUrl: set.baseUrl,
    release: 1.4,
    onload: () => resolveLoaded(),
  }).connect(head);
  // Recorded samples are near 0 dB; drop them a lot so stacked strum notes
  // sit at a sane level under the limiter.
  sampler.volume.value = type === "electric" ? -20 : -18;

  return {
    type,
    pluck(note, time) {
      if (sampler.loaded) sampler.triggerAttack(note, time);
    },
    loaded,
    dispose() {
      sampler.dispose();
      [comp, reverb, limiter, ...extra].forEach((n) => n.dispose());
    },
  };
}

// A short, dry blip for the metronome. Accented beat is higher + louder.
export function createClick() {
  return new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 },
    volume: -10,
  }).toDestination();
}
