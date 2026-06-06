"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Sparkline } from "./Charts";
import { formatNumber } from "@/lib/analytics";
import { toast } from "./Toast";
import { adminFetch } from "./csrf";
import { confirmDialog } from "./ConfirmDialog";
import type { Opportunity, OpportunityType } from "@/types";

const TYPE_LABEL: Record<OpportunityType, string> = {
  Scholarship: "Scholarship",
  Internship: "Internship",
  Job: "Job",
  Grant: "Grant",
  Fellowship: "Fellowship",
  Competition: "Competition",
  Volunteer: "Volunteer",
  Donation: "Donation"
};

const TYPE_COLOR: Record<OpportunityType, string> = {
  Scholarship: "#0B2545",
  Internship: "#FFD60A",
  Job: "#10B981",
  Grant: "#8B5CF6",
  Fellowship: "#EC4899",
  Competition: "#F97316",
  Volunteer: "#06B6D4",
  Donation: "#EF4444"
};

type SortKey = "views" | "applies" | "conversion" | "title" | "deadline" | "shares";

export function AdminPostsTable({ opps, engagement }: { opps: Opportunity[]; engagement: ReturnType<typeof import("@/lib/analytics").getAllEngagement> }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | OpportunityType>("all");
  const [status, setStatus] = useState<"all" | "live" | "expiring" | "expired" | "featured">("all");
  const [sort, setSort] = useState<SortKey>("views");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const bulkAction = async (action: "publish" | "unpublish" | "delete") => {
    if (selected.size === 0) return;
    if (action === "delete") {
      const ok = await confirmDialog({
        title: `Delete ${selected.size} post${selected.size === 1 ? "" : "s"}?`,
        description: "This will permanently remove the selected opportunities. This action cannot be undone.",
        confirmLabel: `Delete ${selected.size}`,
        tone: "danger",
        requireText: "DELETE"
      });
      if (!ok) return;
    }
    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/opportunities/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selected), action })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast(j.error || "Action failed", "bad");
        return;
      }
      const verb = action === "publish" ? "Published" : action === "unpublish" ? "Unpublished" : "Deleted";
      toast(`${verb} ${selected.size} post${selected.size === 1 ? "" : "s"}.`, "good");
      setSelected(new Set());
      router.refresh();
    } catch {
      toast("Network error \u2014 try again.", "bad");
    } finally {
      setBusy(false);
    }
  };

  const rows = useMemo(() => {
    const now = Date.now();
    return opps
      .map((o) => {
        const e = engagement.find((x) => x.id === o.id)!;
        const days = (new Date(o.deadline).getTime() - now) / (1000 * 60 * 60 * 24);
        const status: "live" | "expiring" | "expired" = days < 0 ? "expired" : days < 14 ? "expiring" : "live";
        return { o, e, status, daysLeft: Math.round(days) };
      })
      .filter((r) => {
        if (q) {
          const t = (r.o.title + " " + r.o.organization + " " + r.o.region).toLowerCase();
          if (!t.includes(q.toLowerCase())) return false;
        }
        if (type !== "all" && r.o.type !== type) return false;
        if (status === "featured" ? !r.o.featured : status !== "all" && r.status !== status) return false;
        return true;
      })
      .sort((a, b) => {
        const f = dir === "asc" ? 1 : -1;
        switch (sort) {
          case "views": return (a.e.views - b.e.views) * f;
          case "applies": return (a.e.applyClicks - b.e.applyClicks) * f;
          case "shares": return (a.e.shareClicks - b.e.shareClicks) * f;
          case "conversion": return (a.e.conversionRate - b.e.conversionRate) * f;
          case "title": return a.o.title.localeCompare(b.o.title) * f;
          case "deadline": return (a.daysLeft - b.daysLeft) * f;
        }
      });
  }, [opps, engagement, q, type, status, sort, dir]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.o.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.o.id)));
  };
  const toggleOne = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const onSort = (k: SortKey) => {
    if (sort === k) setDir(dir === "asc" ? "desc" : "asc");
    else { setSort(k); setDir("desc"); }
  };

  const SortHead = ({ k, children, align = "left" }: { k: SortKey; children: React.ReactNode; align?: "left" | "right" }) => (
    <th className={"py-2.5 pr-2 " + (align === "right" ? "text-right" : "text-left")}>
      <button onClick={() => onSort(k)} className={"inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:text-ink dark:hover:text-white " + (sort === k ? "text-ink dark:text-white" : "text-ink-mute dark:text-slate-500")}>
        {children}
        {sort === k && <span className="text-brand dark:text-accent">{dir === "asc" ? "\u2191" : "\u2193"}</span>}
      </button>
    </th>
  );

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts, orgs, regions\u2026" className="input pl-9" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="input w-auto">
          <option value="all">All types</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input w-auto">
          <option value="all">Any status</option>
          <option value="live">Live</option>
          <option value="expiring">Expiring soon</option>
          <option value="expired">Expired</option>
          <option value="featured">Featured only</option>
        </select>
        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-mute dark:text-slate-400">{selected.size} selected</span>
            <button onClick={() => bulkAction("publish")} disabled={busy} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">Publish</button>
            <button onClick={() => bulkAction("unpublish")} disabled={busy} className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50">Unpublish</button>
            <button onClick={() => bulkAction("delete")} disabled={busy} className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50">Delete</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
            <tr>
              <th className="py-2.5 pl-4 pr-2 w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-800" />
              </th>
              <th className="py-2.5 pr-2"><SortHead k="title">Post</SortHead></th>
              <th className="py-2.5 pr-2 text-right"><SortHead k="views" align="right">Views</SortHead></th>
              <th className="py-2.5 pr-2 text-right"><SortHead k="applies" align="right">Applies</SortHead></th>
              <th className="py-2.5 pr-2 text-right"><SortHead k="shares" align="right">Shares</SortHead></th>
              <th className="py-2.5 pr-2 text-right"><SortHead k="conversion" align="right">Conv.</SortHead></th>
              <th className="py-2.5 pr-2">Trend</th>
              <th className="py-2.5 pr-2"><SortHead k="deadline">Deadline</SortHead></th>
              <th className="py-2.5 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => (
              <tr key={r.o.id} className={"group transition-colors " + (selected.has(r.o.id) ? "bg-brand-50/40 dark:bg-slate-800/40" : "hover:bg-slate-50/60 dark:hover:bg-slate-900/30")}>
                <td className="pl-4 pr-2 py-3">
                  <input type="checkbox" checked={selected.has(r.o.id)} onChange={() => toggleOne(r.o.id)} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-800" />
                </td>
                <td className="pr-2 py-3 max-w-xs">
                  <Link href={`/opportunities/${r.o.slug}`} target="_blank" className="block">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: TYPE_COLOR[r.o.type] }} />
                      <span className="truncate font-semibold text-ink group-hover:text-brand dark:text-white dark:group-hover:text-accent">
                        {r.o.title}
                      </span>
                      {r.o.featured && <span className="chip chip-accent !py-0">★</span>}
                    </div>
                    <span className="ml-4 text-[11px] text-ink-mute dark:text-slate-500">
                      {TYPE_LABEL[r.o.type]} \u00b7 {r.o.organization} \u00b7 {r.o.region}
                    </span>
                  </Link>
                </td>
                <td className="pr-2 py-3 text-right font-mono text-ink dark:text-white">{formatNumber(r.e.views)}</td>
                <td className="pr-2 py-3 text-right font-mono text-ink dark:text-white">{formatNumber(r.e.applyClicks)}</td>
                <td className="pr-2 py-3 text-right font-mono text-ink-mute dark:text-slate-400">{formatNumber(r.e.shareClicks)}</td>
                <td className="pr-2 py-3 text-right">
                  <span className={"font-mono " + (r.e.conversionRate > 7 ? "text-emerald-600 dark:text-emerald-400" : "text-ink-mute dark:text-slate-400")}>
                    {r.e.conversionRate}%
                  </span>
                </td>
                <td className="pr-2 py-3 w-24">
                  <Sparkline data={r.e.trend} color={TYPE_COLOR[r.o.type]} />
                </td>
                <td className="pr-2 py-3">
                  <span className={"chip " + (r.status === "expired" ? "chip-rose" : r.status === "expiring" ? "chip-amber" : "chip-emerald")}>
                    {r.status === "expired" ? "Expired" : r.status === "expiring" ? `${r.daysLeft}d left` : `${r.daysLeft}d`}
                  </span>
                </td>
                <td className="pr-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link href={`/admin/opportunities/${r.o.id}/edit`} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-ink-mute hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-400 dark:hover:border-accent dark:hover:text-accent">
                      Edit
                    </Link>
                    <a href={`/opportunities/${r.o.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-ink-mute hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-400 dark:hover:border-accent dark:hover:text-accent">
                      View
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-sm text-ink-mute dark:text-slate-400">
                  No posts match your filters. <button onClick={() => { setQ(""); setType("all"); setStatus("all"); }} className="text-brand link-underline dark:text-accent">Clear filters</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-ink-mute dark:border-slate-800 dark:text-slate-500">
        <span>Showing {rows.length} of {opps.length} opportunities</span>
        <div className="flex items-center gap-3">
          <span>{rows.filter((r) => r.status === "expiring").length} expiring soon</span>
          <span>{rows.filter((r) => r.status === "expired").length} expired</span>
        </div>
      </div>
    </div>
  );
}
