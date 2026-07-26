"use client";

import type { SiteContent } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import EditableText from "./EditableText";

export default function ShopHeader({ content }: { content: SiteContent }) {
  const { updateContent } = useAdmin();

  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <div className="mx-auto mb-8 h-px w-16 bg-turquoise" />
      <EditableText
        as="h1"
        value={content.shop.heading}
        onSave={(v) => updateContent((c) => ({ ...c, shop: { ...c.shop, heading: v } }))}
        className="font-display text-4xl font-semibold text-ink sm:text-5xl"
      />
      <EditableText
        as="p"
        multiline
        value={content.shop.subtext}
        onSave={(v) => updateContent((c) => ({ ...c, shop: { ...c.shop, subtext: v } }))}
        className="mt-4 text-base text-ink/60"
      />
    </div>
  );
}
