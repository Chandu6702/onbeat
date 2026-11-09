"use client";

import { useProgress, useHasHydrated } from "@/state/progress";

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
  const { xp, streak, bestChangesPerMin, knownChords } = useProgress();

  const show = (v: number) => (hydrated ? v : 0);

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
            <div className="font-display text-[18px] font-bold">Guitar learner</div>
            <div className="text-[13px] text-muted">
              {show(xp) >= 1000 ? "Level 3 · Advancing" : show(xp) >= 300 ? "Level 2 · Getting there" : "Level 1 · Just starting"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat n={show(streak)} label="Day streak" color="var(--color-beat)" />
        <Stat n={show(xp).toLocaleString()} label="Total XP" color="var(--color-accent-2)" />
        <Stat n={show(bestChangesPerMin)} label="Best changes / min" color="var(--color-go)" />
        <Stat n={hydrated ? knownChords.length : 6} label="Chords you know" />
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        Chords you know
      </p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {(hydrated ? knownChords : ["Em", "Am", "C", "G", "D", "E"]).map((c) => (
          <span
            key={c}
            className="rounded-[11px] border border-accent-2 bg-accent px-3.5 py-2 font-display text-[15px] font-bold text-white"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-faint">
        Difficulty labels help you find your next step — the app suggests, never forces.
      </p>
    </>
  );
}
