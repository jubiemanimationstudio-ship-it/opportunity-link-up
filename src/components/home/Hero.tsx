import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { site } from "@/lib/site";

export function Hero({ stats }: { stats: { total: number; views: number; regions: number } }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand text-white" aria-labelledby="hero-heading">
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
      <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full bg-brand-300/30 blur-3xl" aria-hidden="true" />

      <div className="container-page relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            New opportunities daily
          </div>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Where Opportunity
            <span className="block">
              Meets{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand">Ambition</span>
                <span
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent sm:h-4 lg:h-5"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Verified scholarships, internships, jobs, grants and giving opportunities — curated daily for ambitious people. One link, one click, your next chapter.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" placeholder="Try ‘Chevening’, ‘Google internship’ or ‘grants for women’…" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/opportunities" variant="accent" size="lg">
              Browse All Opportunities
            </Button>
            <a
              href={site.whatsappInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:border-accent hover:bg-white/10"
            >
              <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
              Join WhatsApp Family
            </a>
          </div>

          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
            <Stat number={`${stats.total}+`} label="Live opportunities" />
            <Stat number={`${stats.regions}`} label="Regions covered" />
            <Stat number={`${(stats.views / 1000).toFixed(1)}K`} label="Monthly readers" />
          </dl>
        </div>
      </div>

      <div className="relative h-12 sm:h-16">
        <svg className="absolute inset-x-0 bottom-0 h-full w-full text-white dark:text-[rgb(9_17_33)]" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 80 L0 30 Q 360 80 720 40 T 1440 30 L1440 80 Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <dt className="font-display text-2xl font-extrabold text-accent sm:text-3xl">{number}</dt>
      <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:text-xs">{label}</dd>
    </div>
  );
}
