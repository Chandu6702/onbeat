"use client";

import { useState } from "react";
import Link from "next/link";
import { CHORDS } from "@/data/chords";
import type { Genre } from "@/data/types";
import { getPattern } from "@/data/patterns";
import { generateLoop, type GeneratedLoop } from "@/audio/generator";
import { useProgress, useHasHydrated } from "@/state/progress";
import PlayAlong from "@/components/practice/PlayAlong";

const GENRES: Genre[] = ["Pop", "Folk", "Rock", "Ballad"];
const ALL_CHORDS = Object.keys(CHORDS);

export default function CreatePage() {
  const known = useProgress((s) => s.knownChords);
  const creations = useProgress((s) => s.creations);
  const addCreation = useProgress((s) => s.addCreation);
  const hydrated = useHasHydrated();

  const [selected, setSelected] = useState<string[]>(known.slice(0, 4));
  const [genre, setGenre] = useState<Genre>("Pop");
  const [fingerstyle, setFingerstyle] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [loop, setLoop] = useState<GeneratedLoop | null>(null);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [sections, setSections] = useState<{ name: string; chords: string[]; patternId: string }[]>([]);

  const toggleChord = (name: string) => {
    setSelected((s) => (s.includes(name) ? s.filter((c) => c !== name) : [...s, name]));
    setError("");
  };

  const generate = () => {
    if (selected.length < 2) {
      setError("Pick at least 2 chords.");
      return;
    }
    setSavedMsg("");
    const l = generateLoop(selected, genre);
    // Fingerstyle overrides the strum pattern with a picking pattern of the same feel.
    if (fingerstyle) {
      l.patternId = genre === "Ballad" ? "fingerpick-ballad" : "fingerpick-arp";
    }
    setLoop(l);
  };

  const save = () => {
    if (!loop) return;
    addCreation({
      id: crypto.randomUUID(),
      name: `${loop.genre} loop — ${loop.chords.join(" ")}`,
      chords: loop.chords,
      patternId: loop.patternId,
      bpm,
      genre: loop.genre,
      createdAt: Date.now(),
    });
    setSavedMsg("Saved to your creations.");
  };

  const SECTION_NAMES = ["Verse", "Chorus", "Bridge", "Outro"];
  const addSection = () => {
    if (!loop) return;
    const name = SECTION_NAMES[sections.length] ?? `Section ${sections.length + 1}`;
    setSections((s) => [...s, { name, chords: loop.chords, patternId: loop.patternId }]);
    setSavedMsg("");
  };
  const removeSection = (i: number) => setSections((s) => s.filter((_, idx) => idx !== i));

  const songChords = sections.flatMap((s) => s.chords);
  const songHref =
    sections.length > 0
      ? `/practice?mode=play&chords=${songChords.join(",")}&pattern=${sections[0].patternId}&bpm=${bpm}`
      : "#";
  const saveSong = () => {
    if (sections.length === 0) return;
    addCreation({
      id: crypto.randomUUID(),
      name: `Song — ${sections.map((s) => s.name).join(" / ")}`,
      chords: songChords,
      patternId: sections[0].patternId,
      bpm,
      genre,
      createdAt: Date.now(),
    });
    setSavedMsg("Song saved to your creations.");
  };

  const tempoPct = Math.round(((bpm - 50) / (140 - 50)) * 100);

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Create</h1>
      <p className="mb-4 text-[13.5px] text-muted">
        Pick what you know — we&apos;ll build a playable loop. No music theory needed.
      </p>

      <div className="rounded-2xl border border-line bg-panel p-4">
        <p className="text-[12.5px] font-semibold text-muted">1 · Chords you want to use</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_CHORDS.map((c) => {
            const on = selected.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleChord(c)}
                className={`rounded-[11px] border px-3.5 py-2 font-display text-[15px] font-bold transition ${
                  on ? "border-accent-2 bg-accent text-white" : "border-line bg-panel text-muted"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-[12.5px] font-semibold text-muted">2 · Feel / genre</p>
        <div className="mt-3 flex gap-1 rounded-xl border border-line bg-panel-2 p-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition ${
                genre === g ? "bg-accent text-white" : "text-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFingerstyle((f) => !f)}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-panel-2 px-3.5 py-3 text-left transition hover:border-accent"
        >
          <span>
            <span className="text-[13.5px] font-semibold">🎵 Fingerstyle picking</span>
            <span className="block text-[11.5px] text-faint">
              Pluck the strings one at a time instead of strumming.
            </span>
          </span>
          <span
            className={`relative h-[22px] w-[38px] flex-none rounded-full transition ${
              fingerstyle ? "bg-accent" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-all ${
                fingerstyle ? "left-[18px]" : "left-[2px]"
              }`}
            />
          </span>
        </button>

        <p className="mt-5 text-[12.5px] font-semibold text-muted">
          3 · Tempo — <span className="text-fg">{bpm} BPM</span>
        </p>
        <input
          type="range"
          min={50}
          max={140}
          step={1}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="mt-3 w-full"
          style={{
            background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ${tempoPct}%, #262c40 ${tempoPct}%)`,
          }}
        />

        {error && <p className="mt-3 text-[13px] font-medium text-pink">{error}</p>}

        <button
          onClick={generate}
          className="mt-5 w-full rounded-[13px] bg-accent py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
        >
          ✨ Generate my loop
        </button>
      </div>

      {loop && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold">
              Your {loop.genre} loop
            </h2>
            <span className="text-[12px] text-faint">{getPattern(loop.patternId).name}</span>
          </div>

          <PlayAlong
            key={`${loop.chords.join("-")}-${loop.patternId}-${bpm}`}
            progression={loop.chords}
            patternId={loop.patternId}
            startBpm={bpm}
            title="Your creation"
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              className="flex-1 rounded-[13px] border border-line bg-panel py-3 text-[14px] font-semibold text-fg transition hover:border-accent"
            >
              Save loop
            </button>
            <Link
              href={`/practice?mode=play&chords=${loop.chords.join(",")}&pattern=${loop.patternId}&bpm=${bpm}`}
              className="flex-1 rounded-[13px] bg-panel py-3 text-center text-[14px] font-semibold text-accent-2 transition hover:bg-panel-2"
            >
              Open in Practice →
            </Link>
          </div>
          <Link
            href={`/listen?chords=${loop.chords.join(",")}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[13px] border border-line bg-panel py-2.5 text-[13px] font-semibold text-muted transition hover:border-accent hover:text-fg"
          >
            👂 Score it hands-free in Listen mode →
          </Link>
          <button
            onClick={addSection}
            className="mt-3 w-full rounded-[13px] border border-dashed border-line bg-panel py-2.5 text-[13px] font-semibold text-muted transition hover:border-accent hover:text-fg"
          >
            ＋ Add as a section (build a verse/chorus song)
          </button>
          {savedMsg && <p className="mt-3 text-center text-[13px] font-medium text-go">{savedMsg}</p>}
        </div>
      )}

      {sections.length > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-panel p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Your song · {songChords.length} bars
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[11px] border border-line bg-panel-2 p-2.5">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-accent/15 font-display text-[12px] font-bold text-accent-2">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold">{s.name}</div>
                  <div className="truncate text-[12px] text-muted">{s.chords.join(" · ")}</div>
                </div>
                <button
                  onClick={() => removeSection(i)}
                  aria-label={`Remove ${s.name}`}
                  className="ml-auto grid h-7 w-7 flex-none place-items-center rounded-full border border-line text-muted transition hover:text-pink"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={saveSong}
              className="flex-1 rounded-[13px] border border-line bg-panel py-3 text-[14px] font-semibold text-fg transition hover:border-accent"
            >
              Save song
            </button>
            <Link
              href={songHref}
              className="flex-1 rounded-[13px] bg-accent py-3 text-center text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              Play full song →
            </Link>
          </div>
        </div>
      )}

      {hydrated && creations.length > 0 && (
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Your saved loops
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            {creations.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-[11px] border border-line bg-panel p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">{c.chords.join(" · ")}</div>
                  <div className="text-[12px] text-muted">
                    {c.genre} · {getPattern(c.patternId).name} · {c.bpm} BPM
                  </div>
                </div>
                <Link
                  href={`/practice?mode=play&chords=${c.chords.join(",")}&pattern=${c.patternId}&bpm=${c.bpm}`}
                  className="ml-auto grid h-10 w-10 flex-none place-items-center rounded-full bg-accent"
                  aria-label="Play"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
