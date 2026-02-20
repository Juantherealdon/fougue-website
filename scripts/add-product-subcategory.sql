-- Add subcategory column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create product_subcategories table to store available subcategories
CREATE TABLE IF NOT EXISTS product_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for subcategories table (public read, admin write)
ALTER TABLE product_subcategories DISABLE ROW LEVEL SECURITY;

-- Insert some default subcategories
INSERT INTO product_subcategories (name) VALUES 
  ('Vouchers'),
  ('Mystery Gifts'),
  ('Couples Experiences'),
  ('Digital'),
  ('Premium Collections')
ON CONFLICT (name) DO NOTHING;
