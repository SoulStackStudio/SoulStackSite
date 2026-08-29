import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import ExhibitionBackdrop from "@/components/ExhibitionBackdrop";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exhibitions — Soul Stack Studio",
  description: "Current exhibitions from Soul Stack Studio, Nazaré.",
};

export default async function ExhibitionsPage() {
  const content = await getContent();
  const shows = content.exhibitions ?? [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <ExhibitionBackdrop />

      <div className="mx-auto mb-14 max-w-2xl text-center">
        <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Exhibitions</h1>
        <p className="mt-4 text-base text-ink/60">
          Each show is its own collection of limited-edition fine art prints.
        </p>
      </div>

      {shows.length === 0 ? (
        <p className="py-16 text-center text-ink/45">No exhibitions running just now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {shows.map((show) => (
            <Link key={show.slug} href={`/exhibitions/${show.slug}`} className="group block">
              <div className="overflow-hidden rounded-xl bg-seafoam">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={show.coverImage}
                  alt={show.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{show.title}</h2>
              <p className="mt-1 text-sm text-ink/55">{show.tagline}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-brand">
                {show.prints.length} prints — view collection
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
