import Link from "next/link";
import type { Opportunity } from "@/types";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";

export function FeaturedOpportunities({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;
  const [hero, ...rest] = items;
  return (
    <section className="container-page py-16 lg:py-20" aria-labelledby="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">
            Editor’s picks
          </p>
          <h2
            id="featured-heading"
            className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance text-ink dark:text-white sm:text-4xl"
          >
            Featured this week
          </h2>
        </div>
        <Link href="/opportunities?featured=1" className="text-sm font-semibold text-brand link-underline dark:text-accent">
          See all featured →
        </Link>
      </div>

      {rest.length === 0 ? (
        <div className="mt-10">
          <OpportunityCard opp={hero} variant="feature" index={0} />
        </div>
      ) : (
        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          <OpportunityCard opp={hero} variant="feature" index={0} />
          {rest.slice(0, 2).map((opp, i) => (
            <OpportunityCard key={opp.id} opp={opp} index={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
