import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed — Soul Stack Studio",
};

export default function SuccessPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <CheckCircle2 size={56} className="mx-auto text-turquoise" strokeWidth={1.5} />
        <h1 className="mt-6 font-display text-4xl font-semibold text-ink">Thank you</h1>
        <p className="mt-4 leading-relaxed text-ink/65">
          Your order is confirmed. A receipt has been emailed to you, and your print is now on its
          way to production — it will ship as soon as it passes our quality check.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full border border-brand px-8 py-3 text-sm font-medium tracking-widest uppercase text-brand transition hover:bg-brand hover:text-cream"
        >
          Continue Browsing
        </Link>
      </div>
    </section>
  );
}
