import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { Opportunity, OpportunityType } from "@/types";
import { deadlineLabel, deadlineTone, formatDate, getDaysLeft } from "@/lib/utils";

const typeTone: Record<OpportunityType, "brand" | "accent" | "success" | "warn" | "danger" | "muted"> = {
  Scholarship: "brand",
  Internship: "accent",
  Job: "success",
  Grant: "warn",
  Fellowship: "brand",
  Competition: "accent",
  Volunteer: "success",
  Donation: "danger"
};

export function OpportunityCard({
  opp,
  variant = "default",
  index = 0
}: {
  opp: Opportunity;
  variant?: "default" | "compact" | "feature";
  index?: number;
}) {
  const days = getDaysLeft(opp.deadline);
  const tone = deadlineTone(days);
  const isDonation = opp.type === "Donation";
  const progress =
    opp.goalAmount && opp.raisedAmount ? Math.min(100, Math.round((opp.raisedAmount / opp.goalAmount) * 100)) : 0;

  if (variant === "feature") {
    return (
      <Link
        href={`/opportunities/${opp.slug}`}
        className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-brand text-white shadow-card transition-all hover:shadow-glow dark:bg-slate-900"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={opp.coverImage}
            alt={opp.coverImageAlt || opp.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge tone={typeTone[opp.type]}>{opp.type}</Badge>
            {opp.featured && <Badge tone="accent">★ Featured</Badge>}
          </div>
        </div>
        <div className="relative -mt-12 flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {opp.funding && (
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{opp.funding}</span>
            )}
            {opp.location && (
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{opp.location}</span>
            )}
          </div>
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-balance sm:text-2xl">
            {opp.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-200 line-clamp-2">{opp.excerpt}</p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <DeadlinePill days={days} tone={tone} small />
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform group-hover:translate-x-1">
              Read more
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/opportunities/${opp.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow hover:ring-brand/40 dark:bg-slate-900/70 dark:ring-slate-800 dark:hover:ring-accent/50 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={opp.coverImage}
          alt={opp.coverImageAlt || opp.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone={typeTone[opp.type]}>{opp.type}</Badge>
          {opp.featured && <Badge tone="accent">★</Badge>}
        </div>
        <DeadlinePill days={days} tone={tone} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-ink-mute dark:text-slate-400">
          <span className="font-semibold text-brand dark:text-accent">{opp.organization}</span>
          {opp.location && <span>{opp.location}</span>}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-ink dark:text-white text-balance line-clamp-2 group-hover:text-brand dark:group-hover:text-accent">
          {opp.title}
        </h3>
        <p className="text-sm leading-relaxed text-ink-mute dark:text-slate-400 line-clamp-3">{opp.excerpt}</p>

        {isDonation && opp.goalAmount && opp.raisedAmount !== undefined ? (
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-ink-mute dark:text-slate-400">
              <span>{progress}% funded</span>
              <span>Goal: {opp.amount}</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {opp.funding && <span className="chip chip-muted">{opp.funding}</span>}
            {opp.amount && variant !== "compact" && (
              <span className="text-xs font-semibold text-brand dark:text-accent">{opp.amount}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <time className="text-ink-mute dark:text-slate-500" dateTime={opp.publishedAt}>
            {formatDate(opp.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1 font-semibold text-brand dark:text-accent">
            View
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function DeadlinePill({
  days,
  tone,
  className,
  small
}: {
  days: number;
  tone: "danger" | "warn" | "ok" | "muted";
  className?: string;
  small?: boolean;
}) {
  const toneClass = {
    danger: "bg-rose-500 text-white",
    warn: "bg-amber-500 text-brand",
    ok: "bg-emerald-500 text-white",
    muted: "bg-slate-500 text-white"
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold shadow-sm ${
        small ? "px-2.5 py-0.5 text-[11px]" : "px-2.5 py-1 text-[11px]"
      } ${toneClass} ${className ?? ""}`}
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      {deadlineLabel(days)}
    </span>
  );
}
