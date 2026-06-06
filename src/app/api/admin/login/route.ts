import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { checkPassword, registerSession, getActivePassword, isAdminPasswordInitialized, validatePasswordStrength } from "@/lib/admin-secrets";
import { audit, getClientIp, getLockoutState, recordFailedAttempt, resetAttempts, remainingAttempts } from "@/lib/security";

const GENERIC_ERROR = "Invalid password.";

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const lockout = getLockoutState(ip);
  if (lockout.locked) {
    audit({ ip, action: "login.blocked", meta: { remainingSeconds: lockout.remainingSeconds, level: lockout.level } });
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${Math.ceil(lockout.remainingSeconds / 60)} minute(s).`,
        locked: true,
        remainingSeconds: lockout.remainingSeconds
      },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body?.password || "");

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (isAdminPasswordInitialized()) {
    if (password.length < 12) {
      const next = recordFailedAttempt(ip);
      const left = remainingAttempts(ip);
      audit({ ip, action: "login.failed", meta: { reason: "too_short" } });
      if (next.locked) {
        return NextResponse.json(
          {
            error: `Too many failed attempts. Locked for ${Math.ceil(next.remainingSeconds / 60)} minute(s).`,
            locked: true,
            remainingSeconds: next.remainingSeconds
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: GENERIC_ERROR, remainingAttempts: left }, { status: 401 });
    }
  }

  if (!checkPassword(password)) {
    const next = recordFailedAttempt(ip);
    const left = remainingAttempts(ip);
    audit({ ip, action: "login.failed", meta: { remainingAttempts: left } });
    if (next.locked) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Locked for ${Math.ceil(next.remainingSeconds / 60)} minute(s).`,
          locked: true,
          remainingSeconds: next.remainingSeconds
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: GENERIC_ERROR, remainingAttempts: left },
      { status: 401 }
    );
  }

  resetAttempts(ip);
  setAdminSession();
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const sessionId = registerSession(ip, userAgent);
  const { cookies } = await import("next/headers");
  const isProd = process.env.NODE_ENV === "production";
  cookies().set("ha_session", sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 4 * 60 * 60
  });
  audit({ ip, action: "login.success", meta: { sessionId } });
  return NextResponse.json({ ok: true });
}
