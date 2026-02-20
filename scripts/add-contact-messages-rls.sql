-- Enable RLS on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to INSERT contact messages
CREATE POLICY "Allow public inserts on contact_messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Optional: Create policy to restrict SELECT to authenticated users only (if you want to view messages from admin)
CREATE POLICY "Allow authenticated users to select contact_messages"
  ON contact_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');
