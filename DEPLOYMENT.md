# Deployment plan — Cadence (free tier)

How to take Cadence live for **$0**, then add accounts + cross-device sync later — also free.
Written for the current build: Next.js 16, all client components, **no API routes or server
actions**, so every route prerenders to static HTML (`14/14 ○ Static`). That makes hosting cheap
and gives us the easiest possible first deploy.

The GitHub repo is already at `github.com/Chandu6702/cadence`.

---

## Phase 0 — Pre-deploy checklist (~15 min)

Do these once before the first deploy.

- [ ] **Rename the "Cadence" placeholder** (if you want a different name): `src/app/layout.tsx`
      (`<title>`/metadata), `src/components/SideNav.tsx`, `src/app/page.tsx`, and the `C` logo mark.
- [ ] **Confirm a clean build locally:**
      ```bash
      npm run lint && npm test && npm run build
      ```
- [ ] **Decide static vs. server rendering.** The app has no server code, so **static export**
      is the simplest and has no cold starts. To enable it, set in `next.config.ts`:
      ```ts
      const nextConfig: NextConfig = { output: "export" };
      ```
      `npm run build` then also writes a static `out/` folder you can host anywhere. (Skip this if
      you deploy to Vercel, which handles Next natively without export.)
- [ ] **Commit and push** so the host can build from GitHub.

---

## Phase 1 — Ship the frontend (free)

Pick **one** host. All three below have a genuinely free tier big enough for this app.

### Option A — Vercel  ⭐ recommended (zero-config, no cold starts)

Made by the Next.js team; the free **Hobby** tier is ideal for a personal project.

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New → Project** → import `Chandu6702/cadence`.
3. Framework preset auto-detects **Next.js**. Leave build command (`next build`) and output as
   defaults. No env vars needed yet.
4. **Deploy.** You get `https://cadence-xxxx.vercel.app` in ~1 min, on a global CDN.
5. Every push to `main` auto-deploys; pull requests get preview URLs.
- *Don't* set `output: "export"` for Vercel — let it run Next natively.

### Option B — Render (you mentioned this)

Render's free tier fits, with one caveat per mode:

- **Static Site (recommended on Render):** needs `output: "export"` (Phase 0).
  New → **Static Site** → connect the repo → Build `npm install && npm run build` →
  Publish directory **`out`**. Free, on a CDN, **no cold starts**. Best Render option.
- **Web Service (only if you later add server code):** New → **Web Service** → Build
  `npm install && npm run build` → Start `npm start`. The free Web Service **spins down after
  ~15 min idle**, so the first visit after idle is slow (~30s cold start). Avoid for a static app.

### Option C — Cloudflare Pages / Netlify (also free, static)

Both work like Render's Static Site: connect the repo, build `npm run build`, publish `out`
(requires `output: "export"`). Generous free bandwidth; pick by preference.

### Custom domain (optional, later)

All of the above let you attach a custom domain free (you only pay the registrar for the domain
itself, ~$10/yr). Add it in the host's dashboard and point DNS as instructed.

---

## Phase 2 — Accounts + cross-device sync (free, Supabase)

Today progress lives in `localStorage` (one browser). To let it follow a user across devices, add
**Supabase** — its free tier gives Postgres + Auth + Row-Level Security (500 MB DB, 50k monthly
active users). This is purely client-side, so it works even on static hosting.

### 1. Create the project
- [supabase.com](https://supabase.com) → New project (free). Note the **Project URL** and
  **anon public key**.

### 2. Schema — one row per user holding their progress

```sql
-- Progress snapshot, keyed to the authenticated user.
create table public.progress (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  data         jsonb not null default '{}',   -- the Zustand store state
  updated_at   timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Users can only read/write their own row.
create policy "own progress - select" on public.progress
  for select using (auth.uid() = user_id);
create policy "own progress - upsert" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "own progress - update" on public.progress
  for update using (auth.uid() = user_id);
```

Storing the whole store as one `jsonb` blob keeps the client simple and matches the current shape
(`knownChords`, `xp`, `streak`, `completedLessons`, `practiceLog`, `creations`, …). Normalise into
columns later only if you need server-side queries/leaderboards.

### 3. Client wiring
- `npm install @supabase/supabase-js`
- Add env vars (set them in the host dashboard too):
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  ```
- One `src/lib/supabase.ts` client. **Auth:** Supabase Auth — email magic-link is the least
  friction; add Google OAuth later (needs the deployed URL in the provider's redirect allowlist).
- **Sync strategy (local-first):**
  1. App still writes to the Zustand `localStorage` store as today — instant, offline-safe.
  2. On sign-in, `upsert` the local store up (first time) or pull the row down and **merge**
     (take the max of each numeric best, union the arrays, keep the larger `practiceLog`).
  3. On store change, debounce (~2 s) an `upsert` of `data` + `updated_at`.
  4. Treat Supabase as the source of truth across devices; local is the fast cache.
- **Migration:** no data loss — existing users keep their `localStorage`; it's pushed up the first
  time they sign in. Anonymous use stays fully working (sign-in is optional).

### 4. Scope estimate
Small, isolated change: one client lib, a thin sync hook subscribed to the store, and a sign-in
button on Profile. No changes to the audio engine, data layer, or existing pages.

---

## Cost & limits summary

| Piece            | Service               | Free tier                                   | Cold starts |
|------------------|-----------------------|---------------------------------------------|-------------|
| Frontend (rec.)  | Vercel Hobby          | 100 GB bandwidth/mo, auto CI from GitHub     | No          |
| Frontend (alt.)  | Render Static Site    | Static + CDN                                 | No          |
| Frontend (alt.)  | Cloudflare Pages      | Unlimited requests, 500 builds/mo            | No          |
| Auth + DB        | Supabase Free         | Postgres 500 MB, 50k MAU, Auth, RLS          | n/a         |
| Custom domain    | any registrar         | ~$10/yr (optional; hosting stays free)       | —           |

Everything needed to go live and sync progress is **$0** except an optional custom domain.

---

## Recommended path

1. **Phase 0** checklist → clean build.
2. **Vercel** for the frontend (fastest, no cold starts, zero config). Live in minutes.
3. When you want cross-device progress, add **Supabase** per Phase 2 — no backend server to run,
   no new hosting cost.
