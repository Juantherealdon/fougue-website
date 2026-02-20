-- Add missing columns to experiences table
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS requirements jsonb DEFAULT '[]'::jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
