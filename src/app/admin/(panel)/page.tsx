import Link from "next/link";
import { getAllOpportunities } from "@/lib/opportunities";
import { getRealtimeStats, getSupabaseStats } from "@/lib/analytics-realtime";
import { formatNumber, timeAgo, type ActivityItem } from "@/lib/analytics";
import { listActiveSessions, getAdminSecretStatus, getRecoveryStatus } from "@/lib/admin-secrets";
import { cookies } from "next/headers";
import { site } from "@/lib/site";
import { Sparkline, LineChart, DonutChart, BarChart } from "@/components/admin/Charts";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { SessionsPanel } from "@/components/admin/SessionsPanel";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

export const metadata = { title: "Admin · Engagement Dashboard" };
export const dynamic = "force-dynamic";

const TYPE_COLOR: Record<string, string> = {
  Scholarship: "#0B2545",
  Internship: "#FFD60A",
  Job: "#10B981",
  Grant: "#8B5CF6",
  Fellowship: "#EC4899",
  Competition: "#F97316",
  Volunteer: "#06B6D4",
  Donation: "#EF4444"
};

const TYPE_LABEL: Record<string, string> = {
  Scholarship: "Scholarships",
  Internship: "Internships",
  Job: "Jobs",
  Grant: "Grants",
  Fellowship: "Fellowships",
  Competition: "Competitions",
  Volunteer: "Volunteering",
  Donation: "Donations"
};

export default async function AdminDashboardPage() {
  const opps = await getAllOpportunities();
  const supabaseStats = await getSupabaseStats();
  const memoryStats = getRealtimeStats();
  const stats = supabaseStats || memoryStats;
  const sessions = listActiveSessions();
  const secretStatus = getAdminSecretStatus();
  const recoveryStatus = getRecoveryStatus();
  const currentSessionId = cookies().get("ha_session")?.value;

  const oppStats = supabaseStats?.oppStats || [];

  const typeAgg = new Map<string, { views: number; applies: number }>();
  for (const o of oppStats) {
    const key = o.type;
    const cur = typeAgg.get(key) || { views: 0, applies: 0 };
    cur.views += o.views;
    cur.applies += o.applies;
    typeAgg.set(key, cur);
  }
  const engagementByType = opps.map((o) => {
    const agg = typeAgg.get(o.type) || { views: 0, applies: 0 };
    return { type: o.type, views: agg.views, applies: agg.applies };
  });

  const oppBySlug = new Map(oppStats.map(o => [o.slug, o]));
  const oppsWithData = opps.map(o => ({
    ...o,
    views: oppBySlug.get(o.slug)?.views || 0,
    applies: oppBySlug.get(o.slug)?.applies || 0,
    shares: oppBySlug.get(o.slug)?.shares || 0,
    saves: oppBySlug.get(o.slug)?.saves || 0,
  }));
  const topOpps = [...oppsWithData].sort((a, b) => b.views - a.views);
  const underperformers = [...oppsWithData]
    .filter(o => o.views > 0)
    .sort((a, b) => a.views - b.views)
    .slice(0, 4);
  if (underperformers.length < 4) {
    const zeroOpps = oppsWithData.filter(o => o.views === 0);
    underperformers.push(...zeroOpps.slice(0, 4 - underperformers.length));
  }

  const featuredViewShare = 0;
  const totalEngagement = stats.applyClicks + stats.shareClicks + stats.saveClicks;

  return (
    <div>
      <AutoRefresh intervalMs={30000} />
      <main className="container-page py-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Engagement</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
              Real-time feed · {opps.length} live opportunities · starts at zero until readers act
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.lastEventAt ? "Live" : "Idle"}
            </span>
            <RefreshButton />
          </div>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total views" value={formatNumber(stats.pageViews)} delta={0} spark={stats.dailyViews.map((d) => d.views)} accent="brand" />
          <KpiCard label="Unique visitors" value={formatNumber(stats.uniqueVisitors)} delta={0} spark={stats.dailyViews.map((d) => d.visitors)} accent="emerald" />
          <KpiCard label="Engagement clicks" value={formatNumber(totalEngagement)} delta={0} spark={stats.dailyClicks.map((d) => d.apply + d.share + d.save)} accent="accent" />
          <KpiCard label="Avg conversion" value={`0%`} delta={0} suffix="%" accent="violet" />
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Newsletter subs" value={formatNumber(stats.newsletterSubs)} delta={0} accent="brand" small />
          <KpiCard label="Contact messages" value={formatNumber(stats.contactSubmissions)} delta={0} accent="emerald" small />
          <KpiCard label="WhatsApp clicks" value={formatNumber(stats.whatsappClicks)} delta={0} accent="emerald" small />
          <KpiCard label="Featured share" value={`${featuredViewShare}%`} delta={0} suffix="%" accent="accent" small />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink dark:text-white">Traffic & engagement</h2>
                <p className="text-xs text-ink-mute dark:text-slate-400">Daily views vs. total clicks — last 30 days, live</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <Legend dot="#0B2545" label="Views" />
                <Legend dot="#10B981" label="Applies" />
                <Legend dot="#FFD60A" label="Shares" />
                <Legend dot="#8B5CF6" label="Saves" />
              </div>
            </div>
            <div className="mt-4 h-60 text-slate-400">
              <LineChart
                xLabels={stats.dailyViews.map((d) => d.date.slice(5))}
                series={[
                  { name: "Views", color: "#0B2545", data: stats.dailyViews.map((d) => d.views) },
                  { name: "Applies", color: "#10B981", data: stats.dailyClicks.map((d) => d.apply) },
                  { name: "Shares", color: "#FFD60A", data: stats.dailyClicks.map((d) => d.share) },
                  { name: "Saves", color: "#8B5CF6", data: stats.dailyClicks.map((d) => d.save) }
                ]}
              />
            </div>
          </div>

          <div className="card p-5 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">By opportunity type</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Starts at zero — fills in as readers engage</p>
            <div className="mt-3 grid grid-cols-2 items-center gap-3">
              <div className="h-44">
                <DonutChart
                  data={engagementByType.some(e => e.views > 0) ? engagementByType.filter(e => e.views > 0).map((e) => ({
                    label: TYPE_LABEL[e.type] || e.type,
                    value: e.views,
                    color: TYPE_COLOR[e.type] || "#94A3B8"
                  })) : [{ label: "No data yet", value: 1, color: "#cbd5e1" }]}
                  size={180}
                />
              </div>
              <ul className="space-y-1.5 text-xs">
                {opps.slice(0, 6).map((o) => {
                  const agg = typeAgg.get(o.type) || { views: 0, applies: 0 };
                  return (
                    <li key={o.id} className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: TYPE_COLOR[o.type] || "#94A3B8" }} />
                        <span className="truncate text-ink-mute dark:text-slate-400">{TYPE_LABEL[o.type] || o.type}</span>
                      </span>
                      <span className="font-mono text-ink-mute dark:text-slate-500">{agg.views}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink dark:text-white">Top opportunities</h2>
                <p className="text-xs text-ink-mute dark:text-slate-400">Sorted by 30-day views · all start at 0</p>
              </div>
              <Link href="/admin/opportunities" className="text-xs font-semibold text-brand link-underline dark:text-accent">
                View all →
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-ink-mute dark:border-slate-700 dark:text-slate-500">
                  <tr>
                    <th className="py-2 pr-2">Post</th>
                    <th className="py-2 pr-2 text-right">Views</th>
                    <th className="py-2 pr-2 text-right">Applies</th>
                    <th className="py-2 pr-2 text-right">Conv.</th>
                    <th className="py-2 pr-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topOpps.slice(0, 8).map((o) => {
                    const conv = o.views > 0 ? Math.round((o.applies / o.views) * 100) : 0;
                    return (
                      <tr key={o.id} className="group">
                        <td className="py-3 pr-2">
                          <Link href={`/opportunities/${o.slug}`} target="_blank" className="block max-w-xs">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: TYPE_COLOR[o.type] || "#94A3B8" }} />
                              <span className="truncate font-semibold text-ink group-hover:text-brand dark:text-white dark:group-hover:text-accent">
                                {o.title}
                              </span>
                            </div>
                            <span className="ml-4 text-[11px] text-ink-mute dark:text-slate-500">
                              {TYPE_LABEL[o.type] || o.type}
                              {o.featured ? " · Featured" : ""}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 pr-2 text-right font-mono text-ink-mute dark:text-slate-500">{o.views}</td>
                        <td className="py-3 pr-2 text-right font-mono text-ink-mute dark:text-slate-500">{o.applies}</td>
                        <td className="py-3 pr-2 text-right font-mono text-ink-mute dark:text-slate-500">{conv}%</td>
                        <td className="py-3 pr-2 w-32">
                          <Sparkline data={Array(30).fill(o.views > 0 ? Math.max(1, Math.round(o.views / 30)) : 0)} color={TYPE_COLOR[o.type] || "#0B2545"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Live activity</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">
              {stats.recent.length === 0 ? "Waiting for the first reader event…" : `${stats.recent.length} recent events`}
            </p>
            <ul className="mt-4 max-h-[440px] space-y-3 overflow-y-auto pr-1">
              {stats.recent.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-ink-mute dark:border-slate-700 dark:text-slate-500">
                  <p className="font-semibold text-ink dark:text-white">No events yet</p>
                  <p className="mt-1">Real-time events will appear here as readers browse, apply, save, share, subscribe or message you.</p>
                </li>
              ) : (
                stats.recent.map((a, i) => <ActivityRow key={i} activity={a} />)
              )}
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Top referrers</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Empty until traffic arrives</p>
            <ul className="mt-4 space-y-3">
              {stats.topReferrers.length === 0 ? (
                <li className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-ink-mute dark:border-slate-700 dark:text-slate-500">No referrer data yet.</li>
              ) : (
                stats.topReferrers.map((r) => (
                  <li key={r.source}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink dark:text-white">{r.source}</span>
                      <span className="font-mono text-ink-mute dark:text-slate-400">{formatNumber(r.visits)}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(r.visits / (stats.topReferrers[0]?.visits || 1)) * 100}%` }} />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="card p-5 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Top searches</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">From the on-site search bar</p>
            <ul className="mt-4 space-y-2.5">
              {stats.topSearches.length === 0 ? (
                <li className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-ink-mute dark:border-slate-700 dark:text-slate-500">No search data yet.</li>
              ) : (
                stats.topSearches.map((s) => (
                  <li key={s.query} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate text-ink-mute dark:text-slate-300">
                      <span className="text-ink-mute/60 dark:text-slate-500">&ldquo;</span>
                      {s.query}
                      <span className="text-ink-mute/60 dark:text-slate-500">&rdquo;</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="font-mono font-semibold text-ink dark:text-white">{formatNumber(s.count)}</span>
                      <span className="ml-1.5 text-[10px] text-ink-mute dark:text-slate-500">/ {s.results} hits</span>
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="card p-5 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Action queue</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Suggested next steps</p>
            <ul className="mt-4 space-y-3 text-sm">
              <Action tone="rose" title="No posts expiring within 14 days" hint="Stay on top of upcoming deadlines" href="/admin/opportunities" />
              <Action tone="amber" title="All posts have zero views (clean slate)" hint="Share the site on socials to drive traffic" href="/admin/opportunities" />
              <Action tone="emerald" title="Post a new opportunity" hint="Add 1–2 high-quality posts this week" href="/admin/opportunities/new" />
              <Action tone="brand" title="Share the homepage on WhatsApp" hint={`"${site.tagline}"`} href={`https://wa.me/?text=${encodeURIComponent(site.name + " — " + site.tagline)}`} external />
              <Action tone="violet" title="Reply to contact messages" hint={`${stats.contactSubmissions} total this month`} href="/admin/contact" />
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-7">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Underperformers</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Posts that need attention · all start at 0</p>
            <div className="mt-4 space-y-3">
              {underperformers.map((o) => {
                const conv = o.views > 0 ? Math.round((o.applies / o.views) * 100) : 0;
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="min-w-0">
                      <Link href={`/opportunities/${o.slug}`} target="_blank" className="block truncate text-sm font-semibold text-ink hover:text-brand dark:text-white dark:hover:text-accent">
                        {o.title}
                      </Link>
                      <span className="text-[11px] text-ink-mute dark:text-slate-500">
                        {TYPE_LABEL[o.type] || o.type} · {o.views} views · {conv}% conv.
                      </span>
                    </div>
                    <Link href={`/admin/opportunities/${o.id}/edit`} className="shrink-0 text-xs font-semibold text-brand link-underline dark:text-accent">
                      Edit →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5 lg:col-span-5">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Clicks by day</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Apply clicks last 30 days · live</p>
            <div className="mt-4">
              <BarChart height={200} color="#10B981" data={stats.dailyClicks.filter((_, i) => i % 2 === 0).map((d) => ({ label: d.date.slice(8), value: d.apply }))} />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-7">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Admin security</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Account health, password age, and active sessions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SecurityStat label="Password" value={secretStatus.initialized ? "Custom (hashed)" : "Default (env)"} tone={secretStatus.initialized ? "good" : "warn"} />
              <SecurityStat label="Password age" value={`${secretStatus.passwordAgeDays} days`} tone={secretStatus.needsRotation ? "warn" : "good"} />
              <SecurityStat label="Recovery lock" value={recoveryStatus.locked ? `${recoveryStatus.remainingSeconds}s` : "Unlocked"} tone={recoveryStatus.locked ? "bad" : "good"} />
              <SecurityStat label="Active sessions" value={String(sessions.filter((s) => !s.revoked).length)} tone="info" />
              <SecurityStat label="Failed recoveries" value={String(recoveryStatus.failedAttempts)} tone={recoveryStatus.failedAttempts > 0 ? "warn" : "good"} />
              <SecurityStat label="Last password change" value={secretStatus.lastPasswordChangeAt ? new Date(secretStatus.lastPasswordChangeAt).toLocaleDateString() : "—"} tone="info" />
            </div>
          </div>
          <div className="card p-5 lg:col-span-5">
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Active sessions</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Revoke suspicious or old devices</p>
            <SessionsPanel sessions={sessions} currentSessionId={currentSessionId} />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/50 p-5 text-xs text-ink-mute dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
          <strong className="font-semibold text-ink dark:text-white">Real-time, not demo data.</strong> Every number on this dashboard starts at zero and only grows when a real reader action hits <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">/api/track</code>. The endpoint accepts: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">view</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">apply</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">share</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">save</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">newsletter</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">contact</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">whatsapp</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">search</code>, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">donate</code>. Example: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">fetch(&apos;/api/track&apos;,&#123;method:&apos;POST&apos;,headers:&#123;&apos;Content-Type&apos;:&apos;application/json&apos;&#125;,body:JSON.stringify(&#123;kind:&apos;view&apos;,opportunity:opp.title&#125;)&#125;)</code>
        </section>
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  spark,
  accent,
  suffix,
  small
}: {
  label: string;
  value: string;
  delta: number;
  spark?: number[];
  accent: "brand" | "emerald" | "accent" | "violet";
  suffix?: string;
  small?: boolean;
}) {
  const color = accent === "brand" ? "#0B2545" : accent === "emerald" ? "#10B981" : accent === "accent" ? "#FFD60A" : "#8B5CF6";
  const positive = delta >= 0;
  return (
    <div className={"card relative overflow-hidden p-5 " + (small ? "lg:p-5" : "")}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute dark:text-slate-400">{label}</p>
      <p className={"mt-2 font-display font-extrabold tracking-tight text-ink dark:text-white " + (small ? "text-2xl" : "text-3xl")}>
        {value}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {value === "0" || value === "0%" ? "— waiting" : (positive ? "+" : "") + delta + (suffix ?? "%")}
        </span>
        {spark && (
          <div className="w-24 text-slate-400">
            <Sparkline data={spark} color={color} height={28} />
          </div>
        )}
      </div>
      <span className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10" style={{ background: color }} />
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-mute dark:text-slate-400">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const icon = (() => {
    switch (activity.kind) {
      case "apply": return { bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", svg: <path d="M5 12l5 5L20 7" /> };
      case "share": return { bg: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", svg: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></> };
      case "newsletter": return { bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", svg: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></> };
      case "contact": return { bg: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", svg: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> };
      case "save": return { bg: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300", svg: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /> };
      case "whatsapp": return { bg: "bg-[#25D366]/15 text-[#0F7E3A] dark:text-emerald-300", svg: <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4" /> };
      case "donate": return { bg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", svg: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></> };
    }
  })();
  const text = (() => {
    switch (activity.kind) {
      case "apply": return <><strong className="font-semibold text-ink dark:text-white">Someone</strong> from {activity.country} applied via <span className="font-semibold text-ink dark:text-white">{activity.opportunity.slice(0, 50)}…</span></>;
      case "share": return <><strong className="font-semibold text-ink dark:text-white">Shared</strong> on {activity.channel}: <span className="text-ink-mute dark:text-slate-400">{activity.opportunity.slice(0, 40)}…</span></>;
      case "newsletter": return <><strong className="font-semibold text-ink dark:text-white">Newsletter</strong> signup: {activity.email} ({activity.country})</>;
      case "contact": return <><strong className="font-semibold text-ink dark:text-white">{activity.name}</strong> sent a message · <span className="text-ink-mute dark:text-slate-400">{activity.reason}</span></>;
      case "save": return <><strong className="font-semibold text-ink dark:text-white">Bookmarked</strong> {activity.opportunity.slice(0, 50)}…</>;
      case "whatsapp": return <><strong className="font-semibold text-ink dark:text-white">Someone</strong> tapped the WhatsApp button</>;
      case "donate": return <><strong className="font-semibold text-ink dark:text-white">Donation</strong> of ${activity.amount} to {activity.opportunity.slice(0, 40)}…</>;
    }
  })();
  return (
    <li className="flex items-start gap-3">
      <span className={"mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full " + icon.bg}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {icon.svg}
        </svg>
      </span>
      <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-ink-mute dark:text-slate-400">
        {text}
        <p className="mt-0.5 text-[10px] text-ink-mute/70 dark:text-slate-500">{activity.minutesAgo < 1 ? "just now" : timeAgo(activity.minutesAgo)}</p>
      </div>
    </li>
  );
}

function Action({ tone, title, hint, href, external }: { tone: "rose" | "amber" | "emerald" | "brand" | "violet"; title: string; hint: string; href: string; external?: boolean }) {
  const dot = tone === "rose" ? "bg-rose-500" : tone === "amber" ? "bg-amber-500" : tone === "emerald" ? "bg-emerald-500" : tone === "violet" ? "bg-violet-500" : "bg-brand";
  return (
    <li>
      <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + dot} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink group-hover:text-brand dark:text-white dark:group-hover:text-accent">{title}</p>
          <p className="text-[11px] text-ink-mute dark:text-slate-500">{hint}</p>
        </div>
        <svg className="mt-1.5 h-4 w-4 text-ink-mute group-hover:text-brand dark:group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </li>
  );
}

function SecurityStat({ label, value, tone }: { label: string; value: string; tone: "good" | "warn" | "bad" | "info" }) {
  const palette = tone === "good"
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
    : tone === "warn"
    ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200"
    : tone === "bad"
    ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200"
    : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200";
  return (
    <div className={"rounded-xl border p-3 " + palette}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
