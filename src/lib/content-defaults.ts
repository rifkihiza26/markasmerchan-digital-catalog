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
