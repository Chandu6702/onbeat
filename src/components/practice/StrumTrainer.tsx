"use client";

import { useEffect, useRef, useState } from "react";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { PATTERNS, getPattern } from "@/data/patterns";
import { useProgress } from "@/state/progress";
import { useSettings } from "@/state/settings";

const CHORD = "Em"; // strumming trainer uses one easy chord so focus stays on the hand

export default function StrumTrainer() {
  const [patternId, setPatternId] = useState(PATTERNS[1].id);
  const [bpm, setBpmState] = useState(80);
  const [metro, setMetro] = useState(true);
  const recorded = useRef(false);
  const recordPractice = useProgress((s) => s.recordPractice);
  const countInPref = useSettings((s) => s.countIn);
  const metroVol = useSettings((s) => s.metronomeVolume);

  const pattern = getPattern(patternId);

  const { ui, toggle, stop, setBpm, setMetronome, setMetronomeVolume, setCountIn, setContent } =
    usePracticeEngine({
      bpm: 80,
      progression: [CHORD],
      pattern: getPattern(PATTERNS[1].id),
      mode: "play",
      metronome: true,
      countInBars: countInPref ? 1 : 0,
      metronomeVolume: metroVol,
    });

  useEffect(() => setCountIn(countInPref ? 1 : 0), [countInPref, setCountIn]);
  useEffect(() => setMetronomeVolume(metroVol), [metroVol, setMetronomeVolume]);

  const choosePattern = (id: string) => {
    setPatternId(id);
    setContent([CHORD], getPattern(id));
  };

  const onToggle = () => {
    if (!ui.playing && !recorded.current) {
      recordPractice();
      recorded.current = true;
    }
    toggle();
  };
  const onTempo = (v: number) => {
    setBpmState(v);
    setBpm(v);
  };
  const onMetro = () => {
    const next = !metro;
    setMetro(next);
    setMetronome(next);
  };

  const tempoPct = Math.round(((bpm - 50) / (140 - 50)) * 100);

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {PATTERNS.map((p) => {
          const on = p.id === patternId;
          return (
            <button
              key={p.id}
              onClick={() => choosePattern(p.id)}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${
                on ? "border-accent bg-panel-2 text-fg" : "border-line bg-panel text-muted"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#121524] to-[#0e111c] px-4 py-7 text-center">
        <div className="mb-5 flex justify-center gap-2.5">
          {[0, 1, 2, 3].map((b) => {
            const on = ui.playing && ui.beat === b;
            return (
              <span
                key={b}
                className={`h-[11px] w-[11px] rounded-full transition-transform duration-75 ${
                  on ? (b === 0 ? "scale-150 bg-accent-2" : "scale-150 bg-beat") : "bg-[#2a3048]"
                }`}
              />
            );
          })}
        </div>

        <div className="mb-1 font-display text-[15px] font-semibold text-muted">{pattern.name}</div>
        <div className="mb-5 text-xs uppercase tracking-[0.12em] text-faint">
          {ui.isCountIn ? "count in…" : `on ${CHORD}`}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {pattern.steps.map((s, i) => {
            const on = ui.playing && ui.step === i && !!s;
            const isBeat = i % 2 === 0;
            return (
              <span
                key={i}
                className={`grid h-[46px] w-[34px] place-items-center rounded-[10px] border text-[20px] font-bold transition-all duration-75 ${
                  on
                    ? "-translate-y-1 border-go bg-go text-[#06231a]"
                    : s
                      ? "border-line bg-panel text-muted"
                      : `border-line bg-panel text-faint ${isBeat ? "opacity-60" : "opacity-40"}`
                }`}
              >
                {s === "D" ? "↓" : s === "U" ? "↑" : "·"}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px] flex items-center justify-center gap-3.5">
        <button
          onClick={onMetro}
          aria-label="Metronome"
          className={`grid h-[50px] w-[50px] place-items-center rounded-full border bg-panel ${
            metro ? "border-beat text-beat" : "border-line text-muted"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 2h8l3 20H5L8 2zM12 5l-1 9M12 5l3 12" />
          </svg>
        </button>
        <button
          onClick={onToggle}
          aria-label={ui.playing ? "Pause" : "Play"}
          className="grid h-[70px] w-[70px] place-items-center rounded-full bg-accent shadow-[0_10px_30px_rgba(124,92,255,0.45)] transition-transform active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            {ui.playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
        <button
          onClick={stop}
          aria-label="Restart"
          className="grid h-[50px] w-[50px] place-items-center rounded-full border border-line bg-panel text-muted"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12a8 8 0 108-8M4 4v4h4" />
          </svg>
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] text-muted">Tempo</span>
          <span className="font-display text-[22px] font-bold">
            {bpm}
            <small className="ml-1 text-xs font-medium text-faint">BPM</small>
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={140}
          step={1}
          value={bpm}
          onChange={(e) => onTempo(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${tempoPct}%, #262c40 ${tempoPct}%)`,
          }}
        />
      </div>

      <p className="mt-3.5 text-center text-xs leading-relaxed text-faint">
        Follow the arrows — ↓ down, ↑ up. Start slow, then push the tempo up.
      </p>
    </>
  );
}
