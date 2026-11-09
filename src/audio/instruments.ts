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
  acoustic: { attackNoise: 0.9, dampening: 4200, resonance: 0.93, release: 1.4 },
  electric: { attackNoise: 0.4, dampening: 5800, resonance: 0.97, release: 1.8 },
};

/**
 * A plucked-string (Karplus-Strong) guitar with a proper master chain:
 * high-pass to remove low rumble, EQ for presence, a compressor to even out
 * the strum, and a brick-wall limiter so stacked strings never clip into mud.
 * Electric adds a gentle overdrive + amp-style EQ; acoustic gets a bit of body.
 */
export function createGuitar(type: InstrumentType = "acoustic", voices = 6): Guitar {
  const limiter = new Tone.Limiter(-2).toDestination();

  const reverb = new Tone.Reverb({
    decay: type === "electric" ? 1.1 : 1.8,
    wet: type === "electric" ? 0.08 : 0.16,
  }).connect(limiter);

  const comp = new Tone.Compressor({
    threshold: -22,
    ratio: 3,
    attack: 0.003,
    release: 0.25,
  }).connect(reverb);

  const eq = new Tone.EQ3({
    low: type === "acoustic" ? -2 : -1,
    mid: type === "electric" ? 2.5 : 0,
    high: type === "acoustic" ? 3 : 2,
    lowFrequency: 250,
    highFrequency: 2600,
  }).connect(comp);

  const highpass = new Tone.Filter(85, "highpass").connect(eq);

  // Electric runs through a subtle overdrive for warmth/edge before the EQ.
  let head: Tone.ToneAudioNode = highpass;
  let drive: Tone.Distortion | null = null;
  if (type === "electric") {
    drive = new Tone.Distortion({ distortion: 0.14, wet: 0.5 }).connect(highpass);
    head = drive;
  }

  const output = new Tone.Gain(type === "electric" ? 0.8 : 0.92).connect(head);

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
      output.dispose();
      drive?.dispose();
      highpass.dispose();
      eq.dispose();
      comp.dispose();
      reverb.dispose();
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
