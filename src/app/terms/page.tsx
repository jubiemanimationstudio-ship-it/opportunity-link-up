import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">Terms of Use</h1>
          <p className="mt-2 text-sm text-ink-mute dark:text-slate-400">By using {site.name}, you agree to these terms.</p>
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <h2>1. What we do</h2>
          <p>{site.name} is a free, public discovery platform. We surface opportunities (scholarships, internships, jobs, grants, fellowships, causes) and link to their official source. We do not run the application process.</p>

          <h2>2. No guarantees</h2>
          <p>We work hard to verify every opportunity, but we cannot guarantee the accuracy, availability, or outcome of any listing. Always confirm on the official source before applying or paying anything.</p>

          <h2>3. No fees</h2>
          <p>Link-Up is free to use. We will never charge you a fee to apply to an opportunity surfaced on our platform. If a third-party listing asks for payment, treat it as a red flag and report it to us.</p>

          <h2>4. Acceptable use</h2>
          <ul>
            <li>Don’t scrape or republish our content without permission.</li>
            <li>Don’t impersonate us or use our brand to solicit money.</li>
            <li>Don\u2019t submit opportunities you know to be fraudulent.</li>
          </ul>

          <h2>5. Limitation of liability</h2>
          <p>Link-Up is provided \u201cas is\u201d. To the maximum extent permitted by law, we are not liable for any losses arising from your use of the platform, including but not limited to lost applications, incorrect deadlines, or third-party conduct.</p>

          <h2>6. Changes</h2>
          <p>We may update these terms from time to time. Continued use after a change means you accept the new terms.</p>

          <p className="text-sm text-ink-mute dark:text-slate-500">Questions? <Link href="/contact" className="text-brand link-underline dark:text-accent">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
}
