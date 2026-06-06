# Supabase Setup — Optional Upgrade

The site works **without Supabase** thanks to a built-in in-memory store (`src/lib/data/store.ts`). Admin changes (create, edit, delete, bulk) persist for the life of the dev server, so you can build, test, and demo the full admin flow right now.

**In-memory mode is the default.** You'll see an amber banner at the top of the admin panel reminding you.

**Set up Supabase when you want changes to survive server restarts, work across multiple servers, and be visible on a live deploy.** This is required before going to production.

## What you'll get
- Persistent storage of opportunities (no reset on restart)
- Multi-server ready (works on Vercel + local)
- Row-level security (public reads only published posts; admin writes go through service role)
- Future-ready for contact submissions, audit logs, sessions, AI-saved drafts

## Time needed
~10–15 minutes if you've never used Supabase before.

## Step 1 — Create a project
1. Go to https://supabase.com and sign in (free tier is fine — 500MB DB, 1GB storage)
2. Click **"New Project"**
3. Name it `opportunity-linkup` (or whatever you prefer)
4. Pick the **closest region** to your audience
5. Set a strong **database password** (save it somewhere safe)
6. Click **Create new project** — wait ~1 minute for it to provision

## Step 2 — Run the schema
1. In your Supabase dashboard, open **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` in this project
4. Copy the entire contents and paste into the SQL editor
5. Click **Run** (or Ctrl+Enter)
6. You should see: `Success. No rows returned` — that means the table, indexes, policies and trigger were created

## Step 3 — (Optional) Seed the sample data
If you want the 12 sample opportunities pre-loaded into Supabase:
1. Open `supabase/seed.sql` in this project
2. Copy and run it in the SQL editor the same way

If you skip this, the sample data will still appear in the app (it falls back to the in-memory sample data) — but the next admin edit won't be reflected in Supabase until you create something new.

## Step 4 — Get your API keys
1. In Supabase dashboard, go to **Settings → API** (left sidebar)
2. Copy these three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this secret, never expose to the browser

## Step 5 — Add to your local environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` in your editor
3. Paste the three values from Step 4
4. Save the file
5. Restart the dev server: stop `next dev` and start it again

The amber banner on the admin panel will disappear once Supabase is configured, and the dashboard will show a green "Supabase connected" indicator.

## Step 6 — Verify
1. Sign in to `/admin/login`
2. Create a new opportunity
3. Refresh the page — the new post should still be there
4. Stop and restart `next dev` — the new post should STILL be there (that's the proof it's persisted in Supabase, not just in memory)

## For production deploy (Vercel etc.)
Add the same 3 environment variables in your Vercel project settings:
- Settings → Environment Variables
- Paste `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Apply to Production (and Preview if you want it on PRs)
- Redeploy

## Troubleshooting
**"permission denied for table opportunities"** — RLS is enabled and your service role key isn't being used. Check that `SUPABASE_SERVICE_ROLE_KEY` is set, not just the anon key.

**"Invalid API key"** — You copied the wrong key. The `service_role` key is on a separate line from `anon` in the Supabase dashboard. Get a new one if you're unsure.

**Banner still shows in admin** — Restart the dev server after saving `.env.local`. Next.js doesn't hot-reload env vars.

**Seed SQL fails with "duplicate key"** — You've run the seed twice. Either skip seeding (admin create will still work) or truncate the table first: `truncate public.opportunities cascade;`

## What stays in-memory even with Supabase
- **Audit log** (`src/lib/security.ts`) — uses globalThis, resets on restart
- **Login lockout** — same, resets on restart
- **Admin session** — stored in HttpOnly cookie, expires when you log out

These are fine for production because:
- Audit log is for your eyes only; the real "important events" should be in Supabase in a future iteration
- Lockout is for brute-force protection; losing it on restart just means an attacker has a fresh attempt window after each deploy (acceptable)
- Session cookies travel with the browser, so they're not really "in-memory"

## Future iterations
When you outgrow the in-memory audit log, just add a `audit_log` table to `supabase/schema.sql` and update `src/lib/security.ts` to write to it.
