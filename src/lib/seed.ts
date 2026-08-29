import type { SiteContent } from "./types";

const defaultSizes = [
  { label: "20×25 cm", priceCents: 4500 },
  { label: "30×40 cm", priceCents: 7500 },
  { label: "50×75 cm", priceCents: 12000 },
];

const exhibitionSizes = [
  { label: "A3", priceCents: 15600 },
  { label: "A2", priceCents: 19500 },
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
  exhibitions: [
    {
      "slug": "the-sea-within-us",
      "title": "The Sea Within Us",
      "tagline": "Nazare, Portugal - a first year at the water's edge",
      "story": "Soul Stack Studio really began with three things: a shared love of photography, a deep pull towards the ocean, and a simple choice to build a life together that we truly love.\n\nWe are Cassandra and Clive. Over the past year, Nazare has transformed from a place where we just happen to live into something much deeper. It became our home and a central part of our story. We packed up and moved to Portugal to design a life centered around what matters most to us: creative freedom, the sea, and the dream of building something of our own.\n\nWith our cameras always in hand, we slowly learned to tune out the noise and pay closer attention to the world around us. We fell in love with the shifting coastal light, the constant pulse of the Atlantic, and those quiet, breathless moments right before a wave crashes down. We watched the ocean on days when it was completely wild and unpredictable, and on days when it was so still it looked like glass.\n\nGradually, those fleeting moments grew into a collection. The Sea Within Us is the heart of that first year, functioning as a visual journal of us exploring, looking, and creating side by side.\n\nThese photographs are not just pictures of the ocean. They are tangible pieces of the new life we are building here. They hold our memories of crisp mornings, slow afternoons, sudden winter storms, and the endless Atlantic horizon. Photography became our anchor in Nazare, forcing us to slow down, notice the details, and truly appreciate the raw beauty right in front of us.\n\nThis exhibition is a major milestone for us. It marks the official launch of Soul Stack Studio, turning our creative passion into a business that brings the places we love right into your home. But we also believe that building a dream should not just serve us. It should lift up the community around us, too. That is why The Sea Within Us is an exhibition with a purpose. We are proud to donate a portion of all proceeds to GRUVA, a local organization supporting animal welfare right here in Nazare.\n\nWe came here to build a life, found an ocean that completely redefined our inspiration, and ended up discovering a place to call home. Now, we just want to share a piece of what we have been lucky enough to see.\n\nThank you so much for stopping by and taking a look. We hope that somewhere in these frames, you find a feeling that stays with you long after you leave.\n\nWith love from Nazare,\nCassandra & Clive\nSoul Stack Studio",
      "paper": "Canson Infinity Platine Fibre Rag 310gsm",
      "edition": "Limited edition of 30 - supplied with a Certificate of Authenticity",
      "printInfo": "Every photograph in The Sea Within Us is produced as a professional fine art print, created to the highest standards for collectors, galleries, exhibitions, and private spaces.\n\nAll prints are produced exclusively on Canson Infinity Platine Fibre Rag 310gsm, a premium archival fine art paper chosen for its exceptional image quality, rich tonal reproduction, subtle texture, and long-term stability. This ensures that every print maintains the depth, detail, and character of the original photograph.\n\nFine art prints are available in A2 and A3 sizes and are carefully inspected and prepared by hand before being professionally flat-packed and securely packaged for safe delivery. Each print is protected throughout shipping to ensure it reaches you in excellent, gallery-ready condition.\n\nEvery artwork is supplied with a Certificate of Authenticity, confirming the details of the photograph and its edition.\n\nWhether you are purchasing a print for your home, adding to a personal collection, gifting an artwork, or acquiring a limited edition, each print is made with the same attention to quality and presentation that goes into the photography itself.\n\nPrinted to collect. Made to last.",
      "coverImage": "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=2000&auto=format&fit=crop",
      "prints": [
        {
          "id": "the-sea-within-us--smoke-on-the-water",
          "title": "Smoke on the Water",
          "description": "Spray lifting off the back of a wave as the offshore wind catches it, held for the half second it looked like smoke.",
          "image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--emerald-swirls",
          "title": "Emerald Swirls",
          "description": "Green water turning over on itself in the shallows, the colour deepening where the light stops reaching.",
          "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--wistful",
          "title": "Wistful",
          "description": "A soft, unhurried afternoon on the sand. The kind of light that makes you stop walking without deciding to.",
          "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--canyon-wall",
          "title": "Canyon Wall",
          "description": "The cliff face standing against the Atlantic, worn into shape by the same water it looks down on.",
          "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--the-nebula",
          "title": "The Nebula",
          "description": "Foam and colour spread across the surface until the sea stopped looking like the sea at all.",
          "image": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--out-of-bounds",
          "title": "Out of Bounds",
          "description": "The moment a set arrives further out than it should, past every line you thought the ocean kept to.",
          "image": "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--resilience",
          "title": "Resilience",
          "description": "A wave folding back into itself and reforming. Nothing about the ocean stays broken for long.",
          "image": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--the-red-sentinel",
          "title": "The Red Sentinel",
          "description": "The light that stands watch over the point, still there through every storm that came through.",
          "image": "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--breathe-out",
          "title": "Breathe Out",
          "description": "The long exhale after the set passes, when the water goes quiet and the horizon settles again.",
          "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--the-ocean-s-breathe",
          "title": "The Ocean's Breathe",
          "description": "The slow rise and fall of open water, photographed on a morning that never quite woke up.",
          "image": "https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--dawn-breaks",
          "title": "Dawn Breaks",
          "description": "First light coming over the Atlantic, the ten minutes we kept setting an alarm for all winter.",
          "image": "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--red-alert",
          "title": "Red Alert",
          "description": "The sky going hot and low before a winter storm, the whole coast lit in warning colours.",
          "image": "https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--the-shore-dance",
          "title": "The Shore Dance",
          "description": "Turquoise shallows moving over white sand from above, patterns that never repeat twice.",
          "image": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "the-sea-within-us--the-safe-keepers",
          "title": "The Safe Keepers",
          "description": "The quiet stretch of coast that holds everything else in place, seen from high above the water.",
          "image": "https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        }
      ]
    },
    {
      "slug": "souls-of-the-canyon",
      "title": "Souls of the Canyon",
      "tagline": "Nazare, Portugal - a first year on the cliffs",
      "story": "Soul Stack Studio started with a love of photography, a love of the ocean, and a decision to build a life around the things that make us happy. We are Cassandra and Clive. When we first came to Nazare, we knew the ocean would become a big part of our lives. What we didn't realise was how much the people who spend their lives out there would become part of our story too.\n\nSouls of the Canyon is the story of our first year photographing the big-wave surfers of Nazare. For many months, we stood on those cliffs with our cameras, often in the cold, sometimes waiting for hours for nothing much to happen. And then, almost without warning, everything would change. The ocean would come alive, the waves would build, and the surfers would head out.\n\nWhen we first started photographing Nazare, it was the size and power of the waves that caught our attention. It is hard not to be drawn in by them. But the more time we spent there, the more we found ourselves looking beyond the waves. Slowly, we began to understand that big-wave surfing is about so much more than riding a huge wave. There is an incredible amount of patience, courage and trust involved. You have to know the ocean, respect it, and accept that there will always be things you cannot control.\n\nOur cameras gave us a reason to keep coming back, but they also taught us how much there was still to learn. One of the first things we had to learn was simply how to recognise who we were photographing. From the cliffs, everything happens incredibly quickly. There can be so much water, spray and movement that, at first, it was almost impossible to tell one surfer from another.\n\nSo we started learning the little things. The colour of a board. A wetsuit. A sponsor's logo. Someone's stance. And that was when the photographs started to feel different to us. The more we watched, the more connected we felt to the people we had originally come to simply photograph.\n\nSouls of the Canyon isn't meant to be a perfect record of big-wave surfing, and we certainly don't claim to be the perfect technical surf photographers. We are still learning. We are learning the ocean, learning the light, most of all, learning how to capture something that happens incredibly quickly and from quite a distance.\n\nThese photographs are our perspective, two people standing on the cliffs of Nazare with cameras, trying to capture what we felt, what we saw, and what made us keep coming back. But every image means something to us. Each one is connected to a moment we were there to witness or a feeling we wanted to hold on to.\n\nOver this year, the ocean taught us a lot about patience. It taught us that you cannot force the moment you are waiting for. It is our first year photographing the surfers of Nazare and our first real glimpse into a world that, from the outside, can seem almost impossible to understand.\n\nThank you for being here, and for taking the time to look at our photographs.\n\nWe hope that, somewhere amongst these images, you can feel a little of what we felt standing on those cliffs - the excitement, the nerves, the beauty, the uncertainty, and above all, the incredible human spirit behind the waves.\n\nWith love from Nazare,\nCassandra & Clive\nSoul Stack Studio",
      "paper": "Canson Infinity Platine Fibre Rag 310gsm",
      "edition": "Limited edition of 30 - supplied with a Certificate of Authenticity",
      "printInfo": "Every photograph in Souls of the Canyon is produced as a professional fine art print, created to the highest standards for collectors, galleries, exhibitions, and private spaces.\n\nAll prints are produced exclusively on Canson Infinity Platine Fibre Rag 310gsm, a premium archival fine art paper chosen for its exceptional image quality, rich tonal reproduction, subtle texture, and long-term stability. This ensures that every print maintains the depth, detail, and character of the original photograph.\n\nFine art prints are available in A2 and A3 sizes and are carefully inspected and prepared by hand before being professionally flat-packed and securely packaged for safe delivery. Each print is protected throughout shipping to ensure it reaches you in excellent, gallery-ready condition.\n\nEvery artwork is supplied with a Certificate of Authenticity, confirming the details of the photograph and its edition.\n\nWhether you are purchasing a print for your home, adding to a personal collection, gifting an artwork, or acquiring a limited edition, each print is made with the same attention to quality and presentation that goes into the photography itself.\n\nPrinted to collect. Made to last.",
      "coverImage": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2000&auto=format&fit=crop",
      "prints": [
        {
          "id": "souls-of-the-canyon--contours",
          "title": "Contours",
          "description": "The shape of a wave read like a landscape, every ridge and hollow drawn in moving water.",
          "image": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--chasing-shadows",
          "title": "Chasing Shadows",
          "description": "Late light across the face of a wave, a rider working the dark side of it towards the shoulder.",
          "image": "https://images.unsplash.com/photo-1455729552865-3658a5d39692?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--liquid-earth",
          "title": "Liquid Earth",
          "description": "Water carrying so much sand and light that it stopped behaving like water entirely.",
          "image": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--into-the-trough",
          "title": "Into the Trough",
          "description": "The drop. The part everyone on the cliff stops talking for.",
          "image": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--fractured",
          "title": "Fractured",
          "description": "A wave coming apart across its whole length, more spray than shape by the time it reached us.",
          "image": "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--wind-drift",
          "title": "Wind Drift",
          "description": "Offshore wind holding the lip up a fraction longer than it should have stayed.",
          "image": "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--the-mystic-leap",
          "title": "The Mystic Leap",
          "description": "The committed moment, when there is no version of this where you change your mind.",
          "image": "https://images.unsplash.com/photo-1520942702018-0862200e6873?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--the-escape",
          "title": "The Escape",
          "description": "Out ahead of it and running, the whole thing collapsing behind the board.",
          "image": "https://images.unsplash.com/photo-1530870110042-98b2cb110834?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--the-bowl",
          "title": "The Bowl",
          "description": "Where the canyon focuses the swell and the wave stands up taller than it has any right to.",
          "image": "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--oblique",
          "title": "Oblique",
          "description": "Shot down the line from the cliff, the angle that finally makes the scale read.",
          "image": "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--into-the-heart",
          "title": "Into the Heart",
          "description": "Deep inside the section, the place we spent all winter hoping to be pointed at.",
          "image": "https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        },
        {
          "id": "souls-of-the-canyon--marmoris",
          "title": "Marmoris",
          "description": "The marbled surface left behind after the wave has gone, veined like polished stone.",
          "image": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1600&auto=format&fit=crop",
          "featured": false,
          "sizes": exhibitionSizes
        }
      ]
    }
  ],
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
