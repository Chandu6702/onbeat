"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress, useHasHydrated } from "@/state/progress";
import BrandMark from "./BrandMark";
import { NAV_ITEMS, NavIcon } from "./nav-items";

export default function SideNav() {
  const path = usePathname();
  const hydrated = useHasHydrated();
  const streak = useProgress((s) => s.streak);
  const shownStreak = hydrated ? streak : 0;

  return (
    <aside className="sticky top-0 hidden h-dvh w-[240px] flex-none flex-col border-r border-line bg-ink px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <BrandMark className="h-[38px] w-[38px] rounded-xl" />
        <div>
          <b className="block font-display text-[17px] font-semibold tracking-tight">Onbeat</b>
          <span className="block text-[11px] text-faint">Practice studio</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                active
                  ? "bg-panel text-fg"
                  : "text-muted hover:bg-panel/60 hover:text-fg"
              }`}
            >
              <NavIcon
                item={it}
                className="h-[21px] w-[21px]"
                fill={active ? "rgba(124,92,255,0.15)" : "none"}
                stroke={active ? "var(--color-accent-2)" : "currentColor"}
              />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-line bg-panel p-3">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold">
          <span className="h-[7px] w-[7px] rounded-full bg-beat" /> {shownStreak}-day streak
        </div>
        <p className="mt-1 text-[11px] text-faint">
          {shownStreak > 0 ? "Keep it going — practice today." : "Practice today to start a streak."}
        </p>
      </div>
    </aside>
  );
}
