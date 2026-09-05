import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import ExhibitionBackdrop from "@/components/ExhibitionBackdrop";
import ExhibitionCards from "@/components/ExhibitionCards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exhibitions — Soul Stack Studio",
  description: "Current exhibitions from Soul Stack Studio, Nazaré.",
};

export default async function ExhibitionsPage() {
  const content = await getContent();
  const shows = (content.exhibitions ?? []).filter((e) => !e.hidden);

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

      <ExhibitionCards shows={shows} />
    </section>
  );
}
