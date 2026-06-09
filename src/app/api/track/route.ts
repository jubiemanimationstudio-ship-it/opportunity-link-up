import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics-realtime";

export const dynamic = "force-dynamic";

async function persistToSupabase(event: {
  kind: string;
  visitorId?: string;
  country?: string;
  referrer?: string;
  opportunity?: string;
  email?: string;
  name?: string;
  reason?: string;
  channel?: string;
  amount?: number;
  query?: string;
  results?: number;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        kind: event.kind,
        visitor_id: event.visitorId || null,
        country: event.country || null,
        referrer: event.referrer || null,
        opportunity: event.opportunity || null,
        email: event.email || null,
        name: event.name || null,
        reason: event.reason || null,
        channel: event.channel || null,
        amount: event.amount ?? null,
        query: event.query || null,
        results: event.results ?? null,
        created_at: new Date().toISOString()
      })
    });
  } catch {
    // persist failure should never break the user experience
  }
}

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

    const event = {
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
    };

    recordEvent(event);
    persistToSupabase(event).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "track failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "track", method: "POST" });
}
