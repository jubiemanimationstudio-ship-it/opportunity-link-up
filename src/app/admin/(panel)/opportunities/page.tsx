import Link from "next/link";
import { getAllOpportunities } from "@/lib/opportunities";
import { getAllEngagement, timeAgo } from "@/lib/analytics";
import { AdminPostsTable } from "@/components/admin/AdminPostsTable";

export const metadata = { title: "Admin \u00b7 All Opportunities" };

export default async function AdminOpportunitiesPage() {
  const opps = await getAllOpportunities();
  const engagement = getAllEngagement(opps);
  return (
    <div>
      <main className="container-page py-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Manage</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">All opportunities</h1>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
              {opps.length} live \u00b7 last updated {timeAgo(45)}
            </p>
          </div>
          <Link href="/admin/opportunities/new" className="btn-primary">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New opportunity
          </Link>
        </div>
        <div className="mt-6">
          <AdminPostsTable opps={opps} engagement={engagement} />
        </div>
      </main>
    </div>
  );
}
