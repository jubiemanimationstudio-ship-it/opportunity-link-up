import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@") || email.length < 5 || email.length > 254) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ---- INTEGRATION PLACEHOLDER ----
    // Plug in Resend, Mailchimp, ConvertKit or Supabase here later.
    // Example with Resend:
    //   import { Resend } from "resend";
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.contacts.create({ email, audienceId: "..." });
    //
    // For now we just log and accept the submission so the UI flow works.
    console.log(`[newsletter] new subscriber: ${email}`);

    return NextResponse.json({ ok: true, message: "Subscribed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }
}
