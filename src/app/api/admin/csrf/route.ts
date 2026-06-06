import { NextResponse } from "next/server";
import { isAdminSession, getCsrfToken } from "@/lib/auth";

export async function GET() {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = getCsrfToken();
  return NextResponse.json({ token });
}
