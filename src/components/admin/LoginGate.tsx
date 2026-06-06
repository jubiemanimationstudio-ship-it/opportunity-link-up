"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Button } from "@/components/ui/Button";

export function LoginGate({ passwordHint }: { passwordHint: string }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
        <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <div>
          <p className="font-semibold">You are already signed in.</p>
          <p className="mt-0.5">Sign out first to log in with a different password, or go straight to the dashboard.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button href="/admin" variant="primary" className="flex-1 justify-center">Go to dashboard</Button>
        <button
          onClick={onSignOut}
          disabled={signingOut}
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink-mute hover:border-rose-300 hover:text-rose-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:text-rose-300"
        >
          {signingOut ? "Signing out\u2026" : "Sign out"}
        </button>
      </div>
      <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[11px] text-ink-mute dark:border-slate-800 dark:text-slate-500">
        {passwordHint}
      </p>
    </div>
  );
}
