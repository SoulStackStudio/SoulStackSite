import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import ExhibitionBackdrop from "@/components/ExhibitionBackdrop";
import ExhibitionCoverEditor from "@/components/ExhibitionCoverEditor";
import {
  ExhibitionHeader,
  ExhibitionNarrative,
  ExhibitionSpecs,
} from "@/components/ExhibitionIntro";

export const dynamic = "force-dynamic";

async function getShow(slug: string) {
  const content = await getContent();
  return (content.exhibitions ?? []).find((e) => e.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return { title: "Exhibition — Soul Stack Studio" };
  return {
    title: `${show.title} — Soul Stack Studio`,
    description: show.tagline,
    openGraph: {
      title: `${show.title} — Soul Stack Studio`,
      description: show.tagline,
      images: show.coverImage ? [show.coverImage] : undefined,
    },
  };
}

export default async function ExhibitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) notFound();

  return (
    <>
      <ExhibitionBackdrop />

      <ExhibitionCoverEditor show={show} />

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:pt-16">
        <ExhibitionHeader show={show} />
        <ExhibitionNarrative show={show} />
        <ExhibitionSpecs show={show} />

        <div className="mt-16 sm:mt-20">
          <ProductGrid
            prints={show.prints}
            manage
            exhibitionSlug={show.slug}
            paper={show.paper}
            edition={show.edition}
            aspect="3/2"
          />
        </div>
      </section>
    </>
  );
}
