"use client";

import { useEffect, useRef, useState } from "react";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getChord } from "@/data/chords";
import type { StrumPattern } from "@/data/types";
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
const MIN_BPM = 50;
const MAX_BPM = 160;

// The drill loops two "bars" of 2 beats each (4 eighth-notes), so the chord
// flips every 2 beats. One down-strum per beat gives an audible pulse to follow.
// Changes per minute is therefore bpm / 2 — that's what we score. Over a full
// 60s run the total changes played equals exactly changesPerMin(bpm).
const DRILL_PATTERN: StrumPattern = {
  id: "change-drill",
  name: "Change drill",
  genre: "Folk",
  difficulty: "easy",
  steps: ["D", "", "D", ""],
};

const changesPerMin = (bpm: number) => Math.round(bpm / 2);

export default function ChangeDrill() {
  const known = useProgress((s) => s.knownChords);
  const best = useProgress((s) => s.bestChangesPerMin);
  const reportChanges = useProgress((s) => s.reportChanges);
  const addXp = useProgress((s) => s.addXp);
  const recordPractice = useProgress((s) => s.recordPractice);
  const hydrated = useHasHydrated();

  const pairs = CANDIDATE_PAIRS.filter((p) => p.every((c) => known.includes(c)));
  const [pair, setPair] = useState<[string, string]>(pairs[0] ?? ["Em", "Am"]);
  const [bpm, setBpm] = useState(80);

  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(DURATION);
  const [result, setResult] = useState<{ perMin: number; count: number; saved: boolean; isBest: boolean } | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStarted = useRef(false);
  const finished = useRef(false);
  const runFinalCount = useRef(0); // tempo is frozen mid-run, so capture at start

  const { ui, play, stop, setBpm: setEngineBpm, setContent } = usePracticeEngine({
    bpm: 80,
    progression: pair,
    pattern: DRILL_PATTERN,
    mode: "play",
    metronome: true,
    countInBars: 2, // one 4/4 measure of clicks to get ready
  });

  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  // The full-run total; also the changes/min this tempo scores.
  const finalCount = changesPerMin(bpm);

  // Start the 60s clock once the count-in ends. The interval owns the countdown
  // and the natural finish, so no setState runs synchronously inside an effect.
  useEffect(() => {
    if (!running || ui.isCountIn || timerStarted.current) return;
    timerStarted.current = true;
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          if (!finished.current) {
            finished.current = true;
            clearTimer();
            queueMicrotask(() => {
              stop();
              setRunning(false);
              const c = runFinalCount.current;
              addXp(Math.max(1, Math.round(c / 2)));
              recordPractice();
              setResult({ perMin: c, count: c, saved: false, isBest: false });
            });
          }
          return 0;
        }
        return l - 1;
      });
    }, 1000);
  }, [running, ui.isCountIn, stop, addXp, recordPractice]);

  useEffect(() => () => clearTimer(), []);

  const start = () => {
    setResult(null);
    setLeft(DURATION);
    timerStarted.current = false;
    finished.current = false;
    runFinalCount.current = finalCount;
    setEngineBpm(bpm);
    setContent(pair, DRILL_PATTERN);
    setRunning(true);
    play();
  };

  const cancel = () => {
    clearTimer();
    stop();
    setRunning(false);
    setLeft(DURATION);
    timerStarted.current = false;
    finished.current = false;
  };

  const confirmClean = () => {
    if (!result) return;
    const isBest = reportChanges(result.perMin);
    setResult({ ...result, saved: true, isBest });
  };

  const activeIsSecond = running && !ui.isCountIn && ui.chord === pair[1];
  const elapsed = DURATION - left;
  const liveCount = running && !ui.isCountIn ? Math.min(finalCount, Math.floor((elapsed * finalCount) / DURATION)) : 0;
  const shownCount = result ? result.count : liveCount;
  const tempoPct = Math.round(((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100);

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
        {running ? (ui.isCountIn ? "get ready…" : `${left}s`) : result ? "Done!" : `${DURATION}s`}
      </div>
      <div className="bg-gradient-to-b from-white to-[#a48bff] bg-clip-text font-display text-[78px] font-bold leading-none text-transparent">
        {shownCount}
      </div>
      <div className="text-[13px] text-muted">changes played</div>

      <div className="my-5 flex items-start justify-center gap-6">
        {pair.map((c, idx) => {
          const active = running && !ui.isCountIn && (idx === 1 ? activeIsSecond : !activeIsSecond);
          const chord = getChord(c);
          return (
            <div key={c} className={`transition-opacity ${running && !ui.isCountIn && !active ? "opacity-35" : ""}`}>
              <div className={`font-display text-[30px] font-bold ${active ? "text-accent-2" : ""}`}>{c}</div>
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
        onClick={running ? cancel : start}
        className={`w-full rounded-[18px] py-6 font-display text-[20px] font-bold transition-transform active:scale-[0.98] ${
          running ? "bg-panel-2 text-fg" : "bg-go text-[#06231a]"
        }`}
      >
        {running ? "Stop" : "Start 60s drill"}
      </button>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] text-muted">
            Tempo · <b className="text-fg">{finalCount}</b> changes/min
          </span>
          <span className="font-display text-[22px] font-bold">
            {bpm}
            <small className="ml-1 text-xs font-medium text-faint">BPM</small>
          </span>
        </div>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          step={2}
          value={bpm}
          disabled={running}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full disabled:opacity-50"
          style={{
            background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${tempoPct}%, #262c40 ${tempoPct}%)`,
          }}
        />
      </div>

      <div className="mt-3.5 text-[13px] text-muted">
        Personal best: <b className="text-fg">{hydrated ? best : 0}</b> / min
      </div>

      {result && !result.saved && (
        <div className="mt-4 rounded-2xl border border-line bg-panel p-4">
          <div className="text-[14px] font-semibold text-fg">
            {result.count} changes at {result.perMin}/min
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
            Did you land every change cleanly, in time?
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={confirmClean}
              className="flex-1 rounded-[13px] bg-go py-3 text-[14px] font-bold text-[#06231a] transition active:scale-[0.98]"
            >
              Yes — kept up ✓
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 rounded-[13px] border border-line bg-panel py-3 text-[14px] font-semibold text-muted transition hover:border-accent"
            >
              Too fast — retry
            </button>
          </div>
        </div>
      )}

      {result && result.saved && (
        <div className={`mt-3 font-semibold ${result.isBest ? "text-go" : "text-muted"}`}>
          {result.isBest
            ? `🏆 New personal best — ${result.perMin} changes/min!`
            : `Locked in ${result.perMin}/min. Nudge the tempo up next round.`}
        </div>
      )}

      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        Hands-free: after the count-in the loop switches chords for you on the beat — just play
        along. Push the tempo up as it gets easy.
      </p>
    </div>
  );
}
