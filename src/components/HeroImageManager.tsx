"use client";

import { useRef, useState } from "react";
import { X, Plus, ArrowUp, ArrowDown, Trash2, Crop, Check } from "lucide-react";
import type { HeroImage } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ImagePicker from "./ImagePicker";

interface Props {
  images: HeroImage[];
  onClose: () => void;
}

export function heroImageStyle(img: HeroImage): React.CSSProperties {
  return {
    objectPosition: `${img.posX}% ${img.posY}%`,
    transform: `scale(${img.zoom})`,
    transformOrigin: `${img.posX}% ${img.posY}%`,
  };
}

export default function HeroImageManager({ images, onClose }: Props) {
  const { updateContent, saving } = useAdmin();
  const [list, setList] = useState<HeroImage[]>(images);
  const [adjusting, setAdjusting] = useState<number | null>(null);
  const [addUrl, setAddUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  function patch(i: number, p: Partial<HeroImage>) {
    setList((prev) => prev.map((img, idx) => (idx === i ? { ...img, ...p } : img)));
  }

  function move(i: number, dir: -1 | 1) {
    setList((prev) => {
      const t = i + dir;
      if (t < 0 || t >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });
    setAdjusting(null);
  }

  function onDrag(i: number, e: React.PointerEvent) {
    if (!dragRef.current || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const img = list[i];
    const dx = ((e.clientX - dragRef.current.x) / rect.width) * (100 / img.zoom);
    const dy = ((e.clientY - dragRef.current.y) / rect.height) * (100 / img.zoom);
    dragRef.current = { x: e.clientX, y: e.clientY };
    patch(i, {
      posX: Math.max(0, Math.min(100, img.posX - dx)),
      posY: Math.max(0, Math.min(100, img.posY - dy)),
    });
  }

  async function save() {
    setError(null);
    if (list.length === 0) return setError("Keep at least one image");
    const err = await updateContent((c) => ({
      ...c,
      hero: { ...c.hero, images: list, image: list[0].url },
    }));
    if (err) setError(err);
    else onClose();
  }

  return (
    <div className="w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl bg-cream p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Hero images</p>
        <button onClick={onClose} className="p-1 text-ink/40 hover:text-ink" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
        {list.map((img, i) => (
          <div key={`${img.url}-${i}`} className="rounded-lg border border-seafoam bg-mist p-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-12 w-20 shrink-0 rounded-md object-cover"
                style={{ objectPosition: `${img.posX}% ${img.posY}%` }}
              />
              <span className="flex-1 truncate text-xs text-ink/50">
                {i === 0 ? "Shows first" : `Slide ${i + 1}`}
              </span>
              <button onClick={() => move(i, -1)} className="p-1 text-ink/50 hover:text-brand" title="Earlier">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} className="p-1 text-ink/50 hover:text-brand" title="Later">
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => setAdjusting(adjusting === i ? null : i)}
                className={`p-1 hover:text-brand ${adjusting === i ? "text-brand" : "text-ink/50"}`}
                title="Choose visible section"
              >
                <Crop size={14} />
              </button>
              <button
                onClick={() => {
                  setList((prev) => prev.filter((_, idx) => idx !== i));
                  setAdjusting(null);
                }}
                className="p-1 text-ink/50 hover:text-red-500"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {adjusting === i && (
              <div className="mt-2">
                <div
                  ref={previewRef}
                  className="relative aspect-[21/9] cursor-move touch-none overflow-hidden rounded-md bg-seafoam"
                  onPointerDown={(e) => {
                    dragRef.current = { x: e.clientX, y: e.clientY };
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => onDrag(i, e)}
                  onPointerUp={() => (dragRef.current = null)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                    style={heroImageStyle(img)}
                  />
                  <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-2 py-0.5 text-[10px] text-cream">
                    drag to frame the shot
                  </span>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-ink/60">
                  Zoom
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.05}
                    value={img.zoom}
                    onChange={(e) => patch(i, { zoom: Number(e.target.value) })}
                    className="flex-1 accent-brand"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-seafoam pt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink/50">Add image</p>
        <ImagePicker value={addUrl} onChange={setAddUrl} />
        <button
          onClick={() => {
            if (!addUrl.trim()) return;
            setList((prev) => [...prev, { url: addUrl.trim(), posX: 50, posY: 50, zoom: 1 }]);
            setAddUrl("");
          }}
          disabled={!addUrl.trim()}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-deep disabled:opacity-40"
        >
          <Plus size={15} /> Add to slideshow
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2 text-sm font-medium text-cream hover:bg-brand-deep disabled:opacity-50"
      >
        <Check size={15} /> {saving ? "Saving…" : "Save slideshow"}
      </button>
    </div>
  );
}
