"use client";

import { useProgress, useHasHydrated } from "@/state/progress";
import { levelStatus, LEVELS, type LevelProgress } from "@/data/levels";

const EMPTY: LevelProgress = {
  knownChords: [],
  bestChangesPerMin: 0,
  creations: 0,
  streak: 0,
  sessions: 0,
  completedLessons: [],
};

export default function JourneyPage() {
  const hydrated = useHasHydrated();
  const s = useProgress();

  const p: LevelProgress = hydrated
    ? {
        knownChords: s.knownChords,
        bestChangesPerMin: s.bestChangesPerMin,
        creations: s.creations.length,
        streak: s.streak,
        sessions: s.sessions,
        completedLessons: s.completedLessons,
      }
    : EMPTY;

  const status = levelStatus(p);

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Your journey</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Five levels from first chord to musician. Each unlocks by doing, not by clocking hours —
        nothing is locked, this just shows where you are.
      </p>

      <div className="mt-4 rounded-[20px] border border-[#2c2b4d] bg-gradient-to-br from-[#1a1836] to-[#141726] p-5">
        <div className="text-[12px] uppercase tracking-[0.12em] text-faint">
          Level {status.currentLevelNumber} of {LEVELS.length}
        </div>
        <div className="mt-0.5 font-display text-[24px] font-bold">{status.current.name}</div>
        <div className="text-[13px] text-muted">{status.current.tagline}</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#2a2f47]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-pink transition-all"
            style={{ width: `${(status.current.doneCount / status.current.total) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 text-[12px] text-muted">
          {status.current.doneCount} / {status.current.total} milestones on this level
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {status.levels.map((lv) => {
          const isCurrent = lv.n === status.currentLevelNumber;
          return (
            <div
              key={lv.n}
              className={`rounded-2xl border p-4 ${
                isCurrent ? "border-accent bg-panel-2" : "border-line bg-panel"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`grid h-9 w-9 flex-none place-items-center rounded-full font-display text-[15px] font-bold ${
                    lv.complete
                      ? "bg-go text-[#06231a]"
                      : isCurrent
                        ? "bg-accent text-white"
                        : "border border-line text-muted"
                  }`}
                >
                  {lv.complete ? "✓" : lv.n}
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold">{lv.name}</div>
                  <div className="text-[12.5px] text-muted">{lv.tagline}</div>
                </div>
                <span className="ml-auto text-[12px] font-semibold text-faint">
                  {lv.doneCount}/{lv.total}
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1.5">
                {lv.milestones.map((m) => {
                  const met = lv.metIds.includes(m.id);
                  return (
                    <li key={m.id} className="flex items-center gap-2.5 text-[13px]">
                      <span
                        className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full text-[11px] ${
                          met ? "bg-go/20 text-go" : "border border-line text-faint"
                        }`}
                      >
                        {met ? "✓" : ""}
                      </span>
                      <span className={met ? "text-fg line-through decoration-faint/50" : "text-muted"}>
                        {m.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
