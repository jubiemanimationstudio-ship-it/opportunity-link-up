"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { adminFetch } from "./csrf";
import { confirmDialog } from "./ConfirmDialog";

export interface AdminSessionInfo {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: number;
  lastSeen: number;
  revoked: boolean;
}

export function SessionsPanel({
  sessions,
  currentSessionId
}: {
  sessions: AdminSessionInfo[];
  currentSessionId?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const active = sessions.filter((s) => !s.revoked);

  function revokeOne(id: string) {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    if (id === currentSessionId) {
      toast("Cannot revoke your current session here — use Sign out.", "bad");
      return;
    }
    setBusyId(id);
    start(async () => {
      try {
        const res = await adminFetch("/api/admin/sessions/revoke", {
          method: "POST",
          body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error();
        toast("Session revoked.", "good");
        router.refresh();
      } catch {
        toast("Could not revoke session.", "bad");
      } finally {
        setBusyId(null);
      }
    });
  }

  async function revokeAll() {
    const ok = await confirmDialog({
      title: "Revoke all other sessions?",
      description: `Sign out ${active.length - 1} other device${active.length - 1 === 1 ? "" : "s"}. Your current session stays active.`,
      confirmLabel: "Revoke all",
      tone: "danger"
    });
    if (!ok) return;
    start(async () => {
      try {
        const res = await adminFetch("/api/admin/sessions/revoke-all", { method: "POST", body: JSON.stringify({}) });
        if (!res.ok) throw new Error();
        toast("All other sessions revoked.", "good");
        router.refresh();
      } catch {
        toast("Could not revoke sessions.", "bad");
      }
    });
  }

  return (
    <div className="mt-4 space-y-3">
      {active.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-ink-mute dark:border-slate-700 dark:text-slate-500">No active sessions recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {active.map((s) => {
            const isCurrent = s.id === currentSessionId;
            const shortAgent = (s.userAgent || "Unknown device").slice(0, 80);
            const ageMin = Math.round((Date.now() - s.createdAt) / 60000);
            return (
              <li key={s.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 p-2.5 dark:border-slate-700">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-white">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> This device
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Other</span>
                    )}
                    <span className="font-mono text-[11px] text-ink-mute dark:text-slate-400">{s.ip}</span>
                  </p>
                  <p className="mt-1 truncate text-[11px] text-ink-mute dark:text-slate-400" title={s.userAgent}>{shortAgent}</p>
                  <p className="mt-0.5 text-[10px] text-ink-mute/80 dark:text-slate-500">
                    Seen {Math.max(0, Math.round((Date.now() - s.lastSeen) / 60000))}m ago · started {ageMin < 60 ? `${ageMin}m ago` : `${Math.round(ageMin / 60)}h ago`}
                  </p>
                </div>
                {!isCurrent && (
                  <button
                    onClick={() => revokeOne(s.id)}
                    disabled={pending || busyId === s.id}
                    className="shrink-0 rounded-full border border-rose-200 px-2.5 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
                  >
                    Revoke
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {active.length > 1 && (
        <button
          onClick={revokeAll}
          disabled={pending}
          className="w-full rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
        >
          Revoke all other sessions
        </button>
      )}
    </div>
  );
}
