"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Quote, Check, X } from "lucide-react";
import type { Review, SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import ReviewEditModal from "./ReviewEditModal";

function patchReviews(c: SiteContent, fn: (list: Review[]) => Review[]): SiteContent {
  return { ...c, reviews: fn(c.reviews ?? []) };
}

function StarRow({ rating, size = 14 }: { rating?: number; size?: number }) {
  if (!rating) return null;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < rating ? "fill-aqua text-aqua" : "text-seafoam"} />
      ))}
    </div>
  );
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
      <div className="mt-4">
        <StarRow rating={review.rating} />
      </div>

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

function PendingRow({
  review,
  onApprove,
  onReject,
}: {
  review: Review;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-turquoise/40 bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-ink">{review.name}</p>
          <StarRow rating={review.rating} size={12} />
        </div>
        {review.context && <p className="text-xs text-ink/50">{review.context}</p>}
        <p className="mt-1 text-sm italic text-ink/70">“{review.quote}”</p>
      </div>
      <div className="flex shrink-0 gap-2 self-end sm:self-auto">
        <button
          onClick={onApprove}
          className="flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-cream hover:bg-brand-deep"
        >
          <Check size={13} /> Approve
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-1 rounded-full border border-seafoam px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-red-50 hover:text-red-500"
        >
          <X size={13} /> Reject
        </button>
      </div>
    </div>
  );
}

function SubmitReviewForm() {
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-lg border border-seafoam bg-mist px-3 py-2 text-sm outline-none focus:border-turquoise";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !quote.trim()) {
      setError("Please add your name and a review.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, context, quote, rating, company }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "Something went wrong");
      }
      setStatus("sent");
      setName("");
      setContext("");
      setQuote("");
      setRating(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-seafoam/70 bg-cream p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">Thank you!</p>
        <p className="mt-2 text-sm text-ink/60">
          Your review has been sent and will appear here once it's approved.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-brand hover:text-brand-deep"
        >
          Leave another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg rounded-xl border border-seafoam/70 bg-cream p-8">
      <h3 className="text-center font-display text-xl font-semibold text-ink">Leave a Review</h3>
      <p className="mt-1 text-center text-sm text-ink/55">
        Bought a print, or saw the work in person? We'd love to hear from you.
      </p>

      <div className="mt-6 space-y-4">
        {/* Honeypot — hidden from real visitors, bots tend to fill every field. */}
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
            Name
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
            How do you know the work? (optional)
          </label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Bought a print, or Saw the collection in person"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink/50">
            Your review
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
                className="p-0.5 text-aqua transition hover:scale-110"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star size={22} className={n <= rating ? "fill-aqua" : ""} />
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-brand py-2.5 text-sm font-medium tracking-widest uppercase text-cream transition hover:bg-brand-deep disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const { isAdmin, updateContent } = useAdmin();
  const [editing, setEditing] = useState<Review | null>(null);
  const [adding, setAdding] = useState(false);

  const approved = reviews.filter((r) => r.approved !== false);
  const pending = reviews.filter((r) => r.approved === false);

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

  async function approve(id: string) {
    await updateContent((c) =>
      patchReviews(c, (list) => list.map((r) => (r.id === id ? { ...r, approved: true } : r)))
    );
  }

  async function reject(id: string) {
    await updateContent((c) => patchReviews(c, (list) => list.filter((r) => r.id !== id)));
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

        {isAdmin && pending.length > 0 && (
          <div className="mb-12">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-brand">
              Pending approval — only visible to you ({pending.length})
            </p>
            <div className="space-y-3">
              {pending.map((review) => (
                <PendingRow
                  key={review.id}
                  review={review}
                  onApprove={() => approve(review.id)}
                  onReject={() => reject(review.id)}
                />
              ))}
            </div>
          </div>
        )}

        {approved.length > 0 && (
          <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((review) => (
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

        <SubmitReviewForm />
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
