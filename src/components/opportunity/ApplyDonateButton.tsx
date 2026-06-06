"use client";

import Link from "next/link";
import { track } from "@/lib/track";

export function ApplyDonateButton({
  href,
  isDonation,
  title,
  slug
}: {
  href: string;
  isDonation: boolean;
  title: string;
  slug: string;
}) {
  const onClick = () => {
    track(isDonation ? "donate" : "apply", { opportunity: title, slug });
  };
  if (isDonation) {
    return (
      <Link
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-flex w-full items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        Donate now
      </Link>
    );
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-accent inline-flex w-full items-center justify-center gap-2"
    >
      Apply on official site
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17l10-10M7 7h10v10" />
      </svg>
    </Link>
  );
}

export function WhatsAppSidebarLink({
  href,
  title
}: {
  href: string;
  title: string;
}) {
  return (
    <a
      href={href}
      onClick={() => track("whatsapp", { opportunity: title, channel: "sidebar" })}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
      Ask the WhatsApp Family
    </a>
  );
}
