"use client";

import { hasAnalyticsConsent } from "@/components/layout/CookieConsent";

export type TrackKind =
  | "view"
  | "apply"
  | "share"
  | "save"
  | "newsletter"
  | "contact"
  | "whatsapp"
  | "search"
  | "donate";

export type TrackPayload = {
  opportunity?: string;
  slug?: string;
  query?: string;
  results?: number;
  channel?: string;
  reason?: string;
  amount?: number;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

let visitorId: string | null = null;
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  if (visitorId) return visitorId;
  try {
    const key = "tol_vid";
    const existing = window.localStorage.getItem(key);
    if (existing) {
      visitorId = existing;
      return existing;
    }
    const id = `v_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    window.localStorage.setItem(key, id);
    visitorId = id;
    return id;
  } catch {
    return "";
  }
}

export function track(kind: TrackKind, payload: TrackPayload = {}): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  try {
    const body = JSON.stringify({ kind, ...payload, visitorId: getVisitorId() });
    const blob = new Blob([body], { type: "application/json" });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const ok = navigator.sendBeacon("/api/track", blob);
      if (ok) return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    });
  } catch {
    // never let tracking break the UI
  }
}
