import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { getAdminEmail, setAdminEmail, checkRecoveryPassphrase, rotateRecoveryPassphrase, getAdminSecretStatus } from "@/lib/admin-secrets";
import { audit, getClientIp } from "@/lib/security";
import { middlewareForAdminApi } from "@/lib/admin-middleware";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = getAdminEmail();
  const status = getAdminSecretStatus();
  return NextResponse.json({ email, initialized: status.initialized, hint: status.hint });
}

export async function PATCH(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ip = getClientIp(req);

  // Update email
  if (body.email !== undefined) {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    setAdminEmail(email);
    audit({ action: "settings.email.update", ip, meta: { email } });
    return NextResponse.json({ ok: true });
  }

  // Update recovery passphrase
  if (body.currentPassphrase !== undefined && body.newPassphrase !== undefined) {
    const { currentPassphrase, newPassphrase } = body;
    if (!currentPassphrase || !newPassphrase) {
      return NextResponse.json({ error: "All fields required." }, { status: 400 });
    }
    if (newPassphrase.length < 12) {
      return NextResponse.json({ error: "New passphrase must be 12+ characters." }, { status: 400 });
    }
    if (currentPassphrase === newPassphrase) {
      return NextResponse.json({ error: "New passphrase must differ from current." }, { status: 400 });
    }
    const check = checkRecoveryPassphrase(currentPassphrase);
    if (!check.ok) {
      audit({ action: "settings.passphrase.update", ip, meta: { outcome: "wrong_current" } });
      return NextResponse.json({ error: "Current passphrase is incorrect." }, { status: 403 });
    }
    const rot = rotateRecoveryPassphrase(newPassphrase);
    if (!rot.ok) {
      return NextResponse.json({ error: rot.error || "Failed to update passphrase." }, { status: 400 });
    }
    audit({ action: "settings.passphrase.update", ip, meta: { outcome: "ok" } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
}
