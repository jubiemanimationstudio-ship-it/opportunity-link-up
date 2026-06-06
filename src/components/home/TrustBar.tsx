"use client";

import { useEffect, useRef } from "react";

const logos = [
  { name: "Chevening", text: "Chevening" },
  { name: "Mastercard Foundation", text: "Mastercard Foundation" },
  { name: "DAAD", text: "DAAD" },
  { name: "World Bank", text: "World Bank" },
  { name: "United Nations", text: "United Nations" },
  { name: "Rhodes Trust", text: "Rhodes Trust" },
  { name: "Google", text: "Google" },
  { name: "Tony Elumelu Foundation", text: "Tony Elumelu Foundation" },
  { name: "Commonwealth", text: "Commonwealth" },
  { name: "Mandela Washington", text: "Mandela Washington" }
];

export function TrustBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    const step = () => {
      x -= 0.4;
      if (Math.abs(x) >= el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-[rgb(9_17_33)]" aria-label="Trusted by organisations">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-ink-mute dark:text-slate-500">
          Featuring opportunities from
        </p>
        <div className="mt-6 overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-12 whitespace-nowrap will-change-transform"
            style={{ width: "max-content" }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-wider text-ink-mute opacity-70 transition-opacity hover:opacity-100 dark:text-slate-400 sm:text-lg"
              >
                <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5l3.09 6.26L22 7.77l-5 4.87 1.18 6.88L12 16.27l-6.18 3.25L7 12.64 2 7.77l6.91-1.01z" />
                </svg>
                {logo.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
