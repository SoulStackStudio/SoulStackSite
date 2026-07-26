import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, isAdminRequest, makeToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

export async function GET() {
  return NextResponse.json({ admin: await isAdminRequest() });
}

export async function POST(req: NextRequest) {
  let password = "";
  try {
    password = (await req.json())?.password ?? "";
  } catch {
    // fall through to failure
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeToken(), cookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
