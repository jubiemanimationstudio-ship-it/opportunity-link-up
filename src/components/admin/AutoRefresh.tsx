"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    const id = setInterval(() => {
      if (active.current) router.refresh();
    }, intervalMs);
    return () => {
      active.current = false;
      clearInterval(id);
    };
  }, [router, intervalMs]);

  return null;
}
