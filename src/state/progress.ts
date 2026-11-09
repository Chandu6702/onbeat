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

interface ProgressState {
  knownChords: string[];
  xp: number;
  streak: number;
  lastPracticeDate: string | null; // YYYY-MM-DD
  dailyGoalMin: number;
  bestChangesPerMin: number;
  creations: Creation[];

  addXp: (n: number) => void;
  recordPractice: () => void;
  reportChanges: (perMin: number) => boolean; // returns true if new best
  toggleKnownChord: (name: string) => void;
  addCreation: (c: Creation) => void;
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
      knownChords: ["Em", "Am", "C", "G", "D", "E"],
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      dailyGoalMin: 10,
      bestChangesPerMin: 0,
      creations: [],

      addXp: (n) => set((s) => ({ xp: s.xp + n })),

      recordPractice: () => {
        const today = todayStr();
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
    }),
    { name: "cadence-progress", version: 1 },
  ),
);

// Avoids SSR/first-paint hydration mismatch when displaying persisted values.
import { useEffect, useState } from "react";
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
