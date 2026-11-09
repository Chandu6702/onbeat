"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePracticeEngine } from "@/audio/usePracticeEngine";
import { getPattern } from "@/data/patterns";
import { THEORY, type TheoryLesson, type TheoryModule } from "@/data/theory";
import { useProgress } from "@/state/progress";

function LessonBody({ body }: { body: string[] }) {
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {body.map((para, i) =>
        para.startsWith("- ") ? (
          <div key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-fg">
            <span className="text-accent-2">•</span>
            <span>{para.slice(2)}</span>
          </div>
        ) : (
          <p key={i} className="text-[13.5px] leading-relaxed text-muted">
            {para}
          </p>
        ),
      )}
    </div>
  );
}

function LessonView({
  module,
  lesson,
  onBack,
}: {
  module: TheoryModule;
  lesson: TheoryLesson;
  onBack: () => void;
}) {
  const { previewNotes } = usePracticeEngine({
    bpm: 80,
    progression: ["C"],
    pattern: getPattern("folk-down"),
    mode: "metronome",
    metronome: false,
    countInBars: 0,
  });
  const [revealed, setRevealed] = useState(false);
  const markLessonDone = useProgress((s) => s.markLessonDone);

  // Reading a lesson counts as completing it (feeds the level system).
  useEffect(() => markLessonDone(lesson.id), [lesson.id, markLessonDone]);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-fg"
      >
        ‹ {module.name}
      </button>
      <h1 className="font-display text-[21px] font-semibold leading-snug">{lesson.title}</h1>
      <div className="mt-1 text-[12px] text-faint">{lesson.minutes} min read · {module.name}</div>

      <LessonBody body={lesson.body} />

      {lesson.demos && lesson.demos.length > 0 && (
        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-beat">Hear it</h3>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {lesson.demos.map((d, i) => (
              <button
                key={i}
                onClick={() => previewNotes(d.midi, d.harmonic)}
                className="inline-flex items-center gap-2 rounded-[11px] border border-line bg-panel px-3 py-2 text-[13px] font-semibold transition hover:border-accent active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-accent-2">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {d.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-5 rounded-2xl border border-line bg-panel p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Key points</h3>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {lesson.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-fg">
              <span className="text-go">✓</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </section>

      {lesson.quiz && (
        <section className="mt-5 rounded-2xl border border-accent/40 bg-accent/5 p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-2">Quick check</h3>
          <p className="mt-2 text-[14px] font-semibold text-fg">{lesson.quiz.q}</p>
          {revealed ? (
            <p className="mt-2 text-[13.5px] leading-relaxed text-go">{lesson.quiz.answer}</p>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-3 rounded-[11px] border border-line bg-panel px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-fg"
            >
              Show answer
            </button>
          )}
        </section>
      )}

      <Link
        href="/practice?mode=play"
        className="mt-6 flex w-full items-center justify-center rounded-[13px] bg-go py-3.5 text-[15px] font-bold text-[#06231a] transition active:scale-[0.98]"
      >
        Try it in Practice →
      </Link>
    </div>
  );
}

function TheoryInner() {
  const params = useSearchParams();
  const lessonParam = params.get("lesson");
  const [openId, setOpenId] = useState<string | null>(null);
  // Apply a ?lesson= deep-link after mount (avoids an SSR/client mismatch).
  useEffect(() => {
    if (lessonParam) queueMicrotask(() => setOpenId(lessonParam));
  }, [lessonParam]);

  if (openId) {
    for (const m of THEORY) {
      const lesson = m.lessons.find((l) => l.id === openId);
      if (lesson) return <LessonView module={m} lesson={lesson} onBack={() => setOpenId(null)} />;
    }
  }

  const total = THEORY.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">Music theory</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Short, plain-English lessons — no dots on a staff. Work top to bottom and chords, scales,
        and progressions stop being memorisation. {total} lessons.
      </p>

      <div className="mt-5 flex flex-col gap-6">
        {THEORY.map((m, mi) => (
          <section key={m.id}>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[15px] font-bold text-accent-2">{mi + 1}</span>
              <h2 className="font-display text-[17px] font-semibold">{m.name}</h2>
            </div>
            <p className="mt-0.5 text-[12.5px] text-muted">{m.blurb}</p>
            <div className="mt-3 flex flex-col gap-2">
              {m.lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setOpenId(l.id)}
                  className="flex items-center gap-3 rounded-[11px] border border-line bg-panel p-3.5 text-left transition-colors hover:border-accent"
                >
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold">{l.title}</div>
                    <div className="text-[12px] text-muted">{l.minutes} min</div>
                  </div>
                  <span className="ml-auto text-accent-2">→</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default function TheoryPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <TheoryInner />
    </Suspense>
  );
}
