import Link from "next/link";
import type { Opportunity } from "@/types";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";

export function RelatedOpportunities({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40" aria-labelledby="related-heading">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="related-heading" className="font-display text-2xl font-extrabold tracking-tight text-ink dark:text-white sm:text-3xl">
            You might also like
          </h2>
          <Link href="/opportunities" className="text-sm font-semibold text-brand link-underline dark:text-accent">
            See all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((opp, i) => (
            <OpportunityCard key={opp.id} opp={opp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
