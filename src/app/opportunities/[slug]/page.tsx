import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllOpportunities,
  getOpportunityBySlug,
  getRelatedOpportunities
} from "@/lib/opportunities";
import { site } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { AdSlot } from "@/components/ui/AdSlot";
import { BackButton } from "@/components/ui/BackButton";
import { ShareButtons } from "@/components/opportunity/ShareButtons";
import { OpportunitySidebar } from "@/components/opportunity/OpportunitySidebar";
import { RelatedOpportunities } from "@/components/opportunity/RelatedOpportunities";
import { ViewTracker } from "@/components/opportunity/ViewTracker";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const all = await getAllOpportunities();
  return all.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const opp = await getOpportunityBySlug(params.slug);
  if (!opp) return { title: "Not found" };
  return {
    title: opp.title,
    description: opp.excerpt,
    openGraph: {
      title: opp.title,
      description: opp.excerpt,
      type: "article",
      publishedTime: opp.publishedAt,
      modifiedTime: opp.updatedAt,
      images: [{ url: opp.coverImage, width: 1600, height: 1000, alt: opp.coverImageAlt || opp.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: opp.title,
      description: opp.excerpt,
      images: [opp.coverImage]
    },
    alternates: { canonical: `${site.url}/opportunities/${opp.slug}` }
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const opp = await getOpportunityBySlug(params.slug);
  if (!opp) notFound();

  const related = await getRelatedOpportunities(params.slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": opp.type === "Job" ? "JobPosting" : "Article",
    headline: opp.title,
    description: opp.excerpt,
    image: opp.coverImage,
    datePublished: opp.publishedAt,
    dateModified: opp.updatedAt || opp.publishedAt,
    author: { "@type": "Organization", name: opp.organization },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.svg` }
    },
    ...(opp.type === "Job" && {
      title: opp.title,
      hiringOrganization: { "@type": "Organization", name: opp.organization },
      jobLocation: opp.location
        ? { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: opp.location } }
        : undefined,
      validThrough: opp.deadline,
      employmentType: opp.duration
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ViewTracker slug={opp.slug} title={opp.title} />

      <article className="bg-white dark:bg-[rgb(9_17_33)]">
        <header className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-page pt-10 pb-12 lg:pt-14 lg:pb-16">
            <BackButton className="mb-4" />
            <nav aria-label="Breadcrumb" className="text-xs text-ink-mute dark:text-slate-400">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-brand dark:hover:text-accent">Home</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/opportunities" className="hover:text-brand dark:hover:text-accent">Opportunities</Link></li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/categories/${opp.type.toLowerCase()}`}
                    className="hover:text-brand dark:hover:text-accent"
                  >
                    {opp.type}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="brand">{opp.type}</Badge>
              {opp.funding && <Badge tone="accent">{opp.funding}</Badge>}
              {opp.level && <Badge tone="muted">{opp.level}</Badge>}
              {opp.featured && <Badge tone="warn">★ Featured</Badge>}
            </div>

            <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight text-balance text-ink dark:text-white sm:text-4xl lg:text-5xl">
              {opp.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-mute dark:text-slate-300 sm:text-lg">
              {opp.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-mute dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Published {formatDate(opp.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                {opp.readingTimeMinutes} min read
              </span>
              {opp.views !== undefined && (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  {opp.views.toLocaleString()} views
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="container-page py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card">
                <Image
                  src={opp.coverImage}
                  alt={opp.coverImageAlt || opp.title}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="my-6">
                <ShareButtons title={opp.title} slug={opp.slug} />
              </div>

              <div
                className="prose-article"
                dangerouslySetInnerHTML={{ __html: opp.content }}
              />

              <div className="my-10">
                <AdSlot slot="article-mid" size="in-article" label="Sponsored" />
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div className="text-sm text-ink-mute dark:text-slate-400">
                  Found this useful? Share it with someone who needs it.
                </div>
                <ShareButtons title={opp.title} slug={opp.slug} />
              </div>
            </div>

            <div className="lg:col-span-4">
              <OpportunitySidebar opp={opp} />
            </div>
          </div>
        </div>
      </article>

      <RelatedOpportunities items={related} />
    </>
  );
}
