"use client";

import { useState } from "react";
import {
  Pencil,
  Check,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { TextStyle } from "@/lib/types";
import { textStyleCss } from "@/lib/types";
import { useAdmin } from "./AdminProvider";

interface Props {
  value: string;
  /** saved style for this text box (size %, alignment) */
  textStyle?: TextStyle;
  onSave: (newValue: string, style: TextStyle) => Promise<string | null>;
  multiline?: boolean;
  /** Classes applied to the rendered text (and mirrored on the editor). */
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const SIZE_MIN = 50;
const SIZE_MAX = 200;
const SIZE_STEP = 10;

export default function EditableText({
  value,
  textStyle,
  onSave,
  multiline,
  className,
  as: Tag = "p",
}: Props) {
  const { isAdmin, saving } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [style, setStyle] = useState<TextStyle>(textStyle ?? {});
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <Tag className={className} style={textStyleCss(textStyle)}>
        {value}
      </Tag>
    );
  }

  const size = style.size ?? 100;
  // these blocks sit in centered layouts, so "center" is the design default
  const align = style.align ?? "center";

  function setSize(next: number) {
    setStyle((s) => ({ ...s, size: Math.max(SIZE_MIN, Math.min(SIZE_MAX, next)) }));
  }

  async function save() {
    setError(null);
    const cleaned: TextStyle = {};
    if (size !== 100) cleaned.size = size;
    if (align !== "center") cleaned.align = align;
    const err = await onSave(draft.trim(), cleaned);
    if (err) setError(err);
    else setEditing(false);
  }

  if (editing) {
    const alignButton = (a: "left" | "center" | "right", Icon: typeof AlignLeft, title: string) => (
      <button
        onClick={() => setStyle((s) => ({ ...s, align: a }))}
        className={`rounded-md p-1.5 transition ${
          align === a ? "bg-brand text-cream" : "text-ink/50 hover:bg-seafoam hover:text-brand"
        }`}
        title={title}
      >
        <Icon size={14} />
      </button>
    );

    return (
      <div className="relative w-full">
        {/* symmetry guides: dashed centre line (and edge lines for left/right) */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-1/2 w-px border-l border-dashed transition-opacity ${
            align === "center" ? "border-aqua opacity-90" : "border-aqua/40 opacity-40"
          }`}
        />
        {align === "left" && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-px border-l border-dashed border-aqua opacity-90" />
        )}
        {align === "right" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px border-r border-dashed border-aqua opacity-90" />
        )}

        <div className="mb-2 inline-flex flex-wrap items-center gap-1 rounded-lg bg-cream/95 p-1.5 shadow-md">
          {alignButton("left", AlignLeft, "Align left")}
          {alignButton("center", AlignCenter, "Centered (symmetrical)")}
          {alignButton("right", AlignRight, "Align right")}
          <span className="mx-1 h-4 w-px bg-seafoam" />
          <button
            onClick={() => setSize(size - SIZE_STEP)}
            className="rounded-md p-1.5 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Smaller text"
          >
            <Minus size={14} />
          </button>
          <span className="w-11 text-center text-xs font-medium text-ink/70">{size}%</span>
          <button
            onClick={() => setSize(size + SIZE_STEP)}
            className="rounded-md p-1.5 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Bigger text"
          >
            <Plus size={14} />
          </button>
          <span className="mx-1 h-4 w-px bg-seafoam" />
          <button
            onClick={() => setStyle({})}
            className="rounded-md p-1.5 text-ink/50 hover:bg-seafoam hover:text-brand"
            title="Reset size & alignment"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(3, draft.split("\n").length + 1)}
            className={`w-full rounded-lg border-2 border-turquoise bg-cream/95 p-2 text-ink outline-none ${className ?? ""}`}
            style={{ fontSize: `${size}%`, textAlign: align }}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className={`w-full rounded-lg border-2 border-turquoise bg-cream/95 p-2 text-ink outline-none ${className ?? ""}`}
            style={{ fontSize: `${size}%`, textAlign: align }}
          />
        )}
        <div className="mt-2 flex items-center justify-center gap-2">
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
              setStyle(textStyle ?? {});
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
      <Tag className={className} style={textStyleCss(textStyle)}>
        {value}
      </Tag>
      <button
        onClick={() => {
          setDraft(value);
          setStyle(textStyle ?? {});
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
