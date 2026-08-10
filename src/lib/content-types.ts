export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  material: string | null;
  specifications: string[];
  featured_image: string | null;
  gallery: string[];
  is_featured: boolean;
  category_id: string | null;
};

export type CatalogCategory = PublicCategory & { products: PublicProduct[] };

export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  gallery: string[];
  category: string | null;
  client_name: string | null;
  project_date: string | null;
  is_featured: boolean;
};

export type PublicPartner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export type LandingPageContent = {
  one_stop: {
    title_start: string;
    title_highlight: string;
    description: string;
    labels: string[];
    card_title_start: string;
    card_title_highlight: string;
    card_description: string;
  };
  why: {
    title_start: string;
    title_highlight: string;
    values: { title: string; color: string; rot: number }[];
  };
  consultation: {
    title_start: string;
    title_highlight: string;
    description: string;
    button_text: string;
    card_title: string;
    features: string[];
  };
  bulk_order: {
    title_start: string;
    title_highlight: string;
    description: string;
    targets: string[];
    button_text: string;
  };
  marquee: {
    text: string;
  };
  hero: {
    badge: string;
    quote: string;
    cta_primary: string;
    cta_secondary: string;
    marquee_text: string;
  };
  about_page: {
    hero_title_start: string;
    hero_title_highlight: string;
    marquee_text: string;
    title_start: string;
    title_highlight: string;
    paragraph_1: string;
    paragraph_2: string;
    image_1: string | null;
    image_2: string | null;
    serve_title: string;
    serve_items: string[];
    how_title: string;
    how_description: string;
  };
  products_page: {
    hero_title_start: string;
    hero_title_highlight: string;
    description: string;
    marquee_text: string;
  };
  contact_page: {
    hero_title_start: string;
    hero_title_highlight: string;
    card_title_start: string;
    card_title_highlight: string;
    description: string;
    wa_button_text: string;
    ig_button_text: string;
    info_title: string;
    image: string | null;
    closing_start: string;
    closing_highlight: string;
  };
};


export type SiteSettings = {
  brand_name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  favicon_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_image_1: string | null;
  hero_image_2: string | null;
  hero_image_3: string | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  footer_text: string;
  landing_page_content: LandingPageContent | null;
};

export type ContactSettings = {
  whatsapp_number: string | null;
  instagram_url: string | null;
  email: string | null;
  address: string | null;
  google_maps_url: string | null;
  business_hours: string | null;
};

export type SiteContext = { site: SiteSettings; contact: ContactSettings };
