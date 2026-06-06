"use client";

import { useEffect, useState } from "react";

function diff(target: Date) {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { total, days, hours, minutes, seconds, ended: false };
}

export function DeadlineCountdown({ deadline, compact = false }: { deadline: string; compact?: boolean }) {
  const target = new Date(deadline);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (t.ended) {
    return (
      <div
        role="status"
        className={`flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${
          compact ? "text-xs" : ""
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
        Application window closed
      </div>
    );
  }

  const urgent = t.days <= 7;
  const tone = urgent
    ? "from-rose-500 to-orange-500 text-white"
    : t.days <= 21
    ? "from-amber-500 to-yellow-400 text-brand"
    : "from-brand to-brand-400 text-white dark:from-accent dark:to-accent-300 dark:text-brand";

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`relative isolate overflow-hidden rounded-2xl bg-gradient-to-br ${tone} ${
        compact ? "p-4" : "p-5"
      } shadow-card`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] opacity-80 ${compact ? "" : "text-xs"}`}>
            {urgent ? "\u26A0 Closing soon" : "Application deadline"}
          </p>
          <p className={`mt-0.5 font-display font-bold ${compact ? "text-xs" : "text-sm"}`}>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric"
            }).format(target)}
          </p>
        </div>
        <svg className={`opacity-70 ${compact ? "h-6 w-6" : "h-9 w-9"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>

      <div className={`mt-4 grid grid-cols-4 gap-2 ${compact ? "" : "sm:gap-3"}`}>
        <TimeBlock value={t.days} label="Days" compact={compact} />
        <TimeBlock value={t.hours} label="Hrs" compact={compact} />
        <TimeBlock value={t.minutes} label="Min" compact={compact} />
        <TimeBlock value={t.seconds} label="Sec" compact={compact} />
      </div>
    </div>
  );
}

function TimeBlock({ value, label, compact }: { value: number; label: string; compact?: boolean }) {
  return (
    <div className="rounded-xl bg-white/15 px-2 py-3 text-center backdrop-blur">
      <div className={`font-display font-extrabold tabular-nums tracking-tight ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest opacity-80">{label}</div>
    </div>
  );
}
