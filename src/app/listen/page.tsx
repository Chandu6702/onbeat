"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getPattern } from "@/data/patterns";
import { getChord } from "@/data/chords";
import { useProgress } from "@/state/progress";
import { chordPitchClasses, chordCoverage, detectPitchClasses } from "@/audio/pitch";

const PROGRESSION = ["Em", "C", "G", "D"]; // the first real four-chord loop
const LOOPS = 2; // bars to score = PROGRESSION.length * LOOPS
const HIT = 0.6; // coverage needed to count a bar as "played right"

type Status = "idle" | "denied" | "error" | "listening" | "done";
interface BarResult {
  chord: string;
  coverage: number;
  hit: boolean;
}

export default function ListenPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [bpm, setBpm] = useState(70);
  const [results, setResults] = useState<BarResult[]>([]);
  const [liveCoverage, setLiveCoverage] = useState(0);
  const recordPractice = useProgress((s) => s.recordPractice);
  const addXp = useProgress((s) => s.addXp);

  const streamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  // Per-bar accumulator: how many frames each pitch class was detected in.
  const counts = useRef<Map<number, number>>(new Map());
  const frames = useRef(0);
  const prevBar = useRef(-1);
  const scored = useRef(0);
  const recorded = useRef(false);

  const { ui, play, stop, setBpm: setEngineBpm } = usePracticeEngine({
    bpm: 70,
    progression: PROGRESSION,
    pattern: getPattern("folk-down"),
    mode: "metronome", // clicks + bar advancement, but the app stays silent
    metronome: true,
    countInBars: 1,
    metronomeVolume: 0.6,
  });

  const cleanup = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    micCtxRef.current?.close().catch(() => {});
    micCtxRef.current = null;
    stop();
  }, [stop]);

  useEffect(() => () => cleanup(), [cleanup]);

  const finishBar = useCallback((chordName: string) => {
    const expected = chordPitchClasses(getChord(chordName)?.midi ?? []);
    const need = Math.max(2, Math.floor(frames.current * 0.15));
    const present = new Set<number>();
    counts.current.forEach((c, pc) => {
      if (c >= need) present.add(pc);
    });
    const coverage = chordCoverage(present, expected);
    setResults((r) => [...r, { chord: chordName, coverage, hit: coverage >= HIT }]);
    counts.current = new Map();
    frames.current = 0;
    scored.current += 1;
    if (scored.current >= PROGRESSION.length * LOOPS) {
      cleanup();
      setStatus("done");
    }
  }, [cleanup]);

  // Score a bar whenever the engine advances to the next one (after count-in).
  useEffect(() => {
    if (status !== "listening" || ui.isCountIn) return;
    if (prevBar.current === -1) {
      prevBar.current = ui.bar;
      return;
    }
    if (ui.bar !== prevBar.current) {
      const finishedChord = PROGRESSION[prevBar.current];
      prevBar.current = ui.bar;
      queueMicrotask(() => finishBar(finishedChord));
    }
  }, [status, ui.bar, ui.isCountIn, finishBar]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false },
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      micCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      const buf = new Float32Array(analyser.frequencyBinCount);

      counts.current = new Map();
      frames.current = 0;
      prevBar.current = -1;
      scored.current = 0;
      setResults([]);
      setStatus("listening");
      if (!recorded.current) {
        recordPractice();
        recorded.current = true;
      }

      const tick = () => {
        analyser.getFloatFrequencyData(buf);
        const classes = detectPitchClasses(buf, ctx.sampleRate);
        classes.forEach((pc) => counts.current.set(pc, (counts.current.get(pc) ?? 0) + 1));
        frames.current += 1;
        // Live coverage against the current expected chord (for the meter).
        const expected = chordPitchClasses(getChord(PROGRESSION[prevBar.current] ?? "Em")?.midi ?? []);
        setLiveCoverage(chordCoverage(classes, expected));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      setEngineBpm(bpm);
      play();
    } catch (err) {
      const denied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "SecurityError");
      setStatus(denied ? "denied" : "error");
    }
  };

  const reset = () => {
    cleanup();
    setStatus("idle");
    setResults([]);
    recorded.current = false;
  };

  const hits = results.filter((r) => r.hit).length;
  const total = PROGRESSION.length * LOOPS;

  // Award XP once when a listen run finishes.
  useEffect(() => {
    if (status === "done") addXp(Math.max(2, hits));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Listen mode</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        The app counts you in and keeps time — you play the chords, and it listens to score you.
        Fully hands-free. Best with headphones so the clicks don&apos;t bleed into the mic.
      </p>

      <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#121524] to-[#0e111c] px-4 py-7 text-center">
        {status === "idle" || status === "denied" || status === "error" ? (
          <div className="py-4">
            {status === "denied" && (
              <p className="mb-4 text-[13.5px] leading-relaxed text-pink">
                Mic access was blocked. Allow the microphone for this site, then try again.
              </p>
            )}
            {status === "error" && (
              <p className="mb-4 text-[13.5px] leading-relaxed text-pink">
                Couldn&apos;t start the mic. Check a microphone is connected and try again.
              </p>
            )}
            <div className="font-display text-[15px] font-semibold text-muted">You&apos;ll play</div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {PROGRESSION.map((c, i) => (
                <span
                  key={i}
                  className="grid h-11 min-w-11 place-items-center rounded-xl border border-line bg-panel px-2 font-display text-[18px] font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-[34ch] text-[12.5px] leading-relaxed text-faint">
              Nothing is recorded — the mic is analysed live on your device. {LOOPS} times through.
            </p>
            <button
              onClick={start}
              className="mt-5 w-full rounded-[14px] bg-accent py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Start listening
            </button>
          </div>
        ) : status === "listening" ? (
          <>
            <div className="text-xs uppercase tracking-[0.12em] text-faint">
              {ui.isCountIn ? "count in — get ready" : "play this chord"}
            </div>
            <div className="bg-gradient-to-b from-white to-[#c9c6ff] bg-clip-text font-display text-[64px] font-bold leading-none text-transparent">
              {ui.chord || PROGRESSION[0]}
            </div>
            <div className="mt-2 text-[13px] text-muted">
              {ui.isCountIn ? " " : `next · ${PROGRESSION[(ui.bar + 1) % PROGRESSION.length]}`}
            </div>

            {/* live match meter */}
            <div className="mx-auto mt-5 h-2.5 w-full max-w-[320px] overflow-hidden rounded-full bg-[#262c40]">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  liveCoverage >= HIT ? "bg-go" : "bg-accent-2"
                }`}
                style={{ width: `${Math.round(liveCoverage * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 text-[12px] text-faint">
              {liveCoverage >= HIT ? "got it 🎯" : "listening…"}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {results.map((r, i) => (
                <span
                  key={i}
                  className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-[13px] font-bold ${
                    r.hit ? "bg-go/20 text-go" : "bg-pink/15 text-pink"
                  }`}
                >
                  {r.hit ? "✓" : "·"}
                </span>
              ))}
            </div>

            <button
              onClick={reset}
              className="mt-6 w-full rounded-[13px] border border-line bg-panel py-3 text-[14px] font-semibold text-muted transition hover:text-fg"
            >
              Stop
            </button>
          </>
        ) : (
          <>
            <div className="text-xs uppercase tracking-[0.12em] text-faint">your score</div>
            <div className="bg-gradient-to-b from-white to-[#a48bff] bg-clip-text font-display text-[72px] font-bold leading-none text-transparent">
              {hits}
              <span className="text-[32px] text-faint">/{total}</span>
            </div>
            <div className="mt-1 text-[13px] font-semibold text-muted">
              {hits === total
                ? "Perfect — every chord landed! 🏆"
                : hits >= total * 0.6
                  ? "Nice — most chords landed."
                  : "Keep at it — slow the tempo down and try again."}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {results.map((r, i) => (
                <span
                  key={i}
                  className={`grid h-9 min-w-9 place-items-center rounded-lg px-1.5 font-display text-[13px] font-bold ${
                    r.hit ? "bg-go/20 text-go" : "bg-pink/15 text-pink"
                  }`}
                  title={`${r.chord}: ${Math.round(r.coverage * 100)}%`}
                >
                  {r.chord}
                </span>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-6 w-full rounded-[14px] bg-accent py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Go again
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[13px] text-muted">Tempo</span>
        <span className="font-display text-[18px] font-bold">
          {bpm}
          <small className="ml-1 text-xs font-medium text-faint">BPM</small>
        </span>
      </div>
      <input
        type="range"
        min={50}
        max={110}
        step={2}
        value={bpm}
        disabled={status === "listening"}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="mt-2 w-full disabled:opacity-50"
        style={{
          background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${Math.round(
            ((bpm - 50) / 60) * 100,
          )}%, #262c40 ${Math.round(((bpm - 50) / 60) * 100)}%)`,
        }}
      />

      <p className="mt-4 text-center text-xs text-faint">
        New &amp; experimental — chord detection is approximate.{" "}
        <Link href="/tuner" className="font-semibold text-accent-2 hover:underline">
          Tune up first
        </Link>
      </p>
    </>
  );
}
