import Link from "next/link";

export function DbStatusBanner({
  status
}: {
  status: {
    syncStatus: string;
    syncError?: string;
    count: number;
  };
}) {
  return (
    <div className="border-b border-amber-300 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20">
      <div className="container-page py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              <strong>In-memory store.</strong> Changes persist during this dev session but reset on server restart.
              {status.syncError && (
                <span className="ml-1 text-rose-600 dark:text-rose-300">
                  Last error: {status.syncError}
                </span>
              )}
            </span>
          </div>
          <Link
            href="/SUPABASE_SETUP"
            className="rounded-full bg-amber-600 px-3 py-1 font-bold text-white hover:bg-amber-700"
          >
            Set up Supabase →
          </Link>
        </div>
      </div>
    </div>
  );
}
