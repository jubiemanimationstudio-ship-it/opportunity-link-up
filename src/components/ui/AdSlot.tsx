"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

type AdSize = "leaderboard" | "rectangle" | "skyscraper" | "responsive" | "in-article";

const dimensions: Record<AdSize, { w: string; h: string; format?: string }> = {
  leaderboard: { w: "min(728px, 100%)", h: "90px" },
  rectangle: { w: "300px", h: "250px" },
  skyscraper: { w: "160px", h: "600px" },
  responsive: { w: "100%", h: "auto", format: "auto" },
  "in-article": { w: "100%", h: "auto", format: "fluid" }
};

export function AdSlot({
  slot,
  size = "responsive",
  className,
  label = "Advertisement"
}: {
  slot?: string;
  size?: AdSize;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!site.adsense.enabled || !slot) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // noop
    }
  }, [slot]);

  const dims = dimensions[size];
  const enabled = site.adsense.enabled && slot;

  return (
    <aside
      aria-label={label}
      className={`group/ad relative my-6 mx-auto flex w-full max-w-[728px] flex-col items-center ${className ?? ""}`}
    >
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-mute dark:text-slate-500">
        {label}
      </span>
      {enabled ? (
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{ display: "block", width: dims.w, height: dims.h }}
          data-ad-client={site.adsense.client}
          data-ad-slot={slot}
          data-ad-format={dims.format ?? "auto"}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-xs font-medium text-ink-mute dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500"
          style={{
            minHeight: size === "rectangle" ? 250 : size === "leaderboard" ? 90 : 120,
            maxWidth: dims.w
          }}
        >
          Ad slot ({size}) — activates after AdSense approval
        </div>
      )}
    </aside>
  );
}
