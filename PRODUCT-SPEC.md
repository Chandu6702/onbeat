# Music Practice App — Product Spec

_As of 2026-09-18_

## Vision & concept

**One line:** A sleek, beginner-to-advanced practice partner for musicians — **Learn**, **Practice**, and **Create** — starting with guitar and built to add more instruments.

**The problem.** People learning an instrument hit a wall between _knowing_ a few chords and _actually playing music_. Existing tools are fragmented: one app teaches chords, another is just a metronome, songbooks assume you already read chord charts, and real play-alongs need copyrighted recordings. A beginner who has learned Em and Am has no simple way to practice switching between them in rhythm, or to hear a small "song" built from only those two chords and play along with it.

**The idea.** One app that meets you where you are and grows with you. It teaches the building blocks, drills them with rhythm and tempo, and — crucially — **generates its own practice music from the chords you know**, so there is always something to play along to without depending on licensed songs. A total beginner uses it to _become_ good; an advanced player uses it to warm up, drill hard material, or compose. Same app, no walls.

**Why it's different.** The core unlock is _generated, license-free practice content_. Instead of a library of songs the app can't legally provide, the app is itself a small music engine: give it the chords you know plus a genre and tempo, and it produces a progression, a strumming pattern, and an audible backing you play over. That makes the app useful on day one, in every country, with zero content-licensing cost.

## Who it's for

The app is _fluid_ — the same product serves all three, and people move between them over time. No mode-switching, no separate "beginner app."

**The absolute beginner (e.g. you, learning guitar now).** Knows a handful of chords, unsure what to learn next or how to practice rhythm. Needs: clear "start here" guidance, chord shapes shown visually, gentle change drills, and something simple to play along with that only uses the chords they know. Wins when: they can play a real-feeling progression in time.

**The returning / intermediate player.** Knows several open chords, maybe a couple of strumming patterns, wants to get tighter and learn songs. Needs: chord-change speed drills, genre-specific strumming, harder generated play-alongs, and a sense of progress. Wins when: their changes get clean at higher tempos and they can hold a groove.

**The advanced player.** Plays well, uses the app to warm up, drill weak spots, sight-read new progressions, or compose. Needs: fast/complex material, barre and extended chords, full control in the Create studio, and no hand-holding. Wins when: it's a fast, flexible practice and writing tool they reach for daily.

Difficulty labels (Easy / Medium / Hard) do double duty across all three: they _orient_ the beginner ("start with these Easy chords") and _filter_ for the advanced player ("show me Hard only").

## The three pillars

### 1. Learn

The reference and teaching layer — everything is browsable and difficulty-labeled.

- **Chord library** — each chord shown as a fingering diagram (fretboard for guitar/uke, keys for piano), playable so you hear it, with finger numbers and common mistakes.
- **Strumming patterns** — down/up stroke patterns shown visually and audibly, tagged by genre and difficulty.
- **Genres** — short primers: what a genre sounds like, its typical chords and strumming feel, example patterns.
- **Suggested learning path** — a recommended order for people who don't know where to start ("first chords → first change → first strum → first play-along"). Guidance only; never a gate.

### 2. Practice

The core daily loop — short, focused, measurable reps.

- **Chord trainer** — hold a single shape, get it clean.
- **Chord-change drill** — the classic "how many clean Em↔Am changes in 60 seconds," with a live count and a personal best.
- **Strumming trainer** — a pattern on a metronome; visual stroke guide scrolls in time; adjustable tempo.
- **Play-along** — a generated progression scrolls with the beat, the current chord is highlighted, the app plays a backing in tempo, you play along. Adjustable tempo and count-in.

### 3. Create

Make your own material — for beginners who can't compose yet _and_ advanced players who want to.

- **Build a progression** — pick the chords you know, a strumming pattern, a tempo, and a genre; the app assembles a playable practice piece / mini-song.
- **Save & loop** — keep your creations, loop sections, revisit them as practice.
- **Advanced composing** — more chords, custom patterns, section structure (verse/chorus) for players who want to write.

## Core mechanics

**Difficulty labels (Easy / Medium / Hard).** Every piece of content — chords, patterns, drills, generated songs — carries a difficulty tag, LeetCode-style. Rough guide:

- _Easy_ — open chords (Em, Am, C, G, D), slow tempos, simple all-down strum, 2–3 chord changes.
- _Medium_ — more chords including F, faster changes, down-up patterns, syncopation, more genres.
- _Hard_ — barre and extended chords, fast tempos, complex/syncopated strumming, longer progressions.

**Suggested-not-forced paths.** The learning path recommends a sensible order and can _nudge_ ("you're crushing Easy changes — try Medium?"), but it never locks content. Any user can jump straight to any drill, song, or the Create studio at any time. Two ways in, same library: **"Guide me"** (follow the path) and **"Let me choose"** (browse and filter by difficulty + type).

**Gamification that pulls, doesn't gate.** Motivation, never a wall:

- **XP** for completed reps (a finished drill, a clean change record, a played-through song).
- **Streaks** for practicing on consecutive days.
- **Daily goal** — a small, adjustable target (e.g. "10 minutes" or "3 drills") so a session always has a finish line.
- **Personal bests** — e.g. fastest clean Em↔Am changes/minute, so progress is visible and self-competitive.
- Rewards _unlock nothing that was locked_ — they mark progress and suggest what's next.

**No-licensing content principle.** The app ships **no** copyrighted recordings and **no** scraped chord charts. All play-along material is either generated by the app's own engine or user-created. Any real songs added later come only from public-domain / Creative Commons sources or user imports. This keeps the app legal, free to run, and available everywhere from day one.

## Key screens & UX flow

Four primary screens, reachable from a simple bottom/side nav: **Home, Learn, Practice, Create** (plus Profile for stats).

**Home / Today.** The landing screen. Shows: today's streak and daily-goal progress, a big "Continue" button (resume the suggested path or last activity), a "Practice now" quick-start, and 2–3 recommended cards (a chord to review, a change drill, a play-along at your level). One screen that answers "what do I do right now?"

**Learn.** Browsable library with a difficulty filter and type tabs (Chords / Strumming / Genres). Toggle between **Guide me** (the ordered path) and **Browse** (free exploration). Tapping an item opens a detail view with the diagram, audio, and a "Practice this" button.

**Practice (the core loop).** A focused, full-screen session:

1. Pick a mode (chord / change drill / strumming / play-along) or accept the recommended one.
2. Set tempo and difficulty; count-in plays.
3. Do the rep with clear visual timing — stroke guide, highlighted current chord, moving playhead.
4. See the result (count, accuracy, XP earned, new personal best) and a one-tap "Again" / "Next."

**Create studio.** Pick chords → choose a strumming pattern → set tempo + genre → preview the generated piece → save or send it straight into a play-along. Advanced users get more chords, custom patterns, and section structure.

**Design language.** Sleek and modern, generous whitespace, one accent color, large tap targets, and _timing-first_ visuals (the beat, the current chord, and the next chord are always obvious at a glance). Friendly copy, sentence case, minimal chrome.

## The generated-music engine

This is the app's differentiator and its answer to licensing. Instead of _storing_ songs, the app _generates_ practice music on the fly. No recordings, no chord-chart scraping.

**Inputs:** the chords the user knows (or picks), a genre, a difficulty, and a tempo (BPM).

**What it produces:**

1. **A chord progression** — chosen from common, musically-sensible patterns filtered to the user's chords. Music theory makes this reliable: familiar progressions like I–V–vi–IV or i–VII–VI cover a huge amount of real music, and simple 2-chord loops (Em–Am) are perfect for beginners. The engine picks a progression whose chords are all in the user's known set.
2. **A strumming pattern** — selected by genre and difficulty (e.g. all-down for Easy folk; down-up-down-up for pop; syncopated for Hard).
3. **An audible backing** — the app _synthesizes_ the chords in tempo so there's something to play along with. Two levels: (a) a simple sampled/synth guitar or piano playing the chords in the strumming rhythm; (b) optionally a light drum/click groove for feel. Because it's synthesized, it's original audio — no licensing.
4. **A synced visual score** — the progression scrolls with a playhead; the current chord is highlighted and the next one is cued ahead of time so the player can prepare the change.

**How the audio works (technically).** A scheduler drives a Web Audio timeline: a clock ticks at the BPM, and on each beat the engine triggers chord notes (from a small set of recorded instrument samples, pitch-shifted, or a synth) following the strumming pattern. Libraries like Tone.js handle precise scheduling and sampling in the browser; the same model ports to native audio engines on mobile. Everything — tempo, count-in, looping a section, muting the backing so only the click remains — falls out of this one timeline.

**Why this is enough for v1.** Beginners don't need famous songs — they need _correct, in-tempo material using the chords they're learning_, repeated until it's clean. The engine delivers infinite such material for free.

## Tech stack & architecture

**Recommendation: build web-first, then wrap for mobile.** A web app is the fastest way to validate the core loop and audio, works on any device, and shares almost all its code with a later mobile build.

**Suggested stack**

- **Frontend:** React + TypeScript, Tailwind CSS for the sleek UI. (Or Next.js if you want easy hosting + a marketing page.)
- **Audio:** Tone.js on top of the Web Audio API — scheduling, sampler, synth, metronome. This is the engine that makes the whole thing tick.
- **State / storage:** start with local storage for progress; add a backend (e.g. Supabase or Firebase) when you want accounts, cross-device sync, and leaderboards.
- **Mobile later:** React Native (Expo) reuses your React knowledge and most logic; the audio engine swaps to a native equivalent. Or wrap the web app with Capacitor for a fast first mobile release.

**Core data model (instrument-agnostic by design).** Model everything as data so new instruments plug in without new code:

- **Instrument** — name, tuning/layout, how a chord shape renders (fretboard vs keyboard), sample set.
- **Chord** — name, the notes it contains, per-instrument fingering/shape, difficulty.
- **StrummingPattern** — sequence of down/up/rest per beat, genre tags, difficulty.
- **Progression** — ordered chords + a pattern + tempo + genre (generated or user-created).
- **UserProgress** — known chords, XP, streak, personal bests, saved creations.

Because chords are stored as _notes_, the audio engine can play any chord on any instrument, and adding ukulele, piano, or bass is mostly new shape-rendering + samples — not a rewrite.

## MVP scope & roadmap

Ship the smallest thing that proves the core loop feels good, then expand.

**v1 — MVP (guitar only, web).** Prove: "generated play-along from the chords I know feels great to practice with."

- Chord library for ~8 open chords with diagrams + audio.
- Chord-change drill with 60-second count and personal best.
- Strumming trainer with metronome + a few patterns.
- Play-along on a generated progression (scrolling chords, highlighted current chord, synthesized backing, tempo control).
- Basic Create: pick chords + pattern + tempo → generate a piece → play along.
- Local progress: XP, streak, daily goal.

**v2 — depth & retention.**

- More chords (incl. barre/F), Medium/Hard content, more genres and patterns.
- Suggested learning path with nudges.
- Accounts + cross-device sync; richer stats and personal bests.
- Better instrument samples and an optional drum groove.

**v3 — breadth.**

- Additional instruments (ukulele, piano, bass) via the data model.
- Mobile app (React Native or Capacitor).
- Mic-based chord/timing detection ("are you playing it right / in time?").
- Public-domain / Creative Commons real songs and user import (ChordPro).
- Social: shared creations, challenges, leaderboards.

**Fastest path to feel it:** build the v1 play-along loop as a prototype first (done — see `index.html`), validate the feel, then layer the rest.

## Open questions & risks

**Decisions to make before/while building:**

- **First instrument confirmed as guitar?** (Assumed yes, since that's what you're learning.)
- **Web-first, or must it be a phone app from day one?** (Recommend web-first for speed; wrap later.)
- **How real should the backing sound in v1?** A basic synth/sampled guitar is quick; realistic multi-instrument audio is more work. Recommend "good enough to practice with" first.
- **Accounts in v1, or local-only?** Recommend local-only to ship faster; add accounts in v2.
- **How prescriptive is the learning path?** Confirmed: suggested and nudging, never gating.

**Risks & mitigations:**

- **Audio timing must feel tight** — loose timing kills a rhythm app. Mitigation: build on a proven scheduler (Tone.js), test latency early, always give a visual + audible count-in.
- **Generated music sounding "wrong"** — mitigation: constrain the engine to well-known, theory-safe progressions and patterns rather than free generation.
- **Scope creep** — the vision is large. Mitigation: hold the line on the v1 loop; everything else waits.
- **Mic detection is hard** — keep it out of v1; the app is fully useful without it (you play along by ear/eye).
- **Motivation vs. pressure** — gamification should encourage, not shame. Keep streaks forgiving and goals adjustable.
