-- Create experiences table
DROP TABLE IF EXISTS experiences CASCADE;

CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_hours DECIMAL(3,1) NOT NULL,
  guests TEXT NOT NULL,
  highlight TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT false,
  ranking INTEGER NOT NULL DEFAULT 999,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert experiences with ranking
INSERT INTO experiences (id, title, subtitle, image, description, duration_hours, guests, highlight, available, ranking, price) VALUES
('interlude-francais', 'The Parisian Interlude', 'A Picnic Experience', '/images/experience-picnic.jpg', 'Escape into nature with French elegance. A curated picnic featuring artisanal cheeses, fresh baguettes, and champagne, set in a dreamy location chosen just for you. Let the afternoon unfold without rush.', 2.5, '2 people', 'Sunset timing available', true, 1, 750.00),
('french-rendez-vous', 'French Rendez-vous', 'An Intimate Dinner Experience', '/images/hero-couple-dinner.jpg', 'Transport yourselves to a candlelit Parisian evening. This intimate dinner experience recreates the romance of France with exquisite cuisine, vintage wines, and an atmosphere that whispers of love stories waiting to unfold.', 3.5, '2 people', 'Private chef & sommelier', false, 2, 1200.00),
('sakura-hanami', 'Sakura Hanami', 'Japanese Serenity', '/images/experience-japan.jpg', 'An intimate journey through Japanese traditions. Experience the art of tea ceremony, sake tasting, and mindful connection in a space transformed into a serene Japanese sanctuary.', 2.5, '2 people', 'Traditional tea ceremony', false, 3, 900.00),
('love-is-art', 'Love is Art', 'Creative Connection', '/images/experience-paint.jpg', 'Create together, connect deeper. This artistic experience invites you to paint, sculpt, or create alongside your partner, guided by a professional artist. Your masterpiece becomes a lasting memory.', 2.5, '2 people', 'Take your art home', false, 4, 850.00);

-- Create index on ranking for faster queries
CREATE INDEX idx_experiences_ranking ON experiences(ranking);
