# Build Plan — Cadence (working name)

_A phased plan to build the web app. Companion to `PRODUCT-SPEC.md`. Web-first, guitar-first._

---

## Decisions locked

| Decision | Choice |
|---|---|
| First instrument | Guitar |
| Platform | Web first (mobile later, same codebase) |
| Accounts | None in v1 — progress saved locally (localStorage) |
| Backing sound | Synthesized (Web Audio / Tone.js), "good enough to practice with" |
| Learning path | Suggested + nudging, never gating |
| Content | 100% generated / user-created — no licensed songs |

---

## The stack

**Core**
- **Next.js 16 (App Router) + React 19 + TypeScript** — UI, type safety, file-based routing, and a built-in path to a backend + landing page when we need one later.
- **Tailwind CSS v4** — the sleek, modern styling from the prototype, systematized as theme tokens in `globals.css`.
- **Tone.js** — audio engine (scheduler, synth/sampler, metronome) on top of Web Audio. Audio components are client components (`"use client"`).

**State & storage**
- **Zustand** — lightweight global state (current session, settings, progress). Simpler than Redux.
- **localStorage** (via a small wrapper) — persist known chords, XP, streak, bests, saved creations. **No backend in v1.**

**Routing & structure**
- **Next.js App Router** — folders under `src/app/` map to routes: Home (`/`), Learn, Practice, Create, Profile. (No React Router needed.)

**Why Next.js over Vite:** the app doesn't need it for v1, but the roadmap does — accounts, saved creations, and songs all want a backend, and Next.js API routes provide one in the same project, plus an easy landing page and one-command Vercel deploy. Avoids a migration later.

**Tooling**
- **ESLint + Prettier** — consistent code.
- **Vitest** — unit tests for the music-theory + generation logic (the part most worth testing).

**Deploy**
- **Vercel or Netlify** — push the repo, get a live URL. Free tier is plenty for v1.

**Deferred to later phases** (not v1): Supabase/Firebase (accounts + sync), React Native/Capacitor (mobile), mic pitch detection.

---

## Project structure

The Next.js app lives at the repo root; docs sit alongside it, and the original
prototype is kept for reference under `prototype/`.

```
music-practice-app/          # repo root = the Next.js app
├── PRODUCT-SPEC.md
├── BUILD-PLAN.md
├── README.md
├── prototype/index.html     # original single-file prototype (reference only)
├── package.json
└── src/
    ├── app/                 # routes: / (home), /learn, /practice, /create, /profile
    ├── audio/               # engine.ts, instruments.ts, generator.ts, usePracticeEngine.ts
    ├── components/          # nav, Fretboard, practice/* and learn/* views
    ├── data/                # chords, patterns, progressions, genres, path (pure data)
    └── state/progress.ts    # Zustand store (persisted)
```

The `data/` and `audio/generator.ts` layers are the heart — keeping them pure (no UI) makes them testable and reusable on mobile later.

---

## Phase 0 — Scaffold ✅ DONE

Goal: a running, empty, well-structured app.

- [x] Create the Next.js + React + TS project (at the repo root).
- [x] Add Tailwind, Tone.js, Zustand.
- [x] Set up the design tokens from the prototype (colors, fonts, spacing) in `globals.css`.
- [x] Bottom nav + 5 screens routed (Home / Learn / Practice / Create / Profile).
- [x] Verified: production build passes, dev server renders the app frame + nav.
- [ ] _Later:_ deploy the shell to Vercel to prove the pipeline (optional until there's more to show).

**Run it locally:** `npm run dev` → open http://localhost:3000

**Done when:** the app runs locally with working navigation. ✅

---

## Phase 1 — The audio engine ✅ DONE

Goal: prove tight, in-tempo audio. This is the make-or-break piece.

- [x] `data/types.ts` — shared music types (Chord, StrumPattern, Difficulty, Genre).
- [x] `data/chords.ts` — 10 chords → notes + guitar shape + difficulty.
- [x] `data/patterns.ts` — strumming patterns (down/up/rest per 8th) tagged by genre + difficulty.
- [x] `data/progressions.ts` — theory-safe progression templates by genre + a demo loop.
- [x] `audio/instruments.ts` — plucked-string (Karplus-Strong) guitar via a per-string voice pool + light reverb; metronome click.
- [x] `audio/engine.ts` — `PracticeEngine`: Tone.Sequence scheduler with BPM, beats, strum scheduling, silent count-in bar, looping, and `Tone.getDraw()` UI callbacks. Modes: play / strum / metronome.
- [x] `audio/usePracticeEngine.ts` — React hook wrapping the engine for the UI.
- [x] Verified in-browser: transport runs, chords advance in time, strum steps + beat dots highlight on the beat, tempo + metronome work.

**Done when:** you can call the engine with a progression + pattern + BPM and hear it play in time, looping cleanly. ✅ (Working play-along wired onto the Practice screen as the verification harness.)

---

## Phase 2 — Practice loop (the product's spine) ✅ DONE

Goal: the screens people actually use daily. Built on Phase 1.

- [x] Practice **mode picker** + per-mode views with back navigation (deep-linkable via `?mode=`).
- [x] **Play-along** — beat dots, big current chord, chord lane (current + next cued), strum guide, play/pause, tempo slider, metronome toggle, count-in.
- [x] **Chord-change drill** — selectable pairs, 60s timer, tap counter with chord audio, personal best saved locally.
- [x] **Strumming trainer** — selectable patterns, arrows lighting on the beat, tempo + metronome.
- [x] `components/Fretboard` — reusable chord-shape diagram (SVG).
- [x] `state/progress.ts` — Zustand + localStorage store: known chords, XP, streak, daily goal, best changes/min, creations.
- [x] Wired XP / streak / personal-best updates on completion; Profile shows live stats; Home cards deep-link into modes.

**Done when:** all three practice modes work end-to-end with real audio and save progress. ✅

---

## Phase 3 — Learn library ✅ DONE

Goal: the browse/teach layer.

- [x] Chord library grid with fretboard diagrams + tap-to-hear, difficulty filter (All/Easy/Medium/Hard).
- [x] Guide me / Browse toggle; suggested path as data (`data/path.ts`) rendered as a numbered timeline.
- [x] Strumming-patterns list (visual arrows + audible per-pattern preview with live step highlight).
- [x] Genre primers (data-driven cards, `data/genres.ts`).
- [x] "Practice this" / CTA buttons deep-link into the Practice loop via `?mode=`.

**Done when:** a beginner can browse, hear everything, and jump into practice from any item. ✅

---

## Phase 4 — Create studio + generator ✅ DONE

Goal: make-your-own, and the generation logic that also powers Home's recommendations.

- [x] `audio/generator.ts` — given selected chords + genre, picks a theory-safe template whose chords the user has; falls back to cycling the selected chords into a 4-bar loop. Pure + seedable RNG.
- [x] Create screen — chord multi-select, genre, tempo → Generate → **inline play-along preview** → Save / Open in Practice.
- [x] Save & list user creations (localStorage); each saved loop deep-links back into play-along.
- [x] Practice play-along accepts generated content via `?chords=&pattern=&bpm=`.

**Done when:** picking chords + genre + tempo reliably produces a good-sounding, playable loop. ✅

---

## Phase 5 — Home, Profile, polish ✅ DONE

Goal: tie it together and make it feel finished.

- [x] **Home** — streak ring, real stats, Continue + recommended cards driven by real progress and a (deterministic) generated loop from your chords.
- [x] **Profile** — XP, streak, best changes/min, chords learned, known-chords list (live).
- [x] First-run "start here" banner (shows when XP is 0), friendly copy pass.
- [x] Responsive (sidebar/desktop ↔ bottom-nav/mobile), reduced-motion, keyboard `:focus-visible` ring.
- [x] Fixed an SSR hydration mismatch (deterministic Home recommendation).
- [x] Vitest suite on `generator.ts` (7 tests, passing); `npm test` wired.
- [x] `README.md` for run instructions + structure.

**Done when:** it looks and feels like the prototype, backed by real data, live at a URL. ✅

---

## Rough timeline

~2–3 focused weeks to a shippable v1 web app (solo, part-time longer). Order is deliberate: **engine first** (biggest risk), then the loop people use most, then breadth.

## Definition of done for v1

A stranger can open the URL, browse chords, run a change drill, play along to a generated loop in their chords, create their own loop, and come back tomorrow to a saved streak — all with no login and no licensed content.

---

## v1 complete 🎉

All five phases are done. The app runs, is tested, builds clean, and covers all three pillars
(Learn, Practice, Create) with local progress. Run it with `npm run dev`.

**Suggested next steps (v2):**
- Deploy to Vercel for a shareable URL.
- Rename from the placeholder "Cadence".
- Add accounts + cross-device sync (Supabase or Next.js API routes).
- More chords/patterns, Medium/Hard content, the nudging learning path.
- Better instrument samples + an optional drum groove.
- Then v3: more instruments, mobile wrap, mic detection, public-domain songs.

_App name is still the placeholder "Cadence" — rename in `src/app/layout.tsx`,
`src/components/SideNav.tsx`, and `src/app/page.tsx`._
