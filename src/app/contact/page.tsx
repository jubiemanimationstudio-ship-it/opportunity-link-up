import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send Link-Up a message, submit an opportunity, report a correction or request a partnership."
};

const channels = [
  {
    title: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    description: "Best for long messages, partnership requests or media.",
    icon: "mail"
  },
  {
    title: "WhatsApp",
    value: "Chat with us",
    href: site.whatsappInvite,
    description: "Quick questions, tips, or community group invites.",
    icon: "whatsapp"
  },
  {
    title: "Twitter / X",
    value: "@LinkUpOpps",
    href: "https://twitter.com/",
    description: "We post new opportunities first on socials.",
    icon: "twitter"
  }
];

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-[rgb(9_17_33)]">
      <header className="relative isolate overflow-hidden border-b border-slate-200 bg-brand py-14 text-white dark:border-slate-800 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden="true" />
        <div className="container-page relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Contact</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            We reply to every message.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            Send us a tip, a correction, a partnership idea, or just say hi. We read everything.
          </p>
        </div>
      </header>

      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-white">Other channels</h2>
            <ul className="space-y-4">
              {channels.map((c) => (
                <li key={c.title}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand dark:bg-slate-800 dark:text-accent">
                      {c.icon === "mail" && (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
                      )}
                      {c.icon === "whatsapp" && (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
                      )}
                      {c.icon === "twitter" && (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-slate-500">{c.title}</p>
                      <p className="mt-0.5 truncate font-semibold text-brand dark:text-accent">{c.value}</p>
                      <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">{c.description}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="card p-6">
              <h3 className="font-display text-base font-bold text-ink dark:text-white">Response time</h3>
              <p className="mt-2 text-sm text-ink-mute dark:text-slate-400">
                We typically respond within 24 hours on weekdays. Tips about new opportunities are prioritised.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
