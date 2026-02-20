-- Add subcategories JSONB column to products table for multi-subcategory support
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;

-- Migrate existing subcategory data to the new column
UPDATE products 
SET subcategories = jsonb_build_array(subcategory) 
WHERE subcategory IS NOT NULL AND subcategory != '' AND (subcategories IS NULL OR subcategories = '[]'::jsonb);
