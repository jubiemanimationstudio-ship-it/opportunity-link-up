import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo />
          <span className="chip chip-brand">Admin</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/admin" className="rounded-full px-3 py-1.5 font-medium text-ink-mute hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/opportunities" className="rounded-full px-3 py-1.5 font-medium text-ink-mute hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
            All posts
          </Link>
          <Link href="/admin/contact" className="hidden rounded-full px-3 py-1.5 font-medium text-ink-mute hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:inline">
            Inbox
          </Link>
          <Link href="/admin/audit" className="hidden rounded-full px-3 py-1.5 font-medium text-ink-mute hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:inline">
            Audit
          </Link>
          <Link href="/admin/opportunities/new" className="ml-1 rounded-full bg-brand px-3 py-1.5 font-semibold text-white hover:bg-brand-700">
            + New
          </Link>
          <Link href="/" className="ml-1 hidden rounded-full px-3 py-1.5 font-medium text-ink-mute hover:text-ink dark:text-slate-400 dark:hover:text-white sm:inline">
            View site
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
