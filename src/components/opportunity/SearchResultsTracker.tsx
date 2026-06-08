"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

export function SearchResultsTracker({
  query,
  resultsCount
}: {
  query: string;
  resultsCount: number;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (query && !fired.current) {
      fired.current = true;
      track("search", { query, results: resultsCount });
    }
  }, [query, resultsCount]);
  return null;
}
