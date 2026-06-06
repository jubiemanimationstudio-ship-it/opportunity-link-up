import type { Metadata } from "next";
import Link from "next/link";
import { affiliateResources } from "@/lib/data/meta";

export const metadata: Metadata = { title: "Affiliate Disclosure" };

export default function DisclosurePage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">Affiliate Disclosure</h1>
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <p>In accordance with the FTC and ASA guidelines, we want to be transparent about how {`The Opportunity Link-up`} makes money.</p>

          <h2>Affiliate links</h2>
          <p>Some of the links on our Resources page are “affiliate links.” If you sign up or make a purchase through one of these links, we may receive a small commission at <strong>no extra cost to you</strong>. This helps keep Link-Up free for readers.</p>

          <h2>Our promise</h2>
          <p>We only feature tools and resources we have personally vetted and would recommend regardless of the commission. Affiliate partnerships never influence which opportunities we publish, our editorial tone, or our rankings.</p>

          <h2>Current partners</h2>
          <ul>
            {affiliateResources.map((r) => (
              <li key={r.id}>
                <strong>{r.title}</strong> — {r.category} {r.badge ? `(${r.badge})` : ""}
              </li>
            ))}
          </ul>

          <h2>Display advertising</h2>
          <p>We may display contextual advertising (Google AdSense or similar). These ads are clearly separated from editorial content and labelled \u201cSponsored\u201d. We do not run retargeting ads, pop-ups, or interstitials.</p>

          <p className="text-sm text-ink-mute dark:text-slate-500">Questions? <Link href="/contact" className="text-brand link-underline dark:text-accent">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
}
