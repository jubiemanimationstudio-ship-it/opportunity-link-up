import crypto from "node:crypto";

export interface AdminSecretConfig {
  passwordHash: string;
  recoveryPassphraseHash: string;
  passwordHint: string;
  adminEmail: string;
  passwordSetAt: number;
  lastPasswordChangeAt: number;
  failedRecoveryAttempts: number;
  lockedUntil: number;
}

const DEFAULTS: AdminSecretConfig = {
  passwordHash: "",
  recoveryPassphraseHash: "",
  passwordHint: "",
  adminEmail: "",
  passwordSetAt: 0,
  lastPasswordChangeAt: 0,
  failedRecoveryAttempts: 0,
  lockedUntil: 0
};

const store: { config: AdminSecretConfig; loaded: boolean } = (globalThis as any).__adminSecretConfig || ((globalThis as any).__adminSecretConfig = { config: { ...DEFAULTS }, loaded: false });

function getConfig(): AdminSecretConfig {
  if (!store.config) store.config = { ...DEFAULTS };
  return store.config;
}

function setConfig(next: AdminSecretConfig): void {
  store.config = next;
  saveConfigToSupabase(next).catch(() => {});
}

async function loadConfigFromSupabase(): Promise<AdminSecretConfig> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ...DEFAULTS };
  try {
    const res = await fetch(`${url}/rest/v1/admin_config?id=eq.main&select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!res.ok) return { ...DEFAULTS };
    const rows = await res.json() as any[];
    if (!rows.length) return { ...DEFAULTS };
    const r = rows[0];
    return {
      passwordHash: r.password_hash || "",
      recoveryPassphraseHash: r.recovery_passphrase_hash || "",
      passwordHint: r.password_hint || "",
      adminEmail: r.admin_email || "",
      passwordSetAt: r.password_set_at || 0,
      lastPasswordChangeAt: r.last_password_change_at || 0,
      failedRecoveryAttempts: r.failed_recovery_attempts || 0,
      lockedUntil: r.locked_until || 0
    };
  } catch {
    return { ...DEFAULTS };
  }
}

async function saveConfigToSupabase(config: AdminSecretConfig): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/admin_config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        id: "main",
        password_hash: config.passwordHash,
        recovery_passphrase_hash: config.recoveryPassphraseHash,
        password_hint: config.passwordHint,
        admin_email: config.adminEmail,
        password_set_at: config.passwordSetAt,
        last_password_change_at: config.lastPasswordChangeAt,
        failed_recovery_attempts: config.failedRecoveryAttempts,
        locked_until: config.lockedUntil
      })
    });
  } catch {}
}

export async function ensureConfigLoaded(): Promise<void> {
  if (store.loaded) return;
  const config = await loadConfigFromSupabase();
  if (config.passwordHash) {
    store.config = config;
  }
  store.loaded = true;
}

export function hashSecret(secret: string): string {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(secret, salt, 64).toString("base64url");
  return `${salt}:${hash}`;
}

export function verifySecret(secret: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  try {
    const got = crypto.scryptSync(secret, salt, 64).toString("base64url");
    const a = Buffer.from(got);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getActivePassword(): string {
  const config = getConfig();
  if (config.passwordHash) {
    if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  }
  return process.env.ADMIN_PASSWORD || "linkup-admin-2026";
}

export function isAdminPasswordInitialized(): boolean {
  const config = getConfig();
  return !!config.passwordHash && !!config.recoveryPassphraseHash;
}

export function initializeAdminSecrets(password: string, recoveryPassphrase: string, hint: string, adminEmail?: string): { ok: boolean; error?: string } {
  const pwErr = validatePasswordStrength(password);
  if (pwErr) return { ok: false, error: pwErr };
  if (recoveryPassphrase.length < 12) {
    return { ok: false, error: "Recovery passphrase must be at least 12 characters." };
  }
  if (password === recoveryPassphrase) {
    return { ok: false, error: "Password and recovery passphrase must differ." };
  }
  const now = Date.now();
  setConfig({
    passwordHash: hashSecret(password),
    recoveryPassphraseHash: hashSecret(recoveryPassphrase),
    passwordHint: hint.slice(0, 120),
    adminEmail: (adminEmail || "").trim().toLowerCase(),
    passwordSetAt: now,
    lastPasswordChangeAt: now,
    failedRecoveryAttempts: 0,
    lockedUntil: 0
  });
  return { ok: true };
}

export function rotatePassword(newPassword: string): { ok: boolean; error?: string } {
  const pwErr = validatePasswordStrength(newPassword);
  if (pwErr) return { ok: false, error: pwErr };
  const config = getConfig();
  setConfig({
    ...config,
    passwordHash: hashSecret(newPassword),
    lastPasswordChangeAt: Date.now()
  });
  return { ok: true };
}

export function rotateRecoveryPassphrase(newPassphrase: string): { ok: boolean; error?: string } {
  if (newPassphrase.length < 12) {
    return { ok: false, error: "Recovery passphrase must be at least 12 characters." };
  }
  const config = getConfig();
  setConfig({
    ...config,
    recoveryPassphraseHash: hashSecret(newPassphrase)
  });
  return { ok: true };
}

export function getAdminEmail(): string {
  const config = getConfig();
  return config.adminEmail || process.env.ADMIN_EMAIL || "";
}

export function setAdminEmail(email: string): void {
  const config = getConfig();
  setConfig({ ...config, adminEmail: email.trim().toLowerCase() });
}

export function checkPassword(input: string): boolean {
  const config = getConfig();
  if (config.passwordHash) {
    return verifySecret(input, config.passwordHash);
  }
  const envPassword = process.env.ADMIN_PASSWORD || "linkup-admin-2026";
  if (config.passwordHash === "" && !process.env.ADMIN_PASSWORD) {
    return checkPasswordWithConstantTime(input, envPassword);
  }
  return checkPasswordWithConstantTime(input, envPassword);
}

function checkPasswordWithConstantTime(input: string, expected: string): boolean {
  const a = Buffer.from(String(input), "utf8");
  const b = Buffer.from(String(expected), "utf8");
  const len = Math.max(a.length, b.length, 1);
  const aPad = Buffer.concat([a, Buffer.alloc(len - a.length)]);
  const bPad = Buffer.concat([b, Buffer.alloc(len - a.length)]);
  if (bPad.length !== aPad.length) {
    return false;
  }
  const equal = crypto.timingSafeEqual(aPad, bPad);
  return equal && a.length === b.length;
}

export function checkRecoveryPassphrase(input: string): { ok: boolean; locked: boolean; remainingSeconds: number } {
  const config = getConfig();
  const now = Date.now();
  if (config.lockedUntil > now) {
    return { ok: false, locked: true, remainingSeconds: Math.ceil((config.lockedUntil - now) / 1000) };
  }
  if (!config.recoveryPassphraseHash) {
    return { ok: false, locked: false, remainingSeconds: 0 };
  }
  const ok = verifySecret(input, config.recoveryPassphraseHash);
  if (ok) {
    setConfig({ ...config, failedRecoveryAttempts: 0, lockedUntil: 0 });
    return { ok: true, locked: false, remainingSeconds: 0 };
  }
  const next = config.failedRecoveryAttempts + 1;
  const lockoutSec = next >= 5 ? 3600 : 0;
  setConfig({
    ...config,
    failedRecoveryAttempts: next,
    lockedUntil: lockoutSec ? now + lockoutSec * 1000 : 0
  });
  return { ok: false, locked: !!lockoutSec, remainingSeconds: lockoutSec };
}

export function getAdminSecretStatus(): {
  initialized: boolean;
  passwordSetAt: number;
  lastPasswordChangeAt: number;
  passwordAgeDays: number;
  hint: string;
  needsRotation: boolean;
} {
  const config = getConfig();
  const initialized = !!config.passwordHash && !!config.recoveryPassphraseHash;
  const now = Date.now();
  const ageMs = config.lastPasswordChangeAt ? now - config.lastPasswordChangeAt : 0;
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  return {
    initialized,
    passwordSetAt: config.passwordSetAt,
    lastPasswordChangeAt: config.lastPasswordChangeAt,
    passwordAgeDays: ageDays,
    hint: config.passwordHint,
    needsRotation: ageDays > 90
  };
}

export function validatePasswordStrength(pw: string): string | null {
  if (typeof pw !== "string") return "Password required.";
  if (pw.length < 12) return "Password must be at least 12 characters.";
  if (pw.length > 128) return "Password is too long.";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter.";
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter.";
  if (!/\d/.test(pw)) return "Password must contain a digit.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must contain a symbol.";
  const common = ["password", "admin", "linkup-admin-2026", "123456789012", "qwertyuiop12", "letmein12345!", "welcome12345!"];
  if (common.some((c) => pw.toLowerCase().includes(c))) return "Password too common.";
  return null;
}

export function getRecoveryStatus(): { locked: boolean; remainingSeconds: number; failedAttempts: number } {
  const config = getConfig();
  const now = Date.now();
  return {
    locked: config.lockedUntil > now,
    remainingSeconds: config.lockedUntil > now ? Math.ceil((config.lockedUntil - now) / 1000) : 0,
    failedAttempts: config.failedRecoveryAttempts
  };
}

export interface ActiveSession {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: number;
  lastSeen: number;
  revoked: boolean;
}

const sessions: Map<string, ActiveSession> = (globalThis as any).__activeAdminSessions || ((globalThis as any).__activeAdminSessions = new Map());

export function registerSession(ip: string, userAgent: string): string {
  const id = crypto.randomBytes(24).toString("base64url");
  const now = Date.now();
  sessions.set(id, { id, ip, userAgent: userAgent.slice(0, 200), createdAt: now, lastSeen: now, revoked: false });
  return id;
}

export function touchSession(id: string): void {
  const s = sessions.get(id);
  if (s && !s.revoked) s.lastSeen = Date.now();
}

export function isSessionActive(id: string): boolean {
  const s = sessions.get(id);
  if (!s) return true;
  return !s.revoked;
}

export function revokeSession(id: string): boolean {
  const s = sessions.get(id);
  if (!s) return false;
  s.revoked = true;
  return true;
}

export function revokeAllSessions(exceptId?: string): number {
  let count = 0;
  for (const [id, s] of sessions) {
    if (id !== exceptId && !s.revoked) {
      s.revoked = true;
      count++;
    }
  }
  return count;
}

export function listActiveSessions(): ActiveSession[] {
  return Array.from(sessions.values()).sort((a, b) => b.lastSeen - a.lastSeen);
}

export function setSessionCookie(id: string): void {
  const { cookies } = require("next/headers");
  const isProd = process.env.NODE_ENV === "production";
  cookies().set("ha_session", id, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 4 * 60 * 60
  });
}

export function getSessionCookie(): string | undefined {
  const { cookies } = require("next/headers");
  return cookies().get("ha_session")?.value;
}

export function clearSessionCookie(): void {
  const { cookies } = require("next/headers");
  cookies().delete("ha_session");
}
