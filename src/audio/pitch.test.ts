import { describe, it, expect } from "vitest";
import {
  noteFromPitch,
  frequencyFromNote,
  centsOff,
  noteName,
  nearestGuitarString,
  autoCorrelate,
  pitchClass,
  chordPitchClasses,
  detectPitchClasses,
  chordCoverage,
} from "./pitch";

describe("pitch math", () => {
  it("maps A4 = 440Hz to MIDI 69", () => {
    expect(noteFromPitch(440)).toBe(69);
    expect(noteName(69)).toBe("A4");
  });

  it("round-trips note ↔ frequency", () => {
    expect(frequencyFromNote(69)).toBeCloseTo(440, 5);
    expect(frequencyFromNote(64)).toBeCloseTo(329.63, 1); // high E
  });

  it("reports cents offset from the nearest note", () => {
    expect(centsOff(440, 69)).toBe(0);
    // ~half a semitone sharp of A4 should read near +50 cents.
    expect(centsOff(440 * Math.pow(2, 0.5 / 12), 69)).toBeGreaterThan(45);
  });

  it("snaps a frequency to the right guitar string", () => {
    expect(nearestGuitarString(82).octave).toBe("low E"); // ~E2
    expect(nearestGuitarString(110).label).toBe("A"); // A2
    expect(nearestGuitarString(330).octave).toBe("high E"); // ~E4
  });
});

describe("autoCorrelate", () => {
  it("detects the frequency of a clean sine wave", () => {
    const sampleRate = 44100;
    const freq = 220; // A3
    const buf = new Float32Array(2048);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
    }
    const detected = autoCorrelate(buf, sampleRate);
    expect(detected).toBeGreaterThan(215);
    expect(detected).toBeLessThan(225);
  });

  it("returns -1 for silence", () => {
    expect(autoCorrelate(new Float32Array(2048), 44100)).toBe(-1);
  });
});

describe("chord detection", () => {
  it("maps frequencies to pitch classes", () => {
    expect(pitchClass(440)).toBe(9); // A
    expect(pitchClass(261.63)).toBe(0); // C4
  });

  it("derives a chord's pitch classes from MIDI", () => {
    // C major triad C(60) E(64) G(67) → 0, 4, 7
    expect(chordPitchClasses([60, 64, 67]).sort((a, b) => a - b)).toEqual([0, 4, 7]);
    // With octave doublings it stays unique
    expect(chordPitchClasses([48, 60, 64, 67, 72]).sort((a, b) => a - b)).toEqual([0, 4, 7]);
  });

  it("detects the pitch classes of peaks in a spectrum", () => {
    const sampleRate = 44100;
    const bins = 4096;
    const binHz = sampleRate / 2 / bins;
    const spec = new Float32Array(bins).fill(-100);
    // Put strong peaks at ~C4, E4, G4 (a C major triad).
    for (const f of [261.63, 329.63, 392.0]) {
      const i = Math.round(f / binHz);
      spec[i] = -20;
      spec[i - 1] = -40;
      spec[i + 1] = -40;
    }
    const detected = detectPitchClasses(spec, sampleRate);
    expect(detected.has(0)).toBe(true); // C
    expect(detected.has(4)).toBe(true); // E
    expect(detected.has(7)).toBe(true); // G
  });

  it("scores chord coverage", () => {
    expect(chordCoverage(new Set([0, 4, 7]), [0, 4, 7])).toBe(1);
    expect(chordCoverage(new Set([0, 7]), [0, 4, 7])).toBeCloseTo(2 / 3, 5);
    expect(chordCoverage(new Set([1, 2]), [0, 4, 7])).toBe(0);
  });
});
