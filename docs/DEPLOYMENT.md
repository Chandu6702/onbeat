# Deployment plan — Onbeat (free tier)

## Phase 0 — Pre-deploy checklist (~15 min)

Do these once before the first deploy.

- [ ] **Confirm a clean build locally:**
      ```bash
      npm run lint && npm test && npm run build
      ```
- [ ] **Enable static export (needed for Render Static Site).** The app has no server code, so it
      exports to plain static files — no cold starts, cheapest to host. Set in `next.config.ts`:
      ```ts
      const nextConfig: NextConfig = { output: "export" };
      ```
      `npm run build` then writes a static `out/` folder (verified working for this app — all 14
      routes export). Keep this on for Render/Cloudflare/Netlify; only remove it if you move to
      Vercel, which runs Next natively.
- [ ] **Commit and push** so the host can build from GitHub.

---

## Phase 1 — Ship the frontend on Render (free)

You're using **Render**, so these are the primary steps. The app is fully static, so use a Render
**Static Site** — it's free, on a CDN, and (unlike a free Web Service) has **no cold starts**.

### Render — Static Site  ⭐ your setup

1. Make sure Phase 0's `output: "export"` is set and pushed.
2. [dashboard.render.com](https://dashboard.render.com) → **New → Static Site** → connect
   `Chandu6702/cadence`.
3. Settings:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `out`
4. **Create Static Site.** You get `https://<name>.onrender.com` on a CDN; every push to `main`
   auto-deploys.
5. When you add cloud sync (Phase 2), add the two `NEXT_PUBLIC_SUPABASE_*` env vars under the
   service's **Environment** tab and redeploy (they're baked in at build time).

> Don't use a Render **Web Service** for this app — its free tier spins down after ~15 min idle,
> giving a ~30 s cold start. The Static Site has none of that.

### Alternatives (also free, same static `out/` build)

- **Cloudflare Pages / Netlify:** connect the repo, build `npm run build`, publish `out`. Generous
  free bandwidth.
- **Vercel:** zero-config for Next — but **remove** `output: "export"` and let it run Next
  natively. Also free (Hobby), no cold starts.

### Custom domain (optional, later)

All of the above let you attach a custom domain free (you only pay the registrar for the domain
itself, ~$10/yr). Add it in the host's dashboard and point DNS as instructed.

---

## Phase 2 — Accounts + cross-device sync (free, Supabase)

> **This is already built.** The Supabase client, auth, sync lifecycle, merge rules, and the
> Profile sign-in UI all ship in the code — turned **off** until you add two env vars. Full
> step-by-step operator guide (create project, SQL, auth, env vars on Render, how to change the
> merge behaviour) is in **`SUPABASE_SETUP.md`**. The summary below is the architecture.

Today progress lives in `localStorage` (one browser). Signing in copies it to **Supabase** — free
tier: Postgres + Auth + Row-Level Security (500 MB DB, 50k monthly active users). It's purely
client-side, so it works even on a static Render site.

**→ Do it: follow `SUPABASE_SETUP.md`** (create project, run the SQL, enable email auth, keys,
env vars on Render, verify). Architecture, for reference:

- **Storage:** one `public.progress` row per user — `user_id`, `data` (jsonb = the whole store
  snapshot), `updated_at` — protected by Row-Level Security so a user only touches their own row.
- **Client:** `src/lib/supabase.ts` builds the client from the two `NEXT_PUBLIC_SUPABASE_*` env
  vars; if they're absent the client is `null` and the whole feature no-ops (app stays local).
- **Auth:** Supabase email **magic link** (`signInWithOtp`) via the Profile "Cloud sync" card.
  Google OAuth is a small add later.
- **Sync (local-first):** the app always writes `localStorage` first (instant, offline). On
  sign-in it pulls the cloud row, **merges** into local, and pushes the result back; local changes
  are then pushed on a 2 s debounce. Merge keeps bests (max), unions collections, and keeps the
  busier practice-log day — so no device loses data.
- **Migration:** zero data loss — existing local progress is pushed up the first time you sign in;
  anonymous use keeps working, sign-in is optional.

---

## Cost & limits summary

| Piece            | Service               | Free tier                                   | Cold starts |
|------------------|-----------------------|---------------------------------------------|-------------|
| Frontend (yours) | Render Static Site    | Static + CDN, auto CI from GitHub            | No          |
| Frontend (alt.)  | Cloudflare Pages      | Unlimited requests, 500 builds/mo            | No          |
| Frontend (alt.)  | Vercel Hobby          | 100 GB bandwidth/mo (runs Next natively)     | No          |
| Auth + DB        | Supabase Free         | Postgres 500 MB, 50k MAU, Auth, RLS          | n/a         |
| Custom domain    | any registrar         | ~$10/yr (optional; hosting stays free)       | —           |

Everything needed to go live and sync progress is **$0** except an optional custom domain.

---

## Recommended path

1. **Phase 0** checklist (enable `output: "export"`) → clean build.
2. **Render Static Site** for the frontend — your setup, free, no cold starts. Live in minutes.
3. When you want cross-device progress, follow **`SUPABASE_SETUP.md`** — it's already coded, just
   add your keys. No backend server to run, no new hosting cost.
