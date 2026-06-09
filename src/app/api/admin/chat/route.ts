import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { getAllOpportunities } from "@/lib/opportunities";
import { site } from "@/lib/site";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

const SYSTEM_PROMPT = `You are the AI assistant for "${site.name}" (${site.shortName}), an opportunities platform. You help the admin manage the site.

CAPABILITIES:
1. **Find opportunities** — Search through the site's opportunity database
2. **Draft newsletter** — Write newsletter content for subscribers
3. **Draft WhatsApp post** — Create engaging posts for the WhatsApp group
4. **Content ideas** — Suggest new opportunities to add
5. **SEO help** — Optimize titles, descriptions, and tags
6. **General admin** — Answer questions about the platform

RULES:
- Be concise and actionable
- Use emoji sparingly for WhatsApp posts
- Newsletter drafts should be professional but warm
- Always include the site name "The Opportunity Link-up" in public content
- For WhatsApp posts, keep under 500 characters and include a call-to-action
- When listing opportunities, include title, type, deadline, and link slug
- The site URL is ${site.url}

WHEN THE USER ASKS TO:
- "send newsletter" or "email subscribers" → Draft the newsletter content, then provide a send action
- "post to whatsapp" or "whatsapp message" → Draft the post with a WhatsApp pre-filled link
- "find opportunities" or "search" → Search through the database
- "new opportunity" or "add" → Help draft the opportunity content
- "ideas" or "suggest" → Brainstorm opportunities to add

Always be helpful and proactive. If you're unsure, ask for clarification.`;

async function buildContext(): Promise<string> {
  const opps = await getAllOpportunities();
  const summary = opps.map(o => `- [${o.type}] ${o.title} | deadline: ${o.deadline} | slug: ${o.slug} | ${o.featured ? "FEATURED" : ""}`).join("\n");
  return `CURRENT OPPORTUNITIES (${opps.length} total):\n${summary}\n\nSITE INFO:\n- Name: ${site.name}\n- URL: ${site.url}\n- WhatsApp Group: ${site.whatsappInvite}\n- Tagline: ${site.tagline}`;
}

export async function POST(req: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured. Add it to .env.local" }, { status: 500 });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT + "\n\n" + await buildContext()
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.parts }]
      }))
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("[AI Chat]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message || "AI request failed" },
      { status: 500 }
    );
  }
}
