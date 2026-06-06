"use client";

import { useEffect, useState } from "react";

type ConsentValue = "accept" | "reject" | "custom";
interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: number;
}

const STORAGE_KEY = "tol_consent_v1";

function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function writeConsent(c: ConsentState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  const maxAge = 60 * 60 * 24 * 180;
  const v = encodeURIComponent(JSON.stringify(c));
  document.cookie = `tol_consent=${v}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("tol:consent", { detail: c }));
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function decide(v: ConsentValue) {
    const c: ConsentState = {
      necessary: true,
      analytics: v === "accept" ? true : v === "custom" ? analytics : false,
      marketing: v === "accept" ? true : v === "custom" ? marketing : false,
      decidedAt: Date.now()
    };
    writeConsent(c);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie preferences" className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-accent/10 dark:text-accent">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.5a9 9 0 1 1-9-9c.5 0 1 .04 1.5.13a3 3 0 0 0 4.34 4.34c.09.5.13 1 .13 1.5Z" />
                <circle cx="8.5" cy="10.5" r="1" />
                <circle cx="12" cy="14" r="1" />
                <circle cx="15.5" cy="10.5" r="1" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-base font-bold text-ink dark:text-white">We respect your privacy</h2>
              <p className="mt-1 text-sm text-ink-mute dark:text-slate-300">
                We use essential cookies to keep the site running (security, session, preferences). With your consent we also use analytics cookies to understand how the site is used, and marketing cookies to measure ad performance. You can change your choice anytime in the footer.
              </p>
              <p className="mt-2 text-[11px] text-ink-mute/80 dark:text-slate-500">
                Read our <a href="/cookies" className="link-underline font-semibold text-brand dark:text-accent">cookie policy</a> and <a href="/privacy" className="link-underline font-semibold text-brand dark:text-accent">privacy policy</a>.
              </p>

              {showDetails && (
                <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/50">
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked readOnly className="mt-0.5 h-4 w-4 rounded text-brand" />
                    <span>
                      <strong className="text-ink dark:text-white">Strictly necessary</strong>
                      <span className="ml-1 text-ink-mute dark:text-slate-400">— always on (session, CSRF, theme)</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-brand" />
                    <span>
                      <strong className="text-ink dark:text-white">Analytics</strong>
                      <span className="ml-1 text-ink-mute dark:text-slate-400">— page views, search terms, referrers (anonymised)</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-brand" />
                    <span>
                      <strong className="text-ink dark:text-white">Marketing</strong>
                      <span className="ml-1 text-ink-mute dark:text-slate-400">— ad performance, retargeting pixels (AdSense, etc.)</span>
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={() => decide("accept")} className="btn-primary text-sm">Accept all</button>
                <button onClick={() => decide("reject")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">Reject non-essential</button>
                {showDetails ? (
                  <button onClick={() => decide("custom")} className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/15 dark:bg-accent/10 dark:text-accent dark:hover:bg-accent/20">Save my choices</button>
                ) : (
                  <button onClick={() => setShowDetails(true)} className="text-xs font-semibold text-ink-mute hover:text-ink dark:text-slate-400 dark:hover:text-white">Customise →</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  const c = readConsent();
  return !!c?.analytics;
}

export function hasMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  const c = readConsent();
  return !!c?.marketing;
}
