import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/email-verification";
import {
  checkRecoveryPassphrase,
  rotatePassword,
  validatePasswordStrength,
  isAdminPasswordInitialized,
  getAdminEmail
} from "@/lib/admin-secrets";
import { setAdminSession } from "@/lib/auth";
import { audit, getClientIp, getLockoutState, recordFailedAttempt, resetAttempts } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const lock = getLockoutState(ip);
  if (lock.locked) {
    return NextResponse.json(
      { error: "Account recovery locked. Try again later.", remainingSeconds: lock.remainingSeconds },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { email, code, passphrase, newPassword, confirm } = body as {
    email?: string;
    code?: string;
    passphrase?: string;
    newPassword?: string;
    confirm?: string;
  };

  // Validate all fields present
  if (!email || !code || !passphrase || !newPassword || !confirm) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // Validate admin is initialized
  if (!isAdminPasswordInitialized()) {
    return NextResponse.json({ error: "No recovery passphrase configured." }, { status: 400 });
  }

  // Check email matches admin email
  const adminEmail = getAdminEmail();
  if (!adminEmail || email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
    audit({ action: "recover.verify", ip, meta: { outcome: "wrong_email" } });
    return NextResponse.json({ error: "Email does not match admin account." }, { status: 403 });
  }

  // Step 1: Verify email code
  const codeResult = verifyCode(email, code);
  if (!codeResult.ok) {
    audit({ action: "recover.verify", ip, meta: { outcome: "wrong_code" } });
    return NextResponse.json({ error: codeResult.error }, { status: 403 });
  }

  // Step 2: Verify recovery passphrase
  const passResult = checkRecoveryPassphrase(passphrase);
  if (passResult.locked) {
    audit({ action: "recover.verify", ip, meta: { outcome: "passphrase_locked" } });
    return NextResponse.json(
      { error: "Recovery locked. Too many wrong passphrase attempts.", remainingSeconds: passResult.remainingSeconds },
      { status: 429 }
    );
  }
  if (!passResult.ok) {
    recordFailedAttempt(ip);
    audit({ action: "recover.verify", ip, meta: { outcome: "wrong_passphrase" } });
    return NextResponse.json({ error: "Recovery passphrase is incorrect." }, { status: 403 });
  }

  // Step 3: Validate passwords match
  if (newPassword !== confirm) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  // Step 4: Validate password strength
  const pwErr = validatePasswordStrength(newPassword);
  if (pwErr) {
    return NextResponse.json({ error: pwErr }, { status: 400 });
  }

  // Step 5: Rotate password
  const rot = rotatePassword(newPassword);
  if (!rot.ok) {
    return NextResponse.json({ error: rot.error || "Failed to update password." }, { status: 400 });
  }

  // Success — auto-login
  resetAttempts(ip);
  setAdminSession();
  audit({ action: "recover.verify", ip, meta: { outcome: "ok" } });

  return NextResponse.json({ ok: true });
}
