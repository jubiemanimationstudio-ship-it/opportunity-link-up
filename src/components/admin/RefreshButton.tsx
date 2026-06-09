"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./Toast";

export function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    toast("Refreshing analytics…", "info");
    router.refresh();
    setTimeout(() => {
      setLoading(false);
      toast("Dashboard updated.", "good");
    }, 800);
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-ink disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
    >
      <svg className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
      {loading ? "Refreshing…" : "Refresh"}
    </button>
  );
}
