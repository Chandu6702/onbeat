import Link from "next/link";
import { LEARNING_PATH } from "@/data/path";

const DIFF_CLASS = {
  easy: "bg-go/15 text-go",
  med: "bg-beat/15 text-beat",
  hard: "bg-pink/15 text-pink",
} as const;

const DIFF_LABEL = { easy: "Easy", med: "Medium", hard: "Hard" } as const;

export default function GuidePath() {
  return (
    <div className="relative flex flex-col gap-3">
      {LEARNING_PATH.map((step) => (
        <div key={step.n} className="flex gap-3.5">
          <div className="flex flex-none flex-col items-center">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel font-display text-[15px] font-bold text-accent-2">
              {step.n}
            </div>
            {step.n < LEARNING_PATH.length && <div className="mt-1 w-px flex-1 bg-line" />}
          </div>

          <div className="flex-1 rounded-2xl border border-line bg-panel p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold leading-snug">{step.title}</h3>
              <span
                className={`flex-none rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${DIFF_CLASS[step.difficulty]}`}
              >
                {DIFF_LABEL[step.difficulty]}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.desc}</p>
            {step.href && step.cta && (
              <Link
                href={step.href}
                className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] bg-panel-2 px-3.5 py-2 text-[13px] font-semibold text-fg transition hover:bg-panel-2/70"
              >
                {step.cta} →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
