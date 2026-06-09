import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { checkPassword, registerSession } from "@/lib/admin-secrets";
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
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  // Try Supabase Auth first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && anonKey && serviceKey) {
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`
        },
        body: JSON.stringify({ email, password })
      });

      const authData = await authRes.json();

      if (authRes.ok && authData?.user) {
        // Check if user is in admin_users table
        const user = authData.user;
        const adminCheck = await fetch(
          `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${user.id}&is_active=eq.true&select=role`,
          {
            headers: {
              "apikey": serviceKey,
              "Authorization": `Bearer ${serviceKey}`
            }
          }
        );
        const adminData = await adminCheck.json();

        if (adminData && adminData.length > 0) {
          // Supabase Auth success
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
          audit({ ip, action: "login.success", meta: { sessionId, email, method: "supabase" } });
          return NextResponse.json({ ok: true });
        }
      }
      // Supabase Auth failed — fall through to env password
    } catch (err) {
      console.error("[login] Supabase auth error, falling back to env password:", err);
    }
  }

  // Fallback: env password
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
    return NextResponse.json({ error: GENERIC_ERROR, remainingAttempts: left }, { status: 401 });
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
  audit({ ip, action: "login.success", meta: { sessionId, method: "env" } });
  return NextResponse.json({ ok: true });
}
