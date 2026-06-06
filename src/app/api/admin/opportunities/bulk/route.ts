import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { audit, getClientIp } from "@/lib/security";
import { middlewareForAdminApi } from "@/lib/admin-middleware";
import { bulkActionInStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const blocked = middlewareForAdminApi(req);
  if (blocked) return blocked;
  if (!isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids, action } = await req.json().catch(() => ({ ids: [], action: "" }));
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: "No items selected" }, { status: 400 });
  if (!["publish", "unpublish", "delete", "archive"].includes(action))
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const count = await bulkActionInStore(ids, action as any);

  audit({
    ip: getClientIp(req),
    action: `opportunity.bulk.${action}`,
    target: ids.join(","),
    meta: { count }
  });

  return NextResponse.json({ ok: true, count });
}
