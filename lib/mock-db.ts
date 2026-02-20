// Mock Database for Orders, Bookings, and Clients
// In production, this would be replaced with a real database (Supabase, etc.)
// Using globalThis to persist data across hot reloads during development

declare global {
  var mockOrders: Order[] | undefined
  var mockBookings: Booking[] | undefined
  var mockClients: Client[] | undefined
}

export interface Order {
  id: string
  customerEmail: string
  customerName: string
  items: {
    id: string
    title: string
    price: number
    quantity: number
  }[]
  totalAmount: number
  currency: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  stripeSessionId?: string
  stripePaymentIntentId?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  experienceId: string
  experienceTitle: string
  date: string
  time: string
  guests: number
  totalAmount: number
  currency: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  stripeSessionId?: string
  stripePaymentIntentId?: string
  specialRequests?: string
  addons?: {
    id: string
    name: string
    price: number
  }[]
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  currency: string
  ordersCount: number
  reservationsCount: number
  lastOrderDate: string
  joinedDate: string
  status: 'active' | 'inactive' | 'vip'
  source: 'Checkout' | 'Waitlist' | 'Manual'
  notes: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Initialize sample data - will persist across hot reloads
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerEmail: 'marie.dupont@example.com',
    customerName: 'Marie Dupont',
    items: [
      { id: 'gift-1', title: 'Luxury Candle Set', price: 450, quantity: 1 },
      { id: 'gift-2', title: 'Silk Scarf Collection', price: 890, quantity: 2 },
    ],
    totalAmount: 2230,
    currency: 'AED',
    status: 'delivered',
    stripePaymentIntentId: 'pi_sample_001',
    shippingAddress: {
      line1: '123 Marina Walk',
      city: 'Dubai',
      postalCode: '00000',
      country: 'UAE',
    },
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-18T14:00:00Z',
  },
  {
    id: 'ORD-002',
    customerEmail: 'jean.martin@example.com',
    customerName: 'Jean Martin',
    items: [
      { id: 'gift-3', title: 'Artisan Chocolate Box', price: 320, quantity: 3 },
    ],
    totalAmount: 960,
    currency: 'AED',
    status: 'shipped',
    stripePaymentIntentId: 'pi_sample_002',
    shippingAddress: {
      line1: '456 Palm Jumeirah',
      city: 'Dubai',
      postalCode: '00000',
      country: 'UAE',
    },
    createdAt: '2026-01-20T15:45:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
  },
]

const initialBookings: Booking[] = [
  {
    id: 'BKG-001',
    customerEmail: 'sophie.bernard@example.com',
    customerName: 'Sophie Bernard',
    customerPhone: '+971501234567',
    experienceId: 'interlude-francais',
    experienceTitle: 'The Parisian Interlude',
    date: '2026-02-14',
    time: '18:00',
    guests: 2,
    totalAmount: 1500,
    currency: 'AED',
    status: 'confirmed',
    stripePaymentIntentId: 'pi_sample_003',
    specialRequests: 'Anniversary celebration - please arrange flowers',
    addons: [
      { id: 'addon-1', name: 'Champagne Upgrade', price: 200 },
    ],
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-01-25T11:00:00Z',
  },
  {
    id: 'BKG-002',
    customerEmail: 'lucas.petit@example.com',
    customerName: 'Lucas Petit',
    customerPhone: '+971509876543',
    experienceId: 'sakura-hanami',
    experienceTitle: 'Sakura Hanami',
    date: '2026-02-20',
    time: '19:30',
    guests: 2,
    totalAmount: 1800,
    currency: 'AED',
    status: 'pending',
    stripePaymentIntentId: 'pi_sample_004',
    createdAt: '2026-01-28T09:30:00Z',
    updatedAt: '2026-01-28T09:30:00Z',
  },
]

const initialClients: Client[] = [
  {
    id: 'CLI-001',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    phone: '+971501234567',
    totalSpent: 2230,
    currency: 'AED',
    ordersCount: 1,
    reservationsCount: 0,
    lastOrderDate: '2026-01-15',
    joinedDate: '2026-01-15',
    status: 'active',
    source: 'Checkout',
    notes: '',
    tags: [],
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'CLI-002',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    phone: '+971501234567',
    totalSpent: 1500,
    currency: 'AED',
    ordersCount: 0,
    reservationsCount: 1,
    lastOrderDate: '2026-01-25',
    joinedDate: '2026-01-25',
    status: 'active',
    source: 'Checkout',
    notes: '',
    tags: [],
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-01-25T11:00:00Z',
  },
]

// Use globalThis to persist data across hot reloads
if (!globalThis.mockOrders) {
  globalThis.mockOrders = initialOrders
}
if (!globalThis.mockBookings) {
  globalThis.mockBookings = initialBookings
}
if (!globalThis.mockClients) {
  globalThis.mockClients = initialClients
}

// Export getter functions to always get the current globalThis reference
export function getOrders(): Order[] {
  return globalThis.mockOrders || []
}

export function getBookings(): Booking[] {
  return globalThis.mockBookings || []
}

export function getClients(): Client[] {
  return globalThis.mockClients || []
}

// Legacy exports for backwards compatibility - these will always reference current data
export const orders = globalThis.mockOrders
export const bookings = globalThis.mockBookings
export const clients = globalThis.mockClients

// Helper functions to add new entries
export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const currentOrders = globalThis.mockOrders || []
  const newOrder: Order = {
    ...order,
    id: `ORD-${String(currentOrders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  currentOrders.push(newOrder)
  console.log('[v0] Added order:', newOrder.id, 'Total orders:', currentOrders.length)
  return newOrder
}

export function addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
  const currentBookings = globalThis.mockBookings || []
  const newBooking: Booking = {
    ...booking,
    id: `BKG-${String(currentBookings.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  currentBookings.push(newBooking)
  console.log('[v0] Added booking:', newBooking.id, 'Total bookings:', currentBookings.length)
  return newBooking
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  }
  return null
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): Booking | null {
  const booking = bookings.find(b => b.id === bookingId)
  if (booking) {
    booking.status = status
    booking.updatedAt = new Date().toISOString()
    return booking
  }
  return null
}

export function addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
  const currentClients = globalThis.mockClients || []
  const newClient: Client = {
    ...client,
    id: `CLI-${String(currentClients.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  currentClients.push(newClient)
  console.log('[v0] Added client:', newClient.id, 'Total clients:', currentClients.length)
  return newClient
}

export function findClientByEmail(email: string): Client | undefined {
  const currentClients = globalThis.mockClients || []
  return currentClients.find(c => c.email.toLowerCase() === email.toLowerCase())
}

export function updateClient(clientId: string, updates: Partial<Client>): Client | null {
  const currentClients = globalThis.mockClients || []
  const client = currentClients.find(c => c.id === clientId)
  if (client) {
    Object.assign(client, updates)
    client.updatedAt = new Date().toISOString()
    console.log('[v0] Updated client:', clientId)
    return client
  }
  return null
}
