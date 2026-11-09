"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InstrumentType } from "@/audio/instruments";

export type Theme = "dark" | "light";

interface SettingsState {
  theme: Theme;
  lefty: boolean;
  countIn: boolean;
  metronomeVolume: number; // 0..1
  transpose: number; // capo / transpose in semitones (+ = capo up)
  instrument: InstrumentType;

  setTheme: (t: Theme) => void;
  toggleLefty: () => void;
  toggleCountIn: () => void;
  setMetronomeVolume: (v: number) => void;
  setTranspose: (n: number) => void;
  setInstrument: (i: InstrumentType) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      lefty: false,
      countIn: true,
      metronomeVolume: 0.8,
      transpose: 0,
      instrument: "acoustic",

      setTheme: (theme) => set({ theme }),
      toggleLefty: () => set((s) => ({ lefty: !s.lefty })),
      toggleCountIn: () => set((s) => ({ countIn: !s.countIn })),
      setMetronomeVolume: (metronomeVolume) => set({ metronomeVolume }),
      setTranspose: (transpose) => set({ transpose }),
      setInstrument: (instrument) => set({ instrument }),
    }),
    // localStorage key kept as the original name on purpose — renaming it would
    // wipe existing users' saved settings. Internal only; not user-visible.
    { name: "cadence-settings" },
  ),
);
