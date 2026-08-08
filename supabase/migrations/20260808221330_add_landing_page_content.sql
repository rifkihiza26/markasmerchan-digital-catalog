ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS landing_page_content JSONB DEFAULT '{}'::jsonb;
