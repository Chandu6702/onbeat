# Onbeat — web app

A beginner-to-advanced guitar practice partner: **Learn**, **Practice**, **Create**, plus a
**Music theory** track and a **Journey** level system. Built web-first with Next.js. Play-along
audio uses real recorded guitar samples (CC-BY, see Attribution), pitch-shifted in the browser.
See `PRODUCT-SPEC.md` and `BUILD-PLAN.md` for the full picture, `IMPROVEMENTS.md` for the roadmap,
and `DEPLOYMENT.md` to ship it.

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
npm test          # run the Vitest suite (generator + pitch logic)
npm run lint      # eslint
```

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css` (light/dark via `data-theme`)
- **Tone.js** — the audio engine: `Tone.Sampler` (real recorded guitar, acoustic & electric,
  pitch-shifted across samples), a `Tone.Sequence` scheduler, strum + fingerpick voicing, and a
  synth metronome click. Mic pitch detection (YIN/autocorrelation + FFT) powers the tuner and
  Listen mode.
- **Zustand + localStorage** — progress (known chords, XP, streak, bests, saved loops, completed
  lessons, per-day practice log).
- **Supabase (optional)** — accounts + cross-device sync, off until keys are set (`SUPABASE_SETUP.md`).

## Structure

```
src/
├── app/                 # routes: / learn practice create profile
│                        #         theory journey tuner listen settings about
├── audio/
│   ├── engine.ts        # PracticeEngine — Tone.js timeline (play / strum / fingerpick / metronome)
│   ├── instruments.ts   # sampled acoustic & electric guitars (Tone.Sampler) + click
│   ├── generator.ts     # builds theory-safe loops from selected chords (tested)
│   ├── pitch.ts         # mic pitch / chord detection (tested)
│   └── usePracticeEngine.ts   # React hook wrapping the engine
├── components/          # nav, Fretboard, Onboarding, practice/* learn/* profile/*
├── data/                # chords, patterns, progressions, genres, curriculum, theory,
│                        # levels, types (pure data — no UI, no audio imports)
└── state/               # progress.ts + settings.ts (Zustand, persisted)
```

The `data/` and `audio/generator.ts` layers are pure and instrument-agnostic — the generator and
pitch math are unit-tested.

## Responsive

Desktop shows a left sidebar; below 768px it switches to a bottom tab bar.

## Attribution

Guitar samples are from [nbrosowsky/tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
(`guitar-acoustic` / `guitar-electric`), licensed **CC-BY**, served from the jsDelivr CDN.
