import { notFound } from "next/navigation";
import { OpportunityEditor } from "@/components/admin/OpportunityEditor";
import { getAllOpportunities } from "@/lib/opportunities";
import { getEngagementFor } from "@/lib/analytics";

export const metadata = { title: "Admin \u00b7 Edit opportunity" };

interface PageProps {
  params: { id: string };
}

export default async function EditOpportunityPage({ params }: PageProps) {
  const opps = await getAllOpportunities();
  const opp = opps.find((o) => o.id === params.id);
  if (!opp) notFound();
  const eng = getEngagementFor(opp);

  return (
    <div>
      <main className="container-page py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Edit</p>
            <h1 className="mt-1 line-clamp-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">{opp.title}</h1>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
              {eng.views.toLocaleString()} views \u00b7 {eng.applyClicks.toLocaleString()} applies \u00b7 {eng.conversionRate}% conversion
            </p>
          </div>
          <a href={`/opportunities/${opp.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs">
            Preview live →
          </a>
        </div>
        <OpportunityEditor initial={opp as any} />
      </main>
    </div>
  );
}
