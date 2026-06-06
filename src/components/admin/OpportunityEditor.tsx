"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { adminFetch } from "./csrf";
import { confirmDialog } from "./ConfirmDialog";
import type { Opportunity, OpportunityType } from "@/types";

const TYPES: { value: OpportunityType; label: string; color: string }[] = [
  { value: "Scholarship", label: "Scholarship", color: "brand" },
  { value: "Internship", label: "Internship", color: "accent" },
  { value: "Job", label: "Job", color: "emerald" },
  { value: "Grant", label: "Grant", color: "violet" },
  { value: "Fellowship", label: "Fellowship", color: "pink" },
  { value: "Competition", label: "Competition", color: "orange" },
  { value: "Volunteer", label: "Volunteering", color: "sky" },
  { value: "Donation", label: "Donation / Cause", color: "rose" }
];

type Status = "draft" | "published" | "archived";

export function OpportunityEditor({ initial }: { initial?: Partial<Opportunity> }) {
  const router = useRouter();
  const isNew = !initial?.id;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<Status>((initial?.status as Status) || "draft");
  const [f, setF] = useState<Partial<Opportunity>>({
    title: "",
    slug: "",
    type: "Scholarship",
    organization: "",
    region: "Worldwide",
    remote: false,
    amount: "",
    funding: "Fully Funded",
    level: "Open",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    applyUrl: "",
    donateUrl: "",
    coverImage: "",
    excerpt: "",
    content: "",
    tags: [],
    featured: false,
    ...initial
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(", "));

  const set = (k: keyof Opportunity, v: any) => setF((s) => ({ ...s, [k]: v }));

  const autoSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

  const onSave = async (nextStatus: Status) => {
    if (!f.title || !f.organization || !f.deadline) {
      toast("Title, organisation and deadline are required.", "bad");
      return;
    }
    setSaving(true);
    const payload: Partial<Opportunity> = {
      ...f,
      slug: f.slug || autoSlug(f.title || ""),
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      status: nextStatus
    } as any;
    try {
      const res = await adminFetch(isNew ? "/api/admin/opportunities" : `/api/admin/opportunities/${f.id}`, {
        method: isNew ? "POST" : "PATCH",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast(j.error || "Save failed", "bad");
        return;
      }
      setStatus(nextStatus);
      const verb = nextStatus === "published" ? "Published" : nextStatus === "draft" ? "Saved as draft" : "Archived";
      toast(verb + ".", "good");
      router.refresh();
    } catch {
      toast("Network error.", "bad");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (isNew || !f.id) return;
    const ok = await confirmDialog({
      title: "Delete this opportunity?",
      description: `This will permanently remove \u201c${f.title}\u201d. This action cannot be undone.`,
      confirmLabel: "Delete forever",
      tone: "danger",
      requireText: "DELETE"
    });
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/opportunities/${f.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast(j.error || "Delete failed", "bad");
        setDeleting(false);
        return;
      }
      toast("Post deleted.", "good");
      router.push("/admin/opportunities");
      router.refresh();
    } catch {
      toast("Network error.", "bad");
      setDeleting(false);
    }
  };

  const onArchive = async () => {
    await onSave("archived");
  };

  return (
    <div className="space-y-5">
      {!isNew && (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-mute dark:text-slate-400">Current status:</span>
            <span className={
              "chip " + (status === "published" ? "chip-emerald" : status === "archived" ? "chip-rose" : "chip-amber")
            }>
              {status === "published" ? "Published" : status === "archived" ? "Archived" : "Draft"}
            </span>
            {f.featured && <span className="chip chip-accent">Featured</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onArchive} disabled={saving || status === "archived"} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-ink disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white">
              {status === "archived" ? "Archived" : "Archive"}
            </button>
            <button onClick={onDelete} disabled={deleting} className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              {deleting ? "Deleting\u2026" : "Delete"}
            </button>
          </div>
        </div>
      )}

      <div className="card p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink dark:text-white">Basics</h2>
            <p className="text-xs text-ink-mute dark:text-slate-400">Title, type and headline info</p>
          </div>
          <span className="chip chip-brand">Required</span>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label">Title <span className="text-rose-500">*</span></label>
            <input
              value={f.title || ""}
              onChange={(e) => {
                set("title", e.target.value);
                if (!f.slug || f.slug === autoSlug(f.title || "")) set("slug", autoSlug(e.target.value));
              }}
              className="input"
              placeholder="e.g. Rhodes Trust Scholarship 2026"
            />
            <p className="mt-1 text-[11px] text-ink-mute dark:text-slate-500">{(f.title || "").length}/120 characters</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Type <span className="text-rose-500">*</span></label>
              <select value={f.type} onChange={(e) => set("type", e.target.value as OpportunityType)} className="input">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Organisation <span className="text-rose-500">*</span></label>
              <input value={f.organization || ""} onChange={(e) => set("organization", e.target.value)} className="input" placeholder="e.g. The Rhodes Trust" />
            </div>
          </div>
          <div>
            <label className="label">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-mute dark:text-slate-500">opportunitylinkup.com/opportunities/</span>
              <input value={f.slug || ""} onChange={(e) => set("slug", e.target.value)} className="input flex-1" placeholder="auto-generated" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 lg:p-6">
        <h2 className="font-display text-base font-bold text-ink dark:text-white">Details</h2>
        <p className="text-xs text-ink-mute dark:text-slate-400">What, where, who, when</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Region</label>
            <input value={f.region || ""} onChange={(e) => set("region", e.target.value)} className="input" placeholder="e.g. Africa, Global, UK" />
          </div>
          <div>
            <label className="label">Level</label>
            <select value={f.level || "Any"} onChange={(e) => set("level", e.target.value)} className="input">
              <option>Any</option>
              <option>High school</option>
              <option>Undergraduate</option>
              <option>Masters</option>
              <option>PhD</option>
              <option>Postdoc</option>
              <option>Early career</option>
              <option>Mid career</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <label className="label">Funding</label>
            <input value={f.funding || ""} onChange={(e) => set("funding", e.target.value)} className="input" placeholder="e.g. Fully funded, Partial, Stipend" />
          </div>
          <div>
            <label className="label">Amount (display)</label>
            <input value={f.amount || ""} onChange={(e) => set("amount", e.target.value)} className="input" placeholder="e.g. $70,000/yr, \u00a31,500 stipend" />
          </div>
          <div>
            <label className="label">Deadline <span className="text-rose-500">*</span></label>
            <input type="date" value={typeof f.deadline === "string" ? f.deadline.slice(0, 10) : ""} onChange={(e) => set("deadline", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="input" placeholder="masters, africa, oxford" />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink dark:text-slate-300">
          <input type="checkbox" checked={!!f.remote} onChange={(e) => set("remote", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-800" />
          Remote / online friendly
        </label>
      </div>

      <div className="card p-5 lg:p-6">
        <h2 className="font-display text-base font-bold text-ink dark:text-white">Links</h2>
        <p className="text-xs text-ink-mute dark:text-slate-400">Where readers go to act</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Apply URL</label>
            <input value={f.applyUrl || ""} onChange={(e) => set("applyUrl", e.target.value)} className="input" placeholder="https://\u2026" />
          </div>
          <div>
            <label className="label">Donate URL (causes only)</label>
            <input value={f.donateUrl || ""} onChange={(e) => set("donateUrl", e.target.value)} className="input" placeholder="https://\u2026" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Cover image URL</label>
            <input value={f.coverImage || ""} onChange={(e) => set("coverImage", e.target.value)} className="input" placeholder="https://images.unsplash.com/\u2026" />
            <p className="mt-1 text-[11px] text-ink-mute dark:text-slate-500">Use Unsplash or your Supabase storage URL. Recommended 1200x630.</p>
          </div>
        </div>
      </div>

      <div className="card p-5 lg:p-6">
        <h2 className="font-display text-base font-bold text-ink dark:text-white">Content</h2>
        <p className="text-xs text-ink-mute dark:text-slate-400">Excerpt and full content (Markdown supported)</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label">Excerpt (1\u20132 sentences)</label>
            <textarea value={f.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="input resize-y" placeholder="Why this opportunity matters" />
          </div>
          <div>
            <label className="label">Content (Markdown)</label>
            <textarea value={f.content || ""} onChange={(e) => set("content", e.target.value)} rows={14} className="input font-mono text-sm resize-y" placeholder={"# About\n\nDescribe the opportunity…\n\n## Eligibility\n…\n\n## How to apply\n…"} />
            <p className="mt-1 text-[11px] text-ink-mute dark:text-slate-500">{(f.content || "").length} characters · Markdown headings, lists, **bold**, [links](url)</p>
          </div>
        </div>
      </div>

      <div className="card p-5 lg:p-6">
        <h2 className="font-display text-base font-bold text-ink dark:text-white">Visibility</h2>
        <label className="mt-3 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/20">
          <input type="checkbox" checked={!!f.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-800" />
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Feature on homepage</p>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">Featured posts get ~3x more views. Use sparingly for the best opportunities.</p>
          </div>
        </label>
      </div>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="text-xs text-ink-mute dark:text-slate-400">
          {saving ? "Saving\u2026" : isNew ? "New post \u2014 unsaved" : "Editing \u2014 changes are not auto-saved"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => router.push("/admin/opportunities")} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-mute hover:text-ink dark:border-slate-700 dark:text-slate-400 dark:hover:text-white">
            Cancel
          </button>
          <button onClick={() => onSave("draft")} disabled={saving} className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50">
            Save draft
          </button>
          <button onClick={() => onSave(status === "published" ? "published" : "published")} disabled={saving} className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50">
            {saving ? "Saving\u2026" : status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
