import type { Opportunity } from "@/types";
import { scholarshipOpportunities } from "./scholarships";
import { internshipOpportunities } from "./internships";
import { jobOpportunities } from "./jobs";
import { grantOpportunities, fellowshipOpportunities } from "./grants";
import { donationOpportunities, competitionOpportunities } from "./donations";
import {
  realScholarshipOpportunities,
  realInternshipOpportunities,
  realJobOpportunities,
  realGrantOpportunities,
  realFellowshipOpportunities,
  realCompetitionOpportunities,
  realVolunteerOpportunities,
  realDonationOpportunities
} from "./real-2026";

export type SyncStatus = "memory" | "supabase" | "syncing" | "error";

interface Store {
  list: Opportunity[];
  initialized: boolean;
  lastSyncAt: number;
  syncStatus: SyncStatus;
  syncError?: string;
}

declare global {
  var __opportunityStore: Store | undefined;
}

const SYNC_TTL_MS = 30_000;

function getGlobalStore(): Store {
  if (!globalThis.__opportunityStore) {
    globalThis.__opportunityStore = {
      list: [],
      initialized: false,
      lastSyncAt: 0,
      syncStatus: "memory"
    };
  }
  return globalThis.__opportunityStore;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSampleOpportunities(): Opportunity[] {
  const legacy = [
    ...scholarshipOpportunities,
    ...internshipOpportunities,
    ...jobOpportunities,
    ...grantOpportunities,
    ...fellowshipOpportunities,
    ...donationOpportunities,
    ...competitionOpportunities
  ];
  const real2026: Opportunity[] = [
    ...realScholarshipOpportunities,
    ...realInternshipOpportunities,
    ...realJobOpportunities,
    ...realGrantOpportunities,
    ...realFellowshipOpportunities,
    ...realCompetitionOpportunities,
    ...realVolunteerOpportunities,
    ...realDonationOpportunities
  ];
  return dedupeBySlugPreferFirst([...real2026, ...legacy]);
}

function dedupeBySlugPreferFirst(list: Opportunity[]): Opportunity[] {
  const seen = new Map<string, Opportunity>();
  for (const o of list) {
    if (!o.slug) continue;
    if (!seen.has(o.slug)) seen.set(o.slug, o);
  }
  return Array.from(seen.values());
}

export function getSampleCounts() {
  const all = getSampleOpportunities();
  const byType: Record<string, number> = {};
  for (const o of all) byType[o.type] = (byType[o.type] || 0) + 1;
  return {
    total: all.length,
    byType
  };
}

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function rowToOpportunity(row: any): Opportunity {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    coverImage: row.cover_image || "",
    coverImageAlt: row.cover_image_alt || "",
    organization: row.organization || "",
    category: row.category || "",
    tags: row.tags || [],
    level: row.level || undefined,
    funding: row.funding || undefined,
    amount: row.amount || undefined,
    duration: row.duration || undefined,
    location: row.location || undefined,
    region: row.region || "Global",
    remote: row.remote || false,
    deadline: row.deadline || new Date().toISOString(),
    publishedAt: row.published_at || row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined,
    readingTimeMinutes: row.reading_time_minutes || 5,
    author: {
      name: row.author_name || "The Link-Up Team",
      role: row.author_role || "Editorial",
      avatar: row.author_avatar || undefined
    },
    featured: row.featured || false,
    views: row.views || 0,
    applyUrl: row.apply_url || undefined,
    donateUrl: row.donate_url || undefined,
    raisedAmount: row.raised_amount || undefined,
    goalAmount: row.goal_amount || undefined,
    status: row.status || "published"
  };
}

function opportunityToRow(opp: Partial<Opportunity>): any {
  return {
    id: opp.id,
    slug: opp.slug,
    type: opp.type,
    title: opp.title,
    excerpt: opp.excerpt,
    content: opp.content,
    cover_image: opp.coverImage,
    cover_image_alt: opp.coverImageAlt,
    organization: opp.organization,
    category: opp.category,
    tags: opp.tags || [],
    level: opp.level,
    funding: opp.funding,
    amount: opp.amount,
    duration: opp.duration,
    location: opp.location,
    region: opp.region,
    remote: opp.remote || false,
    deadline: opp.deadline,
    published_at: opp.publishedAt,
    updated_at: new Date().toISOString(),
    reading_time_minutes: opp.readingTimeMinutes || 5,
    author_name: opp.author?.name,
    author_role: opp.author?.role,
    author_avatar: opp.author?.avatar,
    featured: opp.featured || false,
    views: opp.views || 0,
    apply_url: opp.applyUrl,
    donate_url: opp.donateUrl,
    raised_amount: opp.raisedAmount,
    goal_amount: opp.goalAmount,
    status: opp.status || "draft"
  };
}

async function syncFromSupabase(): Promise<void> {
  const store = getGlobalStore();
  const sb = await getSupabaseClient();
  if (!sb) return;
  store.syncStatus = "syncing";
  try {
    const { data, error } = await sb.from("opportunities").select("*");
    if (error) throw new Error(error.message);
    if (Array.isArray(data) && data.length > 0) {
      store.list = data.map(rowToOpportunity);
    }
    store.syncStatus = "supabase";
    store.syncError = undefined;
    store.lastSyncAt = Date.now();
  } catch (e: any) {
    store.syncStatus = "error";
    store.syncError = e?.message || "Sync failed";
  }
}

async function ensureInitialized(): Promise<void> {
  const store = getGlobalStore();
  if (!store.initialized) {
    store.list = getSampleOpportunities();
    store.initialized = true;
    store.syncStatus = isSupabaseConfigured() ? "supabase" : "memory";
    if (isSupabaseConfigured()) {
      await syncFromSupabase();
    }
  } else if (
    isSupabaseConfigured() &&
    Date.now() - store.lastSyncAt > SYNC_TTL_MS
  ) {
    await syncFromSupabase();
  }
}

export function getStoreStatus() {
  const store = getGlobalStore();
  return {
    syncStatus: store.syncStatus,
    syncError: store.syncError,
    count: store.list.length,
    usingSupabase: isSupabaseConfigured(),
    lastSyncAt: store.lastSyncAt
  };
}

export async function getAllFromStore(): Promise<Opportunity[]> {
  await ensureInitialized();
  return getGlobalStore().list;
}

export async function findById(id: string): Promise<Opportunity | undefined> {
  await ensureInitialized();
  return getGlobalStore().list.find((o) => o.id === id);
}

export async function findBySlug(slug: string): Promise<Opportunity | undefined> {
  await ensureInitialized();
  return getGlobalStore().list.find((o) => o.slug === slug);
}

export async function addToStore(
  opp: Partial<Opportunity>
): Promise<Opportunity> {
  await ensureInitialized();
  const now = new Date().toISOString();
  const id =
    opp.id ||
    `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newOpp: Opportunity = {
    id,
    slug: opp.slug || id,
    type: opp.type || "Scholarship",
    title: opp.title || "Untitled",
    excerpt: opp.excerpt || "",
    content: opp.content || "",
    coverImage: opp.coverImage || "",
    coverImageAlt: opp.coverImageAlt,
    organization: opp.organization || "",
    category: opp.category || opp.type?.toLowerCase() || "general",
    tags: opp.tags || [],
    level: opp.level,
    funding: opp.funding,
    amount: opp.amount,
    duration: opp.duration,
    location: opp.location,
    region: opp.region || "Worldwide",
    remote: opp.remote || false,
    deadline: opp.deadline || now,
    publishedAt: opp.publishedAt || now,
    updatedAt: now,
    readingTimeMinutes: opp.readingTimeMinutes || 5,
    author: opp.author || {
      name: "The Link-Up Team",
      role: "Editorial"
    },
    featured: opp.featured || false,
    views: opp.views || 0,
    applyUrl: opp.applyUrl,
    donateUrl: opp.donateUrl,
    raisedAmount: opp.raisedAmount,
    goalAmount: opp.goalAmount,
    status: opp.status || "draft"
  };
  getGlobalStore().list.unshift(newOpp);
  getGlobalStore().lastSyncAt = 0;

  const sb = await getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb.from("opportunities").insert(opportunityToRow(newOpp));
      if (error) throw new Error(error.message);
      getGlobalStore().syncStatus = "supabase";
    } catch (e: any) {
      getGlobalStore().syncStatus = "error";
      getGlobalStore().syncError = `Saved in memory only. Supabase: ${e?.message || "unknown error"}`;
    }
  }
  return newOpp;
}

export async function updateInStore(
  id: string,
  patch: Partial<Opportunity>
): Promise<Opportunity | undefined> {
  await ensureInitialized();
  const store = getGlobalStore();
  const idx = store.list.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const updated: Opportunity = {
    ...store.list[idx],
    ...patch,
    id: store.list[idx].id,
    updatedAt: new Date().toISOString()
  };
  store.list[idx] = updated;
  store.lastSyncAt = 0;

  const sb = await getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb
        .from("opportunities")
        .update(opportunityToRow(updated))
        .eq("id", id);
      if (error) throw new Error(error.message);
      store.syncStatus = "supabase";
    } catch (e: any) {
      store.syncStatus = "error";
      store.syncError = `Updated in memory only. Supabase: ${e?.message || "unknown error"}`;
    }
  }
  return updated;
}

export async function deleteFromStore(id: string): Promise<boolean> {
  await ensureInitialized();
  const store = getGlobalStore();
  const before = store.list.length;
  store.list = store.list.filter((o) => o.id !== id);
  const removed = store.list.length < before;
  if (removed) store.lastSyncAt = 0;

  const sb = await getSupabaseClient();
  if (sb && removed) {
    try {
      const { error } = await sb.from("opportunities").delete().eq("id", id);
      if (error) throw new Error(error.message);
      store.syncStatus = "supabase";
    } catch (e: any) {
      store.syncStatus = "error";
      store.syncError = `Deleted in memory only. Supabase: ${e?.message || "unknown error"}`;
    }
  }
  return removed;
}

export async function bulkActionInStore(
  ids: string[],
  action: "publish" | "unpublish" | "delete" | "archive"
): Promise<number> {
  await ensureInitialized();
  const store = getGlobalStore();
  let count = 0;
  if (action === "delete") {
    const before = store.list.length;
    store.list = store.list.filter((o) => !ids.includes(o.id));
    count = before - store.list.length;
  } else {
    const status =
      action === "publish" ? "published" : action === "archive" ? "archived" : "draft";
    for (const o of store.list) {
      if (ids.includes(o.id)) {
        o.status = status as Opportunity["status"];
        o.updatedAt = new Date().toISOString();
        count++;
      }
    }
  }
  if (count > 0) store.lastSyncAt = 0;

  const sb = await getSupabaseClient();
  if (sb && count > 0) {
    try {
      if (action === "delete") {
        const { error } = await sb.from("opportunities").delete().in("id", ids);
        if (error) throw new Error(error.message);
      } else {
        const status =
          action === "publish" ? "published" : action === "archive" ? "archived" : "draft";
        const { error } = await sb
          .from("opportunities")
          .update({ status, updated_at: new Date().toISOString() })
          .in("id", ids);
        if (error) throw new Error(error.message);
      }
      store.syncStatus = "supabase";
    } catch (e: any) {
      store.syncStatus = "error";
      store.syncError = `Bulk ${action} in memory only. Supabase: ${e?.message || "unknown error"}`;
    }
  }
  return count;
}

export function resetStore(): void {
  globalThis.__opportunityStore = {
    list: [],
    initialized: false,
    lastSyncAt: 0,
    syncStatus: "memory"
  };
}
