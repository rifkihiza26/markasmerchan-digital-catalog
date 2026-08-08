-- helpers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- roles
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'editor');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'superadmin')
  );
$$;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- categories
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active categories" ON public.product_categories
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage categories" ON public.product_categories
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER product_categories_updated_at BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.product_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  material TEXT,
  specifications TEXT[] NOT NULL DEFAULT '{}',
  featured_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX products_category_idx ON public.products(category_id);

-- projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  client_name TEXT,
  project_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active partners" ON public.partners
  FOR SELECT TO anon, authenticated USING (is_active OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage partners" ON public.partners
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER partners_updated_at BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site settings (singleton)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  instagram_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  footer_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- contact settings (singleton)
CREATE TABLE public.contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  instagram_url TEXT,
  email TEXT,
  address TEXT,
  google_maps_url TEXT,
  business_hours TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.contact_settings TO authenticated;
GRANT ALL ON public.contact_settings TO service_role;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view contact settings" ON public.contact_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage contact settings" ON public.contact_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER contact_settings_updated_at BEFORE UPDATE ON public.contact_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- media library
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder TEXT NOT NULL DEFAULT 'general',
  file_name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view media" ON public.media_assets
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins manage media" ON public.media_assets
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- seed: categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
  ('Apparel', 'apparel', 'Kaos, polo, kemeja, jaket, sweater, hoodie.', 1),
  ('Merchandise', 'merchandise', 'Merch harian buat event, kampus & komunitas.', 2),
  ('Flower', 'flower', 'Fresh & artificial flower.', 3);

-- seed: products (catalog names only; copy/specs left blank for the CMS)
INSERT INTO public.products (category_id, name, slug, sort_order)
SELECT c.id, v.name, v.slug, v.sort_order
FROM (VALUES
  ('apparel', 'Sablon Kaos', 'sablon-kaos', 1),
  ('apparel', 'Sablon Kaos Polo', 'sablon-kaos-polo', 2),
  ('apparel', 'Kemeja PDH', 'kemeja-pdh', 3),
  ('apparel', 'Kemeja Workshirt', 'kemeja-workshirt', 4),
  ('apparel', 'Jaket Parka', 'jaket-parka', 5),
  ('apparel', 'Jaket Bomber', 'jaket-bomber', 6),
  ('apparel', 'Sweater', 'sweater', 7),
  ('apparel', 'Hoodie', 'hoodie', 8),
  ('merchandise', 'Kipas', 'kipas', 1),
  ('merchandise', 'Bucket Hat', 'bucket-hat', 2),
  ('merchandise', 'Tas Spunbond', 'tas-spunbond', 3),
  ('merchandise', 'Tas Blacu', 'tas-blacu', 4),
  ('merchandise', 'Sticker', 'sticker', 5),
  ('merchandise', 'Lanyard', 'lanyard', 6),
  ('merchandise', 'Keychain', 'keychain', 7),
  ('merchandise', 'Tumbler', 'tumbler', 8),
  ('merchandise', 'Thermos Niagara', 'thermos-niagara', 9),
  ('flower', 'Fresh Flower', 'fresh-flower', 1),
  ('flower', 'Artificial Flower', 'artificial-flower', 2)
) AS v(cat_slug, name, slug, sort_order)
JOIN public.product_categories c ON c.slug = v.cat_slug;

-- seed: site + contact settings (brand copy already on the site)
INSERT INTO public.site_settings (brand_name, tagline, description, hero_title, hero_subtitle, footer_text)
VALUES (
  'MARKASMERCHAN',
  'Satu Tempat, Semua Kebutuhan Merch Lo',
  'Custom Merchandise & Apparel',
  'Custom Merchandise & Apparel',
  'Satu Tempat, Semua Kebutuhan Merch Lo',
  'All rights reserved.'
);

INSERT INTO public.contact_settings (whatsapp_number) VALUES (NULL);
