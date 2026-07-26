"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Print } from "@/lib/types";
import { formatPrice } from "@/lib/types";

interface Props {
  print: Print;
  onClose: () => void;
}

export default function ProductModal({ print, onClose }: Props) {
  const [sizeLabel, setSizeLabel] = useState(print.sizes[0]?.label ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = print.sizes.find((s) => s.label === sizeLabel);

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printId: print.id, sizeLabel }),
      });
      const d = await res.json();
      if (!res.ok || !d.url) throw new Error(d?.error ?? "Checkout failed");
      window.location.href = d.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-2xl bg-white shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-seafoam">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={print.image}
            alt={print.title}
            className="h-64 w-full object-cover md:h-full md:min-h-[480px]"
          />
        </div>

        <div className="relative flex flex-col p-8 md:p-10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ink/35 hover:text-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <h2 className="font-display text-3xl font-semibold text-ink">{print.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">{print.description}</p>

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
                      ? "border-brand bg-brand text-white"
                      : "border-seafoam bg-mist text-ink/70 hover:border-turquoise"
                  }`}
                >
                  {s.label} · {formatPrice(s.priceCents)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-10">
            <button
              onClick={buy}
              disabled={busy || !selected}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-widest uppercase text-white transition hover:bg-brand-deep disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Redirecting…
                </>
              ) : (
                <>Buy Print{selected ? ` — ${formatPrice(selected.priceCents)}` : ""}</>
              )}
            </button>
            {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
            <p className="mt-4 text-center text-xs text-ink/40">
              Secure checkout by Stripe · Ships ready to frame
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
