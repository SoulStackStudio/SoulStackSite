import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ["US", "CA", "GB", "IE", "AU", "NZ", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PT"];

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured yet (missing STRIPE_SECRET_KEY)" },
      { status: 500 }
    );
  }

  let printId = "";
  let sizeLabel = "";
  try {
    const body = await req.json();
    printId = body?.printId ?? "";
    sizeLabel = body?.sizeLabel ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Price always comes from the server-side content store — never from the client.
  const content = await getContent();
  const print = content.prints.find((p) => p.id === printId);
  const size = print?.sizes.find((s) => s.label === sizeLabel);
  if (!print || !size) {
    return NextResponse.json({ error: "Print or size not found" }, { status: 404 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "http://localhost:3000";

  // Stripe can only display images it can reach — skip relative/localhost URLs.
  const images =
    print.image.startsWith("https://") && !print.image.includes("localhost")
      ? [print.image]
      : print.image.startsWith("/") && origin.startsWith("https://")
        ? [`${origin}${print.image}`]
        : [];

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: size.priceCents,
          product_data: {
            name: `${print.title} — ${size.label} print`,
            description: print.description.slice(0, 300),
            ...(images.length ? { images } : {}),
          },
        },
      },
    ],
    shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
    phone_number_collection: { enabled: true },
    metadata: {
      printId: print.id,
      printTitle: print.title,
      sizeLabel: size.label,
      priceCents: String(size.priceCents),
    },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
  });

  return NextResponse.json({ url: session.url });
}
