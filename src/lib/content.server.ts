import { createPublicClient } from "./supabase-public.server";
import { SITE_CONTEXT_FALLBACK, SITE_FALLBACK, CONTACT_FALLBACK } from "./content-defaults";
import type {
  CatalogCategory,
  PublicPartner,
  PublicProduct,
  PublicProject,
  SiteContext,
} from "./content-types";

const PRODUCT_FIELDS =
  "id, name, slug, short_description, description, material, specifications, featured_image, gallery, is_featured, category_id";

/** Never throws: the public site degrades to empty content instead of a 500. */
export async function loadCatalog(): Promise<CatalogCategory[]> {
  try {
    const supabase = createPublicClient();
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase
        .from("product_categories")
        .select("id, name, slug, description, image_url")
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(PRODUCT_FIELDS)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    return (categories ?? []).map((category) => ({
      ...category,
      products: ((products ?? []) as PublicProduct[]).filter(
        (product) => product.category_id === category.id,
      ),
    }));
  } catch (error) {
    console.error("[content] loadCatalog failed", error);
    return [];
  }
}

export async function loadProduct(slug: string): Promise<{
  product: PublicProduct;
  category: { name: string; slug: string } | null;
  related: PublicProduct[];
} | null> {
  try {
    const supabase = createPublicClient();
    const { data: product } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("slug", slug)
      .maybeSingle();

    if (!product) return null;

    let category: { name: string; slug: string } | null = null;
    let related: PublicProduct[] = [];

    if (product.category_id) {
      const [{ data: categoryRow }, { data: relatedRows }] = await Promise.all([
        supabase
          .from("product_categories")
          .select("name, slug")
          .eq("id", product.category_id)
          .maybeSingle(),
        supabase
          .from("products")
          .select(PRODUCT_FIELDS)
          .eq("category_id", product.category_id)
          .neq("slug", slug)
          .order("sort_order", { ascending: true })
          .limit(4),
      ]);
      category = categoryRow ?? null;
      related = (relatedRows ?? []) as PublicProduct[];
    }

    return { product: product as PublicProduct, category, related };
  } catch (error) {
    console.error("[content] loadProduct failed", error);
    return null;
  }
}

export async function loadProjects(): Promise<PublicProject[]> {
  try {
    const { data } = await createPublicClient()
      .from("projects")
      .select(
        "id, title, slug, description, image_url, gallery, category, client_name, project_date, is_featured",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return (data ?? []) as PublicProject[];
  } catch (error) {
    console.error("[content] loadProjects failed", error);
    return [];
  }
}

export async function loadPartners(): Promise<PublicPartner[]> {
  try {
    const { data } = await createPublicClient()
      .from("partners")
      .select("id, name, logo_url, website_url")
      .order("sort_order", { ascending: true });
    return (data ?? []) as PublicPartner[];
  } catch (error) {
    console.error("[content] loadPartners failed", error);
    return [];
  }
}

export async function loadSiteContext(): Promise<SiteContext> {
  try {
    const supabase = createPublicClient();
    const [{ data: site }, { data: contact }] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.from("contact_settings").select("*").limit(1).maybeSingle(),
    ]);

    return {
      site: {
        brand_name: site?.brand_name || SITE_FALLBACK.brand_name,
        tagline: site?.tagline || SITE_FALLBACK.tagline,
        description: site?.description || SITE_FALLBACK.description,
        logo_url: site?.logo_url ?? null,
        favicon_url: site?.favicon_url ?? null,
        hero_title: site?.hero_title || SITE_FALLBACK.hero_title,
        hero_subtitle: site?.hero_subtitle || SITE_FALLBACK.hero_subtitle,
        hero_image_1: site?.hero_image_1 ?? null,
        hero_image_2: site?.hero_image_2 ?? null,
        hero_image_3: site?.hero_image_3 ?? null,
        instagram_url: site?.instagram_url ?? null,
        whatsapp_number: site?.whatsapp_number ?? null,
        email: site?.email ?? null,
        address: site?.address ?? null,
        footer_text: site?.footer_text || SITE_FALLBACK.footer_text,
        landing_page_content: {
          ...SITE_FALLBACK.landing_page_content,
          ...((site?.landing_page_content as any) ?? {}),
        },

      },
      contact: {
        whatsapp_number: contact?.whatsapp_number ?? site?.whatsapp_number ?? null,
        instagram_url: contact?.instagram_url ?? site?.instagram_url ?? null,
        email: contact?.email ?? site?.email ?? null,
        address: contact?.address ?? site?.address ?? null,
        google_maps_url: contact?.google_maps_url ?? CONTACT_FALLBACK.google_maps_url,
        business_hours: contact?.business_hours ?? CONTACT_FALLBACK.business_hours,
      },
    };
  } catch (error) {
    console.error("[content] loadSiteContext failed", error);
    return SITE_CONTEXT_FALLBACK;
  }
}
