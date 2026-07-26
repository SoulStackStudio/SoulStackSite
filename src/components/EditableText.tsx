"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAdmin } from "./AdminProvider";

interface Props {
  value: string;
  onSave: (newValue: string) => Promise<string | null>;
  multiline?: boolean;
  /** Classes applied to the rendered text (and mirrored on the editor). */
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function EditableText({ value, onSave, multiline, className, as: Tag = "p" }: Props) {
  const { isAdmin, saving } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  async function save() {
    setError(null);
    const err = await onSave(draft.trim());
    if (err) setError(err);
    else setEditing(false);
  }

  if (editing) {
    return (
      <div className="w-full">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(3, draft.split("\n").length + 1)}
            className={`w-full rounded-lg border-2 border-turquoise bg-cream/95 p-2 text-ink outline-none ${className ?? ""}`}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className={`w-full rounded-lg border-2 border-turquoise bg-cream/95 p-2 text-ink outline-none ${className ?? ""}`}
          />
        )}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 rounded-md bg-brand px-3 py-1 text-xs font-medium text-cream hover:bg-brand-deep disabled:opacity-50"
          >
            <Check size={13} /> {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => {
              setDraft(value);
              setEditing(false);
              setError(null);
            }}
            className="flex items-center gap-1 rounded-md bg-ink/10 px-3 py-1 text-xs font-medium text-ink hover:bg-ink/20"
          >
            <X size={13} /> Cancel
          </button>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="group/edit relative">
      <Tag className={className}>{value}</Tag>
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="absolute -right-2 -top-2 rounded-full bg-turquoise p-1.5 text-cream opacity-0 shadow-md transition group-hover/edit:opacity-100"
        title="Edit text"
        aria-label="Edit text"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}
