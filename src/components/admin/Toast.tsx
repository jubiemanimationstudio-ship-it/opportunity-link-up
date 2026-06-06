"use client";

import { useEffect, useState } from "react";

interface Toast { id: number; text: string; tone: "good" | "bad" | "info" }

let _id = 0;
const listeners = new Set<(t: Toast) => void>();

export function toast(text: string, tone: Toast["tone"] = "info") {
  const t: Toast = { id: ++_id, text, tone };
  listeners.forEach((fn) => fn(t));
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const onAdd = (t: Toast) => {
      setItems((s) => [...s, t]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== t.id)), 3500);
    };
    listeners.add(onAdd);
    return () => { listeners.delete(onAdd); };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur " +
            (t.tone === "good"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/40 dark:text-emerald-100"
              : t.tone === "bad"
              ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/40 dark:text-rose-100"
              : "border-slate-200 bg-white text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-white")
          }
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
