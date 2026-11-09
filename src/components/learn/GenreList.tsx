import Link from "next/link";
import { GENRES } from "@/data/genres";

export default function GenreList() {
  return (
    <div className="flex flex-col gap-3">
      {GENRES.map((g) => (
        <div key={g.name} className="rounded-2xl border border-line bg-panel p-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[17px] font-semibold">{g.name}</h3>
            <span className="text-[11px] text-faint">{g.feel}</span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{g.blurb}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {g.chords.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-line bg-panel-2 px-2.5 py-1 font-display text-[13px] font-bold text-fg"
              >
                {c}
              </span>
            ))}
            <Link
              href="/practice?mode=play"
              className="ml-auto text-[12.5px] font-semibold text-accent-2 hover:underline"
            >
              Play-along →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
