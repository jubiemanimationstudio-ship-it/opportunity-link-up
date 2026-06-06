import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminSession } from "@/lib/auth";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { revokeAllSessions } from "@/lib/admin-secrets";
import { audit, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const current = cookies().get("ha_session")?.value;
  const count = revokeAllSessions(current);
  audit({ action: "session.revoke_all", ip: getClientIp(req), meta: { revoked: count } });
  return NextResponse.json({ ok: true, revoked: count });
}
