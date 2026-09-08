"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import type { Review, SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";

interface Props {
  /** null = adding a new review */
  review: Review | null;
  onClose: () => void;
}

function patchReviews(c: SiteContent, fn: (list: Review[]) => Review[]): SiteContent {
  return { ...c, reviews: fn(c.reviews ?? []) };
}

export default function ReviewEditModal({ review, onClose }: Props) {
  const { updateContent, saving } = useAdmin();
  const [name, setName] = useState(review?.name ?? "");
  const [context, setContext] = useState(review?.context ?? "");
  const [quote, setQuote] = useState(review?.quote ?? "");
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-lg border border-seafoam bg-mist px-3 py-2 text-sm outline-none focus:border-turquoise";

  async function save() {
    setError(null);
    if (!name.trim()) return setError("Name is required");
    if (!quote.trim()) return setError("Add the review text");

    const err = await updateContent((c) =>
      patchReviews(c, (list) => {
        const patch: Review = {
          id: review?.id ?? `review-${Date.now()}`,
          name: name.trim(),
          context: context.trim(),
          quote: quote.trim(),
          rating,
        };
        if (review) return list.map((r) => (r.id === review.id ? patch : r));
        return [...list, patch];
      })
    );
    if (err) setError(err);
    else onClose();
  }

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
            {review ? "Edit review" : "Add a review"}
          </h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Isabel M."
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Context
            </label>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Bought a signed A2 print, or Saw the collection in Nazaré"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Review
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={4}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-0.5 text-aqua hover:scale-110 transition"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star size={22} className={n <= rating ? "fill-aqua" : ""} />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-cream transition hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? "Saving…" : review ? "Save changes" : "Add review"}
          </button>
        </div>
      </div>
    </div>
  );
}
