import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { saveImage } from "@/lib/store";

export const dynamic = "force-dynamic";

// Netlify function request bodies cap out around 6 MB — stay under it
const MAX_BYTES = 4.5 * 1024 * 1024;
const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4 MB" }, { status: 400 });
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json(
      { error: "Only jpg, png, webp, gif or avif images are allowed" },
      { status: 400 }
    );
  }
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 40) || "image";
  const key = `${Date.now()}-${base}.${ext}`;
  await saveImage(key, await file.arrayBuffer());
  return NextResponse.json({ url: `/api/images/${key}` });
}
