"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PracticeEngine, type EngineConfig, type EngineMode, type StepInfo } from "./engine";
import type { StrumPattern } from "@/data/types";

export interface EngineUiState {
  playing: boolean;
  step: number;
  bar: number;
  beat: number | null;
  chord: string;
  isCountIn: boolean;
}

const initialUi: EngineUiState = {
  playing: false,
  step: -1,
  bar: 0,
  beat: null,
  chord: "",
  isCountIn: false,
};

export function usePracticeEngine(config: EngineConfig) {
  const engineRef = useRef<PracticeEngine | null>(null);
  const [ui, setUi] = useState<EngineUiState>(initialUi);

  useEffect(() => {
    const engine = new PracticeEngine(config);
    engine.onStep = (info: StepInfo) =>
      setUi((s) => ({
        ...s,
        step: info.step,
        bar: info.bar,
        beat: info.beat,
        chord: info.chord,
        isCountIn: info.isCountIn,
      }));
    engine.onStateChange = (playing) => setUi((s) => ({ ...s, playing }));
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
    // Engine is created once; live changes go through the setters below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => engineRef.current?.start(), []);
  const stop = useCallback(() => {
    engineRef.current?.stop();
    setUi((s) => ({ ...s, step: -1, beat: null }));
  }, []);
  const toggle = useCallback(() => {
    const e = engineRef.current;
    if (!e) return;
    if (e.playing) stop();
    else e.start();
  }, [stop]);

  const setBpm = useCallback((bpm: number) => engineRef.current?.setBpm(bpm), []);
  const setMetronome = useCallback((on: boolean) => engineRef.current?.setMetronome(on), []);
  const setMetronomeVolume = useCallback((v: number) => engineRef.current?.setMetronomeVolume(v), []);
  const setCountIn = useCallback((bars: number) => engineRef.current?.setCountIn(bars), []);
  const setTranspose = useCallback((semis: number) => engineRef.current?.setTranspose(semis), []);
  const setMode = useCallback((m: EngineMode) => engineRef.current?.setMode(m), []);
  const setContent = useCallback(
    (progression: string[], pattern: StrumPattern) =>
      engineRef.current?.setContent(progression, pattern),
    [],
  );
  const previewChord = useCallback((name: string) => engineRef.current?.previewChord(name), []);

  return {
    ui,
    play,
    stop,
    toggle,
    setBpm,
    setMetronome,
    setMetronomeVolume,
    setCountIn,
    setTranspose,
    setMode,
    setContent,
    previewChord,
  };
}
