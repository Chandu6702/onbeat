export default function Placeholder({
  phase,
  items,
}: {
  phase: string;
  items: string[];
}) {
  return (
    <div className="mt-4 rounded-2xl border border-line bg-panel p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        Coming in {phase}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
