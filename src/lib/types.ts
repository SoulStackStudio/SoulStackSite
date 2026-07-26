export interface PrintSize {
  label: string;
  priceCents: number;
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
