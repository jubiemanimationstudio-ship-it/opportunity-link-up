# Vercel + Domain Setup Guide
## opportunitylinkup.com → The Opportunity Link-up

This guide takes you from `git push` to a live, secured site on your custom domain in under 30 minutes.

---

## 1. Buy your domain (5–10 min)

Recommended registrars (cheapest first, all support Vercel DNS):

| Registrar | .com price/yr | DNS hosting | Notes |
|---|---|---|---|
| **Namecheap** | ~$9 | free | cheapest, easy transfer |
| **Cloudflare** | ~$10 | free | best DDoS protection |
| **Porkbun** | ~$10 | free | clean UI |
| **GoDaddy** | ~$15 | free | support is good |

**Steps:**
1. Go to your registrar, search `opportunitylinkup.com`
2. Add to cart, complete purchase (~$10 for 1 year)
3. Enable WHOIS privacy (free at all 4 above)
4. Don't bother configuring DNS yet — Vercel will tell you what to add

---

## 2. Push your code to GitHub (5 min)

```bash
# In your project folder (C:\Users\Lenovo\Downloads\hithigh)
cd C:\Users\Lenovo\Downloads\hithigh
git init
git add .
git commit -m "Initial commit: Opportunity Link-up v1"
# Create a new repo at https://github.com/new (private is fine)
git remote add origin https://github.com/YOUR_USERNAME/opportunity-link-up.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy to Vercel (3 min)

1. Go to https://vercel.com → **Sign Up** with GitHub
2. Click **Add New… → Project**
3. Select your `opportunity-link-up` repo
4. Vercel auto-detects Next.js. Leave all settings default.
5. **DON'T click Deploy yet** — first add env vars in step 4.

---

## 4. Add Environment Variables in Vercel (5 min)

In the project setup screen (or after deploy, in **Settings → Environment Variables**):

### Required
| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://opportunitylinkup.com` | used for canonical, OG, sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | from supabase.co dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` long JWT | **server-side only**, never expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` long JWT | safe to expose (RLS protects) |
| `ADMIN_PASSWORD` | your-strong-password-12+chars | the password for /admin/login |

### Optional
| Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | from resend.com, for contact form email |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` | only after AdSense approves |
| `NEXT_PUBLIC_WHATSAPP_INVITE` | `https://chat.whatsapp.com/XXXXX` | link in WhatsApp FAB |
| `ANALYTICS_WEBHOOK_URL` | `https://plausible.io/api/event` | for real analytics |
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXXXXX` | Google Analytics 4 ID |

**Important:**
- Tick **Production** for all of them
- For `SUPABASE_SERVICE_ROLE_KEY`, do **NOT** tick "available to client" — Vercel defaults to server-only, keep it that way
- Click **Save** after each

Then click **Deploy**. Wait ~2 min. Your site is now live at `your-project.vercel.app`.

---

## 5. Add the custom domain (5 min)

1. In Vercel: **Settings → Domains**
2. Type `opportunitylinkup.com` → click **Add**
3. Vercel will show you DNS records to add at your registrar. Typically:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
4. Go to your registrar's DNS panel and add these records
5. Wait 2–10 minutes for DNS to propagate
6. Vercel auto-issues a free SSL certificate (Let's Encrypt)
7. Add `www.opportunitylinkup.com` as well, redirect to apex

---

## 6. Post-deploy verification (5 min)

Visit `https://opportunitylinkup.com` and check:

- [ ] Homepage loads, no console errors
- [ ] Theme toggle works (top right)
- [ ] Click any opportunity → detail page loads
- [ ] Try the search bar
- [ ] Submit the contact form → message appears in admin
- [ ] `/admin/login` → log in with `ADMIN_PASSWORD`
- [ ] Dashboard shows zeros (real-time, not demo data)
- [ ] Edit an opportunity, save, refresh home → it shows
- [ ] Run `curl -I https://opportunitylinkup.com` → should see `strict-transport-security` header

If anything is broken, check Vercel **Logs** (top nav).

---

## 7. (Optional) Plausible analytics (free, GDPR-friendly)

Plausible is the best lightweight analytics for opportunity sites:

1. Sign up at https://plausible.io (free trial, then $9/mo)
2. Add `opportunitylinkup.com` as a site
3. In Vercel, add env: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=opportunitylinkup.com`
4. Done — dashboard works at https://plausible.io/opportunitylinkup.com

No cookie banner needed for Plausible (no cookies, no PII).

---

## 8. (Later) Apply for Google AdSense

Don't do this until:
- You have 20+ published opportunities
- Site is at least 2 weeks old
- You have ~100+ organic visitors/day (use Plausible to track)

Then: https://www.google.com/adsense → sign up → add site → wait for approval (~2 weeks).

---

## Cost summary

| Item | Cost/yr |
|---|---|
| Domain `opportunitylinkup.com` | ~$10 |
| Vercel hosting (Hobby tier) | $0 |
| Supabase (Free tier: 500MB DB, 50k MAU) | $0 |
| Resend email (3k/mo free) | $0 |
| **Total** | **~$10/yr** |
