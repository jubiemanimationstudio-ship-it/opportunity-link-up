"use client";

import { useEffect, useRef, useState } from "react";

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "info";
  requireText?: string;
}

type Listener = (opts: ConfirmOptions & { resolve: (v: boolean) => void }) => void;
let listener: Listener | null = null;

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (listener) listener({ ...opts, resolve });
  });
}

export function ConfirmHost() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((v: boolean) => void) | null>(null);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listener = (o) => {
      setOpts({ title: o.title, description: o.description, confirmLabel: o.confirmLabel, cancelLabel: o.cancelLabel, tone: o.tone, requireText: o.requireText });
      setResolveRef(() => o.resolve);
      setTyped("");
      setOpen(true);
    };
    return () => { listener = null; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); resolveRef?.(false); }
      if (e.key === "Enter" && canConfirm) { setOpen(false); resolveRef?.(true); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, typed, opts, resolveRef]);

  if (!open || !opts) return null;

  const canConfirm = !opts.requireText || typed === opts.requireText;
  const tone = opts.tone || "danger";
  const colors = tone === "danger"
    ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
    : tone === "warning"
    ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
    : "bg-brand hover:bg-brand-700 focus:ring-brand";

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setOpen(false); resolveRef?.(false); }} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className={"inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full " + (tone === "danger" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300" : tone === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" : "bg-brand-50 text-brand dark:bg-slate-800 dark:text-accent")}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-ink dark:text-white">{opts.title}</h3>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">{opts.description}</p>
            {opts.requireText && (
              <div className="mt-3">
                <label className="label">Type <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">{opts.requireText}</code> to confirm</label>
                <input value={typed} onChange={(e) => setTyped(e.target.value)} className="input" autoFocus />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button onClick={() => { setOpen(false); resolveRef?.(false); }} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink-mute hover:text-ink dark:border-slate-700 dark:text-slate-400 dark:hover:text-white">
            {opts.cancelLabel || "Cancel"}
          </button>
          <button
            onClick={() => { if (canConfirm) { setOpen(false); resolveRef?.(true); } }}
            disabled={!canConfirm}
            className={"rounded-full px-4 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 " + colors}
          >
            {opts.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
