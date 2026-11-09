"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

interface SettingsState {
  theme: Theme;
  lefty: boolean;
  countIn: boolean;
  metronomeVolume: number; // 0..1
  transpose: number; // capo / transpose in semitones (+ = capo up)

  setTheme: (t: Theme) => void;
  toggleLefty: () => void;
  toggleCountIn: () => void;
  setMetronomeVolume: (v: number) => void;
  setTranspose: (n: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      lefty: false,
      countIn: true,
      metronomeVolume: 0.8,
      transpose: 0,

      setTheme: (theme) => set({ theme }),
      toggleLefty: () => set((s) => ({ lefty: !s.lefty })),
      toggleCountIn: () => set((s) => ({ countIn: !s.countIn })),
      setMetronomeVolume: (metronomeVolume) => set({ metronomeVolume }),
      setTranspose: (transpose) => set({ transpose }),
    }),
    { name: "cadence-settings" },
  ),
);
