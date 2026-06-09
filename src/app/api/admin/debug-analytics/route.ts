import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results: Record<string, any> = {
    hasUrl: !!url,
    hasKey: !!key,
    urlValue: url || "NOT SET",
  };

  if (!url || !key) {
    results.error = "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.";
    return NextResponse.json(results);
  }

  // Test 1: Insert a test row
  try {
    const insertRes = await fetch(`${url}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        kind: "view",
        opportunity: "TEST_EVENT",
        visitor_id: "test-debug",
        created_at: new Date().toISOString(),
      }),
    });
    const insertBody = await insertRes.text();
    results.insertStatus = insertRes.status;
    results.insertBody = insertBody;
  } catch (e: any) {
    results.insertError = e?.message;
  }

  // Test 2: Read back
  try {
    const readRes = await fetch(`${url}/rest/v1/analytics_events?order=created_at.desc&limit=5`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await readRes.json();
    results.readStatus = readRes.status;
    results.rowCount = Array.isArray(rows) ? rows.length : 0;
    results.rows = Array.isArray(rows) ? rows.slice(0, 3) : rows;
  } catch (e: any) {
    results.readError = e?.message;
  }

  return NextResponse.json(results);
}
