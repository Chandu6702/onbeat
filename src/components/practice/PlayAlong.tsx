"use client";

import { useMemo, useRef, useState } from "react";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getPattern } from "@/data/patterns";
import { DEMO_PROGRESSION } from "@/data/progressions";
import { useProgress } from "@/state/progress";

export default function PlayAlong({
  progression = DEMO_PROGRESSION,
  patternId = "pop-duduudu",
  startBpm = 80,
  title = "Play-along",
}: {
  progression?: string[];
  patternId?: string;
  startBpm?: number;
  title?: string;
}) {
  const pattern = useMemo(() => getPattern(patternId), [patternId]);
  const [bpm, setBpmState] = useState(startBpm);
  const [metro, setMetro] = useState(true);
  const [stand, setStand] = useState(false);
  const recorded = useRef(false);
  const recordPractice = useProgress((s) => s.recordPractice);

  const { ui, toggle, stop, setBpm, setMetronome } = usePracticeEngine({
    bpm: startBpm,
    progression,
    pattern,
    mode: "play",
    metronome: true,
    countInBars: 1,
  });

  const onToggle = () => {
    if (!ui.playing && !recorded.current) {
      recordPractice();
      recorded.current = true;
    }
    toggle();
  };

  const onTempo = (v: number) => {
    setBpmState(v);
    setBpm(v);
  };
  const onMetro = () => {
    const next = !metro;
    setMetro(next);
    setMetronome(next);
  };

  const tempoPct = Math.round(((bpm - 50) / (140 - 50)) * 100);

  // Performance / "stand" mode: a big, high-contrast fullscreen view you can
  // read from across the room. Auto-advancing, so nothing to tap while playing.
  if (stand) {
    const nextChord = progression[(ui.bar + 1) % progression.length];
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#05060a] text-center">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs uppercase tracking-[0.14em] text-faint">
            {ui.isCountIn ? "count in…" : ui.playing ? "now playing" : "ready"}
          </span>
          <button
            onClick={() => setStand(false)}
            className="rounded-full border border-line bg-panel px-3 py-1.5 text-[12.5px] font-semibold text-muted transition hover:text-fg"
          >
            Exit
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4">
          <div className="mb-5 flex justify-center gap-4">
            {[0, 1, 2, 3].map((b) => {
              const on = ui.playing && ui.beat === b;
              return (
                <span
                  key={b}
                  className={`h-4 w-4 rounded-full transition-transform duration-75 ${
                    on ? (b === 0 ? "scale-150 bg-accent-2" : "scale-150 bg-beat") : "bg-[#2a3048]"
                  }`}
                />
              );
            })}
          </div>

          <div
            className="font-display font-bold leading-none text-white"
            style={{ fontSize: "clamp(80px, 24vw, 220px)" }}
          >
            {ui.chord || progression[0]}
          </div>

          <div
            className="mt-3 font-semibold text-muted"
            style={{ fontSize: "clamp(16px, 4vw, 26px)" }}
          >
            {ui.playing && !ui.isCountIn ? (
              <>
                next · <span className="text-fg">{nextChord}</span>
              </>
            ) : (
              " "
            )}
          </div>

          <div className="mt-7 flex max-w-full flex-wrap justify-center gap-2.5">
            {pattern.steps.map((s, i) => {
              const on = ui.playing && ui.step === i && !!s;
              return (
                <span
                  key={i}
                  className={`grid place-items-center rounded-xl border font-bold transition-all duration-75 ${
                    on
                      ? "-translate-y-1 border-go bg-go text-[#06231a]"
                      : s
                        ? "border-line bg-panel text-muted"
                        : "border-line bg-panel text-faint opacity-40"
                  }`}
                  style={{
                    height: "clamp(40px, 8vw, 60px)",
                    width: "clamp(30px, 6vw, 46px)",
                    fontSize: "clamp(18px, 3.5vw, 28px)",
                  }}
                >
                  {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-none items-center justify-center pb-8">
          <button
            onClick={onToggle}
            aria-label={ui.playing ? "Pause" : "Play"}
            className="grid h-24 w-24 place-items-center rounded-full bg-accent shadow-[0_10px_30px_rgba(124,92,255,0.45)] transition-transform active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 fill-white">
              {ui.playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#121524] to-[#0e111c] px-4 py-6 text-center">
        <div className="mb-[18px] flex justify-center gap-2.5">
          {[0, 1, 2, 3].map((b) => {
            const on = ui.playing && ui.beat === b;
            return (
              <span
                key={b}
                className={`h-[11px] w-[11px] rounded-full transition-transform duration-75 ${
                  on ? (b === 0 ? "scale-150 bg-accent-2" : "scale-150 bg-beat") : "bg-[#2a3048]"
                }`}
              />
            );
          })}
        </div>

        <div className="bg-gradient-to-b from-white to-[#c9c6ff] bg-clip-text font-display text-[64px] font-bold leading-none tracking-tight text-transparent">
          {ui.chord || progression[0]}
        </div>
        <div className="mt-2 text-xs uppercase tracking-[0.12em] text-faint">
          {ui.isCountIn ? "count in…" : "now playing"}
        </div>

        <div className="my-5 flex min-h-[56px] flex-wrap items-center justify-center gap-2.5">
          {progression.map((c, i) => {
            const cur = ui.playing && !ui.isCountIn && ui.bar === i;
            const next = ui.playing && !ui.isCountIn && (ui.bar + 1) % progression.length === i;
            return (
              <div
                key={i}
                className={`grid h-[52px] min-w-[52px] place-items-center rounded-xl border font-display text-[19px] font-bold transition-all duration-200 ${
                  cur
                    ? "scale-110 border-accent-2 bg-accent text-white shadow-[0_8px_24px_rgba(124,92,255,0.4)]"
                    : next
                      ? "border-[#3a4066] bg-panel text-fg"
                      : "border-line bg-panel text-muted"
                }`}
              >
                {c}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {pattern.steps.map((s, i) => {
            const on = ui.playing && ui.step === i && !!s;
            return (
              <span
                key={i}
                className={`grid h-[38px] w-[30px] place-items-center rounded-[9px] border text-[17px] font-bold transition-all duration-75 ${
                  on
                    ? "-translate-y-[3px] border-go bg-go text-[#06231a]"
                    : s
                      ? "border-line bg-panel text-muted"
                      : "border-line bg-panel text-faint opacity-40"
                }`}
              >
                {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px] flex items-center justify-center gap-3.5">
        <button
          onClick={onMetro}
          aria-label="Metronome"
          className={`grid h-[50px] w-[50px] place-items-center rounded-full border bg-panel ${
            metro ? "border-beat text-beat" : "border-line text-muted"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 2h8l3 20H5L8 2zM12 5l-1 9M12 5l3 12" />
          </svg>
        </button>

        <button
          onClick={onToggle}
          aria-label={ui.playing ? "Pause" : "Play"}
          className="grid h-[70px] w-[70px] place-items-center rounded-full bg-accent shadow-[0_10px_30px_rgba(124,92,255,0.45)] transition-transform active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            {ui.playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>

        <button
          onClick={stop}
          aria-label="Restart"
          className="grid h-[50px] w-[50px] place-items-center rounded-full border border-line bg-panel text-muted"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12a8 8 0 108-8M4 4v4h4" />
          </svg>
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] text-muted">Tempo</span>
          <span className="font-display text-[22px] font-bold">
            {bpm}
            <small className="ml-1 text-xs font-medium text-faint">BPM</small>
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={140}
          step={1}
          value={bpm}
          onChange={(e) => onTempo(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${tempoPct}%, #262c40 ${tempoPct}%)`,
          }}
        />
      </div>

      <button
        onClick={() => setStand(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[13px] border border-line bg-panel py-2.5 text-[13px] font-semibold text-muted transition hover:border-accent hover:text-fg"
      >
        ⛶ Stand mode — big-screen view
      </button>

      <p className="mt-3.5 text-center text-xs leading-relaxed text-faint">
        Watch the highlighted chord — change just before the next one lands. {title}.
      </p>
    </>
  );
}
