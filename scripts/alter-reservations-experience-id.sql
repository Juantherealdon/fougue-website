-- Alter reservations table to use TEXT for experience_id instead of UUID
-- This allows non-UUID experience IDs (like "ezrngfndgefzqsfd" or "interlude-francais")

-- Drop any foreign key constraint on experience_id if exists
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_experience_id_fkey;

-- Change the column type from UUID to TEXT
ALTER TABLE reservations 
ALTER COLUMN experience_id TYPE TEXT USING experience_id::TEXT;
