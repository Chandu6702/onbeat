# Improvements roadmap (post-v1)

Research-backed ideas for making Cadence clearer, richer, and genuinely useful while
you're actually holding the guitar. Companion to `BUILD-PLAN.md`.

## The guiding insight: hands-free

Once you pick up the guitar, both hands are busy — you can't tap the screen. So:

1. **The app must be operable hands-free while playing.** Anything needed mid-play runs on
   its own: auto-advancing play-along, a count-in so you're ready, big glanceable visuals.
   Tapping is only for *setup*, never *while playing*.
2. **Let the app listen.** Real-time pitch/note detection works in the browser via the mic
   (YIN/autocorrelation): ~85 ms for tuning, ~0.3–1 s to settle a chord. Single notes and
   tuning are very reliable; full polyphonic chord detection is possible but harder. This is
   how Yousician scores you — and it's within reach for us.

Reframing: the "tap a chord to hear it" button is only a *preview*. The real product is
"the app plays and listens while your hands are on the guitar."

## Tier 1 — highest impact (solves the core complaints)

- [x] **Built-in tuner (mic).** Done: `/tuner` — mic pitch detection (autocorrelation),
      note + cents needle, snaps to the nearest guitar string, graceful mic-permission
      handling. Pure math in `audio/pitch.ts` (unit-tested). Sets up the mic UX for Listen mode.
- [x] **Fix the change-drill for real playing.** ~~Tapping each change is the "can't hit
      buttons while playing" problem.~~ Done: count-in + auto-tempo mode — the loop switches
      chords for you on the beat, no tapping. Score is changes/min; honest self-report gates
      the personal best (no mic yet). (`components/practice/ChangeDrill.tsx`)
- [x] **Chord detail pages.** Done: finger numbers on the diagram, finger-by-finger breakdown,
      how-to-fret tip, common mistakes, "Hear it" audio, and a "Practice this" deep-link.
      (`components/learn/ChordDetail.tsx`, data on `data/chords.ts`)
- [x] **About / How-to page + first-run onboarding.** Done: `/about` explains hands-free use
      and a good practice flow; a 3-step first-run overlay asks which chords you know + your
      goal and seeds the store (with a persist migration so existing users skip it).
      (`app/about/page.tsx`, `components/Onboarding.tsx`)
- [x] **Performance mode.** Done: a fullscreen, high-contrast "Stand mode" on play-along —
      huge chord, next-chord cue, big beat + strum guide, auto-advancing. (`components/practice/PlayAlong.tsx`)

## Tier 2 — more content + proper ordering

- [x] **More chords and chord *types*:** Done — 27 chords grouped by type: 7ths (G7, E7, A7,
      D7, B7), sus2/sus4, add9 (Cadd9), m7 (Am7, Em7, Dm7), power chords (E5, A5), easier F
      (Fmaj7). Each with fingerings, tips, and mistakes. (`data/chords.ts`, `ChordLibrary`)
- [x] **More strumming patterns/types:** Done — 8 patterns tagged Easy→Hard: 16th-note pop
      (new 16th grid in the engine), offbeat/reggae, palm-muted rock, metronome-only, plus the
      originals. _Still to do: Travis-style + true arpeggio/fingerpicking (needs per-string
      plucking, a bigger engine change)._ (`data/patterns.ts`, `audio/engine.ts`)
- [x] **Proper, research-backed order:** Done — guided path re-sequenced to Em → Am → D → G → C,
      drilling each transition before adding the next chord; Em–C–G–D is the first real loop.
      Change-drill pairs and library groups sorted by difficulty consistently. (`data/path.ts`,
      `ChangeDrill`, `ChordLibrary`)

## Tier 3 — customization (currently "present only, no options")

- [x] **Settings page:** Done — dark/light theme, left-handed fretboards, count-in on/off,
      metronome volume. (`app/settings/page.tsx`, `state/settings.ts`) _Backing instrument
      deferred — only one synth voice exists so far._
- [x] **Capo & transpose** — Done: a −5…+7 semitone shift applied to all playback.
      (`state/settings.ts`, `audio/engine.ts`)
- [x] **A–B loop** — Done: repeat bars [a..b] of a play-along. (`components/practice/PlayAlong.tsx`)
- [x] **Tempo trainer** — Done: the change drill nudges BPM up when you keep up, down when you
      retry. (`components/practice/ChangeDrill.tsx`)
- [x] **Custom drills** — Done: the change drill can drill *any* two of your known chords
      (a "Custom" option with per-chord pickers), and Create has a multi-section song builder —
      add generated loops as Verse/Chorus/… sections, then play or save the whole song.
      (`components/practice/ChangeDrill.tsx`, `app/create/page.tsx`)

## Production roadmap (v2 → v3) — "not a college project"

Audit (2026-09): the app is feature-complete but has production gaps. In priority order:

1. **Audio quality** — _in progress._ The old thin Karplus-Strong synth is the main "college
   project" tell. Done: clean master chain (high-pass → EQ → compressor → limiter) + acoustic
   & electric voices (`audio/instruments.ts`). _Next:_ audible A/B tuning; optionally swap to
   **sampled** guitars (`Tone.Sampler` + the CC-BY [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
   `guitar-acoustic`/`guitar-electric` sets served from `/public`) for maximum realism; per-string
   voicing; a nylon/12-string option later.
2. **Music Theory track** ("GeeksforGeeks for music") — a `/theory` section, research-backed order
   **Intervals → Scales → Triads → Diatonic progressions → Ear training**, each lesson a short
   explainer + audio + a quick self-check. Fills a real gap (we only have chord/pattern data today).
3. **Real level system** — _Done._ Five levels (First strings → Musician), each completed by real
   milestones drawn from Learn + Practice + Theory (chords known, changes/min, streak, saved loops,
   theory modules finished, sessions logged). A `/journey` page shows the ladder; Profile shows the
   computed level. Nothing is hard-locked. (`data/levels.ts`, `app/journey/page.tsx`)
4. **Ear training + Listen mode** — mic scores whether you played the right chord/interval in time
   (reuses the tuner's mic setup). The true hands-free payoff.
5. **Backend + accounts** — move progress off localStorage to real sync (Supabase or Next API +
   Postgres), so progress survives a browser clear and follows the user across devices.
6. **Deploy + rename + test coverage** — ship to a URL, drop the "Cadence" placeholder, add
   component/e2e tests beyond the pure-logic units.

Research sources: browser guitar synthesis vs sampling (Tone.js docs; tonejs-instruments);
web-audio amp/cabinet & acoustic sim ([bobrov.dev](https://bobrov.dev/blog/web-audio-for-electric-guitar-cabinet-emulation/));
beginner theory order ([National Guitar Academy](https://nationalguitaracademy.com/music-theory/music-theory-for-beginners/),
[StringKick](https://www.stringkick.com/blog-lessons/guitar-music-theory/)).

## Tier 4 — polish & retention

- [ ] Practice calendar/history, weekly minutes, gentle streak-freeze.
- [ ] Clearer empty/finished states, richer copy, a sound-on prompt.
- [ ] Deploy to a live URL; rename from the placeholder "Cadence."

## Marquee: Listen mode ✅ v1

Done: `/listen` — the app counts you in and keeps time (metronome only), you play the chords,
and the mic scores each bar via polyphonic peak-picking (`audio/pitch.ts`:
`detectPitchClasses` / `chordCoverage`, unit-tested). Auto-advancing and hands-free; shows a
live match meter and a per-bar score. _Refinements:_ click bleed can inflate scores (best with
headphones); could add HPS/CQT for sharper detection and mic-driven auto-count. Needs real-mic
tuning (the dev browser pane blocks the mic, so only the logic + UI are verified here).

## Suggested first batch ("Play like you mean it")

Tuner → change-drill redesign → chord detail pages → About/How-to + expanded content with the
corrected order → Settings page. Then the Listen-mode batch.

## Sources

- Best guitar apps 2026 — https://americansongwriter.com/best-guitar-learning-app/
- Chord learning order — https://musictonic.com/guitar-chords-for-beginners/
- Em–C–G–D progression — https://goodguitarist.com/songs-that-use-em-c-g-d/
- Browser pitch detection (YIN + Web Audio) — https://dev.to/xiaolu/real-time-pitch-detection-in-the-browser-with-yin-and-the-web-audio-api-4o6b
- In-browser guitar note/chord detector (example) — https://github.com/Raj-Jai/GuitarScope
- Capo (sections, loop, transpose) — https://supermegaultragroovy.com/products/capo/ios/
- smartChord (tunings, capo, autoscroll, left-handed) — https://smartchord.de/
