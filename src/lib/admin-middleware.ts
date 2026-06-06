import { NextResponse } from "next/server";
import { isAdminSession, verifyCsrfHeader } from "@/lib/auth";
import { audit, getClientIp } from "@/lib/security";

const STATE_CHANGING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export function middlewareForAdminApi(req: Request): NextResponse | null {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api/admin/")) return null;
  if (url.pathname === "/api/admin/login") return null;
  if (url.pathname === "/api/admin/logout") return null;
  if (!STATE_CHANGING_METHODS.has(req.method)) return null;
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!verifyCsrfHeader(req)) {
    audit({ ip: getClientIp(req), action: "csrf.rejected", target: url.pathname });
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  return null;
}
