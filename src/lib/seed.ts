import type { SiteContent } from "./types";

const defaultSizes = [
  { label: "20×25 cm", priceCents: 4500 },
  { label: "30×40 cm", priceCents: 7500 },
  { label: "50×75 cm", priceCents: 12000 },
];

export const defaultContent: SiteContent = {
  hero: {
    headline: "Moments of stillness, made to keep",
    subtext:
      "Fine-art photographic prints from Soul Stack Studio — luminous, considered, and printed to gallery standard.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2000&auto=format&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2000&auto=format&fit=crop",
        posX: 50,
        posY: 50,
        zoom: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
        posX: 50,
        posY: 55,
        zoom: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2000&auto=format&fit=crop",
        posX: 50,
        posY: 40,
        zoom: 1,
      },
    ],
  },
  about: {
    heading: "Behind the Lens",
    body: "Soul Stack Studio began at the water's edge — chasing the quiet hour when the light softens and the sea holds its breath. Every print in this collection was captured in a single, unrepeatable moment and is produced on archival fine-art paper with pigment inks rated to last a lifetime. Each piece is checked by hand before it ships, so what arrives at your door is exactly what the ocean gave us.",
  },
  shop: {
    heading: "The Collection",
    subtext:
      "Archival prints in three sizes, shipped ready to frame. Every order is produced to gallery standard.",
  },
  prints: [
    {
      id: "tidewater",
      title: "Tidewater",
      description:
        "An aerial study of the shoreline where turquoise shallows dissolve into white sand. Calm, expansive, and endlessly easy to live with.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop",
      featured: true,
      sizes: defaultSizes,
    },
    {
      id: "morning-glass",
      title: "Morning Glass",
      description:
        "First light over still water, shot in the ten quiet minutes before the wind arrived. Soft pastels for calm rooms.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
      featured: true,
      sizes: defaultSizes,
    },
    {
      id: "undertow",
      title: "Undertow",
      description:
        "The moment a wave folds back into itself — dark teal, glass, and spray frozen mid-motion. A statement piece with real energy.",
      image:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1600&auto=format&fit=crop",
      featured: true,
      sizes: defaultSizes,
    },
    {
      id: "the-long-horizon",
      title: "The Long Horizon",
      description:
        "A minimalist seascape: two bands of colour and a horizon line. Prints beautifully large in living spaces.",
      image:
        "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=1600&auto=format&fit=crop",
      featured: false,
      sizes: defaultSizes,
    },
    {
      id: "cerulean-drift",
      title: "Cerulean Drift",
      description:
        "Open water from above — layered blues shifting from cerulean to deep teal. Quietly dramatic in any light.",
      image:
        "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=1600&auto=format&fit=crop",
      featured: false,
      sizes: defaultSizes,
    },
    {
      id: "salt-and-silver",
      title: "Salt & Silver",
      description:
        "A storm clearing over the coast, silver light breaking through. Moody, cinematic, and rich in detail at large sizes.",
      image:
        "https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1600&auto=format&fit=crop",
      featured: false,
      sizes: defaultSizes,
    },
  ],
};
