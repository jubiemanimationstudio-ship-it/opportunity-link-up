import type { ActivityItem } from "./analytics";

interface AnalyticsState {
  pageViews: number;
  uniqueVisitors: number;
  applyClicks: number;
  shareClicks: number;
  saveClicks: number;
  newsletterSubs: number;
  contactSubmissions: number;
  whatsappClicks: number;
  recent: ActivityItem[];
  lastEventAt: number;
  referrers: Map<string, number>;
  searches: Map<string, { count: number; results: number }>;
  dailyViews: { date: string; views: number; visitors: number }[];
  dailyClicks: { date: string; apply: number; share: number; save: number }[];
  visitors: Set<string>;
}

const empty: AnalyticsState = {
  pageViews: 0,
  uniqueVisitors: 0,
  applyClicks: 0,
  shareClicks: 0,
  saveClicks: 0,
  newsletterSubs: 0,
  contactSubmissions: 0,
  whatsappClicks: 0,
  recent: [],
  lastEventAt: 0,
  referrers: new Map(),
  searches: new Map(),
  dailyViews: buildEmptyDaily(),
  dailyClicks: buildEmptyDailyClicks(),
  visitors: new Set()
};

function buildEmptyDaily(): { date: string; views: number; visitors: number }[] {
  const out: { date: string; views: number; visitors: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), views: 0, visitors: 0 });
  }
  return out;
}

function buildEmptyDailyClicks(): { date: string; apply: number; share: number; save: number }[] {
  const out: { date: string; apply: number; share: number; save: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), apply: 0, share: 0, save: 0 });
  }
  return out;
}

const state: AnalyticsState = (globalThis as any).__analyticsRealtime || ((globalThis as any).__analyticsRealtime = empty);

const MAX_RECENT = 50;

export function recordEvent(event: {
  kind: "view" | "apply" | "share" | "save" | "newsletter" | "contact" | "whatsapp" | "search" | "donate";
  visitorId?: string;
  opportunity?: string;
  country?: string;
  email?: string;
  name?: string;
  reason?: string;
  channel?: "WhatsApp" | "Twitter" | "Facebook" | "LinkedIn" | "Copy";
  amount?: number;
  referrer?: string;
  query?: string;
  results?: number;
}): void {
  state.lastEventAt = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const dv = state.dailyViews.find((d) => d.date === today);
  const dc = state.dailyClicks.find((d) => d.date === today);

  switch (event.kind) {
    case "view":
      state.pageViews++;
      if (event.visitorId) {
        if (!state.visitors.has(event.visitorId)) {
          state.visitors.add(event.visitorId);
          state.uniqueVisitors++;
          if (dv) dv.visitors++;
        }
      } else if (dv) {
        dv.visitors++;
      }
      if (dv) dv.views++;
      if (event.referrer) {
        state.referrers.set(event.referrer, (state.referrers.get(event.referrer) || 0) + 1);
      }
      break;
    case "apply":
      state.applyClicks++;
      if (dc) dc.apply++;
      if (event.opportunity) {
        pushRecent({ kind: "apply", opportunity: event.opportunity, country: event.country || "Unknown", minutesAgo: 0 });
      }
      break;
    case "share":
      state.shareClicks++;
      if (dc) dc.share++;
      if (event.opportunity) {
        pushRecent({ kind: "share", opportunity: event.opportunity, channel: event.channel || "Copy", minutesAgo: 0 });
      }
      break;
    case "save":
      state.saveClicks++;
      if (dc) dc.save++;
      if (event.opportunity) {
        pushRecent({ kind: "save", opportunity: event.opportunity, minutesAgo: 0 });
      }
      break;
    case "newsletter":
      state.newsletterSubs++;
      if (event.email) {
        pushRecent({ kind: "newsletter", email: event.email, country: event.country || "Unknown", minutesAgo: 0 });
      }
      break;
    case "contact":
      state.contactSubmissions++;
      if (event.name) {
        pushRecent({ kind: "contact", name: event.name, reason: event.reason || "General", minutesAgo: 0 });
      }
      break;
    case "whatsapp":
      state.whatsappClicks++;
      pushRecent({ kind: "whatsapp", minutesAgo: 0 });
      break;
    case "donate":
      if (event.opportunity) {
        pushRecent({ kind: "donate", opportunity: event.opportunity, amount: event.amount || 0, minutesAgo: 0 });
      }
      break;
    case "search":
      if (event.query) {
        const cur = state.searches.get(event.query) || { count: 0, results: 0 };
        cur.count++;
        cur.results = event.results ?? cur.results;
        state.searches.set(event.query, cur);
      }
      break;
  }
}

function pushRecent(item: ActivityItem): void {
  state.recent.unshift(item);
  if (state.recent.length > MAX_RECENT) state.recent.length = MAX_RECENT;
  for (const a of state.recent) {
    if (a.kind === "apply" || a.kind === "save" || a.kind === "whatsapp") {
      a.minutesAgo = Math.max(0, a.minutesAgo);
    }
  }
}

export function getRealtimeStats() {
  const topReferrers = Array.from(state.referrers.entries())
    .map(([source, visits]) => ({ source, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 6);
  const topSearches = Array.from(state.searches.entries())
    .map(([query, v]) => ({ query, count: v.count, results: v.results }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return {
    pageViews: state.pageViews,
    uniqueVisitors: state.uniqueVisitors,
    applyClicks: state.applyClicks,
    shareClicks: state.shareClicks,
    saveClicks: state.saveClicks,
    newsletterSubs: state.newsletterSubs,
    contactSubmissions: state.contactSubmissions,
    whatsappClicks: state.whatsappClicks,
    lastEventAt: state.lastEventAt,
    recent: state.recent.slice(0, 18),
    topReferrers: topReferrers.length ? topReferrers : [],
    topSearches: topSearches.length ? topSearches : [],
    dailyViews: state.dailyViews,
    dailyClicks: state.dailyClicks,
    engagementByType: [],
    oppStats: []
  };
}

export function resetAnalyticsState(): void {
  state.pageViews = 0;
  state.uniqueVisitors = 0;
  state.applyClicks = 0;
  state.shareClicks = 0;
  state.saveClicks = 0;
  state.newsletterSubs = 0;
  state.contactSubmissions = 0;
  state.whatsappClicks = 0;
  state.recent = [];
  state.lastEventAt = 0;
  state.referrers = new Map();
  state.searches = new Map();
  state.dailyViews = buildEmptyDaily();
  state.dailyClicks = buildEmptyDailyClicks();
  state.visitors = new Set();
}

export type OppStats = {
  slug: string;
  title: string;
  type: string;
  views: number;
  applies: number;
  shares: number;
  saves: number;
};

export async function getSupabaseStats(): Promise<{
  pageViews: number;
  uniqueVisitors: number;
  applyClicks: number;
  shareClicks: number;
  saveClicks: number;
  newsletterSubs: number;
  contactSubmissions: number;
  whatsappClicks: number;
  lastEventAt: number;
  recent: ActivityItem[];
  topReferrers: { source: string; visits: number }[];
  topSearches: { query: string; count: number; results: number }[];
  dailyViews: { date: string; views: number; visitors: number }[];
  dailyClicks: { date: string; apply: number; share: number; save: number }[];
  oppStats: OppStats[];
} | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();

    let allRows: any[] = [];
    let offset = 0;
    const pageSize = 1000;
    while (true) {
      const res = await fetch(
        `${url}/rest/v1/analytics_events?created_at=gte.${since}&order=created_at.desc&offset=${offset}&limit=${pageSize}`,
        {
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        }
      );
      if (!res.ok) break;
      const batch = await res.json() as any[];
      allRows = allRows.concat(batch);
      if (batch.length < pageSize) break;
      offset += pageSize;
      if (offset > 10000) break;
    }

    let pageViews = 0;
    let uniqueVisitors = 0;
    let applyClicks = 0;
    let shareClicks = 0;
    let saveClicks = 0;
    let newsletterSubs = 0;
    let contactSubmissions = 0;
    let whatsappClicks = 0;
    let lastEventAt = 0;
    const visitors = new Set<string>();
    const dailyViews = buildEmptyDaily();
    const dailyClicks = buildEmptyDailyClicks();
    const recent: ActivityItem[] = [];
    const oppMap = new Map<string, { slug: string; title: string; type: string; views: number; applies: number; shares: number; saves: number }>();

    for (const row of allRows) {
      const ts = new Date(row.created_at).getTime();
      if (ts > lastEventAt) lastEventAt = ts;
      const day = row.created_at.slice(0, 10);

      const oppKey = row.slug || row.opportunity || "";
      if (oppKey && !oppMap.has(oppKey)) {
        oppMap.set(oppKey, { slug: row.slug || "", title: row.opportunity || "", type: row.opp_type || "Unknown", views: 0, applies: 0, shares: 0, saves: 0 });
      }
      const opp = oppMap.get(oppKey);

      switch (row.kind) {
        case "view":
          pageViews++;
          if (row.visitor_id && !visitors.has(row.visitor_id)) {
            visitors.add(row.visitor_id);
            uniqueVisitors++;
            const dv = dailyViews.find(d => d.date === day);
            if (dv) dv.visitors++;
          }
          const dvAll = dailyViews.find(d => d.date === day);
          if (dvAll) dvAll.views++;
          if (opp) opp.views++;
          break;
        case "apply":
          applyClicks++;
          const dcA = dailyClicks.find(d => d.date === day);
          if (dcA) dcA.apply++;
          if (opp) opp.applies++;
          if (row.opportunity) recent.push({ kind: "apply", opportunity: row.opportunity, country: row.country || "Unknown", minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
        case "share":
          shareClicks++;
          const dcS = dailyClicks.find(d => d.date === day);
          if (dcS) dcS.share++;
          if (opp) opp.shares++;
          if (row.opportunity) recent.push({ kind: "share", opportunity: row.opportunity, channel: row.channel || "Copy", minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
        case "save":
          saveClicks++;
          const dcSV = dailyClicks.find(d => d.date === day);
          if (dcSV) dcSV.save++;
          if (opp) opp.saves++;
          if (row.opportunity) recent.push({ kind: "save", opportunity: row.opportunity, minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
        case "newsletter":
          newsletterSubs++;
          if (row.email) recent.push({ kind: "newsletter", email: row.email, country: row.country || "Unknown", minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
        case "contact":
          contactSubmissions++;
          if (row.name) recent.push({ kind: "contact", name: row.name, reason: row.reason || "General", minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
        case "whatsapp":
          whatsappClicks++;
          recent.push({ kind: "whatsapp", minutesAgo: Math.max(0, Math.floor((Date.now() - ts) / 60000)) });
          break;
      }
    }

    const oppStats = Array.from(oppMap.values()).sort((a, b) => b.views - a.views);

    return {
      pageViews,
      uniqueVisitors: visitors.size || uniqueVisitors,
      applyClicks,
      shareClicks,
      saveClicks,
      newsletterSubs,
      contactSubmissions,
      whatsappClicks,
      lastEventAt,
      recent: recent.slice(0, 18),
      topReferrers: [],
      topSearches: [],
      dailyViews,
      dailyClicks,
      oppStats
    };
  } catch {
    return null;
  }
}

export async function getSupabaseEngagement(): Promise<Map<string, { views: number; applies: number; shares: number; saves: number }>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const map = new Map<string, { views: number; applies: number; shares: number; saves: number }>();
  if (!url || !key) return map;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();

    let allRows: any[] = [];
    let offset = 0;
    const pageSize = 1000;
    while (true) {
      const res = await fetch(
        `${url}/rest/v1/analytics_events?created_at=gte.${since}&select=kind,slug&offset=${offset}&limit=${pageSize}`,
        {
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        }
      );
      if (!res.ok) break;
      const batch = await res.json() as any[];
      allRows = allRows.concat(batch);
      if (batch.length < pageSize) break;
      offset += pageSize;
      if (offset > 10000) break;
    }

    for (const row of allRows) {
      if (!row.slug) continue;
      if (!map.has(row.slug)) {
        map.set(row.slug, { views: 0, applies: 0, shares: 0, saves: 0 });
      }
      const entry = map.get(row.slug)!;
      if (row.kind === "view") entry.views++;
      else if (row.kind === "apply") entry.applies++;
      else if (row.kind === "share") entry.shares++;
      else if (row.kind === "save") entry.saves++;
    }
  } catch {
    // silent
  }
  return map;
}
