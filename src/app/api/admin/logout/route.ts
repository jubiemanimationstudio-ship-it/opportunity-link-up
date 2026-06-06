import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { audit, getClientIp } from "@/lib/security";

export async function POST(req: Request) {
  audit({ ip: getClientIp(req), action: "logout" });
  clearAdminSession();
  return NextResponse.json({ ok: true });
}
