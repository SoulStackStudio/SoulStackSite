"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Quote } from "lucide-react";
import type { Review, SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ReviewEditModal from "./ReviewEditModal";

function patchReviews(c: SiteContent, fn: (list: Review[]) => Review[]): SiteContent {
  return { ...c, reviews: fn(c.reviews ?? []) };
}

function ReviewCard({
  review,
  manage,
  onEdit,
  onDelete,
  onMove,
}: {
  review: Review;
  manage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-seafoam/70 bg-cream p-7">
      <Quote size={28} className="text-seafoam" strokeWidth={1.5} />

      {!!review.rating && (
        <div className="mt-4 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating! ? "fill-aqua text-aqua" : "text-seafoam"}
            />
          ))}
        </div>
      )}

      <p className="mt-4 flex-1 font-display text-lg italic leading-relaxed text-ink/80">
        “{review.quote}”
      </p>

      <div className="mt-6 border-t border-seafoam/60 pt-4">
        <p className="text-sm font-medium text-ink">{review.name}</p>
        {review.context && <p className="text-xs text-ink/50">{review.context}</p>}
      </div>

      {manage && (
        <div className="absolute right-3 top-3 flex gap-1 rounded-full bg-cream/95 p-1 opacity-0 shadow-md transition group-hover:opacity-100">
          <button
            onClick={() => onMove(-1)}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Move earlier"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => onMove(1)}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Move later"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={onEdit}
            className="rounded-full p-1 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Edit review"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-full p-1 text-ink/50 hover:bg-red-50 hover:text-red-500"
            title="Delete review"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const { isAdmin, updateContent } = useAdmin();
  const [editing, setEditing] = useState<Review | null>(null);
  const [adding, setAdding] = useState(false);

  if (!isAdmin && reviews.length === 0) return null;

  async function move(id: string, dir: -1 | 1) {
    await updateContent((c) =>
      patchReviews(c, (list) => {
        const idx = list.findIndex((r) => r.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= list.length) return list;
        const next = [...list];
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      })
    );
  }

  async function remove(review: Review) {
    if (!confirm(`Delete this review from ${review.name}? This can't be undone.`)) return;
    await updateContent((c) => patchReviews(c, (list) => list.filter((r) => r.id !== review.id)));
  }

  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-turquoise">
            What People Say
          </p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Reviews</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ink/60">
            From collectors at home and visitors who saw the work in person.
          </p>
        </div>

        {isAdmin && (
          <div className="mb-10 flex justify-center">
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 rounded-full border border-brand/30 bg-seafoam px-5 py-2.5 text-sm font-medium text-brand-deep transition hover:bg-aqua/20"
            >
              <Plus size={16} /> Add a review
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="py-8 text-center text-ink/45">No reviews yet — add the first one above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                manage={isAdmin}
                onEdit={() => setEditing(review)}
                onDelete={() => remove(review)}
                onMove={(dir) => move(review.id, dir)}
              />
            ))}
          </div>
        )}
      </div>

      {(editing || adding) && (
        <ReviewEditModal
          review={editing}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </section>
  );
}
