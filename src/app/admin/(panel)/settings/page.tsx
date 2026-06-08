"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/admin/Toast";
import { adminFetch } from "@/components/admin/csrf";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [currentPassphrase, setCurrentPassphrase] = useState("");
  const [newPassphrase, setNewPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => {
        setEmail(j.email || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const onSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address.", "bad");
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ email: email.trim() })
      });
      const j = await res.json();
      if (!res.ok) { toast(j.error || "Failed", "bad"); return; }
      toast("Email updated.", "good");
    } catch { toast("Network error.", "bad"); }
    finally { setSaving(false); }
  };

  const onChangePassphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassphrase || !newPassphrase) {
      toast("All fields required.", "bad");
      return;
    }
    if (newPassphrase.length < 12) {
      toast("New passphrase must be 12+ characters.", "bad");
      return;
    }
    if (newPassphrase !== confirmPassphrase) {
      toast("Passphrases do not match.", "bad");
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassphrase,
          newPassphrase
        })
      });
      const j = await res.json();
      if (!res.ok) { toast(j.error || "Failed", "bad"); return; }
      toast("Recovery passphrase updated.", "good");
      setCurrentPassphrase("");
      setNewPassphrase("");
      setConfirmPassphrase("");
    } catch { toast("Network error.", "bad"); }
    finally { setSaving(false); }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast("All fields required.", "bad");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match.", "bad");
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/password/rotate", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const j = await res.json();
      if (!res.ok) { toast(j.error || "Failed", "bad"); return; }
      toast("Password changed.", "good");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch { toast("Network error.", "bad"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <main className="container-page py-8 lg:py-10">
        <div className="card h-64 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="container-page py-8 lg:py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">Settings</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-ink-mute dark:text-slate-400">Manage your admin email, recovery passphrase, and password.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Email */}
        <form onSubmit={onSaveEmail} className="card p-5 lg:p-6">
          <h2 className="font-display text-base font-bold text-ink dark:text-white">Admin Email</h2>
          <p className="text-xs text-ink-mute dark:text-slate-400">Used for password recovery codes and security alerts.</p>
          <div className="mt-4 flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input flex-1"
              placeholder="you@example.com"
              required
            />
            <button type="submit" disabled={saving} className="btn-primary shrink-0 disabled:opacity-50">
              {saving ? "Saving…" : "Save email"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-ink-mute dark:text-slate-500">
            {email ? `Recovery codes will be sent to ${email}` : "No email set — recovery codes won't be delivered."}
          </p>
        </form>

        {/* Recovery Passphrase */}
        <form onSubmit={onChangePassphrase} className="card p-5 lg:p-6">
          <h2 className="font-display text-base font-bold text-ink dark:text-white">Recovery Passphrase</h2>
          <p className="text-xs text-ink-mute dark:text-slate-400">Required to reset your password. Must be different from your login password.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label">Current passphrase</label>
              <input
                type="password"
                value={currentPassphrase}
                onChange={(e) => setCurrentPassphrase(e.target.value)}
                className="input"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="label">New passphrase (12+ characters)</label>
              <input
                type="password"
                value={newPassphrase}
                onChange={(e) => setNewPassphrase(e.target.value)}
                className="input"
                required
                minLength={12}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="label">Confirm new passphrase</label>
              <input
                type="password"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="input"
                required
                minLength={12}
                autoComplete="off"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
            {saving ? "Updating…" : "Update passphrase"}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={onChangePassword} className="card p-5 lg:p-6">
          <h2 className="font-display text-base font-bold text-ink dark:text-white">Change Password</h2>
          <p className="text-xs text-ink-mute dark:text-slate-400">12+ characters, mixed case, number, and symbol required.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="label">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
                minLength={12}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
                minLength={12}
                autoComplete="new-password"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
            {saving ? "Changing…" : "Change password"}
          </button>
        </form>
      </div>
    </main>
  );
}
