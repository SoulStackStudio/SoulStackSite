"use client";

import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import type { Print } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { useCart } from "./CartProvider";
import Watermark from "./Watermark";

interface Props {
  print: Print;
  /** Exhibition paper stock, shown under the description when present. */
  paper?: string;
  /** Exhibition edition / certificate line. */
  edition?: string;
  onClose: () => void;
}

export default function ProductModal({ print, paper, edition, onClose }: Props) {
  const [sizeLabel, setSizeLabel] = useState(print.sizes[0]?.label ?? "");
  const { add } = useCart();

  const selected = print.sizes.find((s) => s.label === sizeLabel);

  function addToCart() {
    if (!selected) return;
    add({
      printId: print.id,
      sizeLabel: selected.label,
      title: print.title,
      image: print.image,
      priceCents: selected.priceCents,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-2xl bg-cream shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center bg-seafoam p-3 sm:p-4">
          {/* object-contain so landscape and portrait both show in full */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={print.image}
            alt={print.title}
            className="max-h-[38vh] w-full object-contain md:max-h-[70vh] md:min-h-[420px]"
          />
          <Watermark />
        </div>

        <div className="relative flex flex-col p-6 sm:p-8 md:p-10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ink/35 hover:text-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <h2 className="font-display text-3xl font-semibold text-ink">{print.title}</h2>
          {print.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink/65">{print.description}</p>
          )}

          {(paper || edition || selected?.imageSize || selected?.dimensions) && (
            <dl className="mt-6 space-y-1.5 border-t border-seafoam pt-5 text-xs text-ink/55">
              {paper && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 uppercase tracking-widest text-ink/40">Paper</dt>
                  <dd>{paper}</dd>
                </div>
              )}
              {edition && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 uppercase tracking-widest text-ink/40">Edition</dt>
                  <dd>{edition}</dd>
                </div>
              )}
              {selected?.imageSize && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 uppercase tracking-widest text-ink/40">Image size</dt>
                  <dd>{selected.imageSize}</dd>
                </div>
              )}
              {selected?.dimensions && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 uppercase tracking-widest text-ink/40">Paper size</dt>
                  <dd>{selected.dimensions}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink/45">
              Select size
            </p>
            <div className="flex flex-wrap gap-2">
              {print.sizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSizeLabel(s.label)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    s.label === sizeLabel
                      ? "border-brand bg-brand text-cream"
                      : "border-seafoam bg-mist text-ink/70 hover:border-turquoise"
                  }`}
                >
                  {s.label} · {formatPrice(s.priceCents)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 sm:pt-10">
            <button
              onClick={addToCart}
              disabled={!selected}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-widest uppercase text-cream transition hover:bg-brand-deep disabled:opacity-60"
            >
              <ShoppingBag size={16} />
              Add to Cart{selected ? ` — ${formatPrice(selected.priceCents)}` : ""}
            </button>
            <p className="mt-4 text-center text-xs text-ink/40">
              Secure checkout by Stripe · Flat-packed, shipped unframed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
