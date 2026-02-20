-- Update all experiences to be available
UPDATE experiences 
SET available = true
WHERE available = false;
