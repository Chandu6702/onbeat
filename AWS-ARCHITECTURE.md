# Onbeat on AWS — architecture & services

A reference for deploying Onbeat **entirely on AWS**, and for talking through the architecture in
an interview. This is a standalone doc — it doesn't change the free-tier setup in `DEPLOYMENT.md`
(Render + Supabase), which stays as the quick/zero-cost path. On AWS we **do not use Supabase**;
every piece is an AWS service.

> Context: the app today is a **static front-end** (Next.js `output: "export"` — 14 prerendered
> routes, no SSR, no API routes) and all progress is **local-first** in the browser. Cloud
> sign-in/sync is optional. That shapes the two AWS targets below.

---

## TL;DR

| What you want | AWS services needed |
|---|---|
| **Just host the app** (local-only progress, no login) | **Amplify Hosting** — and nothing else. |
| **Host it + login + cross-device sync, all on AWS** | Amplify Hosting **+ Cognito + API Gateway + Lambda + DynamoDB** (serverless). |
| Same, but with a **Java/Spring Boot** backend (SE target stack) | Amplify Hosting **+ Cognito + ECS Fargate + RDS (PostgreSQL)**. |

- If you only need to **show the app**, Amplify Hosting alone is enough — login just stays off.
- If you want **login/sync on AWS**, you add a backend (Cognito for auth + an API + a database).
  The recommended one for this app is **serverless**, because progress is a single JSON document
  per user, which fits DynamoDB perfectly.

---

## 1. Front-end hosting (always) — AWS Amplify Hosting

```
GitHub (Chandu6702/cadence) --push--> AWS Amplify Hosting --build--> static out/
                                              │
                                              ▼
                                     Amazon CloudFront (CDN + HTTPS) --> users
```

- **AWS Amplify Hosting** connects to the GitHub repo, runs `npm run build` (with
  `output: "export"` in `next.config.ts`), and serves the static `out/` folder. Under the hood it
  uses **Amazon S3** (storage) + **Amazon CloudFront** (global CDN + TLS) + a managed build
  pipeline, with CI on every push to `main`.
- Custom domain: **Route 53** (DNS) + **AWS Certificate Manager / ACM** (TLS, auto-provisioned by
  Amplify).

**Amplify build spec (`amplify.yml`):**
```yaml
version: 1
frontend:
  phases:
    preBuild:  { commands: [npm ci] }
    build:     { commands: [npm run build] }
  artifacts:
    baseDirectory: out
    files: ['**/*']
  cache:
    paths: [node_modules/**/*]
```

That is the entire architecture if you don't need accounts. Everything below adds login + sync.

---

## 2. Backend — RECOMMENDED: serverless, fully AWS (replaces Supabase)

Progress is one JSON blob per user, so a serverless + DynamoDB design is the simplest, cheapest,
and most scalable fit.

```
Browser (static app on Amplify / CloudFront)
   │                                   │
   │ sign in / tokens                  │ GET & PUT /progress   (Authorization: Bearer <JWT>)
   ▼                                   ▼
Amazon Cognito                   Amazon API Gateway (HTTP API)
(user pool, hosted sign-in,          │   └─ JWT authorizer validates the Cognito token
 issues JWTs)                        ▼
                               AWS Lambda  (Node/TS handler: read/merge/write)
                                     │
                                     ▼
                               Amazon DynamoDB
                               table "progress":  PK = userId (JWT sub),  attr = data (JSON), updatedAt
```

**Services and what each does**

| Service | Role |
|---|---|
| **Amazon Cognito** (User Pool) | Sign-up / sign-in, email verification, issues JWT access tokens. Replaces Supabase Auth. Has a hosted UI, or use AWS Amplify's `Auth` client library. |
| **Amazon API Gateway** (HTTP API) | Public HTTPS endpoint `/progress`. A built-in **JWT authorizer** verifies the Cognito token before the request reaches Lambda — no auth code in the function. |
| **AWS Lambda** | Tiny handler: on `GET`, read the user's item; on `PUT`, merge + write. The user id comes from the verified JWT (`event.requestContext.authorizer.jwt.claims.sub`), so a user can only touch their own row. |
| **Amazon DynamoDB** | One item per user, partition key = `userId`, a `data` attribute holding the progress JSON. Serverless, pay-per-request, scales to zero. Replaces Supabase Postgres + RLS (isolation is enforced by keying on the JWT `sub`). |
| **Amazon CloudWatch** | Lambda/API logs, metrics, alarms. **AWS X-Ray** optional for tracing. |
| **AWS IAM** | Least-privilege: the Lambda's execution role may only read/write that one DynamoDB table. |
| **AWS SAM / CDK** (or Terraform) | Infrastructure as code — define Cognito, API Gateway, Lambda, DynamoDB in one template, deploy reproducibly. |

**Client changes (small):** swap `src/lib/supabase.ts` + `src/lib/progressSync.ts` for the
AWS Amplify `Auth` client (Cognito) and `fetch` calls to the API Gateway URL. Env vars become the
Cognito User Pool ID / client ID and the API base URL. **The merge logic
(`mergeProgress` in `src/state/progress.ts`) is reused unchanged** — it doesn't care what the
backend is.

**Why this over RDS:** no relational queries are needed (it's a per-user document), so DynamoDB is
cheaper, zero-ops, and scales automatically. Choose RDS only if you later add features that need
SQL (leaderboards, cross-user analytics) — see the Spring Boot option.

---

## 3. Backend — ALTERNATIVE: Java / Spring Boot on AWS (SE target stack)

The version worth being able to whiteboard, since the career target is **Java + Spring Boot +
AWS**. Same front-end and same Cognito auth; the API is a Spring Boot service you own, backed by a
relational DB.

```
Browser (static app, CloudFront)
   │ Cognito JWT in Authorization header
   ▼
CloudFront ──► Application Load Balancer ──► ECS Fargate
                                              (Spring Boot container:
                                               GET/PUT /api/progress,
                                               Spring Security validates the Cognito JWT via
                                               spring-boot-starter-oauth2-resource-server)
                                                 │  Spring Data JPA
                                                 ▼
                                           Amazon RDS (PostgreSQL)
                                           progress(user_id PK, data jsonb, updated_at)
```

| Service | Role |
|---|---|
| **Amazon Cognito** | Auth provider; issues JWTs. Spring validates them as an OAuth2 **resource server** (common interview topic). |
| **ECS on AWS Fargate** | Runs the Spring Boot container, no servers to manage. (Alternatives: **Elastic Beanstalk** for an "upload a jar" story; **EKS** if the role wants Kubernetes.) |
| **Application Load Balancer** | Routes HTTPS to the Fargate tasks; health checks. |
| **Amazon RDS (PostgreSQL)** | The DB. The schema in `SUPABASE_SETUP.md` is plain Postgres (`jsonb` column included), so it ports directly. |
| **Amazon ECR** | Stores the built Docker image that Fargate pulls. |
| **Amazon VPC** | Public subnets (ALB) + private subnets (Fargate, RDS); security groups so only the ALB reaches tasks and only tasks reach RDS. |
| **AWS Secrets Manager / SSM Parameter Store** | DB credentials, not in code. |
| **CloudWatch** (+ X-Ray) | Logs, metrics, alarms, tracing. |
| **Route 53 + ACM** | DNS + TLS. |
| **CodePipeline / GitHub Actions + ECR** | CI/CD: build image → push to ECR → deploy to ECS. |
| **Terraform / AWS CDK** | Infra as code. |

Heavier than the app needs — its value is demonstrating the full picture (VPC, ALB, Fargate, RDS,
Cognito + JWT resource server, ECR, IaC) for a system-design conversation.

---

## Service summary (all AWS)

| Layer | Serverless path (recommended) | Spring Boot path |
|---|---|---|
| Front-end hosting | Amplify Hosting (S3 + CloudFront) | Amplify Hosting (S3 + CloudFront) |
| Auth | Amazon Cognito | Amazon Cognito |
| API | API Gateway (HTTP API) + Lambda | ECS Fargate + ALB (Spring Boot) |
| Database | DynamoDB | RDS (PostgreSQL) |
| Image registry | — | ECR |
| Networking | (managed) | VPC + subnets + security groups |
| Secrets | (env / SSM) | Secrets Manager / SSM |
| Observability | CloudWatch (+ X-Ray) | CloudWatch (+ X-Ray) |
| DNS / TLS | Route 53 + ACM | Route 53 + ACM |
| CI/CD | Amplify + SAM/CDK | CodePipeline / GitHub Actions + ECR |
| IaC | AWS SAM / CDK / Terraform | Terraform / CDK |

**Free tier (12 months):** Cognito (50k MAU, always free), Lambda (1M req/mo, always free),
DynamoDB (25 GB + 25 RCU/WCU, always free), API Gateway (1M req/mo for 12 mo), Amplify build +
hosting free tier. RDS/Fargate have 12-month free allowances but can incur small cost if left
running — use them for a demo, then stop the cluster.

---

## How to talk about it in an interview

- **"How is it deployed?"** — Static Next.js export on a CDN. On AWS that's **Amplify Hosting**
  (S3 + CloudFront). Progress is local-first; cloud sync is optional.
- **"How would you do accounts/sync on AWS without a BaaS?"** — **Cognito** for auth, an
  **API Gateway HTTP API** with a JWT authorizer, a **Lambda** that reads/merges/writes, and
  **DynamoDB** keyed on the user's JWT `sub` (that's the isolation — a user can only reach their
  own item). Serverless, scales to zero, pay-per-request.
- **"And in Java?"** — Same Cognito auth; a **Spring Boot** API on **ECS Fargate** behind an
  **ALB**, validating the Cognito JWT as an OAuth2 resource server, persisting to **RDS Postgres**
  with Spring Data JPA. Build → **ECR** → ECS via CodePipeline.
- **"Why DynamoDB over RDS?"** — Progress is a single document per user; no joins or cross-user
  queries, so a key-value store is cheaper and zero-ops. I'd move to RDS only when a feature needs
  SQL (leaderboards, analytics).
- **"How does sync avoid data loss across devices?"** — Local-first writes, then a conservative
  merge on sign-in: bests take the max, collections union, the practice log keeps the busier day
  (`mergeProgress` in `src/state/progress.ts`). This stays identical no matter which backend runs.
- **Trade-off:** Serverless = least ops, fastest, cheapest for this shape of data. Spring Boot +
  RDS = more control and a relational model, at the cost of VPC/ALB/cluster management — the right
  call once the data model grows beyond one document per user.

---

## Bottom line

- **To ship the resume project:** Amplify Hosting is enough on its own (login off), or use the
  Render path in `DEPLOYMENT.md`.
- **To make it full-stack on AWS with login:** add **Cognito + API Gateway + Lambda + DynamoDB**
  (serverless) — no Supabase anywhere. The **Spring Boot + ECS + RDS** variant is the one aligned
  with the Java/AWS interview target; keep it ready to whiteboard.
