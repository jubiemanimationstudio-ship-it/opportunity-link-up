import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { audit, getClientIp } from "@/lib/security";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { addToStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const created = await addToStore(body);

  audit({
    ip: getClientIp(req),
    action: "opportunity.create",
    target: created.id,
    meta: { title: created.title, type: created.type, slug: created.slug }
  });

  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
