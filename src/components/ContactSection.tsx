"use client";

import { useState } from "react";
import {
  Mail,
  AtSign,
  Phone,
  MapPin,
  Globe,
  CircleDot,
  Pencil,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Check,
} from "lucide-react";
import type { SiteContent, ContactItem } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";

const DEFAULT_CONTACT = {
  heading: "Get in Touch",
  subtext:
    "For print enquiries, commissions, or anything else — reach out and we'll get back to you within a day or two.",
  items: [
    { label: "Email", value: "soulstackstudio@gmail.com" },
    { label: "Instagram", value: "@Soulstackstudio" },
  ] as ContactItem[],
};

export function resolveContact(content: SiteContent) {
  return content.contact ?? DEFAULT_CONTACT;
}

function iconFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes("mail")) return Mail;
  if (l.includes("insta")) return AtSign;
  if (l.includes("phone") || l.includes("tel") || l.includes("whatsapp")) return Phone;
  if (l.includes("address") || l.includes("studio") || l.includes("location")) return MapPin;
  if (l.includes("web") || l.includes("site")) return Globe;
  return CircleDot;
}

function linkFor(item: ContactItem): string | null {
  const label = item.label.toLowerCase();
  const value = item.value.trim();
  if (label.includes("insta")) return `https://instagram.com/${value.replace(/^@/, "")}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (/^https?:\/\//.test(value)) return value;
  if (label.includes("phone") || label.includes("whatsapp") || /^\+?[\d\s().-]{7,}$/.test(value)) {
    const digits = value.replace(/[^\d+]/g, "");
    if (digits.length >= 7) return `tel:${digits}`;
  }
  return null;
}

export default function ContactSection({ content }: { content: SiteContent }) {
  const { isAdmin, updateContent, saving } = useAdmin();
  const contact = resolveContact(content);
  const [editorOpen, setEditorOpen] = useState(false);
  const [items, setItems] = useState<ContactItem[]>(contact.items);
  const [error, setError] = useState<string | null>(null);

  function patch(i: number, p: Partial<ContactItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...p } : it)));
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const t = i + dir;
      if (t < 0 || t >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });
  }

  async function saveItems() {
    setError(null);
    const cleaned = items
      .map((it) => ({ label: it.label.trim(), value: it.value.trim() }))
      .filter((it) => it.label && it.value);
    if (cleaned.length === 0) return setError("Keep at least one contact detail");
    const err = await updateContent((c) => ({
      ...c,
      contact: { ...resolveContact(c), items: cleaned },
    }));
    if (err) setError(err);
    else setEditorOpen(false);
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
        <EditableText
          as="h1"
          value={contact.heading}
          onSave={(v) =>
            updateContent((c) => ({ ...c, contact: { ...resolveContact(c), heading: v } }))
          }
          className="font-display text-4xl font-semibold text-ink sm:text-5xl"
        />
        <EditableText
          as="p"
          multiline
          value={contact.subtext}
          onSave={(v) =>
            updateContent((c) => ({ ...c, contact: { ...resolveContact(c), subtext: v } }))
          }
          className="mx-auto mt-4 max-w-xl text-base text-ink/60"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {contact.items.map((item, i) => {
          const Icon = iconFor(item.label);
          const href = linkFor(item);
          const inner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-seafoam text-brand">
                <Icon size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-widest text-ink/45">
                  {item.label}
                </span>
                <span className="block truncate text-base text-ink">{item.value}</span>
              </span>
            </>
          );
          const cardClass =
            "flex items-center gap-4 rounded-xl border border-seafoam bg-mist px-5 py-4 transition";
          return href ? (
            <a
              key={i}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`${cardClass} hover:border-turquoise hover:shadow-md`}
            >
              {inner}
            </a>
          ) : (
            <div key={i} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>

      {isAdmin && !editorOpen && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setItems(contact.items);
              setEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-seafoam px-5 py-2.5 text-sm font-medium text-brand-deep transition hover:bg-aqua/20"
          >
            <Pencil size={14} /> Edit contact details
          </button>
        </div>
      )}

      {isAdmin && editorOpen && (
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-seafoam bg-cream p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Contact details</p>
            <button
              onClick={() => setEditorOpen(false)}
              className="p-1 text-ink/40 hover:text-ink"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={it.label}
                  onChange={(e) => patch(i, { label: e.target.value })}
                  placeholder="Label (e.g. Phone)"
                  className="w-32 rounded-lg border border-seafoam bg-mist px-3 py-2 text-sm outline-none focus:border-turquoise"
                />
                <input
                  value={it.value}
                  onChange={(e) => patch(i, { value: e.target.value })}
                  placeholder="Value (e.g. +351 …)"
                  className="flex-1 rounded-lg border border-seafoam bg-mist px-3 py-2 text-sm outline-none focus:border-turquoise"
                />
                <button onClick={() => move(i, -1)} className="p-1 text-ink/50 hover:text-brand" title="Move up">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} className="p-1 text-ink/50 hover:text-brand" title="Move down">
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                  className="p-1 text-ink/50 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setItems((prev) => [...prev, { label: "", value: "" }])}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-deep"
          >
            <Plus size={15} /> Add detail
          </button>

          <p className="mt-2 text-xs text-ink/45">
            Emails, links, Instagram handles and phone numbers become clickable automatically.
          </p>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <button
            onClick={saveItems}
            disabled={saving}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2 text-sm font-medium text-cream hover:bg-brand-deep disabled:opacity-50"
          >
            <Check size={15} /> {saving ? "Saving…" : "Save contact details"}
          </button>
        </div>
      )}
    </section>
  );
}
