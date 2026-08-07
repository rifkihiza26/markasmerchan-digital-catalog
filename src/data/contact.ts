/**
 * Contact info. Values not confirmed in the supplied catalog are marked as
 * placeholders — replace them with the real data before launch.
 */
export const contact = {
  brand: "MARKASMERCHAN",
  positioning: "Custom Merchandise & Apparel",
  tagline: "Satu Tempat, Semua Kebutuhan Merch Lo",
  /** PLACEHOLDER — replace with the real WhatsApp number */
  whatsappNumber: "0000000000",
  whatsappLabel: "[NOMOR WHATSAPP DARI KATALOG]",
  /** PLACEHOLDER — replace with the real Instagram handle */
  instagram: "@markasmerchan",
  instagramUrl: "https://instagram.com/",
  email: null as string | null,
  address: null as string | null,
};

export const waLink = (message = "Halo MarkasMerchan, saya mau konsultasi merch.") =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
