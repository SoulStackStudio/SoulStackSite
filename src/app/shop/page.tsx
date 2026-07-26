import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import ShopHeader from "@/components/ShopHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Soul Stacked Studio",
  description: "Browse the full collection of fine-art photographic prints.",
};

export default async function ShopPage() {
  const content = await getContent();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <ShopHeader content={content} />
      <ProductGrid prints={content.prints} manage />
    </section>
  );
}
