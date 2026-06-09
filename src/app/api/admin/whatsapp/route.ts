import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { getAllOpportunities } from "@/lib/opportunities";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, opportunityIds, customMessage } = await req.json();

    let text = customMessage || message || "";
    let opportunityLinks: string[] = [];

    if (opportunityIds && opportunityIds.length > 0) {
      const allOpps = await getAllOpportunities();
      const selected = allOpps.filter(o => opportunityIds.includes(o.id));

      if (selected.length > 0 && !text) {
        text = selected.map(o => {
          const url = `${site.url}/opportunities/${o.slug}`;
          return `${o.type}: ${o.title}\nDeadline: ${o.deadline}\nApply: ${url}`;
        }).join("\n\n");
      }

      opportunityLinks = selected.map(o => `${site.url}/opportunities/${o.slug}`);
    }

    if (!text) {
      return NextResponse.json({ error: "No message content" }, { status: 400 });
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const groupUrl = site.whatsappInvite;

    return NextResponse.json({
      ok: true,
      message: text,
      personalUrl: whatsappUrl,
      groupUrl,
      opportunityLinks
    });
  } catch (err: any) {
    console.error("[WhatsApp]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate WhatsApp post" },
      { status: 500 }
    );
  }
}
