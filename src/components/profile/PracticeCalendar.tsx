"use client";

import { useProgress, useHasHydrated } from "@/state/progress";

const WEEKS = 13; // ~3 months of history
const DAY_MS = 86400000;

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Green intensity by sessions that day — tuned for the --color-go token.
function cellStyle(count: number): string {
  if (count <= 0) return "bg-panel-2";
  if (count === 1) return "bg-go/30";
  if (count === 2) return "bg-go/60";
  return "bg-go";
}

export default function PracticeCalendar() {
  const hydrated = useHasHydrated();
  const log = useProgress((s) => s.practiceLog);
  const practiceLog = hydrated ? log : {};

  // Build a grid ending today, aligned so each column is one week (Sun→Sat).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay())); // Saturday of this week
  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1)); // first cell (a Sunday)

  const columns: { date: string; count: number; future: boolean }[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: { date: string; count: number; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
      const key = dateStr(cur);
      col.push({
        date: key,
        count: practiceLog[key] ?? 0,
        future: cur.getTime() > today.getTime(),
      });
    }
    columns.push(col);
  }

  // Summary stats over the real log.
  const entries = Object.entries(practiceLog);
  const totalSessions = entries.reduce((n, [, c]) => n + c, 0);
  const daysActive30 = entries.filter(
    ([k, c]) => c > 0 && (today.getTime() - new Date(k + "T00:00:00").getTime()) / DAY_MS < 30,
  ).length;
  const thisWeek = columns[WEEKS - 1].reduce((n, c) => n + (c.future ? 0 : c.count), 0);

  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[15px] font-semibold">Practice history</h2>
        <span className="text-[11.5px] text-faint">last {WEEKS} weeks</span>
      </div>

      <div className="mt-3 flex gap-3 text-center">
        <Stat n={thisWeek} label="This week" />
        <Stat n={daysActive30} label="Days active · 30d" />
        <Stat n={totalSessions} label="Total sessions" />
      </div>

      <div className="mt-4 flex gap-[3px] overflow-x-auto pb-1">
        {columns.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {col.map((cell) => (
              <div
                key={cell.date}
                title={cell.future ? undefined : `${cell.date}: ${cell.count} session${cell.count === 1 ? "" : "s"}`}
                className={`h-[11px] w-[11px] flex-none rounded-[3px] ${
                  cell.future ? "bg-transparent" : cellStyle(cell.count)
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-end gap-1.5 text-[10.5px] text-faint">
        <span>Less</span>
        <span className="h-[10px] w-[10px] rounded-[3px] bg-panel-2" />
        <span className="h-[10px] w-[10px] rounded-[3px] bg-go/30" />
        <span className="h-[10px] w-[10px] rounded-[3px] bg-go/60" />
        <span className="h-[10px] w-[10px] rounded-[3px] bg-go" />
        <span>More</span>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-panel-2 py-2.5">
      <div className="font-display text-[20px] font-bold text-go">{n}</div>
      <div className="mt-0.5 text-[10.5px] text-muted">{label}</div>
    </div>
  );
}
