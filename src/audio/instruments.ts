import * as Tone from "tone";

export interface Guitar {
  // One plucked-string voice per guitar string, so a strum retriggers each
  // string independently — the natural way a guitar behaves.
  strings: Tone.PluckSynth[];
  output: Tone.Gain;
  reverb: Tone.Reverb;
  dispose(): void;
}

// A plucked-string (Karplus-Strong) guitar, fed through light reverb for warmth.
export function createGuitar(voices = 6): Guitar {
  const reverb = new Tone.Reverb({ decay: 1.4, wet: 0.12 }).toDestination();
  const output = new Tone.Gain(0.9).connect(reverb);
  const strings = Array.from(
    { length: voices },
    () =>
      new Tone.PluckSynth({
        attackNoise: 0.7,
        dampening: 4000,
        resonance: 0.95,
        release: 1,
      }).connect(output),
  );
  return {
    strings,
    output,
    reverb,
    dispose() {
      strings.forEach((s) => s.dispose());
      output.dispose();
      reverb.dispose();
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
