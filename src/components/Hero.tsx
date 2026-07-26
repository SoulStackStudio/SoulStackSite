"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageIcon, X } from "lucide-react";
import type { SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";
import ImagePicker from "./ImagePicker";

export default function Hero({ content }: { content: SiteContent }) {
  const { isAdmin, updateContent } = useAdmin();
  const [imagePanel, setImagePanel] = useState(false);
  const [imageDraft, setImageDraft] = useState(content.hero.image);

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.hero.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/60" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center text-cream">
        <EditableText
          as="h1"
          value={content.hero.headline}
          onSave={(v) => updateContent((c) => ({ ...c, hero: { ...c.hero, headline: v } }))}
          className="font-display text-4xl font-semibold leading-tight sm:text-6xl"
        />
        <EditableText
          as="p"
          multiline
          value={content.hero.subtext}
          onSave={(v) => updateContent((c) => ({ ...c, hero: { ...c.hero, subtext: v } }))}
          className="mx-auto mt-6 max-w-xl text-base text-cream/85 sm:text-lg"
        />
        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full bg-cream/95 px-8 py-3 text-sm font-medium tracking-widest uppercase text-brand-deep shadow-lg transition hover:bg-aqua hover:text-cream"
        >
          Browse the Collection
        </Link>
      </div>

      {isAdmin && (
        <div className="absolute bottom-4 right-4 z-20">
          {imagePanel ? (
            <div className="w-80 rounded-xl bg-cream p-4 shadow-2xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Hero image</p>
                <button onClick={() => setImagePanel(false)} className="text-ink/40 hover:text-ink">
                  <X size={16} />
                </button>
              </div>
              <ImagePicker value={imageDraft} onChange={setImageDraft} />
              <button
                onClick={async () => {
                  const err = await updateContent((c) => ({
                    ...c,
                    hero: { ...c.hero, image: imageDraft },
                  }));
                  if (!err) setImagePanel(false);
                }}
                className="mt-3 w-full rounded-lg bg-brand py-2 text-sm font-medium text-cream hover:bg-brand-deep"
              >
                Save image
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setImageDraft(content.hero.image);
                setImagePanel(true);
              }}
              className="flex items-center gap-2 rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-brand shadow-lg transition hover:bg-cream"
            >
              <ImageIcon size={15} /> Change image
            </button>
          )}
        </div>
      )}
    </section>
  );
}
