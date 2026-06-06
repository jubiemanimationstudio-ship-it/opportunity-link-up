"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", type: "general", message: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setForm({ name: "", email: "", type: "general", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 lg:p-8" aria-live="polite">
      {status === "success" && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
          <div>
            <p className="font-semibold">Message received.</p>
            <p className="mt-0.5">We typically reply within 24 hours during weekdays.</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          <div>
            <p className="font-semibold">Could not send right now.</p>
            <p className="mt-0.5">Please email us directly or try again.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={onChange} required className="input" placeholder="Aisha Bello" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="input" placeholder="you@email.com" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="type" className="label">Reason</label>
        <select id="type" name="type" value={form.type} onChange={onChange} className="input">
          <option value="general">General question</option>
          <option value="tip">Submit an opportunity</option>
          <option value="correction">Correct a post</option>
          <option value="partnership">Partnership / press</option>
          <option value="issue">Report an issue</option>
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" name="message" value={form.message} onChange={onChange} required rows={6} className="input resize-y" placeholder="Tell us what is on your mind..." />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-ink-mute dark:text-slate-500">By sending, you agree to our privacy policy.</p>
        <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-50">
          {status === "sending" ? "Sending\u2026" : "Send message"}
        </button>
      </div>
    </form>
  );
}
