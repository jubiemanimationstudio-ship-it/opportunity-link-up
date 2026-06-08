"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type Step = "email" | "verify";

export default function RecoverPage() {
  const router = useRouter();
  const search = useSearchParams();
  const fromQuery = search.get("csrf") || "";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [devCode, setDevCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetch("/api/admin/password/recover")
      .then((r) => r.json())
      .then((j) => {
        if (!j.initialized) setHint("No recovery passphrase is configured.");
      })
      .catch(() => {});
  }, []);

  // Countdown timer for cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const onRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevCode("");
    if (!email.trim()) {
      setError("Enter your admin email.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/recover/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "Failed to send code.");
        return;
      }
      setCodeSent(true);
      setStep("verify");
      setCountdown(60);
      if (j.devCode) setDevCode(j.devCode);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/recover/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          passphrase,
          newPassword,
          confirm
        })
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "Recovery failed.");
        return;
      }
      setStep("email" as Step); // won't render, success shown below
      setCodeSent(true);
      setTimeout(() => router.push("/admin"), 2000);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  if (hint) {
    return (
      <main className="relative isolate flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[rgb(9_17_33)]">
        <div className="absolute right-4 top-4"><ThemeToggle /></div>
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center"><Logo /></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              <strong>{hint}</strong> Set <code className="font-mono">ADMIN_PASSWORD</code> in your environment, or use the env-defined password to log in.
            </div>
            <p className="mt-5 text-center text-xs text-ink-mute dark:text-slate-400">
              <Link href="/admin/login" className="link-underline font-semibold text-brand dark:text-accent">← Back to login</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  if (codeSent && !error && step === "verify" && !passphrase && !newPassword) {
    return (
      <main className="relative isolate flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[rgb(9_17_33)]">
        <div className="absolute right-4 top-4"><ThemeToggle /></div>
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center"><Logo /></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Account recovery</p>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              <strong>Code sent to {email}.</strong> Check your inbox and enter the code below.
            </div>
            {devCode && (
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
                <strong>Dev mode:</strong> Your code is <code className="font-mono text-sm font-bold">{devCode}</code>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[rgb(9_17_33)]">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Account recovery</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white">
            {step === "email" ? "Reset admin password" : "Enter recovery details"}
          </h1>
          <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
            {step === "email"
              ? "Enter your admin email to receive a 6-digit verification code."
              : "Enter the code from your email, your recovery passphrase, and a new password."
            }
          </p>

          {step === "email" ? (
            <form onSubmit={onRequestCode} className="mt-5 space-y-4">
              <div>
                <label className="label">Admin email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
                {busy ? "Sending…" : "Send verification code"}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerify} className="mt-5 space-y-4">
              {devCode && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
                  <strong>Dev mode:</strong> Your code is <code className="font-mono text-sm font-bold">{devCode}</code>
                </div>
              )}

              <div>
                <label className="label">Verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="input text-center font-mono text-lg tracking-[0.3em]"
                  placeholder="000000"
                  required
                  autoFocus
                />
                <p className="mt-1 text-[11px] text-ink-mute dark:text-slate-500">
                  Sent to {email}
                  {countdown > 0 && ` — resend in ${countdown}s`}
                </p>
              </div>

              <div>
                <label className="label">Recovery passphrase</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="input"
                  placeholder="The phrase you saved during setup"
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

              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
                {busy ? "Resetting…" : "Reset password & sign in"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); setCode(""); setPassphrase(""); setNewPassword(""); setConfirm(""); }}
                className="w-full text-center text-xs font-semibold text-ink-mute hover:text-brand dark:text-slate-400 dark:hover:text-accent"
              >
                ← Use a different email
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
