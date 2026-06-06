import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { searchOpportunities, type OpportunityFilters } from "@/lib/opportunities";
import { FiltersBar } from "@/components/opportunity/FiltersBar";
import { OpportunityList } from "@/components/opportunity/OpportunityList";
import { SearchBar } from "@/components/ui/SearchBar";
import type { OpportunityType } from "@/types";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every live opportunity by keyword, country, organisation or category."
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function getString(v: string | string[] | undefined): string {
  if (!v) return "";
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const q = getString(searchParams.q);
  const filters: OpportunityFilters = {
    type: (getString(searchParams.type) as OpportunityType) || "",
    level: getString(searchParams.level),
    funding: getString(searchParams.funding),
    region: getString(searchParams.region),
    remoteOnly: getString(searchParams.remote) === "1"
  };

  const results = await searchOpportunities(q, filters);

  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Search</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
            {q ? <>Results for &ldquo;<span className="text-brand dark:text-accent">{q}</span>&rdquo;</> : "Search opportunities"}
          </h1>
          <p className="mt-3 text-sm text-ink-mute dark:text-slate-300">
            {results.length} {results.length === 1 ? "opportunity" : "opportunities"} found
          </p>
          <div className="mt-6 max-w-2xl">
            <Suspense fallback={null}>
              <SearchBar size="lg" />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Suspense fallback={<div className="card h-64 animate-pulse" />}>
              <FiltersBar resultsCount={results.length} basePath="/search" />
            </Suspense>
          </aside>
          <div className="lg:col-span-9">
            <OpportunityList
              items={results}
              emptyMessage={
                q
                  ? `No opportunities matched "${q}" with these filters. Try a different keyword or clear filters.`
                  : "Type a keyword above or use the filters to find opportunities."
              }
            />
            {!q && results.length === 0 && (
              <div className="mt-6 text-center">
                <Link href="/opportunities" className="btn-outline">
                  Browse all opportunities
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
