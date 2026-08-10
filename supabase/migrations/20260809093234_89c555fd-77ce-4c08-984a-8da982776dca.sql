ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_image_1 text,
  ADD COLUMN IF NOT EXISTS hero_image_2 text,
  ADD COLUMN IF NOT EXISTS hero_image_3 text;