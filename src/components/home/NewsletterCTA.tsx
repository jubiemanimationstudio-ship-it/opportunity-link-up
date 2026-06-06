"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Could not subscribe");
      setStatus("success");
      setMessage("You\u2019re in! Check your inbox to confirm.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("Could not subscribe right now. Please try again later.");
    }
  };

  return (
    <section className="container-page py-16 lg:py-20" aria-labelledby="newsletter-heading">
      <div className="relative isolate overflow-hidden rounded-3xl bg-brand text-white shadow-card lg:py-20 dark:bg-slate-900">
        <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:gap-16 lg:p-16">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Daily opportunity briefing
            </p>
            <h2 id="newsletter-heading" className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
              Get the next opportunity in your inbox before everyone else.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">
              Join thousands of ambitious Africans receiving curated scholarship, internship, job and grant alerts straight to inbox. No spam. Unsubscribe anytime.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Verified opportunities only</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Deadline reminders</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Application tips & templates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>One concise daily email</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-5">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl dark:bg-slate-800 sm:flex-row sm:items-center sm:gap-2">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                placeholder="you@email.com"
                className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-mute dark:text-white dark:placeholder:text-slate-400"
              />
              <Button type="submit" variant="accent" size="md" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing\u2026" : "Subscribe"}
              </Button>
            </div>
            {message && (
              <p
                className={`mt-3 text-sm ${
                  status === "success" ? "text-emerald-300" : "text-rose-300"
                }`}
                role={status === "error" ? "alert" : undefined}
              >
                {message}
              </p>
            )}
            <p className="mt-3 text-xs text-slate-300">
              By subscribing you agree to receive emails from The Opportunity Link-up. We will never share your data.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
