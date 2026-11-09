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

- [ ] **Settings page:** left-handed fretboards, count-in on/off, metronome sound/volume,
      backing instrument, dark/light.
- [ ] **Capo & transpose** (change key without new shapes).
- [ ] **A–B loop** — repeat just the hard bars of a play-along.
- [ ] **Tempo trainer** — auto-nudge BPM up as you succeed (great for change drills).
- [ ] **Custom drills** — pick any chords to drill; build multi-section (verse/chorus) loops in Create.

## Tier 4 — polish & retention

- [ ] Practice calendar/history, weekly minutes, gentle streak-freeze.
- [ ] Clearer empty/finished states, richer copy, a sound-on prompt.
- [ ] Deploy to a live URL; rename from the placeholder "Cadence."

## Marquee (bigger, later): Listen mode

Mic detects whether you're playing the right chord in time and auto-advances / scores you —
the feature that makes the whole app truly hands-free. Do after Tier 1, as its own batch.

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
