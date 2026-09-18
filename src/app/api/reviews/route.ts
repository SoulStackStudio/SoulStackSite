import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getContent, saveContent } from "@/lib/store";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_NAME = 80;
const MAX_CONTEXT = 140;
const MAX_QUOTE = 600;

/** Anyone can submit a review — it lands unapproved until an admin publishes it. */
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    context?: string;
    quote?: string;
    rating?: number;
    company?: string; // honeypot — real visitors never fill this hidden field
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.company) {
    // Looks like a bot — pretend success so it doesn't learn to avoid the field.
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim().slice(0, MAX_NAME);
  const context = (body.context ?? "").trim().slice(0, MAX_CONTEXT);
  const quote = (body.quote ?? "").trim().slice(0, MAX_QUOTE);
  const rating =
    typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
      ? Math.round(body.rating)
      : undefined;

  if (!name || !quote) {
    return NextResponse.json({ error: "Name and review text are required" }, { status: 400 });
  }

  const review: Review = {
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    context,
    quote,
    rating,
    approved: false,
  };

  const content = await getContent();
  content.reviews = [...(content.reviews ?? []), review];
  await saveContent(content);

  // Best-effort notification — a failed email should never lose the review itself.
  const printerEmail = process.env.PRINTER_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (printerEmail && resendKey) {
    try {
      const resend = new Resend(resendKey);
      const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "no rating given";
      await resend.emails.send({
        from: process.env.ORDER_FROM_EMAIL || "Soul Stack Studio <onboarding@resend.dev>",
        to: printerEmail,
        subject: `New review submitted — ${name}`,
        text: [
          `${name} just submitted a review.`,
          context ? `Context: ${context}` : null,
          `Rating: ${stars}`,
          ``,
          `"${quote}"`,
          ``,
          `It's waiting in the pending queue — log into admin mode on the site to approve or reject it.`,
        ]
          .filter((line) => line !== null)
          .join("\n"),
      });
    } catch (err) {
      console.error("Failed to send review notification email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
