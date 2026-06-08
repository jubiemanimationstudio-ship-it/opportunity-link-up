import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateCode } from "@/lib/email-verification";
import { getAdminEmail } from "@/lib/admin-secrets";
import { audit, getClientIp, getLockoutState } from "@/lib/security";

export const dynamic = "force-dynamic";

// Rate limit: 3 requests per IP per 15 minutes
const requestAttempts: Map<string, { count: number; first: number }> =
  (globalThis as any).__recoverRequestAttempts ||
  ((globalThis as any).__recoverRequestAttempts = new Map());

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestAttempts.get(ip);
  if (!record || now - record.first > 15 * 60 * 1000) {
    requestAttempts.set(ip, { count: 1, first: now });
    return true;
  }
  record.count++;
  return record.count <= 3;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const lock = getLockoutState(ip);
  if (lock.locked) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later.", remainingSeconds: lock.remainingSeconds },
      { status: 429 }
    );
  }

  if (!checkRateLimit(ip)) {
    audit({ action: "recover.request", ip, meta: { outcome: "rate_limited" } });
    return NextResponse.json({ error: "Too many requests. Wait 15 minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const { email } = body as { email?: string };

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    return NextResponse.json(
      { error: "No admin email configured. Set ADMIN_EMAIL in your environment." },
      { status: 400 }
    );
  }

  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
    audit({ action: "recover.request", ip, meta: { outcome: "wrong_email" } });
    // Still return success to prevent email enumeration
    return NextResponse.json({ ok: true, hint: "If this email matches the admin, a code has been sent." });
  }

  const { code, error, retryAfterSeconds } = generateCode(adminEmail);
  if (error) {
    return NextResponse.json({ error, retryAfterSeconds }, { status: 429 });
  }

  // Send email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev mode: log the code instead of sending email
    console.log(`\n\n🔐 RECOVERY CODE for ${adminEmail}: ${code}\n\n`);
    audit({ action: "recover.request", ip, meta: { outcome: "dev_mode", email: adminEmail } });
    return NextResponse.json({
      ok: true,
      hint: "Dev mode: check the server console for the code.",
      devCode: code
    });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "The Opportunity Link-up <noreply@opportunitylinkup.com>",
      to: adminEmail,
      subject: "Your Password Recovery Code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0B2545; margin-bottom: 8px;">Password Recovery</h2>
          <p style="color: #475569; font-size: 14px;">You requested a password recovery code. Use the code below within 10 minutes:</p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0B2545; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, ignore this email. The code expires in 10 minutes.</p>
        </div>
      `
    });
    audit({ action: "recover.request", ip, meta: { outcome: "email_sent", email: adminEmail } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send failed:", err);
    audit({ action: "recover.request", ip, meta: { outcome: "email_failed" } });
    return NextResponse.json({ error: "Failed to send email. Try again." }, { status: 500 });
  }
}
