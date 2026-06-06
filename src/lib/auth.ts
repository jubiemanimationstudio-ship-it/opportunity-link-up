import { cookies, headers } from "next/headers";
import { checkPasswordConstantTime, generateCsrfToken, safeCompare, SESSION_TTL_SECONDS } from "@/lib/security";
import { isSessionActive, touchSession } from "@/lib/admin-secrets";

const COOKIE_NAME = "ha_admin";
const CSRF_COOKIE_NAME = "ha_csrf";

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "linkup-admin-2026";
  return checkPasswordConstantTime(input, expected);
}

export function isAdminSession(): boolean {
  const hasCookie = cookies().get(COOKIE_NAME)?.value === "1";
  if (!hasCookie) return false;
  const sessionId = cookies().get("ha_session")?.value;
  if (!sessionId) return true;
  if (!isSessionActive(sessionId)) {
    return false;
  }
  touchSession(sessionId);
  return true;
}

export function setAdminSession() {
  const isProd = process.env.NODE_ENV === "production";
  cookies().set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
  const csrf = generateCsrfToken();
  cookies().set(CSRF_COOKIE_NAME, csrf, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
  cookies().delete(CSRF_COOKIE_NAME);
  cookies().delete("ha_session");
}

export function getCsrfToken(): string {
  let csrf = cookies().get(CSRF_COOKIE_NAME)?.value;
  if (!csrf) {
    csrf = generateCsrfToken();
    const isProd = process.env.NODE_ENV === "production";
    cookies().set(CSRF_COOKIE_NAME, csrf, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS
    });
  }
  return csrf;
}

export function verifyCsrfHeader(req: Request): boolean {
  const cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken) return false;
  const headerToken = req.headers.get("x-csrf-token");
  if (!headerToken) return false;
  return safeCompare(cookieToken, headerToken);
}

export function getAdminPasswordHint(): string {
  if (process.env.ADMIN_PASSWORD) {
    return "Set via ADMIN_PASSWORD env var. Session lasts 4 hours. Auto-locks after 5 failed attempts.";
  }
  return "Default dev password is \u201clinkup-admin-2026\u201d. Set ADMIN_PASSWORD in production.";
}

export function getSessionTtlSeconds(): number {
  return SESSION_TTL_SECONDS;
}

export function getClientIpFromHeaders(): string {
  const h = headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = h.get("x-real-ip");
  if (real) return real;
  return "server-side";
}
