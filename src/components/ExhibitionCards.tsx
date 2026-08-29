import Link from "next/link";
import type { Exhibition } from "@/lib/types";

/**
 * The shared exhibition card grid — used on the homepage and on the
 * /exhibitions index so both stay in step.
 */
export default function ExhibitionCards({ shows }: { shows: Exhibition[] }) {
  if (shows.length === 0) {
    return <p className="py-16 text-center text-ink/45">No exhibitions running just now.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      {shows.map((show) => (
        <Link key={show.slug} href={`/exhibitions/${show.slug}`} className="group block">
          <div className="overflow-hidden rounded-xl bg-seafoam">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={show.coverImage}
              alt={show.title}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-ink transition group-hover:text-brand">
            {show.title}
          </h3>
          <p className="mt-1 text-sm text-ink/55">{show.tagline}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-brand">
            {show.prints.length} prints — view collection
          </p>
        </Link>
      ))}
    </div>
  );
}
