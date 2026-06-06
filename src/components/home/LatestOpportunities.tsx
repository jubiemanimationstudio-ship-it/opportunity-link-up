import Link from "next/link";
import type { Opportunity } from "@/types";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { AdSlot } from "@/components/ui/AdSlot";

export function LatestOpportunities({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-900/40 lg:py-20" aria-labelledby="latest-heading">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">
              Fresh leads
            </p>
            <h2 id="latest-heading" className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance text-ink dark:text-white sm:text-4xl">
              Latest opportunities
            </h2>
          </div>
          <Link href="/opportunities" className="text-sm font-semibold text-brand link-underline dark:text-accent">
            View all opportunities →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((opp, i) => (
            <OpportunityCard key={opp.id} opp={opp} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <AdSlot slot="home-latest" size="responsive" label="Sponsored" />
        </div>
      </div>
    </section>
  );
}
