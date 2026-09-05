"use client";

import { useState } from "react";
import { Pencil, X, Check, Eye, EyeOff } from "lucide-react";
import type { Exhibition, SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ImagePicker from "./ImagePicker";

function patchShow(c: SiteContent, slug: string, patch: Partial<Exhibition>): SiteContent {
  return {
    ...c,
    exhibitions: (c.exhibitions ?? []).map((e) => (e.slug === slug ? { ...e, ...patch } : e)),
  };
}

/**
 * The big cover photo at the top of an exhibition page. In admin mode it
 * carries two controls: change the photo, and show/hide the whole exhibition
 * from the homepage + /exhibitions listing (the exhibition itself stays live
 * at its own URL either way).
 */
export default function ExhibitionCoverEditor({ show }: { show: Exhibition }) {
  const { isAdmin, updateContent, saving } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(show.coverImage);
  const [error, setError] = useState<string | null>(null);

  if (!show.coverImage && !isAdmin) return null;

  async function save() {
    setError(null);
    const err = await updateContent((c) => patchShow(c, show.slug, { coverImage: url.trim() }));
    if (err) setError(err);
    else setEditing(false);
  }

  async function toggleHidden() {
    await updateContent((c) => patchShow(c, show.slug, { hidden: !show.hidden }));
  }

  return (
    <div className="relative h-[38vh] min-h-[240px] w-full overflow-hidden bg-seafoam sm:h-[52vh]">
      {show.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={show.coverImage} alt={show.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-ink/35">
          No cover photo yet
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-cream" />

      {isAdmin && (
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={toggleHidden}
            className="flex items-center gap-1.5 rounded-full bg-cream/95 px-3 py-1.5 text-xs font-medium text-ink shadow-md hover:bg-cream"
            title={
              show.hidden
                ? "Hidden from the homepage/exhibitions list — click to show"
                : "Visible on the homepage/exhibitions list — click to hide"
            }
          >
            {show.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
            {show.hidden ? "Hidden" : "Visible"}
          </button>
          <button
            onClick={() => {
              setUrl(show.coverImage);
              setError(null);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-cream/95 px-3 py-1.5 text-xs font-medium text-ink shadow-md hover:bg-cream"
          >
            <Pencil size={13} /> Cover photo
          </button>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">Cover photo</p>
              <button
                onClick={() => setEditing(false)}
                className="text-ink/40 hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <ImagePicker value={url} onChange={setUrl} />
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            <button
              onClick={save}
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-cream transition hover:bg-brand-deep disabled:opacity-50"
            >
              <Check size={15} /> {saving ? "Saving…" : "Save cover photo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
