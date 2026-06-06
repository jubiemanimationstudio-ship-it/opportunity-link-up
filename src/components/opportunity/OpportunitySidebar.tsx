import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { DeadlineCountdown } from "@/components/opportunity/DeadlineCountdown";
import type { Opportunity } from "@/types";

export function OpportunitySidebar({ opp }: { opp: Opportunity }) {
  const isDonation = opp.type === "Donation";
  const progress =
    opp.goalAmount && opp.raisedAmount
      ? Math.min(100, Math.round((opp.raisedAmount / opp.goalAmount) * 100))
      : 0;

  return (
    <aside className="space-y-5 lg:sticky lg:top-24" aria-label="Opportunity details">
      <DeadlineCountdown deadline={opp.deadline} />

      <div className="card divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-5">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-mute dark:text-slate-400">
            At a glance
          </h3>
        </div>
        <dl className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
          {opp.organization && <Row label="Offered by" value={opp.organization} />}
          {opp.type && <Row label="Type" value={opp.type} />}
          {opp.level && <Row label="Level" value={opp.level} />}
          {opp.funding && <Row label="Funding" value={opp.funding} />}
          {opp.amount && <Row label="Amount" value={opp.amount} highlight />}
          {opp.duration && <Row label="Duration" value={opp.duration} />}
          {opp.location && <Row label="Location" value={opp.location} />}
          {opp.region && <Row label="Region" value={opp.region} />}
          {opp.remote && <Row label="Remote" value="Yes" />}
        </dl>

        {isDonation && opp.goalAmount && (
          <div className="space-y-2 p-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-ink-mute dark:text-slate-400">
              <span>{progress}% raised</span>
              <span>Goal: {opp.amount}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 p-5">
          {isDonation ? (
            <Button
              href={opp.donateUrl || "#"}
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              Donate now
            </Button>
          ) : (
            opp.applyUrl && (
              <Button
                href={opp.applyUrl}
                variant="accent"
                size="lg"
                className="w-full justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply on official site
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l10-10M7 7h10v10" />
                </svg>
              </Button>
            )
          )}
          <a
            href={site.whatsappInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
            Ask the WhatsApp Family
          </a>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-mute dark:text-slate-400">
          Tags
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {opp.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="chip chip-muted hover:bg-brand hover:text-white dark:hover:bg-accent dark:hover:text-brand"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute dark:text-slate-400">
        {label}
      </dt>
      <dd className={`text-right text-sm font-semibold ${highlight ? "text-brand dark:text-accent" : "text-ink dark:text-white"}`}>
        {value}
      </dd>
    </div>
  );
}
