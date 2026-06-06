"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}/opportunities/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const text = encodeURIComponent(`${title} \u2014 via ${site.shortName}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track("share", { opportunity: title, slug, channel: "copy" });
    } catch {
      // noop
    }
  };

  const handleNative = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title,
          text: title,
          url
        });
        track("share", { opportunity: title, slug, channel: "native" });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share">
      <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-mute dark:text-slate-400">
        Share
      </span>
      <ShareBtn
        label="WhatsApp"
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        bg="bg-[#25D366]"
        onClick={() => track("share", { opportunity: title, slug, channel: "whatsapp" })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
      </ShareBtn>
      <ShareBtn
        label="Twitter / X"
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        bg="bg-black"
        onClick={() => track("share", { opportunity: title, slug, channel: "twitter" })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </ShareBtn>
      <ShareBtn
        label="Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        bg="bg-[#1877F2]"
        onClick={() => track("share", { opportunity: title, slug, channel: "facebook" })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z" /></svg>
      </ShareBtn>
      <ShareBtn
        label="LinkedIn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        bg="bg-[#0A66C2]"
        onClick={() => track("share", { opportunity: title, slug, channel: "linkedin" })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
      </ShareBtn>
      <ShareBtn
        label="Telegram"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        bg="bg-[#26A5E4]"
        onClick={() => track("share", { opportunity: title, slug, channel: "telegram" })}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
      </ShareBtn>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 px-3 text-xs font-semibold text-ink transition-all hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-accent dark:hover:text-accent"
      >
        {copied ? (
          <>
            <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy link
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleNative}
        aria-label="More sharing options"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-ink transition-all hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-accent dark:hover:text-accent sm:hidden"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      </button>
    </div>
  );
}

function ShareBtn({
  label,
  href,
  bg,
  children,
  onClick
}: {
  label: string;
  href: string;
  bg: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-110 ${bg}`}
    >
      {children}
    </a>
  );
}
