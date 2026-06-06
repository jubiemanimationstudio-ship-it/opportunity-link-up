import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics-realtime";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const kind = String(body.kind || "").toLowerCase();
    const allowed = ["view", "apply", "share", "save", "newsletter", "contact", "whatsapp", "search", "donate"];
    if (!allowed.includes(kind)) {
      return NextResponse.json({ error: "invalid kind" }, { status: 400 });
    }
    const visitorId = req.headers.get("x-visitor-id") || body.visitorId || undefined;
    const country = req.headers.get("x-vercel-ip-country") || body.country || undefined;
    const referrer = req.headers.get("referer") || body.referrer || undefined;
    recordEvent({
      kind: kind as any,
      visitorId,
      country,
      referrer,
      opportunity: body.opportunity,
      email: body.email,
      name: body.name,
      reason: body.reason,
      channel: body.channel,
      amount: typeof body.amount === "number" ? body.amount : undefined,
      query: body.query,
      results: typeof body.results === "number" ? body.results : undefined
    });
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, t: new Date().toISOString() })
      }).catch(() => {});
    } else {
      console.log("[Track]", kind, body.opportunity || body.email || body.query || "");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "track failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "track", method: "POST" });
}
