import { NextResponse } from "next/server";
import { checkRecoveryPassphrase, rotatePassword, validatePasswordStrength, isAdminPasswordInitialized } from "@/lib/admin-secrets";
import { setAdminSession } from "@/lib/auth";
import { generateCsrfToken } from "@/lib/security";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { audit, getClientIp, getLockoutState, recordFailedAttempt, resetAttempts, safeCompare } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;

  const ip = getClientIp(req);
  const lock = getLockoutState(ip);
  if (lock.locked) {
    return NextResponse.json({ error: "Too many attempts. Try again later.", remainingSeconds: lock.remainingSeconds }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const { passphrase, newPassword } = body as { passphrase?: string; newPassword?: string };

  if (!passphrase || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!isAdminPasswordInitialized()) {
    return NextResponse.json({ error: "No recovery passphrase set. Use the dev fallback (env password) instead." }, { status: 400 });
  }
  const result = checkRecoveryPassphrase(passphrase);
  if (result.locked) {
    audit({ action: "password.recover", ip, meta: { outcome: "locked" } });
    return NextResponse.json({ error: "Recovery locked. Try again later.", remainingSeconds: result.remainingSeconds }, { status: 429 });
  }
  if (!result.ok) {
    recordFailedAttempt(ip);
    audit({ action: "password.recover", ip, meta: { outcome: "wrong_passphrase" } });
    return NextResponse.json({ error: "Recovery passphrase is incorrect" }, { status: 403 });
  }
  const err = validatePasswordStrength(newPassword);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  const rot = rotatePassword(newPassword);
  if (!rot.ok) return NextResponse.json({ error: rot.error }, { status: 400 });
  resetAttempts(ip);
  setAdminSession();
  audit({ action: "password.recover", ip, meta: { outcome: "ok" } });
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  return NextResponse.json({
    initialized: isAdminPasswordInitialized(),
    hint: isAdminPasswordInitialized() ? "Recovery passphrase is configured." : "No recovery passphrase set yet."
  });
}

function getCsrfToken(): string {
  return generateCsrfToken();
}

function safeCompareString(a: string, b: string): boolean {
  return safeCompare(a, b);
}
