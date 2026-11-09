"use client";

import { useState } from "react";
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
