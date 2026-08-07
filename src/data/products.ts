/**
 * Static product data sourced from the MarkasMerchan catalog.
 * NOTE: descriptions / materials / specs that are not present in the supplied
 * catalog are intentionally left null and rendered as
 * "[CONTENT FROM CATALOG NEEDED]" — do not invent copy, prices or specs here.
 */

export type CategoryId = "apparel" | "merchandise" | "flower";

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  /** short editorial description — from catalog only */
  description: string | null;
  /** material info — from catalog only */
  material: string | null;
  /** additional specification lines — from catalog only */
  specs: string[];
  /** image asset, null until the real catalog asset is available */
  image: string | null;
};

export const CONTENT_NEEDED = "[CONTENT FROM CATALOG NEEDED]";

export const products: Product[] = [
  // APPAREL
  { slug: "sablon-kaos", name: "Sablon Kaos", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "sablon-kaos-polo", name: "Sablon Kaos Polo", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "kemeja-pdh", name: "Kemeja PDH", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "kemeja-workshirt", name: "Kemeja Workshirt", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "jaket-parka", name: "Jaket Parka", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "jaket-bomber", name: "Jaket Bomber", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "sweater", name: "Sweater", category: "apparel", description: null, material: null, specs: [], image: null },
  { slug: "hoodie", name: "Hoodie", category: "apparel", description: null, material: null, specs: [], image: null },

  // MERCHANDISE
  { slug: "kipas", name: "Kipas", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "bucket-hat", name: "Bucket Hat", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "tas-spunbond", name: "Tas Spunbond", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "tas-blacu", name: "Tas Blacu", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "sticker", name: "Sticker", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "lanyard", name: "Lanyard", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "keychain", name: "Keychain", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "tumbler", name: "Tumbler", category: "merchandise", description: null, material: null, specs: [], image: null },
  { slug: "thermos-niagara", name: "Thermos Niagara", category: "merchandise", description: null, material: null, specs: [], image: null },

  // FLOWER
  { slug: "fresh-flower", name: "Fresh Flower", category: "flower", description: null, material: null, specs: [], image: null },
  { slug: "artificial-flower", name: "Artificial Flower", category: "flower", description: null, material: null, specs: [], image: null },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
