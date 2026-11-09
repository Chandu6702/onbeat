import { describe, it, expect } from "vitest";
import {
  noteFromPitch,
  frequencyFromNote,
  centsOff,
  noteName,
  nearestGuitarString,
  autoCorrelate,
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
