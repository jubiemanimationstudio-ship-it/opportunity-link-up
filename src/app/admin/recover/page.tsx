"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { adminFetch, getCsrfCookie } from "@/components/admin/csrf";

export default function RecoverPage() {
  const router = useRouter();
  const search = useSearchParams();
  const fromQuery = search.get("csrf") || "";
  const [passphrase, setPassphrase] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [initialized, setInitialized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/password/recover")
      .then((r) => r.json())
      .then((j) => setInitialized(!!j.initialized))
      .catch(() => setInitialized(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const csrf = getCsrfCookie() || fromQuery;
      const res = await adminFetch("/api/admin/password/recover", {
        method: "POST",
        headers: { "x-csrf-token": csrf },
        body: JSON.stringify({ passphrase, newPassword })
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Recovery failed");
        return;
      }
      setOk(true);
      setTimeout(() => router.push("/admin"), 1500);
    } catch {
      setError("Recovery failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[rgb(9_17_33)]">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Account recovery</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white">Reset admin password</h1>
          <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
            Enter the recovery passphrase you set during initial setup to set a new password.
          </p>

          {initialized === false ? (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              <strong>No recovery passphrase is configured.</strong> Set <code className="font-mono">ADMIN_PASSWORD</code> in your environment, or use the env-defined password to log in.
            </div>
          ) : ok ? (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              <strong>Password updated.</strong> Redirecting to the admin dashboard…
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div>
                <label className="label">Recovery passphrase</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="input"
                  placeholder="The phrase you saved when initializing the account"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="label">New password (12+ chars, mixed case, number, symbol)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="label">Confirm new password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input"
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </div>
              {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full disabled:opacity-50"
              >
                {busy ? "Resetting…" : "Reset password & sign in"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-ink-mute dark:text-slate-400">
            <Link href="/admin/login" className="link-underline font-semibold text-brand dark:text-accent">← Back to login</Link>
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] text-ink-mute/80 dark:text-slate-500">
          5 wrong attempts in 15 minutes lock recovery for 1 hour.
        </p>
      </div>
    </main>
  );
}
