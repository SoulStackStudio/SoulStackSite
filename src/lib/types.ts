export interface PrintSize {
  label: string;
  priceCents: number;
  /** Just the printed photo, e.g. "340 × 510mm" — smaller than the paper size below. */
  imageSize?: string;
  /** Full sheet size, border included, e.g. "420 × 594mm" — what "A2"/"A3" actually refers to. */
  dimensions?: string;
}

export interface Print {
  id: string;
  title: string;
  description: string;
  image: string; // absolute URL or /api/images/<key>
  featured: boolean;
  sizes: PrintSize[];
}

export interface HeroImage {
  url: string;
  /** focal point of the visible crop, in % of the source image */
  posX: number;
  posY: number;
  /** 1 = fill the frame, up to 2 = zoomed to 200% */
  zoom: number;
}

export interface ContactItem {
  label: string;
  value: string;
}

export interface TextStyle {
  /** font size as % of the design default (100 = unchanged) */
  size?: number;
  align?: "left" | "center" | "right";
}

export interface Exhibition {
  /** URL segment: /exhibitions/<slug> — this is what the QR codes point at */
  slug: string;
  title: string;
  /** one short line under the title, e.g. "Nazare, Portugal - 2026" */
  tagline: string;
  /** the full "Our Story" text; blank lines separate paragraphs */
  story: string;
  /** one paper stock for the whole show (shown in the header and on every print) */
  paper: string;
  /** edition + certificate line, e.g. "Limited edition of 30" */
  edition: string;
  /** the longer 'Fine Art Photography Prints' copy, shown below the grid */
  printInfo: string;
  coverImage: string;
  /** true = keep the folder live but leave it off the homepage/exhibitions listing */
  hidden?: boolean;
  prints: Print[];
}

export interface SiteContent {
  hero: {
    headline: string;
    subtext: string;
    /** legacy single image — kept in sync with images[0] for backward compat */
    image: string;
    images?: HeroImage[];
  };
  about: {
    heading: string;
    body: string;
  };
  shop: {
    heading: string;
    subtext: string;
  };
  /** optional so older saved content keeps working — defaults live in ContactSection */
  contact?: {
    heading: string;
    subtext: string;
    items: ContactItem[];
  };
  /** per-text-box style overrides, keyed by field id (e.g. "hero.headline") */
  styles?: Record<string, TextStyle>;
  /** optional so older saved content keeps working — each show is its own "folder" */
  exhibitions?: Exhibition[];
  prints: Print[];
}

export function textStyleCss(style?: TextStyle): React.CSSProperties {
  return {
    ...(style?.size && style.size !== 100 ? { fontSize: `${style.size}%` } : {}),
    ...(style?.align ? { textAlign: style.align } : {}),
  };
}

export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/** Every print on the site, main shop and exhibitions alike. */
export function allPrints(content: SiteContent): Print[] {
  return [...content.prints, ...(content.exhibitions ?? []).flatMap((e) => e.prints)];
}

/**
 * Resolve a print id to the print and the show it belongs to (null exhibition =
 * main shop). Exhibition print ids are namespaced "<slug>--<print>", so ids stay
 * unique across shows and the cart can keep using a single flat id.
 */
export function findPrint(
  content: SiteContent,
  id: string
): { print: Print; exhibition: Exhibition | null } | null {
  const own = content.prints.find((p) => p.id === id);
  if (own) return { print: own, exhibition: null };
  for (const exhibition of content.exhibitions ?? []) {
    const print = exhibition.prints.find((p) => p.id === id);
    if (print) return { print, exhibition };
  }
  return null;
}

/**
 * Apply a mutation to one print list — the main shop when slug is undefined,
 * otherwise the matching exhibition. Lets the shared admin grid edit either.
 */
export function mapPrintList(
  content: SiteContent,
  slug: string | undefined,
  fn: (prints: Print[]) => Print[]
): SiteContent {
  if (!slug) return { ...content, prints: fn(content.prints) };
  return {
    ...content,
    exhibitions: (content.exhibitions ?? []).map((e) =>
      e.slug === slug ? { ...e, prints: fn(e.prints) } : e
    ),
  };
}
