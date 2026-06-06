import type { Opportunity } from "@/types";

export interface OpportunityEngagement {
  id: string;
  slug: string;
  title: string;
  type: string;
  views: number;
  uniqueVisitors: number;
  applyClicks: number;
  shareClicks: number;
  saveClicks: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversionRate: number;
  trend: number[];
  topReferrers: { source: string; visits: number }[];
  topCountries: { country: string; visits: number }[];
}

export interface DashboardStats {
  totalViews: number;
  uniqueVisitors: number;
  totalApplyClicks: number;
  totalShareClicks: number;
  avgConversionRate: number;
  newsletterSubs: number;
  contactSubmissions: number;
  whatsappClicks: number;
  dailyViews: { date: string; views: number; visitors: number }[];
  dailyClicks: { date: string; apply: number; share: number; save: number }[];
  engagementByType: { type: string; views: number; applies: number }[];
  topReferrers: { source: string; visits: number }[];
  topSearches: { query: string; count: number; results: number }[];
  recentActivity: ActivityItem[];
}

export type ActivityItem =
  | { kind: "apply"; opportunity: string; country: string; minutesAgo: number }
  | { kind: "share"; opportunity: string; channel: "WhatsApp" | "Twitter" | "Facebook" | "LinkedIn" | "Copy"; minutesAgo: number }
  | { kind: "newsletter"; email: string; country: string; minutesAgo: number }
  | { kind: "contact"; name: string; reason: string; minutesAgo: number }
  | { kind: "save"; opportunity: string; minutesAgo: number }
  | { kind: "whatsapp"; minutesAgo: number }
  | { kind: "donate"; opportunity: string; amount: number; minutesAgo: number };

function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

function rand(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildTrend(seed: number, days: number, base: number): number[] {
  const r = rand(seed);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    const noise = (r() - 0.45) * 0.25;
    v = Math.max(1, v * (1 + noise));
    out.push(Math.round(v));
  }
  return out;
}

const COUNTRIES = ["Nigeria", "Kenya", "Ghana", "South Africa", "India", "Pakistan", "Egypt", "Ethiopia", "UK", "US", "Uganda", "Tanzania", "Cameroon"];
const REFERRERS = [
  { source: "Google Search", weight: 0.42 },
  { source: "WhatsApp", weight: 0.22 },
  { source: "Direct", weight: 0.14 },
  { source: "Twitter / X", weight: 0.09 },
  { source: "Facebook", weight: 0.06 },
  { source: "LinkedIn", weight: 0.04 },
  { source: "Reddit", weight: 0.02 },
  { source: "Other", weight: 0.01 }
];
const SEARCH_TERMS = [
  "fully funded masters",
  "undergraduate scholarships for africans",
  "remote internships 2026",
  "data analyst jobs remote",
  "google scholarship",
  "fully funded phd",
  "commonwealth scholarship",
  "ngo grants africa",
  "engineering jobs europe",
  "fellowship for writers",
  "donate education africa",
  "summer internship usa"
];
const FIRST_NAMES = ["Aisha", "Chinedu", "Kemi", "Tunde", "Lerato", "Wanjiku", "Kwame", "Sade", "Femi", "Nuru", "Zara", "Tendai", "Mosi", "Amina"];
const LAST_NAMES = ["Bello", "Okafor", "Mensah", "Kariuki", "Mwangi", "Adeyemi", "Okeke", "Hassan", "Diallo", "Sow", "Achebe", "Mutombo"];

function weightedReferrers(seed: number) {
  const r = rand(seed);
  return REFERRERS.map((x) => ({ source: x.source, visits: Math.round(r() * 800 + (x.weight * 1200)) }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 6);
}

function countries(seed: number, count: number) {
  const r = rand(seed);
  return Array.from({ length: count }, () => ({
    country: COUNTRIES[Math.floor(r() * COUNTRIES.length)],
    visits: 0
  })).reduce<{ country: string; visits: number }[]>((acc, c) => {
    const existing = acc.find((x) => x.country === c.country);
    const inc = Math.round(r() * 400 + 50);
    if (existing) existing.visits += inc;
    else acc.push({ country: c.country, visits: inc });
    return acc;
  }, []).sort((a, b) => b.visits - a.visits).slice(0, 5);
}

export function getEngagementFor(opp: Opportunity): OpportunityEngagement {
  const seed = hash(opp.id);
  const r = rand(seed);
  const featuredBoost = opp.featured ? 3.2 : 1;
  const views = Math.round((600 + r() * 4200) * featuredBoost);
  const uniqueVisitors = Math.round(views * (0.55 + r() * 0.25));
  const applyClicks = Math.round(views * (0.04 + r() * 0.09));
  const shareClicks = Math.round(views * (0.015 + r() * 0.04));
  const saveClicks = Math.round(views * (0.01 + r() * 0.025));
  const conversionRate = +(applyClicks / Math.max(views, 1) * 100).toFixed(2);
  const bounceRate = +(35 + r() * 35).toFixed(1);
  const avgTimeOnPage = Math.round(45 + r() * 240);
  return {
    id: opp.id,
    slug: opp.slug,
    title: opp.title,
    type: opp.type,
    views,
    uniqueVisitors,
    applyClicks,
    shareClicks,
    saveClicks,
    bounceRate,
    avgTimeOnPage,
    conversionRate,
    trend: buildTrend(seed, 30, views / 30),
    topReferrers: weightedReferrers(seed + 7),
    topCountries: countries(seed + 13, 20)
  };
}

export function getAllEngagement(opps: Opportunity[]): OpportunityEngagement[] {
  return opps.map(getEngagementFor).sort((a, b) => b.views - a.views);
}

export function getDashboardStats(opps: Opportunity[]): DashboardStats {
  const r = rand(20260606);
  const all = getAllEngagement(opps);

  const totalViews = all.reduce((s, e) => s + e.views, 0);
  const uniqueVisitors = all.reduce((s, e) => s + e.uniqueVisitors, 0);
  const totalApplyClicks = all.reduce((s, e) => s + e.applyClicks, 0);
  const totalShareClicks = all.reduce((s, e) => s + e.shareClicks, 0);
  const avgConversionRate = +(all.reduce((s, e) => s + e.conversionRate, 0) / Math.max(all.length, 1)).toFixed(2);

  const newsletterSubs = 2847 + Math.floor(r() * 320);
  const contactSubmissions = 89 + Math.floor(r() * 30);
  const whatsappClicks = 14293 + Math.floor(r() * 800);

  const days = 30;
  const today = new Date();
  const dailyViews = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const base = (Math.round(totalViews / days) * (weekend ? 0.72 : 1.05)) * (0.85 + r() * 0.3);
    return {
      date: d.toISOString().slice(0, 10),
      views: Math.round(base),
      visitors: Math.round(base * 0.72)
    };
  });

  const dailyClicks = dailyViews.map((d) => {
    const apply = Math.round(d.views * (0.05 + r() * 0.05));
    const share = Math.round(d.views * (0.02 + r() * 0.03));
    const save = Math.round(d.views * (0.012 + r() * 0.02));
    return { date: d.date, apply, share, save };
  });

  const typeMap = new Map<string, { views: number; applies: number }>();
  for (const e of all) {
    const cur = typeMap.get(e.type) || { views: 0, applies: 0 };
    typeMap.set(e.type, { views: cur.views + e.views, applies: cur.applies + e.applyClicks });
  }
  const engagementByType = Array.from(typeMap.entries())
    .map(([type, v]) => ({ type, views: v.views, applies: v.applies }))
    .sort((a, b) => b.views - a.views);

  const topReferrers = REFERRERS.map((x) => ({ source: x.source, visits: Math.round(uniqueVisitors * x.weight) }))
    .sort((a, b) => b.visits - a.visits);

  const topSearches = SEARCH_TERMS.map((q) => {
    const r2 = rand(hash(q));
    return { query: q, count: Math.round(40 + r2() * 480), results: Math.round(2 + r2() * 12) };
  }).sort((a, b) => b.count - a.count).slice(0, 8);

  const recentActivity: ActivityItem[] = [];
  for (let i = 0; i < 18; i++) {
    const e = all[Math.floor(r() * all.length)];
    const minutesAgo = Math.floor(r() * 60 * 36) + 1;
    const kindRoll = r();
    if (kindRoll < 0.35) {
      recentActivity.push({
        kind: "apply",
        opportunity: e.title,
        country: COUNTRIES[Math.floor(r() * COUNTRIES.length)],
        minutesAgo
      });
    } else if (kindRoll < 0.55) {
      const channels: ActivityItem extends { kind: "share" } ? never : ("WhatsApp" | "Twitter" | "Facebook" | "LinkedIn" | "Copy")[] = ["WhatsApp", "Twitter", "Facebook", "LinkedIn", "Copy"];
      recentActivity.push({
        kind: "share",
        opportunity: e.title,
        channel: channels[Math.floor(r() * channels.length)] as "WhatsApp" | "Twitter" | "Facebook" | "LinkedIn" | "Copy",
        minutesAgo
      });
    } else if (kindRoll < 0.7) {
      recentActivity.push({
        kind: "newsletter",
        email: `${FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)].toLowerCase()}.${LAST_NAMES[Math.floor(r() * LAST_NAMES.length)].toLowerCase()}@${["gmail.com", "yahoo.com", "outlook.com"][Math.floor(r() * 3)]}`,
        country: COUNTRIES[Math.floor(r() * COUNTRIES.length)],
        minutesAgo
      });
    } else if (kindRoll < 0.82) {
      recentActivity.push({
        kind: "save",
        opportunity: e.title,
        minutesAgo
      });
    } else if (kindRoll < 0.92) {
      const reasons = ["Submit an opportunity", "General question", "Partnership / press", "Correct a post"];
      recentActivity.push({
        kind: "contact",
        name: `${FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(r() * LAST_NAMES.length)]}`,
        reason: reasons[Math.floor(r() * reasons.length)],
        minutesAgo
      });
    } else {
      recentActivity.push({ kind: "whatsapp", minutesAgo });
    }
  }
  recentActivity.sort((a, b) => a.minutesAgo - b.minutesAgo);

  return {
    totalViews,
    uniqueVisitors,
    totalApplyClicks,
    totalShareClicks,
    avgConversionRate,
    newsletterSubs,
    contactSubmissions,
    whatsappClicks,
    dailyViews,
    dailyClicks,
    engagementByType,
    topReferrers,
    topSearches,
    recentActivity
  };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function timeAgo(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
