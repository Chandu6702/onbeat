"use client";

import Link from "next/link";
import { useProgress, useHasHydrated } from "@/state/progress";
import { levelStatus, type LevelProgress } from "@/data/levels";
import PracticeCalendar from "@/components/profile/PracticeCalendar";

function Stat({ n, label, color }: { n: string | number; label: string; color?: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <div className="font-display text-[26px] font-bold" style={color ? { color } : undefined}>
        {n}
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const hydrated = useHasHydrated();
  const s = useProgress();
  const { xp, streak, bestChangesPerMin, knownChords } = s;

  const show = (v: number) => (hydrated ? v : 0);

  const lp: LevelProgress = {
    knownChords: hydrated ? knownChords : [],
    bestChangesPerMin: show(bestChangesPerMin),
    creations: hydrated ? s.creations.length : 0,
    streak: show(streak),
    sessions: hydrated ? s.sessions : 0,
    completedLessons: hydrated ? s.completedLessons : [],
  };
  const level = levelStatus(lp);

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Your progress</h1>
      <p className="text-[13.5px] text-muted">Everything below updates as you practice.</p>

      <div className="mt-4 rounded-[20px] border border-[#2c2b4d] bg-gradient-to-br from-[#1a1836] to-[#141726] p-[18px]">
        <div className="flex items-center gap-3.5">
          <div className="grid h-[52px] w-[52px] place-items-center rounded-[15px] bg-gradient-to-br from-accent to-pink text-2xl">
            🎸
          </div>
          <div>
            <div className="font-display text-[18px] font-bold">
              Level {level.currentLevelNumber} · {level.current.name}
            </div>
            <div className="text-[13px] text-muted">
              {level.current.doneCount}/{level.current.total} milestones · {level.current.tagline}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat n={show(streak)} label="Day streak" color="var(--color-beat)" />
        <Stat n={show(xp).toLocaleString()} label="Total XP" color="var(--color-accent-2)" />
        <Stat n={show(bestChangesPerMin)} label="Best changes / min" color="var(--color-go)" />
        <Stat n={hydrated ? knownChords.length : 0} label="Chords you know" />
      </div>

      <div className="mt-3">
        <PracticeCalendar />
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        Chords you know
      </p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {hydrated && knownChords.length === 0 ? (
          <Link
            href="/learn"
            className="rounded-[11px] border border-dashed border-line bg-panel px-3.5 py-2 text-[13px] font-semibold text-muted transition hover:border-accent hover:text-fg"
          >
            No chords yet — learn your first →
          </Link>
        ) : (
          (hydrated ? knownChords : []).map((c) => (
            <span
              key={c}
              className="rounded-[11px] border border-accent-2 bg-accent px-3.5 py-2 font-display text-[15px] font-bold text-white"
            >
              {c}
            </span>
          ))
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <Link
          href="/journey"
          className="flex items-center gap-3.5 rounded-2xl border border-accent/40 bg-gradient-to-br from-[#1a1836] to-[#141726] p-4 transition hover:border-accent"
        >
          <span className="text-xl">🧭</span>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold">Your journey</div>
            <div className="text-[12.5px] text-muted">
              Level {level.currentLevelNumber}/5 · {level.current.doneCount}/{level.current.total} milestones
            </div>
          </div>
          <span className="ml-auto text-accent-2">→</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-accent"
        >
          <span className="text-xl">⚙️</span>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold">Settings</div>
            <div className="text-[12.5px] text-muted">Theme, left-handed, count-in, metronome.</div>
          </div>
          <span className="ml-auto text-accent-2">→</span>
        </Link>
        <Link
          href="/about"
          className="flex items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-accent"
        >
          <span className="text-xl">💡</span>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold">About &amp; how-to</div>
            <div className="text-[12.5px] text-muted">How hands-free practice works.</div>
          </div>
          <span className="ml-auto text-accent-2">→</span>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-faint">
        Difficulty labels help you find your next step — the app suggests, never forces.
      </p>
    </>
  );
}
