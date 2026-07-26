"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/types";

export default function CartDrawer() {
  const { items, totalCents, isOpen, setOpen, setQty, remove } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            printId: i.printId,
            sizeLabel: i.sizeLabel,
            qty: i.qty,
          })),
        }),
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
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-seafoam px-6 py-5">
          <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
            <ShoppingBag size={20} className="text-brand" /> Your Cart
          </h3>
          <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="flex-1 px-6 py-10 text-center text-ink/50">
            Your cart is empty — add a print from the shop.
          </p>
        ) : (
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {items.map((i) => (
              <div key={`${i.printId}|${i.sizeLabel}`} className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.title} className="h-20 w-16 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight text-ink">
                        {i.title}
                      </p>
                      <p className="text-xs text-ink/50">{i.sizeLabel}</p>
                    </div>
                    <button
                      onClick={() => remove(i.printId, i.sizeLabel)}
                      className="text-ink/30 hover:text-red-500"
                      aria-label={`Remove ${i.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 rounded-full border border-seafoam bg-mist px-2 py-0.5">
                      <button
                        onClick={() => setQty(i.printId, i.sizeLabel, i.qty - 1)}
                        className="p-1 text-ink/50 hover:text-brand"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-sm text-ink">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.printId, i.sizeLabel, i.qty + 1)}
                        className="p-1 text-ink/50 hover:text-brand"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {formatPrice(i.qty * i.priceCents)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-seafoam px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-widest text-ink/50">Total</p>
            <p className="font-display text-2xl font-semibold text-ink">{formatPrice(totalCents)}</p>
          </div>
          <button
            onClick={checkout}
            disabled={busy || items.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-widest uppercase text-cream transition hover:bg-brand-deep disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Redirecting…
              </>
            ) : (
              "Checkout"
            )}
          </button>
          {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
          <p className="mt-3 text-center text-xs text-ink/40">
            Secure checkout by Stripe · Ships ready to frame
          </p>
        </div>
      </div>
    </div>
  );
}
