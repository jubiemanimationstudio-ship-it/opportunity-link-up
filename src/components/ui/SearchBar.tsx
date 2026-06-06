"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@/lib/track";

export function SearchBar({
  className,
  size = "md",
  placeholder = "Search scholarships, country, university..."
}: {
  className?: string;
  size?: "md" | "lg";
  placeholder?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) track("search", { query: q });
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const big = size === "lg";
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`group relative flex w-full items-center overflow-hidden rounded-full border bg-white shadow-sm transition-all focus-within:border-brand focus-within:shadow-md dark:bg-slate-900 ${
        big ? "border-slate-300 dark:border-slate-700" : "border-slate-200 dark:border-slate-800"
      } ${className ?? ""}`}
    >
      <span className={`${big ? "pl-5" : "pl-4"} text-ink-mute dark:text-slate-400`}>
        <svg className={big ? "h-5 w-5" : "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search scholarships"
        className={`flex-1 bg-transparent px-3 outline-none placeholder:text-ink-mute dark:text-slate-100 dark:placeholder:text-slate-500 ${
          big ? "py-4 text-base" : "py-2.5 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`m-1 rounded-full bg-brand text-white transition-transform hover:scale-105 active:scale-95 dark:bg-accent dark:text-brand ${
          big ? "px-5 py-2.5 text-sm font-semibold" : "px-4 py-1.5 text-xs font-semibold"
        }`}
      >
        Search
      </button>
    </form>
  );
}
