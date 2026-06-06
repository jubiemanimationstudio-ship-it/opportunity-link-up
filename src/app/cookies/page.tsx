import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">Cookie Policy</h1>
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <p>{site.name} uses a minimal set of cookies. We do not use advertising or retargeting cookies.</p>

          <h2>Cookies we set</h2>
          <ul>
            <li><strong>ha-theme</strong> — remembers your light/dark mode preference. Expires in 1 year. First-party only.</li>
            <li><strong>ha_admin</strong> — admin session cookie. HttpOnly, secure, expires when you log out.</li>
            <li><strong>Analytics cookies</strong> \u2014 set by our privacy-friendly analytics tool (Plausible or Umami) only after you accept. No cross-site tracking.</li>
          </ul>

          <h2>Managing cookies</h2>
          <p>You can clear all cookies in your browser settings at any time. Doing so will log you out of the admin area and reset your theme preference.</p>

          <p className="text-sm text-ink-mute dark:text-slate-500">Questions? <Link href="/contact" className="text-brand link-underline dark:text-accent">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
}
