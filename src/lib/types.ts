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

export interface SiteContent {
  hero: {
    headline: string;
    subtext: string;
    image: string;
  };
  about: {
    heading: string;
    body: string;
  };
  shop: {
    heading: string;
    subtext: string;
  };
  prints: Print[];
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
