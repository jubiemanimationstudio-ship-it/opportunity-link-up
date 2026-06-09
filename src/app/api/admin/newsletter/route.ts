import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, html, previewText } = await req.json();

    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML content required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || "Link-Up <newsletter@opportunitylinkup.com>";

    if (!apiKey) {
      return NextResponse.json({
        error: "RESEND_API_KEY not configured. Add it to .env.local",
        draft: { subject, html }
      }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    if (audienceId) {
      const result = await resend.contacts.create({
        email: "test@example.com",
        audienceId,
        unsubscribed: false
      });
      console.log("[Newsletter] Contact list available:", !!result);
    }

    const result = await resend.emails.send({
      from: fromEmail,
      to: process.env.ADMIN_EMAIL || "jubiemanimationstudio@gmail.com",
      subject,
      html,
      text: previewText || subject
    });

    console.log("[Newsletter] Sent:", result.data?.id);

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err: any) {
    console.error("[Newsletter]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message || "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
