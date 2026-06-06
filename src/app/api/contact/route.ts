import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/data/contact-store";

export async function POST(req: Request) {
  try {
    const { name, email, type, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = addContactMessage({ name, email, type, message });

    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
      try {
        const resendModuleName = "resend";
        const mod: any = await (Function("m", "return import(m)") as any)(resendModuleName);
        const Resend = mod.Resend;
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL || "Link-Up <hello@opportunitylinkup.com>",
          to: process.env.CONTACT_TO_EMAIL,
          replyTo: email,
          subject: `[${type}] ${name} \u2014 Link-Up message`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Reason:</strong> ${type}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`
        });
      } catch (e: any) {
        console.log("[ContactForm] Resend unavailable, message saved to store only:", e?.message ?? String(e));
      }
    } else {
      console.log("[ContactForm] (no Resend) Message received:", { name, email, type });
    }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
