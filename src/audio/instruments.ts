import * as Tone from "tone";

export type InstrumentType = "acoustic" | "electric";

export interface Guitar {
  // One plucked-string voice per guitar string, so a strum retriggers each
  // string independently — the natural way a guitar behaves.
  strings: Tone.PluckSynth[];
  type: InstrumentType;
  dispose(): void;
}

// Per-instrument voicing + tone shaping. The shared clean signal chain
// (high-pass → EQ → compressor → limiter) is what makes a 6-string strum
// read as clear chords instead of a muddy wash.
const VOICE: Record<
  InstrumentType,
  { attackNoise: number; dampening: number; resonance: number; release: number }
> = {
  // attackNoise is the main source of "buzz" in a plucked string — kept low for
  // a clean attack; dampening set high enough to tame high-frequency hiss.
  acoustic: { attackNoise: 0.35, dampening: 4900, resonance: 0.92, release: 1.4 },
  electric: { attackNoise: 0.28, dampening: 5400, resonance: 0.96, release: 1.8 },
};

/**
 * A plucked-string (Karplus-Strong) guitar with a proper master chain that
 * ends in compressor → limiter so stacked strings never clip into mud.
 *
 * Tone shaping is tuned from spectral measurements of the output:
 * - Acoustic: high-pass (tight low end) → 3.2 kHz presence peak (note
 *   definition) → EQ (brighter, less boom). Warm but clear.
 * - Electric: overdrive → ~5.2 kHz "cabinet" low-pass (kills the fizzy
 *   high harmonics distortion adds) → high-pass → amp EQ, level-matched.
 */
export function createGuitar(type: InstrumentType = "acoustic", voices = 6): Guitar {
  const limiter = new Tone.Limiter(-2).toDestination();

  const reverb = new Tone.Reverb({
    decay: type === "electric" ? 1.0 : 1.8,
    wet: type === "electric" ? 0.07 : 0.16,
  }).connect(limiter);

  const comp = new Tone.Compressor({
    threshold: -22,
    ratio: 3,
    attack: 0.003,
    release: 0.25,
  }).connect(reverb);

  const nodes: Tone.ToneAudioNode[] = [reverb, comp];
  let head: Tone.ToneAudioNode;

  if (type === "acoustic") {
    const eq = new Tone.EQ3({ low: -3, mid: 1, high: 4, lowFrequency: 250, highFrequency: 2600 }).connect(comp);
    const presence = new Tone.Filter({ type: "peaking", frequency: 3200, Q: 1, gain: 3 }).connect(eq);
    const highpass = new Tone.Filter(90, "highpass").connect(presence);
    nodes.push(eq, presence, highpass);
    head = highpass;
  } else {
    const eq = new Tone.EQ3({ low: -1, mid: 2.5, high: 1, lowFrequency: 250, highFrequency: 2500 }).connect(comp);
    const highpass = new Tone.Filter(90, "highpass").connect(eq);
    const cabinet = new Tone.Filter({ type: "lowpass", frequency: 5200, rolloff: -24 }).connect(highpass);
    const drive = new Tone.Distortion({ distortion: 0.1, wet: 0.5 }).connect(cabinet);
    nodes.push(eq, highpass, cabinet, drive);
    head = drive;
  }

  const output = new Tone.Gain(type === "electric" ? 0.62 : 0.92).connect(head);
  nodes.push(output);

  const v = VOICE[type];
  const strings = Array.from(
    { length: voices },
    () =>
      new Tone.PluckSynth({
        attackNoise: v.attackNoise,
        dampening: v.dampening,
        resonance: v.resonance,
        release: v.release,
      }).connect(output),
  );

  return {
    strings,
    type,
    dispose() {
      strings.forEach((s) => s.dispose());
      nodes.forEach((n) => n.dispose());
      limiter.dispose();
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
