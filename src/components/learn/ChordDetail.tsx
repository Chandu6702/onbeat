"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getPattern } from "@/data/patterns";
import { getChord } from "@/data/chords";
import type { Chord, Difficulty } from "@/data/types";
import { useSettings } from "@/state/settings";
import Fretboard from "@/components/Fretboard";

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", med: "Medium", hard: "Hard" };
const DIFF_CLASS: Record<Difficulty, string> = {
  easy: "text-go",
  med: "text-beat",
  hard: "text-pink",
};

const STRING_NAMES = ["low E", "A", "D", "G", "B", "high E"];
const FINGER_NAMES: Record<number, string> = { 1: "index", 2: "middle", 3: "ring", 4: "pinky" };

// Human-readable "which finger goes where", derived from shape + fingers.
function fretGuide(chord: Chord): string[] {
  return chord.shape.map((v, i) => {
    const name = STRING_NAMES[i];
    if (v === "x") return `${name}: don't play (muted)`;
    if (v === 0) return `${name}: open`;
    const finger = chord.fingers?.[i];
    const fingerText = finger ? ` with your ${FINGER_NAMES[finger]}` : "";
    return `${name}: fret ${v}${fingerText}`;
  });
}

export default function ChordDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const chord = getChord(name);
  const transpose = useSettings((s) => s.transpose);
  const { previewChord, setTranspose } = usePracticeEngine({
    bpm: 80,
    progression: [name],
    pattern: getPattern("folk-down"),
    mode: "metronome",
    metronome: false,
    countInBars: 0,
    transpose,
  });

  useEffect(() => setTranspose(transpose), [transpose, setTranspose]);

  if (!chord) {
    return (
      <div>
        <button onClick={onBack} className="text-[13.5px] font-semibold text-muted hover:text-fg">
          ‹ Back
        </button>
        <p className="mt-4 text-muted">Chord not found.</p>
      </div>
    );
  }

  const guide = fretGuide(chord);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-fg"
      >
        ‹ All chords
      </button>

      <div className="overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#121524] to-[#0e111c] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-[40px] font-bold leading-none">{chord.name}</div>
            <div className={`mt-1 text-[11px] font-bold uppercase tracking-[0.08em] ${DIFF_CLASS[chord.difficulty]}`}>
              {DIFF_LABEL[chord.difficulty]}
            </div>
          </div>
          <div className="flex justify-center">
            <Fretboard shape={chord.shape} fingers={chord.fingers} size={128} />
          </div>
        </div>

        <button
          onClick={() => previewChord(chord.name)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[13px] bg-accent py-3 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />
          </svg>
          Hear it
        </button>
      </div>

      <section className="mt-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Finger by finger</h3>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {guide.map((line, i) => {
            const muted = line.includes("don't play");
            return (
              <li
                key={i}
                className={`rounded-[10px] border border-line bg-panel px-3 py-2 text-[13.5px] ${
                  muted ? "text-faint" : "text-fg"
                }`}
              >
                {line}
              </li>
            );
          })}
        </ul>
      </section>

      {chord.tip && (
        <section className="mt-5 rounded-2xl border border-line bg-panel p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-beat">How to fret it</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-fg">{chord.tip}</p>
        </section>
      )}

      {chord.mistakes && chord.mistakes.length > 0 && (
        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pink">Common mistakes</h3>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {chord.mistakes.map((m, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-[10px] border border-line bg-panel px-3 py-2 text-[13.5px] leading-relaxed text-muted"
              >
                <span aria-hidden className="text-pink">⚠</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href={`/practice?mode=play&chords=${chord.name}&pattern=folk-down&bpm=70`}
        className="mt-6 flex w-full items-center justify-center rounded-[13px] bg-go py-3.5 text-[15px] font-bold text-[#06231a] transition active:scale-[0.98]"
      >
        Practice this →
      </Link>
    </div>
  );
}
