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

export type SiteSettings = {
  brand_name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  favicon_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  instagram_url: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  footer_text: string;
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
