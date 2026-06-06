"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

export function ViewTracker({
  slug,
  title
}: {
  slug: string;
  title: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const start = Date.now();
    const fire = () => {
      const dwell = Math.min(1800, Math.round((Date.now() - start) / 1000));
      track("view", { opportunity: title, slug, dwell });
    };
    const t = setTimeout(fire, 1500);
    const onUnload = () => {
      if (document.visibilityState === "visible") fire();
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onUnload);
    return () => {
      clearTimeout(t);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onUnload);
    };
  }, [slug, title]);
  return null;
}
