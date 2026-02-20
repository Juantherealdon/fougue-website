-- Create recurring_availability table
CREATE TABLE IF NOT EXISTS recurring_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  calendar_id UUID,
  experience_id TEXT, -- Using TEXT to support non-UUID experience IDs
  days_of_week INTEGER[] NOT NULL DEFAULT '{}',
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create specific_availability table for blocked dates and special hours
CREATE TABLE IF NOT EXISTS specific_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID,
  experience_id TEXT, -- Using TEXT to support non-UUID experience IDs
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_blocked BOOLEAN DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create availability_time_slots for multiple slots per recurring rule
CREATE TABLE IF NOT EXISTS availability_time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recurring_availability_id UUID REFERENCES recurring_availability(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create calendars table if not exists
CREATE TABLE IF NOT EXISTS calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#800913',
  assigned_to TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recurring_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE specific_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (adjust for production)
DROP POLICY IF EXISTS "Allow all operations on recurring_availability" ON recurring_availability;
CREATE POLICY "Allow all operations on recurring_availability" ON recurring_availability FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on specific_availability" ON specific_availability;
CREATE POLICY "Allow all operations on specific_availability" ON specific_availability FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on availability_time_slots" ON availability_time_slots;
CREATE POLICY "Allow all operations on availability_time_slots" ON availability_time_slots FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on calendars" ON calendars;
CREATE POLICY "Allow all operations on calendars" ON calendars FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recurring_experience ON recurring_availability(experience_id);
CREATE INDEX IF NOT EXISTS idx_recurring_days ON recurring_availability USING GIN(days_of_week);
CREATE INDEX IF NOT EXISTS idx_specific_date ON specific_availability(date);
CREATE INDEX IF NOT EXISTS idx_specific_experience ON specific_availability(experience_id);
