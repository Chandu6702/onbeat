"use client";

import { useState } from "react";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { PATTERNS, getPattern } from "@/data/patterns";
import type { Difficulty } from "@/data/types";

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", med: "Medium", hard: "Hard" };
const DIFF_CLASS: Record<Difficulty, string> = {
  easy: "bg-go/15 text-go",
  med: "bg-beat/15 text-beat",
  hard: "bg-pink/15 text-pink",
};

export default function PatternList() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { ui, play, stop, setContent } = usePracticeEngine({
    bpm: 90,
    progression: ["Em"],
    pattern: getPattern(PATTERNS[0].id),
    mode: "play",
    metronome: true,
    countInBars: 0,
  });

  const toggle = (id: string) => {
    if (playingId === id) {
      stop();
      setPlayingId(null);
      return;
    }
    setContent(["Em"], getPattern(id));
    play();
    setPlayingId(id);
  };

  return (
    <div className="flex flex-col gap-3">
      {PATTERNS.map((p) => {
        const active = playingId === p.id;
        return (
          <div
            key={p.id}
            className={`rounded-2xl border bg-panel p-4 transition-colors ${
              active ? "border-accent" : "border-line"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">{p.name}</div>
                <div className="mt-0.5 text-[12px] text-muted">
                  {p.genre} ·{" "}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${DIFF_CLASS[p.difficulty]}`}>
                    {DIFF_LABEL[p.difficulty]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggle(p.id)}
                aria-label={active ? "Stop" : "Play"}
                className={`grid h-11 w-11 flex-none place-items-center rounded-full transition ${
                  active ? "bg-accent" : "border border-line bg-panel-2"
                }`}
              >
                <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? "fill-white" : "fill-accent-2"}`}>
                  {active ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.steps.map((s, i) => {
                const on = active && ui.step === i && !!s;
                return (
                  <span
                    key={i}
                    className={`grid h-9 w-7 place-items-center rounded-lg border text-[15px] font-bold transition-all duration-75 ${
                      on
                        ? "-translate-y-0.5 border-go bg-go text-[#06231a]"
                        : s
                          ? "border-line bg-panel-2 text-muted"
                          : "border-line bg-panel-2 text-faint opacity-40"
                    }`}
                  >
                    {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-center text-xs text-faint">Played on Em so you can focus on the hand.</p>
    </div>
  );
}
