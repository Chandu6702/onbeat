import Link from "next/link";

export const metadata = {
  title: "About & how-to — Cadence",
};

const STEPS: { n: string; title: string; body: string; href?: string; cta?: string }[] = [
  {
    n: "1",
    title: "Tune up first",
    body: "Grab your phone or laptop mic and tune all six strings before you play — everything sounds better in tune.",
    href: "/tuner",
    cta: "Open the tuner",
  },
  {
    n: "2",
    title: "Set up, then put the screen down",
    body: "Pick your chords, pattern, and tempo while you've got a free hand. Once you start, Cadence runs on its own — you shouldn't need to touch the screen.",
    href: "/practice?mode=play",
    cta: "Go to play-along",
  },
  {
    n: "3",
    title: "Let it count you in",
    body: "Play-along and the change drill both give you a count-in, then switch chords for you on the beat. Watch the highlighted chord and the 'next' cue — change just before it lands.",
    href: "/practice?mode=drill",
    cta: "Try the change drill",
  },
  {
    n: "4",
    title: "Use Stand mode from a distance",
    body: "Inside play-along, tap 'Stand mode' for a big, high-contrast view you can read from a music stand or across the room while both hands stay on the guitar.",
  },
];

export default function AboutPage() {
  return (
    <>
      <h1 className="font-display text-[22px] font-semibold">About &amp; how-to</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Cadence is a hands-free guitar practice partner. The idea is simple: once the guitar is in
        your hands, you can&apos;t tap a screen — so the app plays, counts you in, and moves in tempo
        while you play along.
      </p>

      <section className="mt-5 rounded-2xl border border-line bg-panel p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-beat">
          Three ways to practice
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5 text-[13.5px] leading-relaxed">
          <li>
            <b className="text-fg">Learn</b> — browse every chord (with finger positions, tips, and
            audio), strumming patterns, and a guided path.
          </li>
          <li>
            <b className="text-fg">Practice</b> — play-along loops, the hands-free change drill, and
            the strumming trainer.
          </li>
          <li>
            <b className="text-fg">Create</b> — pick chords + a feel and generate a playable loop to
            practice or save.
          </li>
        </ul>
      </section>

      <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        A good practice flow
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-3.5 rounded-2xl border border-line bg-panel p-4">
            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-accent/15 font-display text-[15px] font-bold text-accent-2">
              {s.n}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold">{s.title}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.body}</p>
              {s.href && s.cta && (
                <Link
                  href={s.href}
                  className="mt-2 inline-block text-[13px] font-semibold text-accent-2 hover:underline"
                >
                  {s.cta} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-panel p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Good to know
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-muted">
          <li>· All backing sound is synthesized in your browser — no login, no licensed songs.</li>
          <li>· Your progress (streak, XP, saved loops) is stored on this device only.</li>
          <li>· Turn your device sound on — audio starts on your first tap (a browser rule).</li>
          <li>· The tuner needs mic permission; it listens locally and never records.</li>
        </ul>
      </section>

      <Link
        href="/tuner"
        className="mt-6 flex w-full items-center justify-center rounded-[13px] bg-accent py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
      >
        Tune up and start →
      </Link>
    </>
  );
}
