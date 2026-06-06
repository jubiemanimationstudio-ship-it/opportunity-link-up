import crypto from "node:crypto";

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
  lockoutLevel: number;
}

const attempts: Map<string, AttemptRecord> = (globalThis as any).__loginAttempts || ((globalThis as any).__loginAttempts = new Map());

export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000;
export const LOCKOUT_DURATIONS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000, 24 * 60 * 60_000];
export const SESSION_TTL_SECONDS = 4 * 60 * 60;

export interface LockoutState {
  locked: boolean;
  remainingMs: number;
  remainingSeconds: number;
  level: number;
}

export function getLockoutState(ip: string): LockoutState {
  const record = attempts.get(ip);
  if (!record) return { locked: false, remainingMs: 0, remainingSeconds: 0, level: 0 };
  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMs = record.lockedUntil - now;
    return { locked: true, remainingMs, remainingSeconds: Math.ceil(remainingMs / 1000), level: record.lockoutLevel };
  }
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.delete(ip);
  }
  return { locked: false, remainingMs: 0, remainingSeconds: 0, level: 0 };
}

export function recordFailedAttempt(ip: string): LockoutState {
  const now = Date.now();
  const record = attempts.get(ip) || { count: 0, firstAttempt: now, lockedUntil: 0, lockoutLevel: 0 };
  if (now - record.firstAttempt > WINDOW_MS) {
    record.count = 0;
    record.firstAttempt = now;
    record.lockedUntil = 0;
    record.lockoutLevel = 0;
  }
  record.count++;
  if (record.count >= MAX_ATTEMPTS) {
    const level = Math.floor((record.count - MAX_ATTEMPTS) / MAX_ATTEMPTS);
    const idx = Math.min(level, LOCKOUT_DURATIONS.length - 1);
    record.lockoutLevel = level;
    record.lockedUntil = now + LOCKOUT_DURATIONS[idx];
  }
  attempts.set(ip, record);
  return getLockoutState(ip);
}

export function resetAttempts(ip: string): void {
  attempts.delete(ip);
}

export function remainingAttempts(ip: string): number {
  const state = getLockoutState(ip);
  if (state.locked) return 0;
  const record = attempts.get(ip);
  return Math.max(0, MAX_ATTEMPTS - (record?.count || 0));
}

export function checkPasswordConstantTime(input: string, expected: string): boolean {
  const a = Buffer.from(String(input), "utf8");
  const b = Buffer.from(String(expected), "utf8");
  const len = Math.max(a.length, b.length, 1);
  const aPad = Buffer.concat([a, Buffer.alloc(len - a.length)]);
  const bPad = Buffer.concat([b, Buffer.alloc(len - b.length)]);
  const equal = crypto.timingSafeEqual(aPad, bPad);
  return equal && a.length === b.length;
}

export interface AuditEvent {
  id: string;
  ts: number;
  ip: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
}

const auditLog: AuditEvent[] = (globalThis as any).__auditLog || ((globalThis as any).__auditLog = []);
const MAX_AUDIT_ENTRIES = 500;

export function audit(event: Omit<AuditEvent, "id" | "ts">): void {
  const entry: AuditEvent = { id: crypto.randomUUID(), ts: Date.now(), ...event };
  auditLog.unshift(entry);
  if (auditLog.length > MAX_AUDIT_ENTRIES) auditLog.length = MAX_AUDIT_ENTRIES;
  console.log(`[AUDIT] ${entry.action} ip=${entry.ip} target=${entry.target || "-"}`);
}

export function getAuditLog(limit = 100): AuditEvent[] {
  return auditLog.slice(0, limit);
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
