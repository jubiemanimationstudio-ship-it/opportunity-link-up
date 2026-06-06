import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedOpportunities } from "@/components/home/FeaturedOpportunities";
import { LatestOpportunities } from "@/components/home/LatestOpportunities";
import { DonationsSpotlight } from "@/components/home/DonationsSpotlight";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import {
  getAllOpportunities,
  getFeaturedOpportunities,
  getOpportunitiesByType,
  getStats
} from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Scholarships, Internships, Jobs & Grants \u2014 Discover Your Next Opportunity",
  description:
    "The Opportunity Link-up is your daily hub for verified scholarships, internships, grants, jobs, fellowships and charitable causes \u2014 curated for ambitious Africans and global achievers."
};

export default async function HomePage() {
  const all = await getAllOpportunities();
  const featured = await getFeaturedOpportunities(3);
  const latest = all.filter((o) => o.type !== "Donation").slice(0, 6);
  const donations = await getOpportunitiesByType("Donation");
  const stats = await getStats();

  return (
    <>
      <Hero
        stats={{
          total: stats.total,
          views: stats.totalViews,
          regions: stats.regions
        }}
      />
      <TrustBar />
      <CategoryGrid />
      <FeaturedOpportunities items={featured} />
      <LatestOpportunities items={latest} />
      <DonationsSpotlight items={donations} />
      <NewsletterCTA />
    </>
  );
}
