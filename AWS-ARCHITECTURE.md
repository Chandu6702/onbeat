# Onbeat on AWS — architecture & services

A reference for deploying Onbeat on AWS, and for talking through the architecture in an
interview. This is **additional** to `DEPLOYMENT.md` (free-tier: Render + Supabase) — it doesn't
change that setup. Pick whichever target you need.

---

## TL;DR — is Amplify enough?

**Yes.** Onbeat is a **static front-end** (Next.js with `output: "export"` — all 14 routes are
prerendered, no SSR, no API routes) whose only backend is **Supabase** (auth + Postgres), called
directly from the browser. So on AWS you need exactly one service to ship it:

> **AWS Amplify Hosting** — connect the GitHub repo, it builds `npm run build` and serves the
> static `out/` folder over CloudFront's CDN with HTTPS and CI on every push.

No VPC, no servers, no load balancer, no database to run yourself. A fuller AWS architecture is
**not required** to deploy it — it's only interesting if you *replace* Supabase with AWS-native
services (Options B/C below), which is a scaling/learning exercise, not a necessity.

---

## Option A — Amplify Hosting (recommended, simplest)

```
GitHub (Chandu6702/cadence)
        │  push to main
        ▼
AWS Amplify Hosting ──builds──► static out/ ──► Amazon CloudFront (CDN + TLS) ──► users
        │
        └── env vars: NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
                                   │
                                   ▼  (browser calls directly)
                           Supabase (Auth + Postgres + RLS)
```

**Setup**
1. Keep `output: "export"` in `next.config.ts` (already documented in `DEPLOYMENT.md`).
2. AWS Console → **Amplify** → **Host web app** → connect GitHub → pick the repo/branch.
3. Build settings (Amplify auto-detects Next.js; confirm it outputs the static site):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands: [npm ci]
       build:
         commands: [npm run build]
     artifacts:
       baseDirectory: out
       files: ['**/*']
     cache:
       paths: [node_modules/**/*]
   ```
4. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars (Amplify → App settings → Environment variables),
   then redeploy (they're baked in at build time). Add the Amplify URL to Supabase's auth redirect
   allowlist (see `SUPABASE_SETUP.md`).

**Services used:** Amplify Hosting (wraps S3 + CloudFront + a build pipeline). That's it.

**AWS services this maps to conceptually:** Amazon S3 (static files), Amazon CloudFront (CDN/TLS),
AWS CodeBuild-style CI (managed by Amplify). Optional: **Route 53** for a custom domain, **ACM**
for the certificate (Amplify provisions one automatically).

**Free tier:** Amplify's free tier (build minutes + hosting/transfer) comfortably covers a
portfolio app; CloudFront + S3 usage at this scale is negligible.

---

## Option B — All-AWS, serverless (replace Supabase)

Only if you want to show you can do the backend on AWS instead of a BaaS. Progress is one JSON
document per user, so it maps cleanly to a serverless stack.

```
Browser (static app on Amplify/CloudFront)
   │ sign-in (JWT)              │ GET/PUT /progress  (Bearer JWT)
   ▼                            ▼
Amazon Cognito            Amazon API Gateway (HTTP API, JWT authorizer = Cognito)
(user pools, hosted UI)         │
                                ▼
                          AWS Lambda (Node/TS handler)
                                │
                                ▼
                          Amazon DynamoDB   table: progress  (PK = userId, attr = data JSON)
```

| Concern            | Supabase today      | AWS-native equivalent                         |
|--------------------|---------------------|-----------------------------------------------|
| Hosting/CDN        | Render/Amplify      | Amplify Hosting (S3 + CloudFront)             |
| Auth               | Supabase Auth       | **Amazon Cognito** (user pools + JWT)         |
| API                | (direct from client)| **API Gateway** (HTTP API) + **Lambda**       |
| Database           | Postgres + RLS      | **DynamoDB** (per-user item) — or RDS, below  |
| Row-level security | Postgres RLS        | JWT `sub` → item PK; IAM scoping on Lambda     |
| Observability      | Supabase dashboard  | **CloudWatch** logs/metrics, **X-Ray** traces |
| Infra as code      | —                   | **AWS SAM** / CDK / Terraform                 |

The client change is small: swap the Supabase client in `src/lib/supabase.ts` / `progressSync.ts`
for Cognito (Amplify Auth) + `fetch` to API Gateway. The merge logic in
`src/state/progress.ts` (`mergeProgress`) is reused unchanged.

**Free tier:** Cognito (50k MAU), Lambda (1M req/mo), DynamoDB (25 GB + on-demand), API Gateway
(1M req/mo, first 12 months) — all well within a portfolio's usage.

---

## Option C — Java / Spring Boot backend (matches the SE target stack)

This is the version worth being able to whiteboard, since the career target is Java + Spring Boot
+ AWS. Same frontend; the backend is a Spring Boot REST API you own.

```
Browser (static app, CloudFront)
   │ Cognito JWT in Authorization header
   ▼
Amazon CloudFront ──► Application Load Balancer ──► ECS Fargate
                                                      (Spring Boot container:
                                                       /api/progress GET+PUT,
                                                       validates Cognito JWT via
                                                       spring-boot-starter-oauth2-resource-server)
                                                         │  Spring Data JPA
                                                         ▼
                                                   Amazon RDS (PostgreSQL)
                                                   table: progress(user_id PK, data jsonb, updated_at)
```

- **Compute:** ECS on **Fargate** (no servers to manage) — or **Elastic Beanstalk** for an even
  simpler "upload a jar" story, or **EKS** if the role wants Kubernetes.
- **Auth:** Amazon Cognito issues JWTs; Spring Security validates them as a resource server
  (`spring-boot-starter-oauth2-resource-server`) — a very common interview topic.
- **DB:** Amazon RDS for PostgreSQL (the schema is already written in `SUPABASE_SETUP.md`; it's
  standard Postgres, so it ports directly — `jsonb` column and all).
- **Networking:** VPC with public subnets (ALB) + private subnets (Fargate tasks, RDS); security
  groups so only the ALB reaches the tasks and only the tasks reach RDS.
- **Secrets:** AWS Secrets Manager / SSM Parameter Store for the DB credentials.
- **Edge/DNS/TLS:** CloudFront + Route 53 + ACM.
- **Observability:** CloudWatch (logs, metrics, alarms), optionally X-Ray.
- **CI/CD:** GitHub Actions or CodePipeline → build image → push to **ECR** → deploy to ECS.
- **IaC:** Terraform or AWS CDK to make it reproducible.

This is deliberately heavier than the app needs — its value is demonstrating the full picture
(VPC, ALB, Fargate, RDS, Cognito, JWT resource server, ECR, IaC) for a system-design conversation.

---

## How to talk about it in an interview

- **"How is it deployed?"** — Static Next.js export on a CDN (Render today; **AWS Amplify** is a
  one-service swap). Progress is local-first in the browser, with optional cloud sync.
- **"Why so simple?"** — The app has no server-side rendering or private server logic, so a CDN +
  a managed auth/DB (Supabase) is the right-sized architecture. I didn't add servers I didn't need.
- **"How would you put it fully on AWS?"** — Walk Option B (serverless: Cognito + API Gateway +
  Lambda + DynamoDB) or **Option C** (Spring Boot on ECS Fargate + RDS + Cognito), and note the
  client merge logic (`mergeProgress`) stays the same either way.
- **"How does sync avoid data loss across devices?"** — Local-first writes, then a conservative
  merge on sign-in: bests take the max, collections union, the practice log keeps the busier day
  (`mergeProgress` in `src/state/progress.ts`). Same strategy regardless of the backend.
- **Trade-offs to mention:** BaaS (Supabase) = fastest to ship, less ops; AWS-native = more
  control, IAM/VPC/observability story, but more moving parts. DynamoDB (single JSON doc per user)
  vs RDS (queryable, relational, needed only if you add leaderboards/analytics).

---

## Summary

| You want to…                         | Use                                                        |
|--------------------------------------|------------------------------------------------------------|
| Deploy on AWS with least effort      | **Amplify Hosting** (Option A). Enough on its own.         |
| Show AWS-native backend (serverless) | Cognito + API Gateway + Lambda + DynamoDB (Option B).      |
| Show the Java/Spring + AWS stack     | Spring Boot on ECS Fargate + RDS + Cognito (Option C).     |

For actually shipping the resume project, **Option A (or the Render path in `DEPLOYMENT.md`) is
all you need.** Options B/C are there so you can speak to the fuller architecture when asked.
