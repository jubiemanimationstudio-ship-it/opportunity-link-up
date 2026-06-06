"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { adminFetch } from "./csrf";
import { confirmDialog } from "./ConfirmDialog";

export function ContactActions({
  id,
  email,
  name,
  reason,
  read: initialRead,
  archived: initialArchived
}: {
  id: string;
  email: string;
  name: string;
  reason: string;
  read: boolean;
  archived: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [archived, setArchived] = useState(initialArchived);
  const [read, setRead] = useState(initialRead);

  const onRead = async () => {
    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/contact/read", {
        method: "POST",
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      setRead(true);
      toast("Marked as read.", "good");
      router.refresh();
    } catch {
      toast("Could not mark as read.", "bad");
    } finally {
      setBusy(false);
    }
  };

  const onArchive = async () => {
    const ok = await confirmDialog({
      title: "Archive this message?",
      description: `Archive the message from ${name}. You can still find it in archived threads.`,
      confirmLabel: "Archive",
      tone: "warning"
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/contact/archive", {
        method: "POST",
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      setArchived(true);
      toast("Archived.", "good");
      router.refresh();
    } catch {
      toast("Could not archive.", "bad");
    } finally {
      setBusy(false);
    }
  };

  if (archived) {
    return (
      <div className="mt-4 flex items-center gap-2 text-xs text-ink-mute dark:text-slate-500">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Archived
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a
        href={`mailto:${email}?subject=Re: ${reason}`}
        className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
      >
        Reply
      </a>
      <button
        onClick={onRead}
        disabled={busy || read}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-ink disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        {read ? "Read" : "Mark read"}
      </button>
      <button
        onClick={onArchive}
        disabled={busy}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-ink disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        Archive
      </button>
    </div>
  );
}
