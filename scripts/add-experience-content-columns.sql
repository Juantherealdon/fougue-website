-- Add missing content columns to experiences table
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS long_description TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS included_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AED';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';
