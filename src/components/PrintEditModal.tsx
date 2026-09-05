"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Print } from "@/lib/types";
import { mapPrintList } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ImagePicker from "./ImagePicker";

interface Props {
  /** null = creating a new print */
  print: Print | null;
  /** When set, the print is added to / edited within that exhibition. */
  exhibitionSlug?: string;
  onClose: () => void;
}

interface SizeDraft {
  label: string;
  price: string; // dollars as typed, e.g. "45"
  imageSize: string; // e.g. "340 × 510mm" — just the printed photo
  dimensions: string; // e.g. "420 × 594mm" — full sheet size, border included
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "print"
  );
}

export default function PrintEditModal({ print, exhibitionSlug, onClose }: Props) {
  const { updateContent, saving } = useAdmin();
  const [title, setTitle] = useState(print?.title ?? "");
  const [description, setDescription] = useState(print?.description ?? "");
  const [image, setImage] = useState(print?.image ?? "");
  const [featured, setFeatured] = useState(print?.featured ?? false);
  const [sizes, setSizes] = useState<SizeDraft[]>(
    print?.sizes.map((s) => ({
      label: s.label,
      price: (s.priceCents / 100).toString(),
      imageSize: s.imageSize ?? "",
      dimensions: s.dimensions ?? "",
    })) ??
      (exhibitionSlug
        ? [
            { label: "A3", price: "225", imageSize: "237 × 355mm", dimensions: "297 × 420mm" },
            { label: "A2", price: "325", imageSize: "340 × 510mm", dimensions: "420 × 594mm" },
          ]
        : [
            { label: "20×25 cm", price: "45", imageSize: "", dimensions: "" },
            { label: "30×40 cm", price: "75", imageSize: "", dimensions: "" },
            { label: "50×75 cm", price: "120", imageSize: "", dimensions: "" },
          ])
  );
  const [error, setError] = useState<string | null>(null);

  function setSize(i: number, patch: Partial<SizeDraft>) {
    setSizes((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function save() {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    if (!image.trim()) return setError("Add an image (URL or upload)");
    const parsedSizes: { label: string; priceCents: number; imageSize?: string; dimensions?: string }[] = [];
    for (const s of sizes) {
      const price = parseFloat(s.price);
      if (!s.label.trim() || isNaN(price) || price < 0.5) {
        return setError("Every size needs a label and a price of at least €0.50");
      }
      parsedSizes.push({
        label: s.label.trim(),
        priceCents: Math.round(price * 100),
        imageSize: s.imageSize.trim() || undefined,
        dimensions: s.dimensions.trim() || undefined,
      });
    }
    if (parsedSizes.length === 0) return setError("Add at least one size");

    const err = await updateContent((c) =>
      mapPrintList(c, exhibitionSlug, (list) => {
        if (print) {
          return list.map((p) =>
            p.id === print.id
              ? { ...p, title: title.trim(), description: description.trim(), image: image.trim(), featured, sizes: parsedSizes }
              : p
          );
        }
        const base = exhibitionSlug ? `${exhibitionSlug}--${slugify(title)}` : slugify(title);
        let id = base;
        while (list.some((p) => p.id === id)) id = `${base}-${Math.floor(Math.random() * 1000)}`;
        return [
          ...list,
          { id, title: title.trim(), description: description.trim(), image: image.trim(), featured, sizes: parsedSizes },
        ];
      })
    );
    if (err) setError(err);
    else onClose();
  }

  const inputClass =
    "w-full rounded-lg border border-seafoam bg-mist px-3 py-2 text-sm outline-none focus:border-turquoise";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-ink">
            {print ? "Edit print" : "Add a new print"}
          </h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Title
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Image
            </label>
            <ImagePicker value={image} onChange={setImage} />
          </div>

          {!exhibitionSlug && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Show on homepage (featured)
            </label>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Sizes &amp; prices
            </label>
            <div className="space-y-2">
              {sizes.map((s, i) => (
                <div key={i} className="rounded-lg border border-seafoam/60 p-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={s.label}
                      onChange={(e) => setSize(i, { label: e.target.value })}
                      placeholder="e.g. 30×40 cm"
                      className={inputClass}
                    />
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                        €
                      </span>
                      <input
                        value={s.price}
                        onChange={(e) => setSize(i, { price: e.target.value })}
                        inputMode="decimal"
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                    <button
                      onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                      className="shrink-0 text-ink/35 hover:text-red-500"
                      title="Remove size"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={s.imageSize}
                      onChange={(e) => setSize(i, { imageSize: e.target.value })}
                      placeholder="Image size — e.g. 340 × 510mm (optional)"
                      className={inputClass}
                    />
                    <input
                      value={s.dimensions}
                      onChange={(e) => setSize(i, { dimensions: e.target.value })}
                      placeholder="Paper size — e.g. 420 × 594mm (optional)"
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setSizes((prev) => [...prev, { label: "", price: "", imageSize: "", dimensions: "" }])
              }
              className="mt-2 flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-deep"
            >
              <Plus size={15} /> Add size
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-cream transition hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? "Saving…" : print ? "Save changes" : "Add print"}
          </button>
        </div>
      </div>
    </div>
  );
}
