"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatDuration(s: number): string {
  if (s <= 0) return "0s";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  }
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r === null) return null;
        if (r <= 1) {
          setLocked(false);
          setError("");
          return null;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.status === 429) {
        const j = await res.json().catch(() => ({}));
        setLocked(true);
        setRemaining(j.remainingSeconds || 60);
        setError(j.error || "Too many attempts. Try again later.");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Sign-in failed.");
        if (typeof j.remainingAttempts === "number") setAttemptsLeft(j.remainingAttempts);
        return;
      }
      setAttemptsLeft(null);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error \u2014 try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 lg:p-8" aria-live="polite">
      {error && (
        <div className={"mb-5 flex items-start gap-3 rounded-xl border p-3 text-sm " + (locked ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200" : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200")}>
          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {locked ? (
              <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
            ) : (
              <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>
            )}
          </svg>
          <div>
            <p className="font-semibold">{locked ? "Temporarily locked" : "Sign-in failed"}</p>
            <p className="mt-0.5">
              {locked && remaining !== null
                ? `Try again in ${formatDuration(remaining)}.`
                : error}
            </p>
            {!locked && attemptsLeft !== null && attemptsLeft <= 2 && (
              <p className="mt-1 text-xs">Warning: {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} remaining before lockout.</p>
            )}
          </div>
        </div>
      )}
      <label htmlFor="email" className="label">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        required
        disabled={locked}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input disabled:opacity-50"
        placeholder="admin@example.com"
      />
      <label htmlFor="password" className="label mt-4">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={locked}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input disabled:opacity-50"
        placeholder={locked ? "Locked" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
      />
      <button type="submit" disabled={loading || locked} className="btn-primary mt-5 w-full justify-center disabled:opacity-50">
        {locked ? "Locked" : loading ? "Signing in\u2026" : "Sign in"}
      </button>
      <div className="mt-4 flex items-center justify-between text-[11px] text-ink-mute dark:text-slate-500">
        <a href="/admin/recover" className="link-underline font-semibold text-brand dark:text-accent">Forgot password?</a>
        <span>4 h session</span>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-mute dark:text-slate-500">
        Protected area. Failed attempts are throttled and logged.
      </p>
    </form>
  );
}
