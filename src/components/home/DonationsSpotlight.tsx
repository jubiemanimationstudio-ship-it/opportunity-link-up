import Link from "next/link";
import Image from "next/image";
import type { Opportunity } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getDaysLeft, deadlineLabel } from "@/lib/utils";

export function DonationsSpotlight({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section className="container-page py-16 lg:py-20" aria-labelledby="donate-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500">
            Give a little, change a life
          </p>
          <h2
            id="donate-heading"
            className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance text-ink dark:text-white sm:text-4xl"
          >
            Causes that need you today
          </h2>
        </div>
        <Link href="/categories/donation" className="text-sm font-semibold text-brand link-underline dark:text-accent">
          See all causes →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {items.slice(0, 2).map((opp) => {
          const days = getDaysLeft(opp.deadline);
          const progress =
            opp.goalAmount && opp.raisedAmount
              ? Math.min(100, Math.round((opp.raisedAmount / opp.goalAmount) * 100))
              : 0;
          return (
            <article
              key={opp.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow hover:ring-rose-300/60 dark:bg-slate-900/70 dark:ring-slate-800 dark:hover:ring-rose-500/50 lg:flex-row lg:items-stretch"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:w-2/5">
                <Image
                  src={opp.coverImage}
                  alt={opp.coverImageAlt || opp.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge tone="danger" className="absolute left-3 top-3">
                  Donate
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500">
                  {opp.organization}
                </div>
                <h3 className="font-display text-xl font-bold leading-snug text-ink dark:text-white text-balance">
                  <Link href={`/opportunities/${opp.slug}`} className="hover:text-brand dark:hover:text-accent">
                    {opp.title}
                  </Link>
                </h3>
                <p className="text-sm text-ink-mute dark:text-slate-400 line-clamp-3">{opp.excerpt}</p>

                <div className="mt-1 space-y-1.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-ink-mute dark:text-slate-400">
                    <span>{progress}% raised</span>
                    <span>Goal: {opp.amount}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-xs font-medium text-ink-mute dark:text-slate-500">
                    {deadlineLabel(days)}
                  </span>
                  <Button href={`/opportunities/${opp.slug}`} variant="primary" size="sm">
                    Donate now
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
