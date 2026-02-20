-- Set default status for experiences that don't have one
-- Based on the 'available' boolean field

-- Experiences with available=true get status 'available'
UPDATE experiences 
SET status = 'available' 
WHERE status IS NULL AND available = true;

-- Experiences with available=false get status 'coming_soon'
UPDATE experiences 
SET status = 'coming_soon' 
WHERE status IS NULL AND available = false;

-- Any remaining null statuses default to 'available'
UPDATE experiences 
SET status = 'available' 
WHERE status IS NULL;
