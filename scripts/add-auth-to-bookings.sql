-- Add auth_user_id column to bookings table (separate from reservations table)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_auth_user_id ON public.bookings(auth_user_id);

-- Update user_cart table to support multiple rows per user (product-level cart items)
-- Drop the unique constraint on user_id if it exists
ALTER TABLE public.user_cart DROP CONSTRAINT IF EXISTS user_cart_user_id_key;

-- Add product_id and product_data columns
ALTER TABLE public.user_cart ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.user_cart ADD COLUMN IF NOT EXISTS product_data JSONB;
ALTER TABLE public.user_cart ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.user_cart ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
