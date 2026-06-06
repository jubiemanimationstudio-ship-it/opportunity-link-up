import type { Metadata } from "next";
import { Suspense } from "react";
import { searchOpportunities, getAllOpportunities, type OpportunityFilters } from "@/lib/opportunities";
import { FiltersBar } from "@/components/opportunity/FiltersBar";
import { OpportunityList } from "@/components/opportunity/OpportunityList";
import { SearchBar } from "@/components/ui/SearchBar";
import { AdSlot } from "@/components/ui/AdSlot";
import type { OpportunityType } from "@/types";

export const metadata: Metadata = {
  title: "All Opportunities",
  description:
    "Browse every live opportunity on The Opportunity Link-up \u2014 scholarships, internships, jobs, grants, fellowships and causes you can support today."
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function getString(v: string | string[] | undefined): string {
  if (!v) return "";
  return Array.isArray(v) ? v[0] : v;
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const q = getString(searchParams.q);
  const filters: OpportunityFilters = {
    type: (getString(searchParams.type) as OpportunityType) || "",
    level: getString(searchParams.level),
    funding: getString(searchParams.funding),
    region: getString(searchParams.region),
    remoteOnly: getString(searchParams.remote) === "1"
  };
  const featuredOnly = getString(searchParams.featured) === "1";

  let results = q || Object.values(filters).some(Boolean)
    ? await searchOpportunities(q, filters)
    : await getAllOpportunities();
  if (featuredOnly) results = results.filter((o) => o.featured);

  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40 lg:py-16">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">
            Browse all
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-balance text-ink dark:text-white sm:text-4xl lg:text-5xl">
            Every opportunity, in one place
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-mute dark:text-slate-300">
            Use the filters to narrow by type, level, funding or region. Save the URL to bookmark your custom view.
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
              <FiltersBar resultsCount={results.length} basePath="/opportunities" />
            </Suspense>
          </aside>
          <div className="lg:col-span-9">
            <OpportunityList items={results} />
            <div className="mt-12">
              <AdSlot slot="list-bottom" size="responsive" label="Sponsored" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
