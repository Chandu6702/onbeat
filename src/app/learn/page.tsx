"use client";

import { useState } from "react";
import Link from "next/link";
import ChordLibrary from "@/components/learn/ChordLibrary";
import PatternList from "@/components/learn/PatternList";
import GenreList from "@/components/learn/GenreList";
import GuidePath from "@/components/learn/GuidePath";

type View = "guide" | "browse";
type Tab = "chords" | "strumming" | "genres";

export default function LearnPage() {
  const [view, setView] = useState<View>("guide");
  const [tab, setTab] = useState<Tab>("chords");

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

      {/* Guide me / Browse */}
      <div className="flex gap-1 rounded-xl border border-line bg-panel p-1">
        {(["guide", "browse"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors ${
              view === v ? "bg-accent text-white" : "text-muted"
            }`}
          >
            {v === "guide" ? "Guide me" : "Browse"}
          </button>
        ))}
      </div>

      {view === "guide" ? (
        <div className="mt-4">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            A suggested path — start at the top and work down. Nothing is locked; jump to anything,
            anytime.
          </p>
          <GuidePath />
        </div>
      ) : (
        <div className="mt-4">
          {/* type tabs */}
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

          {tab === "chords" && <ChordLibrary />}
          {tab === "strumming" && <PatternList />}
          {tab === "genres" && <GenreList />}
        </div>
      )}
    </>
  );
}
