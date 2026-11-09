"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress, useHasHydrated } from "@/state/progress";
import { CURRICULUM, KIND_ICON, KIND_LABEL, unitDone, type Module } from "@/data/curriculum";

export default function CurriculumView() {
  const hydrated = useHasHydrated();
  const knownChords = useProgress((s) => s.knownChords);
  const completedLessons = useProgress((s) => s.completedLessons);
  const [active, setActive] = useState<Module["id"]>("beginner");

  const p = {
    knownChords: hydrated ? knownChords : [],
    completedLessons: hydrated ? completedLessons : [],
  };
  const mod = CURRICULUM.find((m) => m.id === active)!;
  const doneCount = mod.units.filter((u) => unitDone(u, p) === true).length;
  const trackable = mod.units.filter((u) => unitDone(u, p) !== null).length;

  return (
    <div>
      <div className="flex gap-2">
        {CURRICULUM.map((m) => {
          const on = m.id === active;
          return (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-center transition ${
                on ? "border-accent bg-panel-2" : "border-line bg-panel"
              }`}
            >
              <div className={`text-[13.5px] font-semibold ${on ? "text-fg" : "text-muted"}`}>{m.name}</div>
              <div className="text-[10.5px] uppercase tracking-[0.06em] text-faint">{m.level}</div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted">{mod.blurb}</p>
      {trackable > 0 && (
        <div className="mt-1 text-[12px] text-faint">
          {doneCount}/{trackable} learned in this module
        </div>
      )}

      <div className="relative mt-4 flex flex-col gap-2.5">
        {mod.units.map((u) => {
          const done = unitDone(u, p);
          return (
            <Link
              key={u.id}
              href={u.href}
              className={`flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors hover:border-accent ${
                done ? "border-line bg-panel" : "border-line bg-panel"
              }`}
            >
              <div className="grid h-11 w-11 flex-none place-items-center rounded-[13px] bg-gradient-to-br from-[#221f3d] to-[#191c2b] text-[21px]">
                {KIND_ICON[u.kind]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-accent-2">
                    {KIND_LABEL[u.kind]}
                  </span>
                  {done === true && <span className="text-[11px] text-go">✓ done</span>}
                </div>
                <div className="text-[14.5px] font-semibold leading-snug">{u.title}</div>
                <div className="text-[12.5px] leading-snug text-muted">{u.subtitle}</div>
              </div>
              <span className="ml-auto flex-none text-accent-2">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
