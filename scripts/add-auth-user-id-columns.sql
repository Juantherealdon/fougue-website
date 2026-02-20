-- Add auth_user_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_orders_auth_user_id ON orders(auth_user_id);

-- Add auth_user_id column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_bookings_auth_user_id ON bookings(auth_user_id);

-- Add auth_user_id column to reservations table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reservations') THEN
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS idx_reservations_auth_user_id ON reservations(auth_user_id);
  END IF;
END $$;
