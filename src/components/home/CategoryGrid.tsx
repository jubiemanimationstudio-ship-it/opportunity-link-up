import Link from "next/link";
import { site } from "@/lib/site";

const iconMap: Record<string, React.ReactNode> = {
  "graduation-cap": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.7 4 3 6 3s6-1.3 6-3v-5" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
  buildings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 100 4h4v-4z" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  ),
  "hand-heart": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 14h2a2 2 0 100-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="M7 20l1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 00-2.8-2.8L15.5 9" />
      <path d="M2 15l6 6M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.7 2.7 0 0018.4 3c-.9 0-1.5.4-2 .9l-.5.5-.5-.5c-.5-.5-1.1-.9-2-.9A2.7 2.7 0 0010.7 6c0 1.1.8 2 1.5 2.7L16 12l3.5-3.5z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
};

const TILE_COLORS: Record<string, { from: string; to: string; light: string; text: string }> = {
  scholarship: { from: "from-sky-500", to: "to-brand", light: "group-hover:from-sky-500 group-hover:to-brand", text: "text-sky-600 dark:text-sky-400" },
  internship: { from: "from-violet-500", to: "to-fuchsia-500", light: "group-hover:from-violet-500 group-hover:to-fuchsia-500", text: "text-violet-600 dark:text-violet-400" },
  job: { from: "from-emerald-500", to: "to-teal-600", light: "group-hover:from-emerald-500 group-hover:to-teal-600", text: "text-emerald-600 dark:text-emerald-400" },
  grant: { from: "from-amber-500", to: "to-orange-500", light: "group-hover:from-amber-500 group-hover:to-orange-500", text: "text-amber-600 dark:text-amber-400" },
  fellowship: { from: "from-indigo-500", to: "to-purple-600", light: "group-hover:from-indigo-500 group-hover:to-purple-600", text: "text-indigo-600 dark:text-indigo-400" },
  competition: { from: "from-rose-500", to: "to-orange-500", light: "group-hover:from-rose-500 group-hover:to-orange-500", text: "text-rose-600 dark:text-rose-400" },
  volunteer: { from: "from-pink-500", to: "to-rose-500", light: "group-hover:from-pink-500 group-hover:to-rose-500", text: "text-pink-600 dark:text-pink-400" },
  donation: { from: "from-rose-500", to: "to-red-600", light: "group-hover:from-rose-500 group-hover:to-red-600", text: "text-rose-600 dark:text-rose-400" }
};

export function CategoryGrid() {
  return (
    <section className="container-page py-16 lg:py-20" aria-labelledby="categories-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">
            One platform, every opportunity
          </p>
          <h2 id="categories-heading" className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance text-ink dark:text-white sm:text-4xl">
            What are you looking for today?
          </h2>
        </div>
        <a
          href="/opportunities"
          className="hidden text-sm font-semibold text-brand link-underline dark:text-accent sm:inline-flex"
        >
          View all categories →
        </a>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.opportunityTypes.map((cat, i) => {
          const palette = TILE_COLORS[cat.slug] || TILE_COLORS.award;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:bg-slate-900 dark:ring-slate-800 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${palette.from} ${palette.to} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${palette.from} ${palette.to} opacity-15 blur-2xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-150`}
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-ink transition-all duration-500 group-hover:bg-white group-hover:text-brand group-hover:scale-110 group-hover:rotate-3 dark:bg-slate-800 dark:text-white ${palette.text}`}>
                  <span className="h-6 w-6">{iconMap[cat.icon] ?? iconMap["award"]}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink transition-colors duration-500 group-hover:text-white dark:text-white">
                  {cat.label}
                </h3>
                <p className="mt-1 text-sm text-ink-mute transition-colors duration-500 group-hover:text-white/90 dark:text-slate-400 line-clamp-2">
                  {(cat as any).blurb ?? "Browse all current opportunities in this category."}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-brand transition-colors duration-500 group-hover:text-white dark:text-accent">
                  Explore
                  <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
