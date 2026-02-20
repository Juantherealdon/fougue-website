-- Disable RLS on contact_messages table to allow public inserts
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS but make it permissive:
-- CREATE POLICY "Allow public insert"
--   ON contact_messages FOR INSERT
--   WITH CHECK (true);
