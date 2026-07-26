import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ["US", "CA", "GB", "IE", "AU", "NZ", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PT"];

interface CartLine {
  printId: string;
  sizeLabel: string;
  qty: number;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured yet (missing STRIPE_SECRET_KEY)" },
      { status: 500 }
    );
  }

  let lines: CartLine[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.items)) {
      lines = body.items;
    } else if (body?.printId) {
      // backward-compatible single-item shape
      lines = [{ printId: body.printId, sizeLabel: body.sizeLabel, qty: 1 }];
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (lines.length === 0 || lines.length > 30) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Prices always come from the server-side content store — never from the client.
  const content = await getContent();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "http://localhost:3000";

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summaryParts: string[] = [];

  for (const line of lines) {
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    const print = content.prints.find((p) => p.id === line.printId);
    const size = print?.sizes.find((s) => s.label === line.sizeLabel);
    if (!print || !size) {
      return NextResponse.json({ error: "Print or size not found" }, { status: 404 });
    }

    // Stripe can only display images it can reach — skip relative/localhost URLs.
    const images =
      print.image.startsWith("https://") && !print.image.includes("localhost")
        ? [print.image]
        : print.image.startsWith("/") && origin.startsWith("https://")
          ? [`${origin}${print.image}`]
          : [];

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "eur",
        unit_amount: size.priceCents,
        product_data: {
          name: `${print.title} — ${size.label} print`,
          description: print.description.slice(0, 300),
          ...(images.length ? { images } : {}),
        },
      },
    });
    summaryParts.push(`${qty}x ${print.title} (${size.label})`);
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
    phone_number_collection: { enabled: true },
    metadata: {
      summary: summaryParts.join("; ").slice(0, 480),
    },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
  });

  return NextResponse.json({ url: session.url });
}
