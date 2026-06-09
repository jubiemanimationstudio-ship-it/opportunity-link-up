import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { registerSession } from "@/lib/admin-secrets";
import { audit, getClientIp, getLockoutState, recordFailedAttempt, resetAttempts, remainingAttempts } from "@/lib/security";

const GENERIC_ERROR = "Invalid email or password.";

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

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Try Supabase Auth first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    try {
      // Sign in via Supabase Auth REST API
      const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`
        },
        body: JSON.stringify({ email, password })
      });

      const authData = await authRes.json();

      console.log("[login] Supabase auth response:", { ok: authRes.ok, status: authRes.status, hasUser: !!authData?.user, errorMsg: authData?.error_description || authData?.msg });

      if (!authRes.ok || !authData?.user) {
        const next = recordFailedAttempt(ip);
        const left = remainingAttempts(ip);
        audit({ ip, action: "login.failed", meta: { reason: "supabase_auth_rejected", remainingAttempts: left } });
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

      // Check if user is in admin_users table
      const user = authData.user;
      const adminCheck = await fetch(
        `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${user.id}&is_active=eq.true&select=role`,
        {
          headers: {
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`
          }
        }
      );
      const adminData = await adminCheck.json();
      console.log("[login] Admin check:", { status: adminCheck.status, data: adminData });

      if (!adminData || adminData.length === 0) {
        audit({ ip, action: "login.failed", meta: { reason: "not_admin" } });
        return NextResponse.json({ error: "This account does not have admin access." }, { status: 403 });
      }

      // Success
      console.log("[login] Success for:", email, "role:", adminData[0]?.role);
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
      audit({ ip, action: "login.success", meta: { sessionId, email } });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Supabase auth error:", err);
      return NextResponse.json({ error: "Authentication service unavailable." }, { status: 500 });
    }
  }

  // Fallback: env password (no Supabase)
  const { checkPassword } = await import("@/lib/admin-secrets");
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
  audit({ ip, action: "login.success", meta: { sessionId } });
  return NextResponse.json({ ok: true });
}
