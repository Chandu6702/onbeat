"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlayAlong from "@/components/practice/PlayAlong";
import ChangeDrill from "@/components/practice/ChangeDrill";
import StrumTrainer from "@/components/practice/StrumTrainer";

type Mode = "menu" | "play" | "drill" | "strum";

const MODES = [
  {
    id: "drill" as const,
    icon: "🔁",
    title: "Chord-change drill",
    desc: "How many clean changes in 60s? Beat your best.",
  },
  {
    id: "strum" as const,
    icon: "🎸",
    title: "Strumming trainer",
    desc: "Follow the pattern on the beat — Easy to Hard.",
  },
  {
    id: "play" as const,
    icon: "▶️",
    title: "Play-along",
    desc: "A generated loop plays in tempo — you play along.",
  },
];

const TITLES: Record<Exclude<Mode, "menu">, string> = {
  play: "Play-along",
  drill: "Chord-change drill",
  strum: "Strumming trainer",
};

function PracticeInner() {
  const params = useSearchParams();
  const initial = (params.get("mode") as Mode) || "menu";
  const [mode, setMode] = useState<Mode>(
    ["play", "drill", "strum"].includes(initial) ? initial : "menu",
  );

  const chordsParam = params.get("chords");
  const patternParam = params.get("pattern");
  const bpmParam = params.get("bpm");
  const playProps = {
    ...(chordsParam ? { progression: chordsParam.split(",").filter(Boolean) } : {}),
    ...(patternParam ? { patternId: patternParam } : {}),
    ...(bpmParam ? { startBpm: Number(bpmParam) || 80 } : {}),
  };

  if (mode === "menu") {
    return (
      <>
        <h1 className="font-display text-[22px] font-semibold">Practice</h1>
        <p className="mb-4 text-[13.5px] text-muted">Short, focused reps. Pick one.</p>
        <div className="grid gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 text-left transition-colors hover:border-accent"
            >
              <div className="grid h-12 w-12 flex-none place-items-center rounded-[13px] bg-gradient-to-br from-[#221f3d] to-[#191c2b] text-[23px]">
                {m.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold">{m.title}</div>
                <div className="mt-0.5 text-[12.5px] leading-snug text-muted">{m.desc}</div>
              </div>
            </button>
          ))}

          <Link
            href="/listen"
            className="flex w-full items-center gap-3.5 rounded-2xl border border-accent/50 bg-gradient-to-br from-[#1c1a38] to-[#141726] p-4 text-left transition-colors hover:border-accent"
          >
            <div className="grid h-12 w-12 flex-none place-items-center rounded-[13px] bg-accent/15 text-[23px]">
              👂
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold">Listen mode</div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-muted">
                It listens while you play and scores you. Hands-free.
              </div>
            </div>
          </Link>
        </div>

        <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Before you play
        </p>
        <div className="grid gap-3">
          <Link
            href="/tuner"
            className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 text-left transition-colors hover:border-accent"
          >
            <div className="grid h-12 w-12 flex-none place-items-center rounded-[13px] bg-gradient-to-br from-[#221f3d] to-[#191c2b] text-[23px]">
              🎤
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold">Tuner</div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-muted">
                Tune up with your mic before you start.
              </div>
            </div>
            <span className="ml-auto text-[10.5px] font-bold uppercase text-beat">Mic</span>
          </Link>
          <Link
            href="/about"
            className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 text-left transition-colors hover:border-accent"
          >
            <div className="grid h-12 w-12 flex-none place-items-center rounded-[13px] bg-gradient-to-br from-[#221f3d] to-[#191c2b] text-[23px]">
              💡
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold">About &amp; how-to</div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-muted">
                How hands-free practice works.
              </div>
            </div>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setMode("menu")}
        className="mb-1.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-fg"
      >
        ‹ Back
      </button>
      <h1 className="mb-4 font-display text-[19px] font-semibold">{TITLES[mode]}</h1>
      {mode === "play" && <PlayAlong {...playProps} />}
      {mode === "drill" && <ChangeDrill />}
      {mode === "strum" && <StrumTrainer />}
    </>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <PracticeInner />
    </Suspense>
  );
}
