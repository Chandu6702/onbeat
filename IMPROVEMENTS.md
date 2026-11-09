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

- [ ] **Built-in tuner (mic).** Needed before playing; genuinely hands-free. Effort: med.
- [ ] **Fix the change-drill for real playing.** Tapping each change is the "can't hit
      buttons while playing" problem. Replace with a **count-in + auto-tempo** mode (change
      on the beat, no tapping); optionally **mic auto-count**. Effort: med.
- [ ] **Chord detail pages.** Finger numbers, common mistakes, a how-to-fret tip, audio, and
      a "practice this" button — not just a sound. Effort: low–med.
- [ ] **About / How-to page + first-run onboarding.** Explain hands-free use; onboarding asks
      which chords you know + your goal, so the app personalizes. Effort: low.
- [ ] **Performance mode.** Big, high-contrast play view readable from a music stand. Effort: low.

## Tier 2 — more content + proper ordering

- [ ] **More chords and chord *types*:** 7ths (G7, E7, A7, D7, B7), sus2/sus4, add9 (Cadd9),
      m7 (Am7, Em7, Dm7), power chords (E5, A5), easier F options (Fmaj7, mini-F). Group by type.
- [ ] **More strumming patterns/types:** 16th-note pop, offbeat/reggae, folk/Travis-style,
      ballad arpeggio/fingerpicking, palm-muted rock, plus metronome-only. Tag Easy→Hard.
- [ ] **Proper, research-backed order:** Em → Am → D → G → C; transitions matter more than
      adding chords (better 4 smooth than 10 shaky). Em–C–G–D is the first real 4-chord loop.
      Re-sequence the guided path and sort everything by difficulty consistently.

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
