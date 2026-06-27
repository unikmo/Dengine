# Event Engine — Setup Guide

## What you need (all free)
1. **GitHub account** — github.com
2. **Vercel account** — vercel.com (sign in with GitHub)
3. **Supabase account** — supabase.com
4. **Anthropic API key** — console.anthropic.com

---

## Step 1 — GitHub Setup

1. Go to **github.com** and create an account if you don't have one
2. Click the **+** button (top right) → **New repository**
3. Name it: `event-engine`
4. Set to **Private**
5. Click **Create repository**
6. Follow the instructions to push this code:

```bash
git init
git add .
git commit -m "Initial Event Engine"
git remote add origin https://github.com/YOUR-USERNAME/event-engine.git
git push -u origin main
```

---

## Step 2 — Supabase Database

1. Go to **supabase.com** → New Project
2. Name: `event-engine`
3. Set a database password (save it)
4. Choose the region closest to you
5. Wait ~2 minutes for it to spin up

**Run the schema:**
1. In Supabase → click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run**

**Seed the data:**
1. Click **New query** again
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run** (this inserts 267 events and 486 tasks)

**Get your API keys:**
1. Supabase → **Settings** (gear icon) → **API**
2. Copy **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 3 — Anthropic API Key

1. Go to **console.anthropic.com**
2. Sign in → **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

---

## Step 4 — Vercel Deployment

1. Go to **vercel.com** → Sign in with GitHub
2. Click **New Project** → Import `event-engine` from GitHub
3. Click **Environment Variables** — add these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

4. Click **Deploy**
5. Wait ~2 minutes — your app is live! 🎉

Vercel gives you a URL like: `event-engine-abc123.vercel.app`

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run the development server
npm run dev

# Open http://localhost:3000
```

---

## What's included

- **354 event types** across 27 categories
- **1,385 pre-built tasks** for 79 events  
- **AI generation** for any event via Anthropic API
- **Volunteer task claiming** — tap to claim any task
- **Budget levels** — 5 levels from Cost-Efficient to Extravagant
- **Smart intake** — 5 questions shape the blueprint
- **Share links** — share your blueprint with volunteers
- **Print-ready** output

## Project Structure

```
app/
  page.tsx              → Homepage with search
  events/[id]/page.tsx  → Event detail + blueprint generator
  browse/[category]/    → Category browse
  custom/page.tsx       → AI custom event builder
  api/generate/         → Anthropic API route
lib/
  supabase.ts           → Database client
  anthropic.ts          → AI generation
types/
  index.ts              → TypeScript types
supabase/
  schema.sql            → Database schema
  seed.sql              → 267 events + tasks
```
