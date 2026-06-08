import crypto from "node:crypto";

interface VerificationCode {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

const MAX_ATTEMPTS = 5;
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const COOLDOWN_MS = 60 * 1000; // 1 minute between requests

const store: Map<string, VerificationCode> =
  (globalThis as any).__recoveryCodes ||
  ((globalThis as any).__recoveryCodes = new Map());

const cooldowns: Map<string, number> =
  (globalThis as any).__recoveryCooldowns ||
  ((globalThis as any).__recoveryCooldowns = new Map());

function cleanup() {
  const now = Date.now();
  for (const [key, code] of store) {
    if (code.expiresAt < now) store.delete(key);
  }
  for (const [key, ts] of cooldowns) {
    if (now - ts > COOLDOWN_MS) cooldowns.delete(key);
  }
}

export function generateCode(email: string): { code: string; error?: string; retryAfterSeconds?: number } {
  cleanup();
  const key = email.toLowerCase().trim();
  const now = Date.now();

  const lastSent = cooldowns.get(key);
  if (lastSent && now - lastSent < COOLDOWN_MS) {
    return {
      code: "",
      error: `Please wait ${Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000)} seconds before requesting another code.`,
      retryAfterSeconds: Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000)
    };
  }

  // Invalidate any existing code for this email
  store.delete(key);

  const code = crypto.randomInt(100000, 999999).toString();
  store.set(key, {
    code,
    email: key,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    createdAt: now
  });
  cooldowns.set(key, now);

  return { code };
}

export function verifyCode(
  email: string,
  inputCode: string
): { ok: boolean; error?: string; locked?: boolean; remainingSeconds?: number } {
  cleanup();
  const key = email.toLowerCase().trim();
  const record = store.get(key);

  if (!record) {
    return { ok: false, error: "No verification code found. Request a new one." };
  }

  const now = Date.now();
  if (record.expiresAt < now) {
    store.delete(key);
    return { ok: false, error: "Code expired. Request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return {
      ok: false,
      error: "Too many failed attempts. Request a new code.",
      locked: true,
      remainingSeconds: 0
    };
  }

  record.attempts++;

  // Constant-time comparison
  const a = Buffer.from(inputCode.trim(), "utf8");
  const b = Buffer.from(record.code, "utf8");
  if (a.length !== b.length) {
    return { ok: false, error: `Incorrect code. ${MAX_ATTEMPTS - record.attempts} attempts remaining.` };
  }
  const match = crypto.timingSafeEqual(a, b);
  if (!match) {
    return { ok: false, error: `Incorrect code. ${MAX_ATTEMPTS - record.attempts} attempts remaining.` };
  }

  // Code verified — delete it (one-time use)
  store.delete(key);
  return { ok: true };
}

export function isCodePending(email: string): boolean {
  const key = email.toLowerCase().trim();
  return store.has(key);
}

export function getCodeExpiry(email: string): number {
  const key = email.toLowerCase().trim();
  const record = store.get(key);
  if (!record) return 0;
  return Math.max(0, record.expiresAt - Date.now());
}
