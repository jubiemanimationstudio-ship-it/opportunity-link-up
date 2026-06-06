import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { audit, getClientIp } from "@/lib/security";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { updateInStore, deleteFromStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const updated = await updateInStore(params.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  audit({
    ip: getClientIp(req),
    action: "opportunity.update",
    target: params.id,
    meta: { title: updated.title, status: updated.status }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await deleteFromStore(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  audit({
    ip: getClientIp(req),
    action: "opportunity.delete",
    target: params.id
  });

  return NextResponse.json({ ok: true });
}
