import Link from "next/link";
import { site } from "@/lib/site";
import { DeadlineCountdown } from "@/components/opportunity/DeadlineCountdown";
import { ApplyDonateButton, WhatsAppSidebarLink } from "@/components/opportunity/ApplyDonateButton";
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
            <ApplyDonateButton
              href={opp.donateUrl || "#"}
              isDonation
              title={opp.title}
              slug={opp.slug}
            />
          ) : (
            opp.applyUrl && (
              <ApplyDonateButton
                href={opp.applyUrl}
                isDonation={false}
                title={opp.title}
                slug={opp.slug}
              />
            )
          )}
          <WhatsAppSidebarLink href={site.whatsappInvite} title={opp.title} />
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
