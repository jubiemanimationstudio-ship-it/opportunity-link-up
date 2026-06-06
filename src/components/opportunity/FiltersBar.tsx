"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const TYPES = [
  "Scholarship",
  "Internship",
  "Job",
  "Grant",
  "Fellowship",
  "Competition",
  "Volunteer",
  "Donation"
];
const LEVELS = ["Secondary", "Undergraduate", "Masters", "PhD", "Postdoctoral", "Professional"];
const FUNDING = ["Fully Funded", "Partial", "Salaried", "Stipend Only", "Variable"];
const REGIONS = [
  "Africa",
  "Europe",
  "North America",
  "Asia",
  "Australia",
  "Middle East",
  "Worldwide",
  "Remote"
];

export function FiltersBar({
  resultsCount,
  basePath = "/opportunities"
}: {
  resultsCount: number;
  basePath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const current = useMemo(
    () => ({
      type: params.get("type") || "",
      level: params.get("level") || "",
      funding: params.get("funding") || "",
      region: params.get("region") || "",
      remote: params.get("remote") === "1",
      q: params.get("q") || ""
    }),
    [params]
  );

  const update = (key: string, value: string | boolean) => {
    const sp = new URLSearchParams(params.toString());
    if (typeof value === "boolean") {
      if (value) sp.set(key, "1");
      else sp.delete(key);
    } else {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    const qs = sp.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const clear = () => router.push(basePath, { scroll: false });

  const activeCount =
    [current.type, current.level, current.funding, current.region].filter(Boolean).length +
    (current.remote ? 1 : 0);

  return (
    <div className="card sticky top-20 z-20 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink dark:text-white">
          Refine results
        </h2>
        <span className="text-xs font-medium text-ink-mute dark:text-slate-400">
          {resultsCount} {resultsCount === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="space-y-3">
        <Select
          label="Type"
          value={current.type}
          options={TYPES}
          onChange={(v) => update("type", v)}
        />
        <Select
          label="Level"
          value={current.level}
          options={LEVELS}
          onChange={(v) => update("level", v)}
        />
        <Select
          label="Funding"
          value={current.funding}
          options={FUNDING}
          onChange={(v) => update("funding", v)}
        />
        <Select
          label="Region"
          value={current.region}
          options={REGIONS}
          onChange={(v) => update("region", v)}
        />

        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700">
          <input
            type="checkbox"
            checked={current.remote}
            onChange={(e) => update("remote", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600"
          />
          <span className="font-medium text-ink dark:text-slate-100">Remote only</span>
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-ink-mute transition-colors hover:border-rose-400 hover:text-rose-500 dark:border-slate-700 dark:text-slate-400"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium text-ink outline-none transition-colors hover:border-brand focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-accent"
        >
          <option value="">All {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}
