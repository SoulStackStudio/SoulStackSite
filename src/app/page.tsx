import Link from "next/link";
import { getContent } from "@/lib/store";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProductGrid from "@/components/ProductGrid";
import ExhibitionCards from "@/components/ExhibitionCards";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  const featured = content.prints.filter((p) => p.featured);
  const shows = (content.exhibitions ?? []).filter((e) => !e.hidden);

  return (
    <>
      <Hero content={content} />
      <AboutSection content={content} />

      {shows.length > 0 && (
        <section className="border-y border-seafoam/60 bg-gradient-to-b from-transparent via-aqua/6 to-transparent">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-turquoise">
                Now Showing
              </p>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                Exhibitions
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-ink/60">
                Each show is its own collection of limited-edition fine art prints.
              </p>
            </div>
            <ExhibitionCards shows={shows} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-turquoise">
            Featured
          </p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Prints from the Collection
          </h2>
        </div>
        <ProductGrid
          prints={(featured.length > 0 ? featured : content.prints).slice(0, 3)}
          aspect="3/2"
          fit="contain"
        />
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-block rounded-full border border-brand px-8 py-3 text-sm font-medium tracking-widest uppercase text-brand transition hover:bg-brand hover:text-cream"
          >
            View All Prints
          </Link>
        </div>
      </section>
    </>
  );
}
