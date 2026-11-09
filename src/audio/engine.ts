import * as Tone from "tone";
import { getChord } from "@/data/chords";
import type { StrumPattern, StrumStep } from "@/data/types";
import { createGuitar, createClick } from "./instruments";

export type EngineMode = "play" | "strum" | "metronome";

export interface StepInfo {
  /** step within the bar (0..stepsPerBar-1) */
  step: number;
  /** current chord index in the progression */
  bar: number;
  /** beat number 0..3 on down-beats, otherwise null */
  beat: number | null;
  chord: string;
  strum: StrumStep;
  isCountIn: boolean;
}

export interface EngineConfig {
  bpm: number;
  progression: string[];
  pattern: StrumPattern;
  mode: EngineMode;
  metronome: boolean;
  /** silent (metronome-only) lead-in bars before the chords start */
  countInBars: number;
  /** metronome click loudness, 0..1 (default 1) */
  metronomeVolume?: number;
  /** capo / transpose in semitones applied to all played notes (default 0) */
  transpose?: number;
}

const NOTE_SPREAD = 0.02; // seconds between strummed strings

/**
 * PracticeEngine — a Tone.js-driven timeline for play-along, strum trainer,
 * and metronome. Frramework-agnostic; a React hook wraps it for the UI.
 */
export class PracticeEngine {
  private cfg: EngineConfig;
  private guitar = createGuitar();
  private click = createClick();
  private seq: Tone.Sequence<number> | null = null;
  private tickCount = 0;

  onStep: ((info: StepInfo) => void) | null = null;
  onStateChange: ((playing: boolean) => void) | null = null;

  constructor(cfg: EngineConfig) {
    this.cfg = { ...cfg };
  }

  private get stepsPerBar() {
    return this.cfg.pattern.steps.length;
  }

  private get subdivision() {
    return this.cfg.pattern.subdivision ?? "8n";
  }

  /** Grid slots per quarter-note beat: 2 for an 8th grid, 4 for a 16th grid. */
  private get stepsPerBeat() {
    return this.subdivision === "16n" ? 4 : 2;
  }

  private rebuild() {
    this.seq?.dispose();
    const total = this.cfg.progression.length * this.stepsPerBar;
    const events = Array.from({ length: total }, (_, i) => i);
    this.seq = new Tone.Sequence(
      (time, idx) => this.tick(time, idx),
      events,
      this.subdivision,
    );
    this.seq.loop = true;
  }

  private tick(time: number, _idx: number) {
    const spb = this.stepsPerBar;
    const absStep = this.tickCount++;
    const step = absStep % spb;
    const absBar = Math.floor(absStep / spb);
    const bar = absBar % this.cfg.progression.length;
    const isCountIn = absBar < this.cfg.countInBars;
    const spBeat = this.stepsPerBeat;
    const isBeat = step % spBeat === 0;
    const beat = isBeat ? step / spBeat : null;
    const strum = this.cfg.pattern.steps[step] ?? "";
    const chordName = this.cfg.progression[bar];

    if (this.cfg.metronome && isBeat) {
      this.playClick(time, step === 0);
    }

    if (!isCountIn && strum && this.cfg.mode !== "metronome") {
      this.playStrum(chordName, time, strum);
    }

    Tone.getDraw().schedule(() => {
      this.onStep?.({ step, bar, beat, chord: chordName, strum, isCountIn });
    }, time);
  }

  private playClick(time: number, accent: boolean) {
    const vol = this.cfg.metronomeVolume ?? 1;
    const velocity = (accent ? 0.9 : 0.5) * vol;
    if (velocity <= 0) return;
    this.click.triggerAttackRelease(accent ? "C6" : "G5", "32n", time, velocity);
  }

  private playStrum(chordName: string, time: number, dir: StrumStep) {
    const chord = getChord(chordName);
    if (!chord) return;
    const strings = this.guitar.strings;
    const semis = this.cfg.transpose ?? 0;
    const notes = chord.midi.map((m, idx) => ({ m, idx }));
    const order = dir === "U" ? [...notes].reverse() : notes;
    order.forEach((n, i) => {
      const note = Tone.Frequency(n.m + semis, "midi").toNote();
      strings[n.idx % strings.length].triggerAttack(note, time + i * NOTE_SPREAD);
    });
  }

  /** Preview a single chord immediately (for the chord library / create picker). */
  async previewChord(chordName: string) {
    await Tone.start();
    const chord = getChord(chordName);
    if (!chord) return;
    const now = Tone.now();
    const strings = this.guitar.strings;
    const semis = this.cfg.transpose ?? 0;
    chord.midi.forEach((m, i) => {
      const note = Tone.Frequency(m + semis, "midi").toNote();
      strings[i % strings.length].triggerAttack(note, now + i * NOTE_SPREAD);
    });
  }

  async start() {
    await Tone.start();
    const t = Tone.getTransport();
    t.stop();
    t.cancel();
    this.tickCount = 0;
    this.rebuild();
    t.bpm.value = this.cfg.bpm;
    this.seq?.start(0);
    t.start();
    this.onStateChange?.(true);
  }

  stop() {
    const t = Tone.getTransport();
    t.stop();
    t.cancel();
    this.seq?.dispose();
    this.seq = null;
    this.onStateChange?.(false);
  }

  get playing() {
    return Tone.getTransport().state === "started";
  }

  setBpm(bpm: number) {
    this.cfg.bpm = bpm;
    Tone.getTransport().bpm.rampTo(bpm, 0.08);
  }

  setMetronome(on: boolean) {
    this.cfg.metronome = on;
  }

  setMetronomeVolume(v: number) {
    this.cfg.metronomeVolume = v;
  }

  setCountIn(bars: number) {
    this.cfg.countInBars = bars;
  }

  setTranspose(semitones: number) {
    this.cfg.transpose = semitones;
  }

  setMode(mode: EngineMode) {
    this.cfg.mode = mode;
  }

  /** Structural change — rebuilds and restarts cleanly if currently playing. */
  setContent(progression: string[], pattern: StrumPattern) {
    const wasPlaying = this.playing;
    this.cfg.progression = progression;
    this.cfg.pattern = pattern;
    if (wasPlaying) {
      this.start();
    }
  }

  dispose() {
    this.stop();
    this.guitar.dispose();
    this.click.dispose();
  }
}
