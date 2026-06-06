import type { Opportunity, OpportunityType } from "@/types";
import {
  getAllFromStore,
  findById,
  findBySlug,
  isSupabaseConfigured,
  getStoreStatus
} from "./data/store";

export { categories, affiliateResources } from "./data/meta";
export { isSupabaseConfigured, getStoreStatus } from "./data/store";

export async function getAllOpportunities(): Promise<Opportunity[]> {
  const list = await getAllFromStore();
  return [...list].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
}

export async function getFeaturedOpportunities(
  limit?: number
): Promise<Opportunity[]> {
  const all = await getAllOpportunities();
  const featured = all.filter((o) => o.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getOpportunityBySlug(
  slug: string
): Promise<Opportunity | undefined> {
  return findBySlug(slug);
}

export async function getOpportunityById(
  id: string
): Promise<Opportunity | undefined> {
  return findById(id);
}

export async function getOpportunitiesByType(
  type: OpportunityType
): Promise<Opportunity[]> {
  return (await getAllOpportunities()).filter((o) => o.type === type);
}

export async function getOpportunitiesByCategorySlug(
  slug: string
): Promise<Opportunity[]> {
  const normalized = slug.toLowerCase();
  return (await getAllOpportunities()).filter((o) => {
    if (o.type.toLowerCase() === normalized) return true;
    if (o.category.toLowerCase() === normalized) return true;
    if (o.level && o.level.toLowerCase() === normalized) return true;
    if (o.funding && o.funding.toLowerCase().replace(/\s+/g, "-") === normalized) return true;
    if (o.region.toLowerCase() === normalized) return true;
    if (normalized === "remote" && o.remote) return true;
    if (o.tags.map((t) => t.toLowerCase().replace(/\s+/g, "-")).includes(normalized)) return true;
    return false;
  });
}

export async function getRelatedOpportunities(
  slug: string,
  limit = 3
): Promise<Opportunity[]> {
  const all = await getAllOpportunities();
  const current = all.find((o) => o.slug === slug);
  if (!current) return [];
  return all
    .filter((o) => o.slug !== slug)
    .map((o) => ({
      o,
      score:
        (o.type === current.type ? 3 : 0) +
        (o.region === current.region ? 1 : 0) +
        (o.level && o.level === current.level ? 1 : 0) +
        (o.funding && o.funding === current.funding ? 1 : 0) +
        o.tags.filter((t) => current.tags.includes(t)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.o);
}

export interface OpportunityFilters {
  type?: OpportunityType | "";
  level?: string;
  funding?: string;
  region?: string;
  remoteOnly?: boolean;
}

export async function searchOpportunities(
  query: string,
  filters?: OpportunityFilters
): Promise<Opportunity[]> {
  const q = query.trim().toLowerCase();
  const all = await getAllOpportunities();
  return all.filter((o) => {
    const hay = [
      o.title,
      o.excerpt,
      o.location || "",
      o.tags.join(" "),
      o.category,
      o.type,
      o.organization,
      o.level || "",
      o.funding || ""
    ]
      .join(" ")
      .toLowerCase();
    const matchesQ = !q || hay.includes(q);
    const matchesType = !filters?.type || o.type === filters.type;
    const matchesLevel = !filters?.level || o.level === filters.level;
    const matchesFunding = !filters?.funding || o.funding === filters.funding;
    const matchesRegion = !filters?.region || o.region === filters.region;
    const matchesRemote = !filters?.remoteOnly || o.remote === true;
    return matchesQ && matchesType && matchesLevel && matchesFunding && matchesRegion && matchesRemote;
  });
}

export async function getStats() {
  const all = await getAllOpportunities();
  const counts: Record<OpportunityType, number> = {
    Scholarship: 0,
    Internship: 0,
    Job: 0,
    Grant: 0,
    Fellowship: 0,
    Competition: 0,
    Volunteer: 0,
    Donation: 0
  };
  for (const o of all) counts[o.type] = (counts[o.type] || 0) + 1;
  const totalViews = all.reduce((sum, o) => sum + (o.views || 0), 0);
  return {
    total: all.length,
    countsByType: counts,
    totalViews,
    countries: new Set(all.map((o) => o.location).filter(Boolean)).size,
    regions: new Set(all.map((o) => o.region)).size
  };
}
