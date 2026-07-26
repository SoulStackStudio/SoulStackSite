"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Print } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import PrintEditModal from "./PrintEditModal";

interface Props {
  prints: Print[];
  /** Enables the admin add/edit/delete/reorder controls (used on the Shop page). */
  manage?: boolean;
}

export default function ProductGrid({ prints, manage }: Props) {
  const { isAdmin, updateContent } = useAdmin();
  const [openPrint, setOpenPrint] = useState<Print | null>(null);
  const [editPrint, setEditPrint] = useState<Print | null>(null);
  const [adding, setAdding] = useState(false);

  const showManage = manage && isAdmin;

  async function movePrint(id: string, dir: -1 | 1) {
    await updateContent((c) => {
      const idx = c.prints.findIndex((p) => p.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= c.prints.length) return c;
      const next = [...c.prints];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...c, prints: next };
    });
  }

  async function deletePrint(print: Print) {
    if (!confirm(`Delete "${print.title}"? This can't be undone.`)) return;
    await updateContent((c) => ({ ...c, prints: c.prints.filter((p) => p.id !== print.id) }));
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

      {openPrint && <ProductModal print={openPrint} onClose={() => setOpenPrint(null)} />}
      {(editPrint || adding) && (
        <PrintEditModal
          print={editPrint}
          onClose={() => {
            setEditPrint(null);
            setAdding(false);
          }}
        />
      )}
    </>
  );
}
