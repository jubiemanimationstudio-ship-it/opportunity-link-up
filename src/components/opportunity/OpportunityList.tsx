import Link from "next/link";
import type { Opportunity } from "@/types";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";

export function OpportunityList({
  items,
  emptyMessage = "No opportunities match your filters yet. Try clearing some filters or come back tomorrow \u2014 we update daily."
}: {
  items: Opportunity[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-slate-800 dark:text-accent">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <p className="max-w-md text-sm text-ink-mute dark:text-slate-300">{emptyMessage}</p>
        <Link href="/opportunities" className="text-sm font-semibold text-brand link-underline dark:text-accent">
          View all opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((opp, i) => (
        <OpportunityCard key={opp.id} opp={opp} index={i} />
      ))}
    </div>
  );
}
