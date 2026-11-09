"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProgress, useHasHydrated } from "@/state/progress";
import { generateLoop } from "@/audio/generator";

const EMPTY: string[] = [];

function StreakRing({ streak }: { streak: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const frac = Math.min(streak, 7) / 7;
  const offset = c * (1 - frac);
  return (
    <div className="relative h-[78px] w-[78px] flex-none">
      <svg width="78" height="78" viewBox="0 0 78 78" className="-rotate-90">
        <circle cx="39" cy="39" r={r} stroke="#2a2f47" strokeWidth="8" fill="none" />
        <circle
          cx="39"
          cy="39"
          r={r}
          stroke="url(#hg)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#ff6b9d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display text-lg font-bold">
        {streak}
      </div>
    </div>
  );
}

export default function Home() {
  const hydrated = useHasHydrated();
  const { xp, streak, knownChords, lastPracticeDate } = useProgress();

  const today = new Date().toISOString().slice(0, 10);
  const practicedToday = hydrated && lastPracticeDate === today;
  const isNew = hydrated && xp === 0;

  // Match SSR/first render (empty until hydrated), then refine after mount.
  // EMPTY is a stable reference so the recommendation memo doesn't re-run.
  const known = hydrated ? knownChords : EMPTY;
  // The recommendation falls back to a starter set purely to demo a loop — it
  // doesn't claim the user "knows" these chords.
  const rec = useMemo(
    () => generateLoop(known.length ? known : ["Em", "Am", "C", "G"], "Pop", () => 0),
    [known],
  );
  const recHref = `/practice?mode=play&chords=${rec.chords.join(",")}&pattern=${rec.patternId}&bpm=80`;

  return (
    <>
      <div className="mb-5 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-gradient-to-br from-accent to-pink font-display text-lg font-bold text-white">
            O
          </div>
          <div>
            <b className="block font-display text-base font-semibold tracking-tight">Onbeat</b>
            <span className="block text-[11px] text-faint">Practice studio</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-[12.5px] font-semibold">
          <span className="h-[7px] w-[7px] rounded-full bg-beat" /> {hydrated ? streak : 0}-day streak
        </div>
      </div>

      {isNew && (
        <Link
          href="/learn"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-accent/50 bg-accent/10 p-4 transition hover:bg-accent/15"
        >
          <span className="text-2xl">👋</span>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold">New here? Start with the guided path</div>
            <div className="text-[12.5px] text-muted">
              Step-by-step from your first chord to your first play-along.
            </div>
          </div>
          <span className="ml-auto text-accent-2">→</span>
        </Link>
      )}

      <div className="rounded-[20px] border border-[#2c2b4d] bg-gradient-to-br from-[#1a1836] to-[#141726] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold leading-tight md:text-2xl">
              Good to see you.
              <br />
              Ready to play?
            </h2>
            <p className="mt-1.5 max-w-[38ch] text-[13.5px] text-muted">
              {practicedToday
                ? "You've practiced today — nice. Keep the streak alive."
                : "A quick session keeps your streak going. Jump back in."}
            </p>
          </div>
          <StreakRing streak={hydrated ? streak : 0} />
        </div>
        <Link
          href={recHref}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[13px] bg-accent px-4 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
        >
          Continue practice →
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-panel p-3.5">
          <div className="font-display text-[22px] font-bold text-beat">{hydrated ? streak : 0}</div>
          <div className="mt-0.5 text-[11.5px] text-muted">Day streak</div>
        </div>
        <div className="rounded-xl border border-line bg-panel p-3.5">
          <div className="font-display text-[22px] font-bold text-accent-2">
            {(hydrated ? xp : 0).toLocaleString()}
          </div>
          <div className="mt-0.5 text-[11.5px] text-muted">Total XP</div>
        </div>
        <div className="rounded-xl border border-line bg-panel p-3.5">
          <div className="font-display text-[22px] font-bold text-go">
            {practicedToday ? "✓" : "—"}
          </div>
          <div className="mt-0.5 text-[11.5px] text-muted">Today</div>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        Recommended for you
      </p>
      <div className="mt-3 grid gap-2.5 md:grid-cols-2">
        <Link
          href={recHref}
          className="flex items-center gap-3.5 rounded-[11px] border border-line bg-panel p-3 transition-colors hover:border-accent"
        >
          <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[11px] bg-panel-2 text-xl">
            ▶️
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">
              {known.length ? "Play-along in your chords" : "Play-along with starter chords"}
            </div>
            <div className="mt-0.5 truncate text-xs text-muted">{rec.chords.join(" · ")}</div>
          </div>
          <span className="ml-auto rounded-md bg-go/15 px-2 py-1 text-[10.5px] font-bold uppercase text-go">
            Easy
          </span>
        </Link>

        <Link
          href="/practice?mode=drill"
          className="flex items-center gap-3.5 rounded-[11px] border border-line bg-panel p-3 transition-colors hover:border-accent"
        >
          <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[11px] bg-panel-2 text-xl">
            🔁
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Chord-change drill</div>
            <div className="mt-0.5 text-xs text-muted">Beat your record</div>
          </div>
          <span className="ml-auto rounded-md bg-go/15 px-2 py-1 text-[10.5px] font-bold uppercase text-go">
            Easy
          </span>
        </Link>

        <Link
          href="/learn"
          className="flex items-center gap-3.5 rounded-[11px] border border-line bg-panel p-3 transition-colors hover:border-accent"
        >
          <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[11px] bg-panel-2 text-xl">
            🎸
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Learn a new chord</div>
            <div className="mt-0.5 text-xs text-muted">Browse the chord library</div>
          </div>
          <span className="ml-auto rounded-md bg-beat/15 px-2 py-1 text-[10.5px] font-bold uppercase text-beat">
            Grow
          </span>
        </Link>

        <Link
          href="/create"
          className="flex items-center gap-3.5 rounded-[11px] border border-line bg-panel p-3 transition-colors hover:border-accent"
        >
          <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[11px] bg-panel-2 text-xl">
            ✨
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Create your own loop</div>
            <div className="mt-0.5 text-xs text-muted">Make something to play</div>
          </div>
          <span className="ml-auto rounded-md bg-accent/15 px-2 py-1 text-[10.5px] font-bold uppercase text-accent-2">
            New
          </span>
        </Link>
      </div>
    </>
  );
}
