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
        textStyle={content.styles?.["shop.heading"]}
        onSave={(v, st) =>
          updateContent((c) => ({
            ...c,
            shop: { ...c.shop, heading: v },
            styles: { ...(c.styles ?? {}), "shop.heading": st },
          }))
        }
        className="font-display text-4xl font-semibold text-ink sm:text-5xl"
      />
      <EditableText
        as="p"
        multiline
        value={content.shop.subtext}
        textStyle={content.styles?.["shop.subtext"]}
        onSave={(v, st) =>
          updateContent((c) => ({
            ...c,
            shop: { ...c.shop, subtext: v },
            styles: { ...(c.styles ?? {}), "shop.subtext": st },
          }))
        }
        className="mt-4 text-base text-ink/60"
      />
    </div>
  );
}
