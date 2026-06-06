"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchBar } from "@/components/ui/SearchBar";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-slate-50 shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-[rgb(9_17_33)] dark:shadow-[0_1px_0_rgba(0,0,0,0.4)]">
      <div className="container-page flex h-16 items-center gap-3 sm:h-20">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center rounded-full px-2.5 py-1.5 text-[13px] font-medium leading-none transition-colors ${
                  active
                    ? "text-brand dark:text-accent"
                    : "text-ink-mute hover:text-ink dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-accent dark:hover:text-accent lg:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <div className="hidden lg:block lg:w-64 xl:w-80">
            <Suspense fallback={<div className="h-10 w-full rounded-full bg-slate-100 dark:bg-slate-800" />}>
              <SearchBar size="md" />
            </Suspense>
          </div>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-slate-200/70 bg-white px-4 py-3 dark:border-slate-800 dark:bg-[rgb(9_17_33)] lg:hidden">
          <Suspense fallback={<div className="h-10 w-full rounded-full bg-slate-100 dark:bg-slate-800" />}>
            <SearchBar />
          </Suspense>
        </div>
      )}
    </header>
  );
}
