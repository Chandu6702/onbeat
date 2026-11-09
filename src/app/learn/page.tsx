"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChordLibrary from "@/components/learn/ChordLibrary";
import PatternList from "@/components/learn/PatternList";
import GenreList from "@/components/learn/GenreList";
import CurriculumView from "@/components/learn/CurriculumView";

type View = "path" | "browse";
type Tab = "chords" | "strumming" | "genres";

function LearnInner() {
  const params = useSearchParams();
  const initialChord = params.get("chord") ?? undefined;
  const [view, setView] = useState<View>("path");
  const [tab, setTab] = useState<Tab>("chords");

  // A ?chord= deep-link jumps straight to the chord in the browse library
  // (applied after mount to avoid an SSR/client hydration mismatch).
  useEffect(() => {
    if (initialChord)
      queueMicrotask(() => {
        setView("browse");
        setTab("chords");
      });
  }, [initialChord]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-semibold">Learn</h1>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3 py-1.5 text-[12.5px] font-semibold">
          🎸 Guitar
        </div>
      </div>

      <Link
        href="/theory"
        className="mb-3 flex items-center gap-3 rounded-2xl border border-accent/40 bg-gradient-to-br from-[#1a1836] to-[#141726] p-4 transition hover:border-accent"
      >
        <span className="grid h-11 w-11 flex-none place-items-center rounded-[13px] bg-accent/15 text-xl">
          🎓
        </span>
        <div className="min-w-0">
          <div className="text-[14.5px] font-semibold">Music theory — the why behind it</div>
          <div className="text-[12.5px] text-muted">
            Intervals, scales, and progressions in plain English, with audio.
          </div>
        </div>
        <span className="ml-auto text-accent-2">→</span>
      </Link>

      <Link
        href="/listen"
        className="mb-3 flex items-center gap-3 rounded-2xl border border-line bg-panel p-3.5 transition hover:border-accent"
      >
        <span className="grid h-11 w-11 flex-none place-items-center rounded-[13px] bg-panel-2 text-xl">
          👂
        </span>
        <div className="min-w-0">
          <div className="text-[14.5px] font-semibold">Test your chords, hands-free</div>
          <div className="text-[12.5px] text-muted">
            Play the chords you know in Listen mode and get scored.
          </div>
        </div>
        <span className="ml-auto text-accent-2">→</span>
      </Link>

      {/* Path (modules) / Browse (library) */}
      <div className="flex gap-1 rounded-xl border border-line bg-panel p-1">
        {(
          [
            { id: "path", label: "Learn path" },
            { id: "browse", label: "Browse library" },
          ] as { id: View; label: string }[]
        ).map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors ${
              view === v.id ? "bg-accent text-white" : "text-muted"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "path" ? (
        <div className="mt-4">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            A guided path in three levels — each mixes chords, strumming, theory, and practice.
            Nothing is locked; jump in anywhere.
          </p>
          <CurriculumView />
        </div>
      ) : (
        <div className="mt-4">
          <div className="mb-4 flex gap-2">
            {(
              [
                { id: "chords", label: "Chords" },
                { id: "strumming", label: "Strumming" },
                { id: "genres", label: "Genres" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold ${
                  tab === t.id ? "border-accent bg-panel-2 text-fg" : "border-line bg-panel text-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "chords" && <ChordLibrary initialChord={initialChord} />}
          {tab === "strumming" && <PatternList />}
          {tab === "genres" && <GenreList />}
        </div>
      )}
    </>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <LearnInner />
    </Suspense>
  );
}
