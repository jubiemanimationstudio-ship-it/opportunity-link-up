import Link from "next/link";
import { getAuditLog } from "@/lib/security";
import { timeAgo } from "@/lib/analytics";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const metadata = { title: "Admin \u00b7 Audit log" };

const ACTION_LABEL: Record<string, { label: string; tone: "brand" | "emerald" | "amber" | "rose" | "violet" }> = {
  "login.success": { label: "Login success", tone: "emerald" },
  "login.failed": { label: "Login failed", tone: "rose" },
  "login.blocked": { label: "Login blocked", tone: "rose" },
  "logout": { label: "Logout", tone: "brand" },
  "opportunity.create": { label: "Post created", tone: "emerald" },
  "opportunity.update": { label: "Post updated", tone: "brand" },
  "opportunity.delete": { label: "Post deleted", tone: "rose" },
  "opportunity.bulk.publish": { label: "Bulk publish", tone: "emerald" },
  "opportunity.bulk.unpublish": { label: "Bulk unpublish", tone: "amber" },
  "opportunity.bulk.delete": { label: "Bulk delete", tone: "rose" },
  "contact.read": { label: "Message read", tone: "brand" },
  "contact.archive": { label: "Message archived", tone: "amber" },
  "csrf.rejected": { label: "CSRF rejected", tone: "rose" }
};

export default function AdminAuditPage() {
  const events = getAuditLog(200);
  return (
    <div>
      <main className="container-page py-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Security</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">Audit log</h1>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
              {events.length} events \u00b7 in-memory \u00b7 auto-clears on server restart. Persist to Supabase for permanent history.
            </p>
          </div>
          <Link href="/admin" className="text-xs font-semibold text-brand link-underline dark:text-accent">← Back to dashboard</Link>
        </div>

        <div className="mt-6 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-ink-mute dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">When</th>
                  <th className="py-2.5 pr-2">Action</th>
                  <th className="py-2.5 pr-2">IP</th>
                  <th className="py-2.5 pr-2">Target</th>
                  <th className="py-2.5 pr-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-mute dark:text-slate-400">
                      No events yet. Log in or perform an action to see entries.
                    </td>
                  </tr>
                )}
                {events.map((e) => {
                  const meta = ACTION_LABEL[e.action] || { label: e.action, tone: "brand" as const };
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                      <td className="px-4 py-3 text-xs text-ink-mute dark:text-slate-400 whitespace-nowrap">
                        {new Date(e.ts).toLocaleString()} <span className="text-ink-mute/60">\u00b7 {timeAgo(Math.floor((Date.now() - e.ts) / 60000))}</span>
                      </td>
                      <td className="py-3 pr-2">
                        <span className={"chip chip-" + meta.tone}>{meta.label}</span>
                      </td>
                      <td className="py-3 pr-2 font-mono text-xs text-ink-mute dark:text-slate-400">{e.ip}</td>
                      <td className="py-3 pr-2 max-w-xs truncate font-mono text-xs text-ink dark:text-slate-300">{e.target || "\u2014"}</td>
                      <td className="py-3 pr-2 max-w-md truncate text-xs text-ink-mute dark:text-slate-400">
                        {e.meta ? JSON.stringify(e.meta) : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
