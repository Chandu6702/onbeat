export interface NavItem {
  href: string;
  label: string;
  kind: "path" | "practice" | "profile";
  path?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", kind: "path", path: "M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" },
  { href: "/learn", label: "Learn", kind: "path", path: "M4 5h16v14H4zM4 9h16" },
  { href: "/practice", label: "Practice", kind: "practice" },
  { href: "/create", label: "Create", kind: "path", path: "M12 5v14M5 12h14" },
  { href: "/profile", label: "You", kind: "profile" },
];

export function NavIcon({
  item,
  className,
  fill,
  stroke = "currentColor",
}: {
  item: NavItem;
  className?: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill ?? "none"} stroke={stroke} strokeWidth="1.7">
      {item.kind === "practice" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 9l5 3-5 3z" />
        </>
      ) : item.kind === "profile" ? (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </>
      ) : (
        <path d={item.path} />
      )}
    </svg>
  );
}
