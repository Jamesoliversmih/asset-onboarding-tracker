# Asset & Onboarding Tracker

A full-stack internal tool for tracking employee onboarding, offboarding, and IT asset assignments — built with Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

This project is designed to mirror real IT support work: creating accounts, assigning licenses and hardware, running onboarding/offboarding checklists, and reclaiming assets when someone leaves.

## Tech stack

- **Next.js 14** (App Router, Server Actions — no separate API layer needed)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** via **Prisma ORM**

## Getting started

### 1. Get a free Postgres database

Go to [neon.tech](https://neon.tech), sign up free (no credit card), create a project, and copy the connection string it gives you.

### 2. Configure your environment

```bash
cp .env.example .env
```
Paste your Neon connection string into `.env` as `DATABASE_URL`.

### 3. Install dependencies and set up the database

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

The seed script creates 4 sample employees (one in each status: onboarding, active, offboarding, offboarded) and 7 sample assets, so the app has realistic data from the start.

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## What it does

- **Dashboard** — headline stats (total employees, onboarding/active/offboarding counts, assets assigned/available) and a "needs attention" list of anyone mid-onboarding or mid-offboarding.
- **Employees** — list all employees with status; add a new employee, which automatically generates a 6-step onboarding checklist (account creation, MFA, licenses, drive access, hardware).
- **Employee detail** — check off onboarding tasks one by one; once complete, mark the employee active. Later, start offboarding (generates a separate offboarding checklist), and once that's complete, the employee is marked offboarded and their assets are automatically freed up.
- **Assets** — add laptops, monitors, phones, and licenses; assign them to any active/onboarding employee, or unassign to return them to the available pool.

## Project structure

```
app/
  page.tsx                  — dashboard
  employees/page.tsx         — employee list
  employees/new/page.tsx     — add employee form
  employees/[id]/page.tsx    — employee detail + checklist
  assets/page.tsx            — asset list + add/assign
lib/
  prisma.ts                  — Prisma client singleton
  actions.ts                 — all server actions (create, toggle, assign, etc.)
  tasks.ts                   — default onboarding/offboarding checklist templates
prisma/
  schema.prisma              — data model (Employee, Asset, Task)
  seed.ts                    — sample data
components/
  Sidebar.tsx
  StatusBadge.tsx
```

## Deploying

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com) — it auto-detects Next.js.
3. In Vercel's project settings → Environment Variables, add `DATABASE_URL` with your Neon connection string.
4. Deploy. Vercel runs `next build` automatically; Prisma's client is generated as part of `npm install` via its `postinstall` script.

## Notes

- There's no authentication in this version — anyone with the URL can create/edit data. That's fine for a portfolio demo; a real deployment would add auth (e.g. NextAuth) in front of it.
- All mutations use Next.js **Server Actions** — forms `POST` directly to server-side functions with no separate REST/GraphQL API layer, which is the modern Next.js pattern worth highlighting when you talk about this project.
