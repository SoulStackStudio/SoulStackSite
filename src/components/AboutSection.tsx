"use client";

import type { SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";

export default function AboutSection({ content }: { content: SiteContent }) {
  const { updateContent } = useAdmin();

  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
        <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
        <EditableText
          as="h2"
          value={content.about.heading}
          onSave={(v) => updateContent((c) => ({ ...c, about: { ...c.about, heading: v } }))}
          className="font-display text-3xl font-semibold text-ink sm:text-4xl"
        />
        <EditableText
          as="p"
          multiline
          value={content.about.body}
          onSave={(v) => updateContent((c) => ({ ...c, about: { ...c.about, body: v } }))}
          className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg"
        />
      </div>
    </section>
  );
}
