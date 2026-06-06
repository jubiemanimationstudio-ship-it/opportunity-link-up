"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-ink antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h1 className="mt-6 max-w-xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Something went wrong on our end.
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-mute">
            We logged the issue. Please try again — if it keeps happening, let us know and we will fix it.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-ink-mute/70">Error ref: {error.digest}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={reset} className="btn-primary">Try again</button>
            <Link href="/" className="btn-outline">Go home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
