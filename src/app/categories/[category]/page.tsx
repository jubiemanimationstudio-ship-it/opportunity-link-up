import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getOpportunitiesByCategorySlug } from "@/lib/opportunities";
import { categories } from "@/lib/data/meta";
import { FiltersBar } from "@/components/opportunity/FiltersBar";
import { OpportunityList } from "@/components/opportunity/OpportunityList";
import { SearchBar } from "@/components/ui/SearchBar";

interface PageProps {
  params: { category: string };
}

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} \u2014 Live opportunities`,
    description: cat.description
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) notFound();
  const items = await getOpportunitiesByCategorySlug(params.category);

  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className={`relative isolate overflow-hidden border-b border-slate-200 bg-gradient-to-br ${cat.color} dark:border-slate-800`}>
        <div className="absolute inset-0 bg-brand/80" aria-hidden="true" />
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
        <div className="container-page relative py-14 text-white lg:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-200">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href="/" className="hover:text-accent">Home</a></li>
              <li aria-hidden>/</li>
              <li><a href="/opportunities" className="hover:text-accent">Opportunities</a></li>
              <li aria-hidden>/</li>
              <li className="text-white">{cat.name}</li>
            </ol>
          </nav>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-accent">Category</p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {cat.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-200">{cat.description}</p>
          <div className="mt-6 max-w-2xl">
            <Suspense fallback={null}>
              <SearchBar size="lg" />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Suspense fallback={<div className="card h-64 animate-pulse" />}>
              <FiltersBar resultsCount={items.length} basePath={`/categories/${params.category}`} />
            </Suspense>
          </aside>
          <div className="lg:col-span-9">
            <OpportunityList items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
