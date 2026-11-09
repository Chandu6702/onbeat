# Supabase setup — accounts & cloud sync

Cloud sync is **already coded** and ships turned off. The app runs fully locally until you add
two environment variables; then a "Cloud sync" card appears on the Profile page and progress
starts syncing across devices. Nothing here costs money (Supabase free tier).

This doc is the operator's guide — follow it once to turn sync on, and come back to it when you
want to change how it works.

---

## What's already built (so you know what to touch)

| File | Role |
|------|------|
| `src/lib/supabase.ts` | Creates the Supabase client from env vars. If they're missing, exports `null` and everything below no-ops. |
| `src/lib/progressSync.ts` | `pullMergePush` (on sign-in) and `pushProgress` (debounced) — the read/write calls. |
| `src/state/progress.ts` | `exportProgress`, `mergeProgress`, and the `mergeRemote` store action — the **merge rules** live here. |
| `src/components/SyncProvider.tsx` | Mounted in `layout.tsx`; watches auth and pushes changes. |
| `src/components/profile/AccountPanel.tsx` | The sign-in / signed-in UI on Profile. |

---

## Step 1 — Create the project (~3 min)

1. Go to [supabase.com](https://supabase.com) → sign in → **New project** (Free plan).
2. Pick a name and a strong database password (you won't need it for this app).
3. Wait for it to provision.

## Step 2 — Create the table + security rules

In the dashboard: **SQL Editor → New query**, paste this, and **Run**:

```sql
-- One row per user, holding their whole progress snapshot as JSON.
create table public.progress (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  data         jsonb not null default '{}',
  updated_at   timestamptz not null default now()
);

-- Row-Level Security: a user can only ever see or change their own row.
alter table public.progress enable row level security;

create policy "own progress - select" on public.progress
  for select using (auth.uid() = user_id);
create policy "own progress - insert" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "own progress - update" on public.progress
  for update using (auth.uid() = user_id);
```

## Step 3 — Turn on email sign-in

1. **Authentication → Providers → Email**: make sure it's enabled.
2. For the least friction leave it as **magic link** (no passwords). The app uses
   `signInWithOtp`, which emails a one-click link.
3. **Authentication → URL Configuration → Redirect URLs**: add the URLs the link may return to:
   - `http://localhost:3000/profile` (local dev)
   - `https://YOUR-RENDER-SITE.onrender.com/profile` (your deployed site — add after Step 5)

## Step 4 — Get your keys

**Project Settings → API**, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Use the **anon** key, never the `service_role` key — the anon key is safe in the browser because
> Row-Level Security (Step 2) is what actually protects the data.

## Step 5 — Set the env vars

**Local:** copy `.env.example` to `.env.local` and paste the two values, then restart `npm run dev`.

**On Render:** in your service → **Environment** → add both vars (same names), then redeploy.
Because they're `NEXT_PUBLIC_*`, they're baked in at **build time** — you must redeploy after
changing them. (Then go back to Step 3 and add your Render `/profile` URL to the redirect list.)

## Step 6 — Verify

1. Open Profile → the **Cloud sync** card now shows.
2. Enter your email → **Send magic link** → open the email → you land back signed in, with a
   green **Synced** badge.
3. Practice something, then open the site in another browser/device and sign in with the same
   email — your progress is there.

---

## How the sync behaves (and how to change it)

- **Local-first.** The app always writes to `localStorage` first, so it's instant and works
  offline. Sync is a background copy on top.
- **On sign-in** (`pullMergePush`): it pulls your cloud row, **merges** it into local, then pushes
  the merged result back — so every device converges. No data is lost the first time you sign in
  on a device that already had local progress.
- **On change**: `SyncProvider` debounces pushes by **2 s** (`PUSH_DEBOUNCE_MS` — change it there).
- **Merge rules** (`mergeProgress` in `src/state/progress.ts`): bests take the **max** (xp, streak,
  best changes/min, sessions), chord/lesson lists **union**, creations union by id, and the
  practice log keeps the **busier** count per day. Edit that one function to change the policy.

## Common changes

- **Add Google sign-in:** enable the Google provider in Supabase (Authentication → Providers),
  then add a button calling `supabase.auth.signInWithOAuth({ provider: "google" })` in
  `AccountPanel.tsx`. Add your site URL to the provider's allowed redirects.
- **Sync settings too (theme, instrument, etc.):** today only `progress` syncs. To also sync
  `settings`, mirror the same pattern for the `settings` store (export/merge/push), or widen the
  `data` blob to include it.
- **Normalize instead of one JSON blob:** if you later want leaderboards or server-side queries,
  split `data` into real columns and update `exportProgress`/`mergeProgress` accordingly.

## Troubleshooting

- **Card doesn't appear:** env vars not loaded — check names exactly, and that you restarted dev /
  redeployed on Render.
- **Magic link opens but you're not signed in:** the return URL isn't in Supabase's redirect
  allowlist (Step 3).
- **Nothing syncs / console shows `[sync] push failed`:** the table or RLS policies are missing —
  re-run Step 2.
