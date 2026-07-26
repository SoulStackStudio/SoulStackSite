"use client";

import { CheckCircle2 } from "lucide-react";
import { useCart } from "./CartProvider";

/** Small confirmation that slides up when a print is added to the cart. */
export default function CartToast() {
  const { toast, dismissToast, setOpen } = useCart();

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="cart-toast fixed bottom-6 left-1/2 z-50 flex items-center gap-3 rounded-full bg-ink px-5 py-3 shadow-2xl"
      role="status"
    >
      <CheckCircle2 size={18} className="shrink-0 text-aqua" />
      <p className="text-sm text-cream">
        <span className="font-medium">{toast.title}</span>
        <span className="text-cream/70"> · {toast.sizeLabel} added</span>
      </p>
      <button
        onClick={() => {
          dismissToast();
          setOpen(true);
        }}
        className="ml-1 shrink-0 rounded-full bg-cream/15 px-3 py-1 text-xs font-medium tracking-wide text-cream transition hover:bg-cream/25"
      >
        View
      </button>
    </div>
  );
}
