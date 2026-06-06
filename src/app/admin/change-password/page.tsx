"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { adminFetch, getCsrfCookie } from "@/components/admin/csrf";
import { toast } from "@/components/admin/Toast";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const csrf = getCsrfCookie() ?? "";
      const res = await adminFetch("/api/admin/password/rotate", {
        method: "POST",
        headers: { "x-csrf-token": csrf },
        body: JSON.stringify({ currentPassword: current, newPassword: next })
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Could not change password");
        return;
      }
      toast("Password changed.", "good");
      setTimeout(() => router.push("/admin"), 1000);
    } catch {
      setError("Network error");
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Account</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white">Change password</h1>
          <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
            Use a strong unique password. We recommend a password manager.
          </p>
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label className="label">Current password</label>
              <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="input" required autoComplete="current-password" />
            </div>
            <div>
              <label className="label">New password (12+ chars, mixed case, number, symbol)</label>
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="input" required minLength={12} autoComplete="new-password" />
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" required minLength={12} autoComplete="new-password" />
            </div>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? "Saving…" : "Change password"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-ink-mute dark:text-slate-400">
            <Link href="/admin" className="link-underline font-semibold text-brand dark:text-accent">← Back to dashboard</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
