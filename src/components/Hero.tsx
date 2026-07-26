"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Images } from "lucide-react";
import type { SiteContent, HeroImage } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";
import HeroImageManager, { heroImageStyle } from "./HeroImageManager";

// Shown only until the owner saves her own slideshow — she can replace these
// in admin mode (Hero images panel) whenever she likes.
const SAMPLE_SLIDES: HeroImage[] = [
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    posX: 50,
    posY: 55,
    zoom: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2000&auto=format&fit=crop",
    posX: 50,
    posY: 40,
    zoom: 1,
  },
];

function resolveHeroImages(content: SiteContent): HeroImage[] {
  if (content.hero.images && content.hero.images.length > 0) return content.hero.images;
  // Legacy content: keep her single chosen image first, demo the slide
  // mechanic with sample shots until she saves her own set.
  const own = content.hero.image
    ? [{ url: content.hero.image, posX: 50, posY: 50, zoom: 1 }]
    : [];
  return [...own, ...SAMPLE_SLIDES.filter((s) => s.url !== content.hero.image)];
}

const SLIDE_MS = 6000;

export default function Hero({ content }: { content: SiteContent }) {
  const { isAdmin, updateContent } = useAdmin();
  const [managerOpen, setManagerOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = resolveHeroImages(content);
  const current = Math.min(index, images.length - 1);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${img.url}-${i}`}
          src={img.url}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={heroImageStyle(img)}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/60" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center text-cream">
        <EditableText
          as="h1"
          value={content.hero.headline}
          textStyle={content.styles?.["hero.headline"]}
          onSave={(v, st) =>
            updateContent((c) => ({
              ...c,
              hero: { ...c.hero, headline: v },
              styles: { ...(c.styles ?? {}), "hero.headline": st },
            }))
          }
          className="font-display text-4xl font-semibold leading-tight sm:text-6xl"
        />
        <EditableText
          as="p"
          multiline
          value={content.hero.subtext}
          textStyle={content.styles?.["hero.subtext"]}
          onSave={(v, st) =>
            updateContent((c) => ({
              ...c,
              hero: { ...c.hero, subtext: v },
              styles: { ...(c.styles ?? {}), "hero.subtext": st },
            }))
          }
          className="mx-auto mt-6 max-w-xl text-base text-cream/85 sm:text-lg"
        />
        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full bg-cream/95 px-8 py-3 text-sm font-medium tracking-widest uppercase text-brand-deep shadow-lg transition hover:bg-aqua hover:text-cream"
        >
          Browse the Collection
        </Link>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-6 bg-cream/90" : "w-1.5 bg-cream/45 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="absolute bottom-4 right-4 z-20">
          {managerOpen ? (
            <HeroImageManager images={images} onClose={() => setManagerOpen(false)} />
          ) : (
            <button
              onClick={() => setManagerOpen(true)}
              className="flex items-center gap-2 rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-brand shadow-lg transition hover:bg-cream"
            >
              <Images size={15} /> Hero images
            </button>
          )}
        </div>
      )}
    </section>
  );
}
