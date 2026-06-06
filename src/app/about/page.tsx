import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { getStats } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Opportunity Link-up is built by educators, students and grant recipients on a mission to link ambitious people with life-changing opportunities."
};

export default async function AboutPage() {
  const stats = await getStats();
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="relative isolate overflow-hidden border-b border-slate-200 bg-brand py-14 text-white dark:border-slate-800 lg:py-24">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden="true" />
        <div className="container-page relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">About Link-Up</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            We link ambitious people to life-changing opportunities.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
            Too many world-class scholarships, internships, jobs and grants quietly go unclaimed every year. Not because applicants aren’t qualified — because they never heard about them in time. We exist to close that gap.
          </p>
        </div>
      </header>

      <section className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">Our story</h2>
            <div className="prose-article mt-5">
              <p>
                The Opportunity Link-up started as a WhatsApp group. A few past scholarship winners and grant recipients started sharing open calls with friends, then friends of friends. Within months, the group hit its 1,024-member cap. We split it. It filled again. People asked for a website.
              </p>
              <p>
                We built Link-Up because the existing scholarship blogs were either spammy, outdated, or pay-walled behind fake “membership” fees. Our promise is simple: every opportunity here is verified, every link goes to the official source, and the site stays free.
              </p>
              <h2>How we fund this</h2>
              <p>
                Link-Up is free for readers, but it takes real money to run. We sustain the site through three transparent revenue streams: tasteful display advertising, affiliate links to tools we have personally vetted (clearly marked), and voluntary tips from readers. We will never paywall opportunity information.
              </p>
              <h2>What we believe</h2>
              <p>
                Talent is universal. Opportunity is not. Most of the people we have helped never imagined themselves at Oxford, Stanford, Google or the World Bank — until we showed them the door was open. Our job is to keep showing the doors.
              </p>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="card p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-mute dark:text-slate-400">
                By the numbers
              </h3>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <Stat number={`${stats.total}+`} label="Live opportunities" />
                <Stat number={`${stats.regions}`} label="Regions" />
                <Stat number={`${(stats.totalViews / 1000).toFixed(1)}K`} label="Monthly readers" />
                <Stat number="100%" label="Free for everyone" />
              </dl>
            </div>

            <div className="card overflow-hidden">
              <div className="bg-brand p-6 text-white dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Join the family</p>
                <h3 className="mt-2 font-display text-xl font-extrabold">
                  The Link-Up WhatsApp Group
                </h3>
                <p className="mt-2 text-sm text-slate-200">
                  Daily opportunity alerts, deadline reminders, peer support and Q&A with past recipients.
                </p>
              </div>
              <div className="p-6">
                <a
                  href={site.whatsappInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
                  Join the WhatsApp Family
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-ink dark:text-white">Got a tip?</h3>
              <p className="mt-2 text-sm text-ink-mute dark:text-slate-400">
                Know about an opportunity we are missing? Send us a tip and we will verify and publish it.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="/contact" variant="primary" size="sm">
                  Send a tip
                </Button>
                <Link
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-brand dark:border-slate-700 dark:text-slate-400 dark:hover:text-accent"
                >
                  {site.email}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-extrabold text-brand dark:text-accent sm:text-3xl">{number}</dt>
      <dd className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-mute dark:text-slate-500">{label}</dd>
    </div>
  );
}
