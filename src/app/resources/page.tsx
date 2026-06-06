import type { Metadata } from "next";
import { affiliateResources } from "@/lib/data/meta";
import { AdSlot } from "@/components/ui/AdSlot";

export const metadata: Metadata = {
  title: "Application Tools & Resources",
  description:
    "Hand-picked tools to sharpen your applications \u2014 IELTS, TOEFL, GRE prep, writing tools, banking and community."
};

const grouped = affiliateResources.reduce<Record<string, typeof affiliateResources>>((acc, r) => {
  (acc[r.category] ||= []).push(r);
  return acc;
}, {});

export default function ResourcesPage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="relative isolate overflow-hidden border-b border-slate-200 bg-brand py-14 text-white dark:border-slate-800 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="container-page relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Resources</p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Tools that make your application sharper.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            We only feature tools we have used and trust. Some links are affiliate links \u2014 if you sign up we may earn a small commission at no extra cost. It helps keep Link-Up free.
          </p>
        </div>
      </header>

      <div className="container-page py-12 lg:py-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
          <strong className="font-semibold">Affiliate disclosure:</strong> Some of the links on this page are affiliate links. The Opportunity Link-up may receive a commission if you sign up through them. We only recommend products we have personally vetted.
        </div>

        <div className="mt-10 space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h2 id={`cat-${category}`} className="font-display text-2xl font-extrabold text-ink dark:text-white">
                {category}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group card flex h-full flex-col gap-3 p-5 transition-all hover:-translate-y-1 hover:shadow-glow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand dark:bg-slate-800 dark:text-accent">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7" />
                        </svg>
                      </div>
                      {r.badge && (
                        <span className="chip chip-accent">{r.badge}</span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-ink dark:text-white group-hover:text-brand dark:group-hover:text-accent">
                      {r.title}
                    </h3>
                    <p className="text-sm text-ink-mute dark:text-slate-400 line-clamp-3">{r.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand dark:text-accent">
                      {r.cta || "Learn more"}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16">
          <AdSlot slot="resources-bottom" size="responsive" label="Sponsored" />
        </div>
      </div>
    </div>
  );
}
