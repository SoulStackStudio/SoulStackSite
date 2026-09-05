"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Print } from "@/lib/types";
import { mapPrintList } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import PrintEditModal from "./PrintEditModal";

interface Props {
  prints: Print[];
  /** Enables the admin add/edit/delete/reorder controls (used on the Shop page). */
  manage?: boolean;
  /** When set, edits apply to that exhibition's prints instead of the main shop. */
  exhibitionSlug?: string;
  /** Paper stock for the show, surfaced on the product modal. */
  paper?: string;
  /** Edition / certificate line for the show. */
  edition?: string;
  /** Tile shape for the grid — landscape on exhibition pages. */
  aspect?: string;
  /** "cover" (default) crops to fill; "contain" always shows the whole photo. */
  fit?: "cover" | "contain";
}

export default function ProductGrid({
  prints,
  manage,
  exhibitionSlug,
  paper,
  edition,
  aspect,
  fit,
}: Props) {
  const { isAdmin, updateContent } = useAdmin();
  const [openPrint, setOpenPrint] = useState<Print | null>(null);
  const [editPrint, setEditPrint] = useState<Print | null>(null);
  const [adding, setAdding] = useState(false);

  const showManage = manage && isAdmin;

  async function movePrint(id: string, dir: -1 | 1) {
    await updateContent((c) =>
      mapPrintList(c, exhibitionSlug, (list) => {
        const idx = list.findIndex((p) => p.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= list.length) return list;
        const next = [...list];
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      })
    );
  }

  async function deletePrint(print: Print) {
    if (!confirm(`Delete "${print.title}"? This can't be undone.`)) return;
    await updateContent((c) =>
      mapPrintList(c, exhibitionSlug, (list) => list.filter((p) => p.id !== print.id))
    );
  }

  return (
    <>
      {showManage && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-full border border-brand/30 bg-seafoam px-5 py-2.5 text-sm font-medium text-brand-deep transition hover:bg-aqua/20"
          >
            <Plus size={16} /> Add a new print
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {prints.map((print) => (
          <ProductCard
            key={print.id}
            print={print}
            aspect={aspect}
            fit={fit}
            onOpen={() => setOpenPrint(print)}
            manage={showManage}
            onEdit={() => setEditPrint(print)}
            onDelete={() => deletePrint(print)}
            onMove={(dir) => movePrint(print.id, dir)}
          />
        ))}
      </div>

      {prints.length === 0 && (
        <p className="py-16 text-center text-ink/45">No prints available just yet — check back soon.</p>
      )}

      {openPrint && (
        <ProductModal
          print={openPrint}
          paper={paper}
          edition={edition}
          onClose={() => setOpenPrint(null)}
        />
      )}
      {(editPrint || adding) && (
        <PrintEditModal
          print={editPrint}
          exhibitionSlug={exhibitionSlug}
          onClose={() => {
            setEditPrint(null);
            setAdding(false);
          }}
        />
      )}
    </>
  );
}
