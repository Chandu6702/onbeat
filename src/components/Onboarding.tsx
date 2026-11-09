"use client";

import { useState } from "react";
import { CHORDS } from "@/data/chords";
import Fretboard from "@/components/Fretboard";
import { useProgress, useHasHydrated, type PracticeGoal } from "@/state/progress";

const ALL_CHORDS = Object.keys(CHORDS);

const GOALS: { id: PracticeGoal; emoji: string; label: string; sub: string }[] = [
  { id: "songs", emoji: "🎵", label: "Play songs", sub: "Strum along to real progressions" },
  { id: "smooth", emoji: "🔁", label: "Get smoother", sub: "Faster, cleaner chord changes" },
  { id: "chords", emoji: "🎸", label: "Learn more chords", sub: "Grow your vocabulary" },
  { id: "explore", emoji: "✨", label: "Just exploring", sub: "See what's here" },
];

export default function Onboarding() {
  const hydrated = useHasHydrated();
  const onboarded = useProgress((s) => s.onboarded);
  const complete = useProgress((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [chords, setChords] = useState<string[]>([]);
  const [goal, setGoal] = useState<PracticeGoal | null>(null);

  // Only after hydration do we trust the persisted flag (avoids a flash on SSR).
  if (!hydrated || onboarded) return null;

  const toggle = (name: string) =>
    setChords((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  const finish = () => complete(chords, goal);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#07080e]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col px-5 py-8">
        {/* progress dots */}
        <div className="mb-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-accent" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-pink font-display text-3xl font-bold text-white">
              C
            </div>
            <h1 className="mt-5 font-display text-[26px] font-bold">Welcome to Cadence</h1>
            <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed text-muted">
              Your hands-free guitar practice partner. Once the guitar&apos;s in your hands you
              can&apos;t tap the screen — so Cadence <b className="text-fg">plays and counts you in</b>,
              switches chords <b className="text-fg">on the beat</b>, and has a big{" "}
              <b className="text-fg">Stand mode</b> you can read from across the room.
            </p>
            <p className="mt-3 max-w-[40ch] text-[13px] leading-relaxed text-faint">
              Let&apos;s set it up for you — takes about 20 seconds.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-7 w-full rounded-[14px] bg-accent py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Let&apos;s go →
            </button>
            <button onClick={finish} className="mt-3 text-[13px] font-semibold text-muted hover:text-fg">
              Skip for now
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-1 flex-col">
            <h2 className="font-display text-[22px] font-bold">Which chords do you know?</h2>
            <p className="mt-1.5 text-[13.5px] text-muted">
              Pick any you can already play. Not sure? Leave it blank — we&apos;ll start you gently.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {ALL_CHORDS.map((c) => {
                const on = chords.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`rounded-[11px] border px-2.5 pb-2.5 pt-3 text-center transition ${
                      on ? "border-accent-2 bg-accent/15" : "border-line bg-panel"
                    }`}
                  >
                    <div className="mb-0.5 font-display text-[16px] font-bold">{c}</div>
                    <div className="flex justify-center">
                      <Fretboard shape={CHORDS[c].shape} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto flex gap-3 pt-6">
              <button
                onClick={() => setStep(0)}
                className="rounded-[13px] border border-line bg-panel px-5 py-3 text-[14px] font-semibold text-muted"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-[13px] bg-accent py-3 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
              >
                {chords.length > 0 ? `Next · ${chords.length} chosen` : "Next"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col">
            <h2 className="font-display text-[22px] font-bold">What&apos;s your goal?</h2>
            <p className="mt-1.5 text-[13.5px] text-muted">We&apos;ll point you at the right things first.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {GOALS.map((g) => {
                const on = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
                      on ? "border-accent-2 bg-accent/15" : "border-line bg-panel"
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <div className="text-[15px] font-semibold">{g.label}</div>
                      <div className="text-[12.5px] text-muted">{g.sub}</div>
                    </div>
                    {on && <span className="ml-auto text-accent-2">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto flex gap-3 pt-6">
              <button
                onClick={() => setStep(1)}
                className="rounded-[13px] border border-line bg-panel px-5 py-3 text-[14px] font-semibold text-muted"
              >
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 rounded-[13px] bg-go py-3 text-[15px] font-bold text-[#06231a] transition active:scale-[0.98]"
              >
                Start playing →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
