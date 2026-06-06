import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { rotatePassword, validatePasswordStrength, getActivePassword, checkPassword } from "@/lib/admin-secrets";
import { audit, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { currentPassword, newPassword } = body as { currentPassword?: string; newPassword?: string };
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const active = getActivePassword();
  if (!checkPassword(currentPassword)) {
    audit({ action: "password.rotate", ip: getClientIp(req), meta: { outcome: "wrong_current" } });
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
  }
  const err = validatePasswordStrength(newPassword);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  if (newPassword === active) {
    return NextResponse.json({ error: "New password must differ from current" }, { status: 400 });
  }
  const result = rotatePassword(newPassword);
  if (!result.ok) return NextResponse.json({ error: result.error || "Failed" }, { status: 400 });
  audit({ action: "password.rotate", ip: getClientIp(req), meta: { outcome: "ok" } });
  return NextResponse.json({ ok: true });
}
