import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";
import type { SiteContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: SiteContent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || !body.hero || !body.about || !body.shop || !Array.isArray(body.prints)) {
    return NextResponse.json({ error: "Invalid content shape" }, { status: 400 });
  }
  for (const p of body.prints) {
    if (!p.id || !p.title || !Array.isArray(p.sizes) || p.sizes.length === 0) {
      return NextResponse.json(
        { error: `Print "${p.title || p.id || "?"}" needs a title and at least one size` },
        { status: 400 }
      );
    }
    for (const s of p.sizes) {
      if (!s.label || typeof s.priceCents !== "number" || s.priceCents < 50) {
        return NextResponse.json(
          { error: `Print "${p.title}" has a size with a missing label or invalid price` },
          { status: 400 }
        );
      }
    }
  }
  await saveContent(body);
  return NextResponse.json({ ok: true });
}
