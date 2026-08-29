"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { Exhibition, SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";

/** Applies a patch to one exhibition, leaving the rest of the content alone. */
function patchShow(c: SiteContent, slug: string, patch: Partial<Exhibition>): SiteContent {
  return {
    ...c,
    exhibitions: (c.exhibitions ?? []).map((e) => (e.slug === slug ? { ...e, ...patch } : e)),
  };
}

export function ExhibitionHeader({ show }: { show: Exhibition }) {
  const { updateContent } = useAdmin();

  return (
    <header className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
      <p className="text-xs uppercase tracking-[0.35em] text-ink/40">Exhibition</p>
      <EditableText
        as="h1"
        value={show.title}
        onSave={(v) => updateContent((c) => patchShow(c, show.slug, { title: v }))}
        className="mt-4 font-display text-4xl font-semibold text-ink sm:text-6xl"
      />
      <EditableText
        as="p"
        value={show.tagline}
        onSave={(v) => updateContent((c) => patchShow(c, show.slug, { tagline: v }))}
        className="mt-4 text-sm tracking-wide text-ink/55"
      />
    </header>
  );
}

/**
 * A long passage that stays out of the way until it's wanted.
 *
 * On phones it collapses to nothing, so the top of the page is just two slim
 * rows and the prints sit near the fold. From `sm` up there's room for a few
 * teaser lines under a soft fade.
 */
function Collapsible({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 border-b border-seafoam/60 pb-3 text-left sm:border-0 sm:pb-0"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink/40 transition group-hover:text-brand">
          {label}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-brand transition-transform duration-300 sm:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`relative overflow-hidden transition-[max-height] duration-500 ease-out ${
          open ? "max-h-[220rem]" : "max-h-0 sm:max-h-44"
        }`}
      >
        <div className="pt-4">{children}</div>
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-20 bg-gradient-to-b from-transparent to-cream sm:block" />
        )}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 hidden text-[10px] uppercase tracking-[0.25em] text-brand transition hover:text-brand-deep sm:block"
      >
        {open ? "Read less" : "Read more"}
      </button>
    </div>
  );
}

const proseClass = "whitespace-pre-line text-left text-[13.5px] leading-[1.75] text-ink/65";

/**
 * "Our Story" and the fine-art print copy, side by side above the grid so the
 * work stays close to the top of the page.
 */
export function ExhibitionNarrative({ show }: { show: Exhibition }) {
  const { updateContent } = useAdmin();

  return (
    <section className="mx-auto mt-12 grid max-w-4xl gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-14">
      <div className="sm:border-r sm:border-seafoam/60 sm:pr-14">
        <Collapsible label="Our Story">
          <EditableText
            as="p"
            multiline
            value={show.story}
            onSave={(v) => updateContent((c) => patchShow(c, show.slug, { story: v }))}
            className={proseClass}
          />
        </Collapsible>
      </div>

      <div>
        <Collapsible label="The Prints">
          <EditableText
            as="p"
            multiline
            value={show.printInfo}
            onSave={(v) => updateContent((c) => patchShow(c, show.slug, { printInfo: v }))}
            className={proseClass}
          />
        </Collapsible>
      </div>
    </section>
  );
}

/** Paper / sizes / edition, set as a hairline band rather than filled boxes. */
export function ExhibitionSpecs({ show }: { show: Exhibition }) {
  const { updateContent } = useAdmin();

  // Every print in a show carries the same size list, so read it off the first.
  // Shown largest first (A2 / A3), which is not the order they're priced in.
  const sizes = [...(show.prints[0]?.sizes ?? [])].sort((a, b) => b.priceCents - a.priceCents);

  return (
    <dl className="mx-auto mt-12 grid max-w-3xl divide-y divide-seafoam/60 border-y border-seafoam/60 bg-gradient-to-r from-transparent via-aqua/8 to-transparent sm:mt-16 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="px-6 py-7 text-center">
        <dt className="text-[10px] uppercase tracking-[0.3em] text-ink/35">Paper</dt>
        <dd>
          <EditableText
            as="p"
            value={show.paper}
            onSave={(v) => updateContent((c) => patchShow(c, show.slug, { paper: v }))}
            className="mt-3 font-display text-lg leading-snug text-ink/85"
          />
        </dd>
      </div>

      <div className="px-6 py-7 text-center">
        <dt className="text-[10px] uppercase tracking-[0.3em] text-ink/35">Sizes</dt>
        <dd className="mt-3 font-display text-lg leading-snug text-ink/85">
          {sizes.length ? sizes.map((s) => s.label).join(" · ") : "—"}
        </dd>
      </div>

      <div className="px-6 py-7 text-center">
        <dt className="text-[10px] uppercase tracking-[0.3em] text-ink/35">Edition</dt>
        <dd>
          <EditableText
            as="p"
            value={show.edition}
            onSave={(v) => updateContent((c) => patchShow(c, show.slug, { edition: v }))}
            className="mt-3 font-display text-lg leading-snug text-ink/85"
          />
        </dd>
      </div>
    </dl>
  );
}
