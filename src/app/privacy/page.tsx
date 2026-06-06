import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-mute dark:text-slate-400">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <h2>Who we are</h2>
          <p>{site.name} (“Link-Up”, “we”, “us”) is an independent opportunity-discovery platform operated from {site.url}. You can contact us at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Newsletter email:</strong> when you subscribe, we store your email in our email service provider to send you opportunity alerts.</li>
            <li><strong>Contact form submissions:</strong> name, email and message when you reach out.</li>
            <li><strong>Analytics:</strong> aggregated, anonymised page views, referrers and country (via a privacy-friendly analytics tool).</li>
            <li><strong>Cookies:</strong> a small set of first-party cookies for theme preference and admin login. No advertising cookies without your consent.</li>
          </ul>

          <h2>What we never do</h2>
          <ul>
            <li>We never sell your data.</li>
            <li>We never share your email with third parties without consent.</li>
            <li>We never run third-party retargeting ads.</li>
          </ul>

          <h2>Your rights</h2>
          <p>You can request export or deletion of your data at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>. We respond within 30 days.</p>

          <h2>Updates to this policy</h2>
          <p>If we make material changes, we will post a notice on the homepage for at least 14 days. The “Last updated” date at the top of this page always reflects the latest version.</p>

          <p className="text-sm text-ink-mute dark:text-slate-500">Questions? <Link href="/contact" className="text-brand link-underline dark:text-accent">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
}
