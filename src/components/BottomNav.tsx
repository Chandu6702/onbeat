"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NavIcon } from "./nav-items";

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 flex border-t border-line bg-ink/90 px-1.5 pb-2 pt-2 backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-1 flex-col items-center gap-1 p-1.5 text-[10.5px] font-semibold transition-colors ${
              active ? "text-accent-2" : "text-faint"
            }`}
          >
            <NavIcon
              item={it}
              className="h-[23px] w-[23px]"
              fill={active ? "rgba(124,92,255,0.15)" : "none"}
              stroke="currentColor"
            />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
