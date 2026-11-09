import { describe, it, expect } from "vitest";
import { generateLoop } from "./generator";
import { PATTERNS } from "@/data/patterns";

const patternIds = new Set(PATTERNS.map((p) => p.id));

describe("generateLoop", () => {
  it("returns a known template when the user has all its chords", () => {
    const res = generateLoop(["G", "D", "Em", "C"], "Pop");
    expect(res.chords).toHaveLength(4);
    // Every chord must be one the user has.
    expect(res.chords.every((c) => ["G", "D", "Em", "C"].includes(c))).toBe(true);
  });

  it("falls back to cycling selected chords when no template fits", () => {
    const res = generateLoop(["Em", "Am"], "Pop");
    expect(res.chords).toEqual(["Em", "Am", "Em", "Am"]);
  });

  it("never uses a chord the user did not select", () => {
    const sel = ["Em", "Am", "C"];
    const res = generateLoop(sel, "Rock");
    expect(res.chords.every((c) => sel.includes(c))).toBe(true);
  });

  it("returns the first covered template for Ballad C-G-Am-F with a fixed RNG", () => {
    const res = generateLoop(["C", "G", "Am", "F"], "Ballad", () => 0);
    expect(res.chords).toEqual(["C", "G", "Am", "F"]);
  });

  it("always returns 4 bars and a valid pattern id", () => {
    for (const genre of ["Pop", "Folk", "Rock", "Ballad"] as const) {
      const res = generateLoop(["Em", "Am", "C", "G", "D", "F"], genre);
      expect(res.chords).toHaveLength(4);
      expect(patternIds.has(res.patternId)).toBe(true);
      expect(res.genre).toBe(genre);
    }
  });

  it("is deterministic with a fixed RNG", () => {
    const rng = () => 0; // always pick the first template
    const a = generateLoop(["G", "D", "Em", "C"], "Pop", rng);
    const b = generateLoop(["G", "D", "Em", "C"], "Pop", rng);
    expect(a.chords).toEqual(b.chords);
  });

  it("handles an empty selection without crashing", () => {
    const res = generateLoop([], "Pop");
    expect(res.chords).toHaveLength(4);
  });
});
