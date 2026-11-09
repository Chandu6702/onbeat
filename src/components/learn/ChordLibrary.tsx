"use client";

import { useState } from "react";
import { CHORDS } from "@/data/chords";
import type { Difficulty } from "@/data/types";
import Fretboard from "@/components/Fretboard";
import ChordDetail from "@/components/learn/ChordDetail";

const FILTERS: { id: Difficulty | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "med", label: "Medium" },
  { id: "hard", label: "Hard" },
];

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", med: "Medium", hard: "Hard" };

export default function ChordLibrary() {
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return <ChordDetail name={selected} onBack={() => setSelected(null)} />;
  }

  const chords = Object.values(CHORDS).filter((c) => diff === "all" || c.difficulty === diff);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = f.id === diff;
          return (
            <button
              key={f.id}
              onClick={() => setDiff(f.id)}
              className={`rounded-full border px-3.5 py-2 text-[12.5px] font-semibold ${
                on ? "border-accent bg-panel-2 text-fg" : "border-line bg-panel text-muted"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {chords.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelected(c.name)}
            className="rounded-[11px] border border-line bg-panel px-2.5 pb-2.5 pt-3 text-center transition-transform hover:border-accent active:scale-95"
          >
            <div className="mb-0.5 font-display text-[17px] font-bold">{c.name}</div>
            <div className="flex justify-center">
              <Fretboard shape={c.shape} />
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.05em] text-faint">
              {DIFF_LABEL[c.difficulty]}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-faint">
        Tap any chord for finger positions, tips, and audio.
      </p>
    </>
  );
}
