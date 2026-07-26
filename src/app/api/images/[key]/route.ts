import { NextRequest } from "next/server";
import { getImage, imageContentType } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const data = await getImage(key);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(data, {
    headers: {
      "Content-Type": imageContentType(key),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
