# Cadence — web app

A beginner-to-advanced guitar practice partner: **Learn**, **Practice**, and **Create**.
Built web-first with Next.js. All play-along audio is synthesized in the browser — no
licensed content. See `PRODUCT-SPEC.md` and `BUILD-PLAN.md` for the full picture.

## Run it

```bash
npm install       # first time only
npm run dev       # http://localhost:3000
```

Turn your device sound on — audio starts on the first click (browser rule).

Other scripts:

```bash
npm run build     # production build
npm start         # serve the production build
npm test          # run the Vitest suite (generator logic)
npm run lint      # eslint
```

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css`
- **Tone.js** — the audio engine (scheduler, plucked-string synth, metronome)
- **Zustand + localStorage** — progress (XP, streak, bests, saved loops). No backend in v1.

## Structure

```
src/
├── app/                 # routes: / (home), /learn, /practice, /create, /profile
├── audio/
│   ├── engine.ts        # PracticeEngine — Tone.js timeline (play / strum / metronome)
│   ├── instruments.ts   # plucked-string guitar + click
│   ├── generator.ts     # builds theory-safe loops from selected chords (tested)
│   └── usePracticeEngine.ts   # React hook wrapping the engine
├── components/          # nav, Fretboard, practice/* and learn/* views
├── data/                # chords, patterns, progressions, genres, learning path (pure data)
└── state/progress.ts    # Zustand store (persisted)
```

The `data/` and `audio/generator.ts` layers are pure and instrument-agnostic — adding
ukulele/piano is mostly new shapes + samples, and the generator is unit-tested.

## Responsive

Desktop shows a left sidebar; below 768px it switches to a bottom tab bar.

## Notes / not in v1

Guitar only; no accounts (progress is local to the browser); no mic detection; no real
songs (all generated). These are the v2/v3 items in `BUILD-PLAN.md`.

App name "Cadence" is a placeholder — rename in `src/app/layout.tsx`, `src/components/SideNav.tsx`,
and `src/app/page.tsx`.
