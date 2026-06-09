import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured", url: !!url, key: !!key });
  }

  try {
    const res = await fetch(`${url}/rest/v1/analytics_events?select=count&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    const text = await res.text();
    return NextResponse.json({ status: res.status, body: text, url, keyLen: key.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message });
  }
}
