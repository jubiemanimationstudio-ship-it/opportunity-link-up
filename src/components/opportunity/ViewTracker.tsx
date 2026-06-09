"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

export function ViewTracker({
  slug,
  title,
  type
}: {
  slug: string;
  title: string;
  type?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track("view", { opportunity: title, slug, oppType: type });
  }, [slug, title, type]);
  return null;
}
