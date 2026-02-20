-- Add additional columns to experiences table for gallery, addons, and included items
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS included_items JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Dubai, UAE',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AED';

-- Update existing experiences with sample data
UPDATE experiences 
SET 
  images = ARRAY[image, '/images/experience-picnic.jpg', '/images/hero-couple-dinner.jpg'],
  location = 'Dubai, UAE',
  currency = 'AED',
  included_items = '[
    {"id": "1", "title": "Gourmet Picnic Basket", "description": "Artisanal cheeses, charcuterie, fresh bread, and seasonal fruits", "icon": "utensils"},
    {"id": "2", "title": "Premium Beverages", "description": "Selection of fine wines, champagne, or non-alcoholic alternatives", "icon": "wine"},
    {"id": "3", "title": "Elegant Setup", "description": "Luxurious blankets, cushions, and tableware", "icon": "sparkles"},
    {"id": "4", "title": "Personal Concierge", "description": "Dedicated host to ensure your comfort throughout", "icon": "user"}
  ]'::jsonb,
  addons = '[
    {"id": "1", "name": "Live Musician", "description": "Acoustic guitar or violin accompaniment", "price": 500, "available": true},
    {"id": "2", "name": "Flower Arrangement", "description": "Fresh seasonal flowers for your setup", "price": 200, "available": true},
    {"id": "3", "name": "Photography Package", "description": "30-minute professional photo session", "price": 800, "available": true}
  ]'::jsonb,
  long_description = 'Escape the ordinary and immerse yourself in an unforgettable experience crafted with meticulous attention to detail. Every element has been thoughtfully curated to create moments of pure joy and connection.'
WHERE id IS NOT NULL;
