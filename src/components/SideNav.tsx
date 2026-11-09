"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NavIcon } from "./nav-items";

export default function SideNav() {
  const path = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[240px] flex-none flex-col border-r border-line bg-ink px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-gradient-to-br from-accent to-pink font-display text-lg font-bold text-white">
          C
        </div>
        <div>
          <b className="block font-display text-[17px] font-semibold tracking-tight">Cadence</b>
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
          <span className="h-[7px] w-[7px] rounded-full bg-beat" /> 4-day streak
        </div>
        <p className="mt-1 text-[11px] text-faint">Keep it going — practice today.</p>
      </div>
    </aside>
  );
}
