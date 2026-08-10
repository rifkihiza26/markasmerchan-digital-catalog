import type { ContactSettings, SiteContext, SiteSettings } from "./content-types";

/** Brand copy already shipping on the site — used when settings rows are missing. */
export const SITE_FALLBACK: SiteSettings = {
  brand_name: "MARKASMERCHAN",
  tagline: "Satu Tempat, Semua Kebutuhan Merch Lo",
  description: "Custom Merchandise & Apparel",
  logo_url: null,
  favicon_url: null,
  hero_title: "Custom Merchandise & Apparel",
  hero_subtitle: "Satu Tempat, Semua Kebutuhan Merch Lo",
  hero_image_1: null,
  hero_image_2: null,
  hero_image_3: null,
  instagram_url: null,
  whatsapp_number: null,
  email: null,
  address: null,
  footer_text: "All rights reserved.",
  landing_page_content: {
    one_stop: {
      title_start: "One Stop",
      title_highlight: "solution",
      description: "Semua kebutuhan custom merchandise dan apparel lo ada di satu tempat — dari apparel, merchandise, sampai flower. Satu tempat, semua kebutuhan merch lo.",
      labels: ["Apparel", "Merchandise", "Flower"],
      card_title_start: "Lengkap &",
      card_title_highlight: "praktis",
      card_description: "Nggak perlu pindah-pindah vendor. Konsultasi, desain, produksi — semua jalan dari satu markas.",
      image: null
    },
    why: {
      title_start: "Why",
      title_highlight: "markasmerchan?",
      values: [
        { title: "One Stop Solution", color: "bg-sky", rot: -1.5 },
        { title: "Lengkap & Praktis", color: "bg-yellow", rot: 1.2 },
        { title: "Harga Transparan", color: "bg-paper", rot: -0.8 },
        { title: "Proses Jelas", color: "bg-yellow", rot: 1.8 },
        { title: "Mudah Dihubungi", color: "bg-paper", rot: -2 },
        { title: "Gratis Konsultasi Desain", color: "bg-red", rot: 1 }
      ]
    },
    consultation: {
      title_start: "Don’t have a design yet?",
      title_highlight: "we got you.",
      description: "MarkasMerchan nyediain konsultasi desain gratis — dari ide kasar sampai mockup, tim desain kami bantuin sampai jadi.",
      button_text: "Talk to our design team",
      card_title: "Free design consultation",
      features: ["Konsultasi desain", "Mockup sebelum produksi", "Revisi sampai cocok"]
    },
    bulk_order: {
      title_start: "Ordering in",
      title_highlight: "bulk?",
      description: "Pesan borongan buat kampus, organisasi, event, corporate, atau komunitas — tinggal kabarin kebutuhan lo, kami bantu itung.",
      targets: ["Campus", "Organization", "Event", "Corporate", "Community"],
      button_text: "Get a quote"
    },
    marquee: {
      text: "slay & serve"
    },
    hero: {
      badge: "Partner Custom Merch & Apparel Terpercaya untuk Kampus, Event, & Corporate",
      quote: "Satu Tempat, Semua Kebutuhan Merch Lo — Hasil rapi, Tepat Waktu, Bebas Ribet",
      cta_primary: "Lihat Katalog Produk",
      cta_secondary: "Gratis konsultasi desain",
      marquee_text: "Satu tempat, semua kebutuhan merch lo"
    },
    about_page: {
      hero_title_start: "About",
      hero_title_highlight: "us",
      marquee_text: "Custom merchandise & apparel",
      title_start: "About",
      title_highlight: "MarkasMerchan",
      paragraph_1: "MarkasMerchan adalah one stop solution untuk custom merchandise & apparel — melayani kebutuhan kampus, organisasi, event, corporate, dan komunitas.",
      paragraph_2: "",
      image_1: null,
      image_2: null,
      serve_title: "Siapa yang kami layani",
      serve_items: ["Kampus", "Organisasi", "Event", "Corporate", "Komunitas"],
      how_title: "Cara kerja kami",
      how_description: "Konsultasi → desain & mockup → produksi → kirim. Proses jelas, harga transparan, gampang dihubungi."
    },
    products_page: {
      hero_title_start: "Our",
      hero_title_highlight: "product",
      description: "Semua produk di bawah ini diambil dari katalog MarkasMerchan. Klik produk untuk lihat detail dan konsultasi.",
      marquee_text: "Apparel · Merchandise · Flower"
    },
    contact_page: {
      hero_title_start: "Ready to make something",
      hero_title_highlight: "memorable?",
      card_title_start: "Contact",
      card_title_highlight: "Us",
      description: "Ready to make something memorable? Kabarin kebutuhan merch lo, kami bantu dari konsultasi sampai produksi.",
      wa_button_text: "WhatsApp us",
      ig_button_text: "Instagram",
      info_title: "Informasi kontak",
      image: null,
      closing_start: "See u in the",
      closing_highlight: "next step"
    }
  },
};

export const CONTACT_FALLBACK: ContactSettings = {
  whatsapp_number: null,
  instagram_url: null,
  email: null,
  address: null,
  google_maps_url: null,
  business_hours: null,
};

export const SITE_CONTEXT_FALLBACK: SiteContext = {
  site: SITE_FALLBACK,
  contact: CONTACT_FALLBACK,
};

/** Recursively fills missing keys from `fallback` (arrays are replaced wholesale). */
export function deepMerge<T>(fallback: T, override: any): T {
  if (override === null || override === undefined) return fallback;
  if (Array.isArray(fallback) || typeof fallback !== "object") return override as T;
  if (typeof override !== "object" || Array.isArray(override)) return fallback;
  const out: any = { ...(fallback as any) };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge((fallback as any)[key], override[key]);
  }
  return out as T;
}

export const CONTENT_NEEDED = "[CONTENT FROM CATALOG NEEDED]";

/** Digits-only WhatsApp link, or null when no number is configured yet. */
export function waLink(
  number: string | null | undefined,
  message = "Halo MarkasMerchan, saya mau konsultasi merch.",
): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function instagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  const clean = url.replace(/\/+$/, "").split("/").pop();
  return clean ? `@${clean.replace(/^@/, "")}` : null;
}
