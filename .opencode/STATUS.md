# Project Status — Where We Stopped

**Last session:** security hardening + admin settings + Lighthouse audit

## Current state
- ✅ **Repo live:** https://github.com/jubiemanimationstudio-ship-it/opportunity-link-up
- ✅ **Build:** green (all 31 opportunity pages prerender)
- ✅ **Dev server:** http://localhost:3000 (run with `npm run dev` in `C:\Users\Lenovo\Downloads\hithigh`)
- ✅ **Tracking:** all event kinds wired in via `src/lib/track.ts` (view, apply, share, save, newsletter, contact, whatsapp, search, donate) + search result count
- ✅ **Cookies:** GDPR consent banner built, `hasAnalyticsConsent()` respected
- ✅ **Real opportunities:** 22 verified 2026 cycles in `src/lib/data/real-2026.ts`, merged with legacy → 31 total
- ✅ **Admin:** login + password recovery (2-factor: email code + passphrase) + session management + change-password + account settings
- ✅ **Security headers + RLS schema** done
- ✅ **Input sanitization:** all fields sanitized via `src/lib/sanitize.ts` (XSS, HTML injection, URL validation). Contact form XSS fixed. SQL injection confirmed safe (Supabase parameterized queries).
- ✅ **Admin settings page:** `/admin/settings` — set admin email, update recovery passphrase, change password
- ✅ **Image upload:** click-to-upload + drag-and-drop on new post form (`/api/admin/upload` saves to `public/uploads/`)
- ✅ **Admin form dark mode:** `.input` and `.label` CSS classes added (were completely missing)
- ✅ **Back button:** added to opportunity detail pages
- ✅ **Lighthouse scores:** Performance 41 mobile / 70 desktop, Accessibility 97, Best Practices 100, SEO 100
- ✅ **Email verification:** Resend installed, `/api/admin/recover/request` sends 6-digit code, `/api/admin/recover/verify` verifies code + passphrase + new password
- ⏳ **Vercel deploy:** not done yet
- ⏳ **Supabase:** schema.sql written, not yet run on a project
- ⏳ **Domain opportunitylinkup.com:** not bought

## To resume tomorrow
Say: **"hi, where did we stop?"** and I should:
1. Read this file
2. Suggest we either deploy to Vercel, polish UI, or do mobile responsiveness pass

## Useful commands
```bash
cd C:\Users\Lenovo\Downloads\hithigh
npm run dev        # local server
npm run build      # production build
git add . && git commit -m "..." && git push
```

## Admin login (dev)
URL: http://localhost:3000/admin/login
Password: `linkup-admin-2026`
(change via /admin/settings after first login — set email + passphrase there)

## Open todos in priority order
1. **A)** Connect Vercel — user picks the option, I guide
2. **B)** Mobile responsiveness audit on iPhone SE / 14 / iPad
3. **C)** User buys `opportunitylinkup.com` + follows `VERCEL_SETUP.md`
4. **D)** User creates Supabase project + runs `supabase/schema.sql`
5. **E)** Sentry error tracking
6. **F)** AdSense application (after content is live + traffic)
7. **G)** Google Search Console + sitemap submit
8. **H)** Uptime monitoring (UptimeRobot free tier)

## Key files changed this session
- `src/lib/sanitize.ts` (new) — HTML/URL/tag/slug sanitization
- `src/lib/email-verification.ts` (new) — 6-digit code store with expiry + rate limiting
- `src/lib/admin-secrets.ts` — added `adminEmail` field, `getAdminEmail()`, `setAdminEmail()`, `rotateRecoveryPassphrase()`
- `src/lib/data/store.ts` — all fields sanitized on create/update
- `src/app/api/admin/recover/request/route.ts` (new) — sends verification code via Resend (or console in dev)
- `src/app/api/admin/recover/verify/route.ts` (new) — verifies code + passphrase + new password
- `src/app/api/admin/settings/route.ts` (new) — GET/PATCH admin email and recovery passphrase
- `src/app/api/admin/upload/route.ts` (new) — image upload to public/uploads/
- `src/app/admin/recover/page.tsx` — rebuilt with 2-step flow (email → code + passphrase + new password)
- `src/app/admin/(panel)/settings/page.tsx` (new) — email, passphrase, password management
- `src/components/admin/OpportunityEditor.tsx` — wired ImageUpload for cover image
- `src/components/admin/ImageUpload.tsx` (new) — drag-drop + click upload with preview
- `src/components/ui/BackButton.tsx` (new) — history.back() button for detail pages
- `src/app/globals.css` — added `.input`, `.label`, select styling, dark mode support
- `src/app/opportunities/[slug]/page.tsx` — added BackButton
- `src/components/home/TrustBar.tsx` — fixed dark mode contrast (slate-400 → slate-300)
- `src/components/ui/Logo.tsx` — fixed aria-label mismatch
- `src/components/opportunity/SearchResultsTracker.tsx` (new) — fires search event with result count
- `src/app/search/page.tsx` — wired SearchResultsTracker
- `src/app/api/contact/route.ts` — fixed XSS (escapeHtml + sanitizeTextField)

## Recent commits
- `4ad1ce3` — Wire /api/track events into client interactions
- `16a4c7c` — Initial commit: The Opportunity Link-up platform
