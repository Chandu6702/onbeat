"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Creation {
  id: string;
  name: string;
  chords: string[];
  patternId: string;
  bpm: number;
  genre: string;
  createdAt: number;
}

export type PracticeGoal = "songs" | "smooth" | "chords" | "explore";

interface ProgressState {
  knownChords: string[];
  xp: number;
  streak: number;
  lastPracticeDate: string | null; // YYYY-MM-DD
  dailyGoalMin: number;
  bestChangesPerMin: number;
  creations: Creation[];
  onboarded: boolean;
  goal: PracticeGoal | null;
  completedLessons: string[]; // theory lesson ids
  sessions: number; // total practice sessions started
  practiceLog: Record<string, number>; // YYYY-MM-DD -> sessions that day

  addXp: (n: number) => void;
  recordPractice: () => void;
  reportChanges: (perMin: number) => boolean; // returns true if new best
  toggleKnownChord: (name: string) => void;
  addCreation: (c: Creation) => void;
  completeOnboarding: (chords: string[], goal: PracticeGoal | null) => void;
  markLessonDone: (id: string) => void;
  /** Merge a remote snapshot (from cloud sync) into local state. */
  mergeRemote: (data: Partial<ProgressData>) => void;
}

// The persisted, syncable slice of the store (no actions). This is exactly what
// cloud sync reads and writes.
export type ProgressData = {
  knownChords: string[];
  xp: number;
  streak: number;
  lastPracticeDate: string | null;
  dailyGoalMin: number;
  bestChangesPerMin: number;
  creations: Creation[];
  onboarded: boolean;
  goal: PracticeGoal | null;
  completedLessons: string[];
  sessions: number;
  practiceLog: Record<string, number>;
};

/** Snapshot the syncable data out of the live store state. */
export function exportProgress(s: ProgressState): ProgressData {
  return {
    knownChords: s.knownChords,
    xp: s.xp,
    streak: s.streak,
    lastPracticeDate: s.lastPracticeDate,
    dailyGoalMin: s.dailyGoalMin,
    bestChangesPerMin: s.bestChangesPerMin,
    creations: s.creations,
    onboarded: s.onboarded,
    goal: s.goal,
    completedLessons: s.completedLessons,
    sessions: s.sessions,
    practiceLog: s.practiceLog,
  };
}

const uniq = (a: string[]) => Array.from(new Set(a));

// Conservative merge so syncing across devices never loses or double-counts:
// bests take the max, collections union, the practice log keeps the busier day.
export function mergeProgress(local: ProgressData, remote: Partial<ProgressData>): ProgressData {
  const log: Record<string, number> = { ...local.practiceLog };
  for (const [day, n] of Object.entries(remote.practiceLog ?? {})) {
    log[day] = Math.max(log[day] ?? 0, n);
  }
  const creationsById = new Map<string, Creation>();
  for (const c of [...local.creations, ...(remote.creations ?? [])]) creationsById.set(c.id, c);

  const laterDate = (a: string | null, b: string | null | undefined) =>
    !a ? (b ?? null) : !b ? a : a >= b ? a : b;

  return {
    knownChords: uniq([...local.knownChords, ...(remote.knownChords ?? [])]),
    xp: Math.max(local.xp, remote.xp ?? 0),
    streak: Math.max(local.streak, remote.streak ?? 0),
    lastPracticeDate: laterDate(local.lastPracticeDate, remote.lastPracticeDate),
    dailyGoalMin: local.dailyGoalMin ?? remote.dailyGoalMin ?? 10,
    bestChangesPerMin: Math.max(local.bestChangesPerMin, remote.bestChangesPerMin ?? 0),
    creations: Array.from(creationsById.values()).sort((a, b) => b.createdAt - a.createdAt),
    onboarded: local.onboarded || Boolean(remote.onboarded),
    goal: local.goal ?? remote.goal ?? null,
    completedLessons: uniq([...local.completedLessons, ...(remote.completedLessons ?? [])]),
    sessions: Math.max(local.sessions, remote.sessions ?? 0),
    practiceLog: log,
  };
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      knownChords: [],
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      dailyGoalMin: 10,
      bestChangesPerMin: 0,
      creations: [],
      onboarded: false,
      goal: null,
      completedLessons: [],
      sessions: 0,
      practiceLog: {},

      addXp: (n) => set((s) => ({ xp: s.xp + n })),

      recordPractice: () => {
        const today = todayStr();
        set((s) => ({
          sessions: s.sessions + 1,
          practiceLog: { ...s.practiceLog, [today]: (s.practiceLog[today] ?? 0) + 1 },
        }));
        const last = get().lastPracticeDate;
        if (last === today) return;
        let streak = 1;
        if (last) {
          const gap = daysBetween(last, today);
          if (gap === 1) streak = get().streak + 1;
          else if (gap <= 0) streak = get().streak; // clock oddity, keep
        }
        set({ streak, lastPracticeDate: today });
      },

      reportChanges: (perMin) => {
        if (perMin > get().bestChangesPerMin) {
          set({ bestChangesPerMin: perMin });
          return true;
        }
        return false;
      },

      toggleKnownChord: (name) =>
        set((s) => ({
          knownChords: s.knownChords.includes(name)
            ? s.knownChords.filter((c) => c !== name)
            : [...s.knownChords, name],
        })),

      addCreation: (c) => set((s) => ({ creations: [c, ...s.creations] })),

      markLessonDone: (id) =>
        set((s) =>
          s.completedLessons.includes(id)
            ? s
            : { completedLessons: [...s.completedLessons, id] },
        ),

      completeOnboarding: (chords, goal) =>
        // Honour an empty pick — "start gently" means no chords claimed yet.
        set({ knownChords: chords, goal, onboarded: true }),

      mergeRemote: (data) => set((s) => mergeProgress(exportProgress(s), data)),
    }),
    {
      // localStorage key kept as the original name on purpose — renaming it
      // would wipe existing users' progress. Internal only; not user-visible.
      name: "cadence-progress",
      version: 4,
      migrate: (persisted, version) => {
        const state = persisted as Partial<ProgressState>;
        // v1 users already have progress — don't show them onboarding.
        if (version < 2) {
          state.onboarded = true;
          state.goal = state.goal ?? null;
        }
        // v3 adds the level-system fields.
        if (version < 3) {
          state.completedLessons = state.completedLessons ?? [];
          state.sessions = state.sessions ?? 0;
        }
        // v4 adds the per-day practice log for the history calendar.
        if (version < 4) {
          state.practiceLog = state.practiceLog ?? {};
          // Seed the last known practice day so returning users aren't blank.
          if (state.lastPracticeDate && !state.practiceLog[state.lastPracticeDate]) {
            state.practiceLog[state.lastPracticeDate] = Math.max(1, state.sessions ?? 1);
          }
        }
        return state;
      },
    },
  ),
);

// Avoids SSR/first-paint hydration mismatch when displaying persisted values.
// useSyncExternalStore returns the server snapshot (false) during SSR and the
// first client render, then the client snapshot (true) once hydrated — no
// effect, no cascading render.
import { useSyncExternalStore } from "react";
const noop = () => () => {};
export function useHasHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
