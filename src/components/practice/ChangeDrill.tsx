"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getPattern } from "@/data/patterns";
import { getChord } from "@/data/chords";
import { useProgress, useHasHydrated } from "@/state/progress";
import Fretboard from "@/components/Fretboard";

const CANDIDATE_PAIRS: [string, string][] = [
  ["Em", "Am"],
  ["C", "G"],
  ["G", "D"],
  ["Am", "C"],
  ["D", "G"],
];

const DURATION = 60;

export default function ChangeDrill() {
  const known = useProgress((s) => s.knownChords);
  const best = useProgress((s) => s.bestChangesPerMin);
  const reportChanges = useProgress((s) => s.reportChanges);
  const addXp = useProgress((s) => s.addXp);
  const recordPractice = useProgress((s) => s.recordPractice);
  const hydrated = useHasHydrated();

  const pairs = CANDIDATE_PAIRS.filter((p) => p.every((c) => known.includes(c)));
  const [pair, setPair] = useState<[string, string]>(pairs[0] ?? ["Em", "Am"]);

  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(DURATION);
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<{ count: number; isBest: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef(0);

  const { previewChord } = usePracticeEngine({
    bpm: 80,
    progression: [pair[0]],
    pattern: getPattern("folk-down"),
    mode: "metronome",
    metronome: false,
    countInBars: 0,
  });

  const finish = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
    const c = countRef.current;
    const isBest = reportChanges(c);
    addXp(Math.max(1, Math.round(c / 2)));
    recordPractice();
    setResult({ count: c, isBest });
  }, [reportChanges, addXp, recordPractice]);

  // End the drill when the clock runs out.
  useEffect(() => {
    if (running && left <= 0) finish();
  }, [running, left, finish]);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    setResult(null);
    countRef.current = 0;
    setCount(0);
    setLeft(DURATION);
    setRunning(true);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setLeft((l) => l - 1), 1000);
  };

  const tap = () => {
    if (!running) {
      start();
      return;
    }
    const next = countRef.current + 1;
    countRef.current = next;
    setCount(next);
    previewChord(next % 2 ? pair[1] : pair[0]);
  };

  const nextChordIsB = count % 2 === 0;

  return (
    <div className="text-center">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {pairs.map((p) => {
          const on = p[0] === pair[0] && p[1] === pair[1];
          return (
            <button
              key={p.join("-")}
              onClick={() => !running && setPair(p)}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${
                on ? "border-accent bg-panel-2 text-fg" : "border-line bg-panel text-muted"
              } ${running ? "opacity-50" : ""}`}
            >
              {p[0]} ↔ {p[1]}
            </button>
          );
        })}
      </div>

      <div className="font-display text-[15px] font-semibold text-beat">
        {running ? `${left}s` : result ? "Done!" : `${DURATION}s`}
      </div>
      <div className="bg-gradient-to-b from-white to-[#a48bff] bg-clip-text font-display text-[78px] font-bold leading-none text-transparent">
        {count}
      </div>
      <div className="text-[13px] text-muted">clean changes</div>

      <div className="my-5 flex items-start justify-center gap-6">
        {pair.map((c, idx) => {
          const active = running && (idx === 1 ? nextChordIsB : !nextChordIsB);
          const chord = getChord(c);
          return (
            <div key={c} className={`transition-opacity ${running && !active ? "opacity-35" : ""}`}>
              <div className="font-display text-[30px] font-bold">{c}</div>
              {chord && (
                <div className="mt-1 flex justify-center">
                  <Fretboard shape={chord.shape} size={54} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={tap}
        className="w-full rounded-[18px] bg-go py-6 font-display text-[20px] font-bold text-[#06231a] transition-transform active:scale-[0.98]"
      >
        {running ? "Tap on each change" : "Start 60s drill"}
      </button>

      <div className="mt-3.5 text-[13px] text-muted">
        Personal best: <b className="text-fg">{hydrated ? best : 0}</b> / min
        {result && (
          <div className={`mt-2 font-semibold ${result.isBest ? "text-go" : "text-muted"}`}>
            {result.isBest
              ? `🏆 New personal best — ${result.count} changes!`
              : `Nice — ${result.count} changes this round.`}
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        Switch chords cleanly, then tap. Each tap plays the chord so you can hear your timing.
      </p>
    </div>
  );
}
