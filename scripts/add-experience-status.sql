-- Add status column to experiences table
-- Status options: 'available', 'almost_available', 'coming_soon', 'unavailable'

ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Update existing rows: available=true becomes 'available', available=false becomes 'unavailable'
UPDATE experiences 
SET status = CASE 
  WHEN available = true THEN 'available'
  ELSE 'unavailable'
END
WHERE status IS NULL OR status = 'available';

-- Add a check constraint for valid status values
ALTER TABLE experiences 
DROP CONSTRAINT IF EXISTS experiences_status_check;

ALTER TABLE experiences 
ADD CONSTRAINT experiences_status_check 
CHECK (status IN ('available', 'almost_available', 'coming_soon', 'unavailable'));
