import { OpportunityEditor } from "@/components/admin/OpportunityEditor";

export const metadata = { title: "Admin \u00b7 New opportunity" };

export default function NewOpportunityPage() {
  return (
    <div>
      <main className="container-page py-8 lg:py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Create</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">New opportunity</h1>
          <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">All fields marked with <span className="text-rose-500">*</span> are required.</p>
        </div>
        <OpportunityEditor />
      </main>
    </div>
  );
}
