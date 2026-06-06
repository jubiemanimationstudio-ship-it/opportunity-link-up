import Link from "next/link";
import { ContactActions } from "@/components/admin/ContactActions";
import { timeAgo } from "@/lib/analytics";
import { getAllContactMessages, getUnreadCount } from "@/lib/data/contact-store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin \u00b7 Contact messages" };

export default function AdminContactPage() {
  const messages = getAllContactMessages();
  const unread = getUnreadCount();
  return (
    <div>
      <main className="container-page py-8 lg:py-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Inbox</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">Contact messages</h1>
            <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">
              {messages.length} threads \u00b7 {unread} unread
            </p>
          </div>
          <Link href="/admin" className="text-xs font-semibold text-brand link-underline dark:text-accent">← Back to dashboard</Link>
        </div>

        <div className="mt-6 space-y-3">
          {messages.map((m, i) => {
            const minutesAgo = Math.max(
              1,
              Math.floor((Date.now() - +new Date(m.createdAt)) / 60000)
            );
            return (
              <div key={m.id} className={"card p-5 " + (!m.read ? "border-l-4 border-l-brand" : "")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink dark:text-white">
                          {m.name}{" "}
                          {m.country && (
                            <span className="font-normal text-ink-mute dark:text-slate-400">
                              · {m.country}
                            </span>
                          )}
                        </p>
                        <a href={`mailto:${m.email}`} className="text-xs text-brand link-underline dark:text-accent">{m.email}</a>
                      </div>
                    </div>
                    <span className="mt-2 inline-block chip chip-brand">{m.type}</span>
                  </div>
                  <span className="text-xs text-ink-mute dark:text-slate-500">{timeAgo(minutesAgo)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink dark:text-slate-300">{m.message}</p>
                <ContactActions
                  id={m.id}
                  email={m.email}
                  name={m.name}
                  reason={m.type}
                  read={m.read}
                  archived={m.archived}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
