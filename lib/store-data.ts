export type ProductCategory =
  | "smartphones"
  | "audio"
  | "wearables"
  | "computing"
  | "accessories";

export type CategoryRecord = {
  id: number;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type ProductRecord = {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  description: string;
  image: string;
  badge: string | null;
  featured: boolean;
  inStock: boolean;
  sku: string;
  specs: string[];
};

export const categorySeeds: Array<{
  slug: ProductCategory;
  name: string;
  description: string;
  sortOrder: number;
}> = [
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Fresh devices and daily-driver phone picks.",
    sortOrder: 1,
  },
  {
    slug: "audio",
    name: "Audio",
    description: "Wireless earbuds, speakers, and listening gear.",
    sortOrder: 2,
  },
  {
    slug: "wearables",
    name: "Wearables",
    description: "Watches and connected accessories for everyday use.",
    sortOrder: 3,
  },
  {
    slug: "computing",
    name: "Computing",
    description: "Laptop and tablet picks for work and study.",
    sortOrder: 4,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Cases, chargers, cables, and bundle essentials.",
    sortOrder: 5,
  },
];

export const productSeeds = [
  {
    slug: "nova-x12-pro-kit",
    name: "Nova X12 Pro Kit",
    categorySlug: "smartphones",
    price: 84990,
    compareAtPrice: 89990,
    shortDescription: "Flagship-style phone bundle with case and braided cable.",
    description:
      "Built for customers who want a polished daily driver with a premium feel, fast charging support, and ready-to-go protection in the box.",
    image: "/assets/product-smartphone.png",
    badge: "Featured",
    featured: true,
    inStock: true,
    sku: "YMS-PHN-001",
    specs: ["256GB storage", "120Hz display", "Fast charging cable included"],
  },
  {
    slug: "nova-x12-lite",
    name: "Nova X12 Lite",
    categorySlug: "smartphones",
    price: 52990,
    compareAtPrice: null,
    shortDescription: "Balanced performance phone for students and everyday use.",
    description:
      "A reliable mid-range smartphone setup for browsing, social apps, calls, and all-day use with a clean in-hand design.",
    image: "/assets/product-smartphone.png",
    badge: "Popular",
    featured: false,
    inStock: true,
    sku: "YMS-PHN-002",
    specs: ["128GB storage", "Dual camera", "USB-C fast charge support"],
  },
  {
    slug: "pulse-buds-air",
    name: "Pulse Buds Air",
    categorySlug: "audio",
    price: 6990,
    compareAtPrice: 7990,
    shortDescription: "Wireless earbuds with charging case and punchy sound.",
    description:
      "Compact earbuds tuned for everyday listening, voice calls, and commute-friendly battery life with a pocketable case.",
    image: "/assets/product-earbuds.png",
    badge: "New",
    featured: true,
    inStock: true,
    sku: "YMS-AUD-001",
    specs: ["Bluetooth 5.x", "Charging case included", "Touch controls"],
  },
  {
    slug: "sonic-buds-max",
    name: "Sonic Buds Max",
    categorySlug: "audio",
    price: 9990,
    compareAtPrice: null,
    shortDescription: "Upgraded earbuds bundle with longer battery and richer bass.",
    description:
      "A slightly more premium take for customers who want stronger playback time and a fuller low-end tuning.",
    image: "/assets/product-earbuds.png",
    badge: null,
    featured: false,
    inStock: true,
    sku: "YMS-AUD-002",
    specs: ["Up to 30 hours with case", "Low-latency mode", "USB-C charging"],
  },
  {
    slug: "orbit-watch-s2",
    name: "Orbit Watch S2",
    categorySlug: "wearables",
    price: 12990,
    compareAtPrice: 14990,
    shortDescription: "Smartwatch with health tracking and daily notifications.",
    description:
      "A clean square wearable for customers who want call alerts, workouts, and a modern wrist presence without overspending.",
    image: "/assets/product-watch.png",
    badge: "Best Seller",
    featured: true,
    inStock: true,
    sku: "YMS-WAT-001",
    specs: ["AMOLED-style display", "Heart-rate tracking", "Multiple straps supported"],
  },
  {
    slug: "studio-tab-combo",
    name: "Studio Tab Combo",
    categorySlug: "computing",
    price: 68990,
    compareAtPrice: null,
    shortDescription: "Tablet and stylus-friendly setup for study and light work.",
    description:
      "A versatile computing pick for notes, classes, content browsing, and portable work sessions with a premium look.",
    image: "/assets/product-laptop-tablet.png",
    badge: "Featured",
    featured: true,
    inStock: true,
    sku: "YMS-CMP-001",
    specs: ["Tablet + stylus support", "Portable productivity", "Great for learning"],
  },
  {
    slug: "slimbook-flex-13",
    name: "Slimbook Flex 13",
    categorySlug: "computing",
    price: 97990,
    compareAtPrice: null,
    shortDescription: "Lightweight laptop for business, office, and multitasking.",
    description:
      "A compact laptop option for buyers who need dependable work performance and a cleaner premium-store presentation.",
    image: "/assets/product-laptop-tablet.png",
    badge: null,
    featured: false,
    inStock: true,
    sku: "YMS-CMP-002",
    specs: ["13-inch class display", "Solid-state storage", "Portable metal finish"],
  },
  {
    slug: "powerpack-essentials",
    name: "PowerPack Essentials",
    categorySlug: "accessories",
    price: 3490,
    compareAtPrice: null,
    shortDescription: "Fast charger, cable, and case bundle for daily protection.",
    description:
      "A simple accessories starter pack designed for new-device buyers who want charging and protection sorted in one go.",
    image: "/assets/product-smartphone.png",
    badge: "Bundle",
    featured: false,
    inStock: true,
    sku: "YMS-ACC-001",
    specs: ["Protective case", "Braided cable", "Fast charging adapter"],
  },
] as const;
