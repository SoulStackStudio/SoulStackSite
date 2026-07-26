import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// Shipping details live in different places depending on Stripe API version.
function extractShipping(session: Stripe.Checkout.Session) {
  const s = session as unknown as {
    collected_information?: { shipping_details?: { name?: string; address?: Stripe.Address } };
    shipping_details?: { name?: string; address?: Stripe.Address };
  };
  return s.collected_information?.shipping_details ?? s.shipping_details ?? null;
}

function formatAddress(name?: string, addr?: Stripe.Address | null): string {
  if (!addr) return "No shipping address collected";
  return [name, addr.line1, addr.line2, `${addr.city ?? ""} ${addr.state ?? ""} ${addr.postal_code ?? ""}`.trim(), addr.country]
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata ?? {};
  const shipping = extractShipping(session);
  const customer = session.customer_details;

  const orderId = session.id.replace("cs_live_", "").replace("cs_test_", "").slice(0, 12).toUpperCase();
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
  const addressBlock = formatAddress(shipping?.name ?? customer?.name ?? undefined, shipping?.address ?? null);

  const lines = [
    `NEW PRINT ORDER — ${orderId}`,
    ``,
    `Print:  ${meta.printTitle ?? "Unknown"}`,
    `Size:   ${meta.sizeLabel ?? "Unknown"}`,
    `Paid:   €${amount} ${session.currency?.toUpperCase() ?? "EUR"}`,
    ``,
    `SHIP TO:`,
    addressBlock,
    ``,
    `Customer email: ${customer?.email ?? "n/a"}`,
    `Customer phone: ${customer?.phone ?? "n/a"}`,
    ``,
    `Stripe session: ${session.id}`,
  ];
  const text = lines.join("\n");

  const printerEmail = process.env.PRINTER_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!printerEmail || !resendKey) {
    // Not configured yet — log the full order so nothing is silently lost.
    console.warn("Order received but email not configured. Order details:\n" + text);
    return NextResponse.json({ received: true, emailed: false });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: process.env.ORDER_FROM_EMAIL || "Soul Stack Studio <onboarding@resend.dev>",
      to: printerEmail,
      subject: `New print order ${orderId} — ${meta.printTitle ?? ""} ${meta.sizeLabel ?? ""}`,
      text,
    });
  } catch (err) {
    // Log loudly but return 200 so Stripe doesn't retry forever; the order
    // is still recoverable from the Stripe dashboard.
    console.error("Failed to send order email:", err, "\nOrder details:\n" + text);
    return NextResponse.json({ received: true, emailed: false });
  }

  return NextResponse.json({ received: true, emailed: true });
}
