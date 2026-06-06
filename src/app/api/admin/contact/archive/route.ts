import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { markArchived } from "@/lib/data/contact-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: "" }));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const ok = markArchived(id, true);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
