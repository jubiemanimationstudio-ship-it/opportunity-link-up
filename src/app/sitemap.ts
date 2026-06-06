import type { MetadataRoute } from "next";
import { getAllOpportunities } from "@/lib/opportunities";
import { categories } from "@/lib/data/meta";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();
  const opps = await getAllOpportunities();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/opportunities`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 }
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  const opportunityPages: MetadataRoute.Sitemap = opps.map((o) => ({
    url: `${base}/opportunities/${o.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: o.featured ? 0.85 : 0.7
  }));

  return [...staticPages, ...categoryPages, ...opportunityPages];
}
