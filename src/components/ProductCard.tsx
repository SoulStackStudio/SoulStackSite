"use client";

import { Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import type { Print } from "@/lib/types";
import { formatPrice } from "@/lib/types";

interface Props {
  print: Print;
  onOpen: () => void;
  manage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: (dir: -1 | 1) => void;
}

export default function ProductCard({ print, onOpen, manage, onEdit, onDelete, onMove }: Props) {
  const fromPrice = Math.min(...print.sizes.map((s) => s.priceCents));

  return (
    <div className="group relative">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="overflow-hidden rounded-xl bg-seafoam">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={print.image}
            alt={print.title}
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-semibold text-ink">{print.title}</h3>
          <p className="text-sm text-ink/50">from {formatPrice(fromPrice)}</p>
        </div>
      </button>

      {manage && (
        <div className="absolute right-2 top-2 flex gap-1.5 rounded-full bg-white/95 p-1.5 shadow-md">
          {print.featured && <Star size={15} className="mt-[3px] fill-aqua text-aqua" />}
          <button
            onClick={() => onMove?.(-1)}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Move earlier"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => onMove?.(1)}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Move later"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={onEdit}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Edit print"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-full p-1 text-ink/50 hover:bg-red-50 hover:text-red-500"
            title="Delete print"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
