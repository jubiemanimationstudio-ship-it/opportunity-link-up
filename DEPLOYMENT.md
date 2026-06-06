# Deployment Guide \u2014 The Opportunity Link-up

## 0. Prerequisites (free tiers, ~$0\u2013$15/yr)

- **Domain** ($8\u201312/yr) \u2014 buy `opportunitylinkup.com` on Namecheap / Cloudflare / Porkbun
- **Vercel** account (free) \u2014 hosts the site, auto-deploys from GitHub
- **Supabase** account (free) \u2014 Postgres database + auth + storage
- **Resend** account (free up to 3k emails/mo) \u2014 newsletter
- **GitHub** account \u2014 to host the code

## 1. Push the code to GitHub

```bash
git init
git add .
git commit -m "Initial commit \u2014 Opportunity Link-up"
gh repo create opportunity-linkup --public --source=. --remote=origin --push
```

## 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variables (see below)
4. Click **Deploy** \u2014 takes ~90 seconds
5. Once deployed, Vercel gives you a `*.vercel.app` URL

## 3. Add environment variables on Vercel

Project Settings \u2192 Environment Variables. Add:

| Variable | Value | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://opportunitylinkup.com` | Yes |
| `ADMIN_PASSWORD` | A strong password (use a password manager) | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase dashboard | When ready to persist |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase dashboard | When ready to persist |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard (server-only) | When ready to persist |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXX` | When AdSense approved |
| `RESEND_API_KEY` | From resend.com | For newsletter |
| `CONTACT_TO_EMAIL` | `hello@opportunitylinkup.com` | For contact form |
| `CONTACT_FROM_EMAIL` | `Link-Up <noreply@opportunitylinkup.com>` | For contact form |
| `NEXT_PUBLIC_WHATSAPP_INVITE` | Your real WhatsApp group invite link | Yes |
| `STRIPE_SECRET_KEY` / `PAYSTACK_SECRET_KEY` / `FLUTTERWAVE_SECRET_KEY` | If you add donations | Optional |

## 4. Connect the domain

1. Vercel \u2192 Project Settings \u2192 Domains \u2192 add `opportunitylinkup.com` and `www.opportunitylinkup.com`
2. Vercel shows you DNS records. Add them at your registrar:
   - `A` record: `76.76.21.21`
   - `CNAME` for `www`: `cname.vercel-dns.com`
3. Wait 5\u201330 min for DNS to propagate. Vercel auto-issues SSL.

## 5. Supabase setup (when ready)

1. Create a project at [supabase.com](https://supabase.com)
2. SQL editor \u2192 run this schema:

```sql
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  type text not null,
  organization text,
  region text,
  remote boolean default false,
  amount text,
  funding text,
  level text,
  deadline date,
  apply_url text,
  donate_url text,
  cover_image text,
  excerpt text,
  body text,
  tags text[],
  featured boolean default false,
  status text default 'published',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  country text,
  created_at timestamp with time zone default now()
);

create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  reason text,
  message text not null,
  created_at timestamp with time zone default now()
);

create table engagement_events (
  id uuid default gen_random_uuid() primary key,
  opportunity_id uuid references opportunities(id),
  kind text not null,
  country text,
  referrer text,
  created_at timestamp with time zone default now()
);
```

3. Copy the project URL and `anon` + `service_role` keys to your Vercel env vars.
4. Optional: enable Row Level Security and add policies. The current code uses the service role key for writes (server-side only), so RLS is optional for now.

## 6. AdSense

1. Sign up at [google.com/adsense](https://google.com/adsense) with `opportunitylinkup.com`
2. Once approved (usually 1\u20132 weeks), copy your `ca-pub-XXX` client ID
3. Add it as `NEXT_PUBLIC_ADSENSE_CLIENT` in Vercel
4. Redeploy. Ad slots are already placed (top of homepage, between list items, on detail page, on resources page).

**Important:** AdSense may flag the site if it detects auto-generated content. Our AI assistant (Stage 9) is admin-only by design \u2014 never publish AI-generated opportunities without human review.

## 7. Newsletter (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g. `mail.opportunitylinkup.com`)
3. Create an API key \u2192 add to Vercel env
4. The `/api/newsletter` and `/api/contact` routes are already wired.

## 8. Donations (optional)

To accept donations for the `donation` type opportunities, integrate one of:
- **Stripe** (global, takes ~2% + 30\u00a2)
- **Paystack** (Africa-focused, ~1.5% + \u20a100)
- **Flutterwave** (Pan-African, ~1.4%)

All three are supported via env vars. Wire the buttons in `OpportunityCard` and `OpportunitySidebar` to a checkout endpoint.

## 9. Launch checklist

- [ ] Custom domain connected and SSL active
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] `ADMIN_PASSWORD` set to a strong value
- [ ] `NEXT_PUBLIC_WHATSAPP_INVITE` set to real group link
- [ ] Submit sitemap to Google Search Console: `https://opportunitylinkup.com/sitemap.xml`
- [ ] Submit to Bing Webmaster Tools
- [ ] Test the contact form end-to-end
- [ ] Subscribe to your own newsletter to verify
- [ ] Sign in to `/admin` and change the password
- [ ] Apply for AdSense once you have ~10 published posts
- [ ] Share on your socials and WhatsApp community

## 10. Post-launch monitoring

- **Vercel Analytics** \u2014 built in, free
- **Search Console** \u2014 monitor indexing, click-through
- **Plausible / Umami** \u2014 privacy-friendly visitor analytics
- **Uptime** \u2014 [uptime.com](https://uptime.com) free tier, alerts via email

---

Built with Next.js 14, Tailwind CSS, Supabase, Resend. License: your choice.
