import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  asLink = true,
  variant = "default",
  showTagline = false
}: {
  className?: string;
  asLink?: boolean;
  variant?: "default" | "compact" | "stacked";
  showTagline?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "inline-flex items-center font-display tracking-tight",
        variant === "stacked" ? "flex-col items-start gap-1" : "gap-2",
        className
      )}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand shadow-card ring-1 ring-brand-700/40 dark:ring-accent-300/30",
          variant === "compact" ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"
        )}
      >
        <Image
          src="/logo.svg"
          alt="The Opportunity Link-up"
          width={64}
          height={64}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      {variant !== "compact" && (
        <span className="flex flex-col items-start justify-center leading-none">
          <span className="flex items-baseline gap-1 whitespace-nowrap font-extrabold">
            <span className="text-sm text-brand dark:text-white sm:text-[0.95rem]">
              The Opportunity
            </span>
            <span className="inline-block translate-y-[1px] bg-accent px-1 py-px text-[0.7rem] font-extrabold text-brand sm:text-[0.78rem]">
              Link-Up
            </span>
          </span>
          {showTagline && (
            <span className="mt-1 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ink-mute dark:text-slate-400 sm:text-[0.65rem]">
              Scholarships · Jobs · Grants · Causes
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="The Opportunity Link-up home" className="inline-block">
      {inner}
    </Link>
  );
}
