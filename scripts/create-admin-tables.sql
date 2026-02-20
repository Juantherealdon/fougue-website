-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Create orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  experience_id TEXT NOT NULL,
  experience_title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  status TEXT NOT NULL DEFAULT 'confirmed',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  special_requests TEXT,
  addons JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create clients table
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'AED',
  orders_count INTEGER NOT NULL DEFAULT 0,
  reservations_count INTEGER NOT NULL DEFAULT 0,
  last_order_date DATE,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'Checkout',
  notes TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Insert sample data for testing
INSERT INTO orders (id, customer_email, customer_name, items, total_amount, currency, status, created_at) VALUES
('ORD-001', 'marie.dupont@example.com', 'Marie Dupont', '[{"id": "gift-1", "title": "Luxury Candle Set", "price": 450, "quantity": 1}, {"id": "gift-2", "title": "Silk Scarf Collection", "price": 890, "quantity": 2}]', 2230, 'AED', 'delivered', '2026-01-15T10:30:00Z'),
('ORD-002', 'jean.martin@example.com', 'Jean Martin', '[{"id": "gift-3", "title": "Artisan Chocolate Box", "price": 320, "quantity": 3}]', 960, 'AED', 'shipped', '2026-01-20T15:45:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, customer_email, customer_name, customer_phone, experience_id, experience_title, date, time, guests, total_amount, currency, status, special_requests, addons, created_at) VALUES
('BKG-001', 'sophie.bernard@example.com', 'Sophie Bernard', '+971501234567', 'interlude-francais', 'The Parisian Interlude', '2026-02-14', '18:00', 2, 1500, 'AED', 'confirmed', 'Anniversary celebration - please arrange flowers', '[{"id": "addon-1", "name": "Champagne Upgrade", "price": 200}]', '2026-01-25T11:00:00Z'),
('BKG-002', 'lucas.petit@example.com', 'Lucas Petit', '+971509876543', 'sakura-hanami', 'Sakura Hanami', '2026-02-20', '19:30', 2, 1800, 'AED', 'pending', NULL, NULL, '2026-01-28T09:30:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clients (id, name, email, phone, total_spent, currency, orders_count, reservations_count, last_order_date, joined_date, status, source, created_at) VALUES
('CLI-001', 'Marie Dupont', 'marie.dupont@example.com', '+971501234567', 2230, 'AED', 1, 0, '2026-01-15', '2026-01-15', 'active', 'Checkout', '2026-01-15T10:30:00Z'),
('CLI-002', 'Sophie Bernard', 'sophie.bernard@example.com', '+971501234567', 1500, 'AED', 0, 1, '2026-01-25', '2026-01-25', 'active', 'Checkout', '2026-01-25T11:00:00Z')
ON CONFLICT (id) DO NOTHING;
