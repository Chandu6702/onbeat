import * as Tone from "tone";
import { getChord } from "@/data/chords";
import type { StrumPattern, StrumStep } from "@/data/types";
import { createGuitar, createClick, type Guitar, type InstrumentType } from "./instruments";

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
  /** guitar voice: acoustic (default) or electric */
  instrument?: InstrumentType;
}

const NOTE_SPREAD = 0.02; // seconds between strummed strings

/**
 * PracticeEngine — a Tone.js-driven timeline for play-along, strum trainer,
 * and metronome. Frramework-agnostic; a React hook wraps it for the UI.
 */
export class PracticeEngine {
  private cfg: EngineConfig;
  private guitar: Guitar;
  private click = createClick();
  private seq: Tone.Sequence<number> | null = null;
  private tickCount = 0;

  onStep: ((info: StepInfo) => void) | null = null;
  onStateChange: ((playing: boolean) => void) | null = null;

  constructor(cfg: EngineConfig) {
    this.cfg = { ...cfg };
    this.guitar = createGuitar(cfg.instrument ?? "acoustic");
  }

  /** Swap the guitar voice (acoustic ↔ electric). Rebuilds the instrument. */
  setInstrument(type: InstrumentType) {
    if (this.guitar.type === type) return;
    this.guitar.dispose();
    this.guitar = createGuitar(type);
    this.cfg.instrument = type;
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
      if (this.cfg.pattern.style === "fingerpick") {
        this.playPick(chordName, time, this.cfg.pattern.picks?.[step] ?? null);
      } else {
        this.playStrum(chordName, time, strum);
      }
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
    const semis = this.cfg.transpose ?? 0;
    const notes = [...chord.midi];
    const order = dir === "U" ? notes.reverse() : notes;
    order.forEach((m, i) => {
      this.guitar.pluck(Tone.Frequency(m + semis, "midi").toNote(), time + i * NOTE_SPREAD);
    });
  }

  /** Fingerpick: pluck only the named strings of the chord (indices into its
   *  sounding notes; negative counts from the top). Near-simultaneous, with a
   *  hair of spread so a bass+treble pinch doesn't phase. */
  private playPick(chordName: string, time: number, indices: number[] | null) {
    if (!indices || indices.length === 0) return;
    const chord = getChord(chordName);
    if (!chord) return;
    const notes = chord.midi;
    const n = notes.length;
    const semis = this.cfg.transpose ?? 0;
    indices.forEach((idx, i) => {
      const m = notes[((idx % n) + n) % n]; // wrap; -1 -> top string
      this.guitar.pluck(Tone.Frequency(m + semis, "midi").toNote(), time + i * NOTE_SPREAD);
    });
  }

  /** Play an arbitrary set of notes — melodic (one at a time) or harmonic. */
  async previewNotes(midis: number[], harmonic = false) {
    await Tone.start();
    await this.guitar.loaded;
    const now = Tone.now();
    const semis = this.cfg.transpose ?? 0;
    const gap = harmonic ? NOTE_SPREAD : 0.42;
    midis.forEach((m, i) => {
      this.guitar.pluck(Tone.Frequency(m + semis, "midi").toNote(), now + i * gap);
    });
  }

  /** Preview a single chord immediately (for the chord library / create picker). */
  async previewChord(chordName: string) {
    await Tone.start();
    await this.guitar.loaded;
    const chord = getChord(chordName);
    if (!chord) return;
    const now = Tone.now();
    const semis = this.cfg.transpose ?? 0;
    chord.midi.forEach((m, i) => {
      this.guitar.pluck(Tone.Frequency(m + semis, "midi").toNote(), now + i * NOTE_SPREAD);
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
