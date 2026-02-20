-- Alter experience_id column from UUID to TEXT to support non-UUID IDs
-- This is needed because experiences table uses slug-based IDs, not UUIDs

-- First, drop any foreign key constraints if they exist
ALTER TABLE IF EXISTS recurring_availability 
DROP CONSTRAINT IF EXISTS recurring_availability_experience_id_fkey;

ALTER TABLE IF EXISTS specific_availability 
DROP CONSTRAINT IF EXISTS specific_availability_experience_id_fkey;

-- Change the column type from UUID to TEXT
ALTER TABLE recurring_availability 
ALTER COLUMN experience_id TYPE TEXT USING experience_id::TEXT;

ALTER TABLE specific_availability 
ALTER COLUMN experience_id TYPE TEXT USING experience_id::TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recurring_availability_experience_id 
ON recurring_availability(experience_id);

CREATE INDEX IF NOT EXISTS idx_specific_availability_experience_id 
ON specific_availability(experience_id);
