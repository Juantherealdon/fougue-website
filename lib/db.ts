import { createClient } from '@/lib/supabase/server'

// Order types
export interface OrderInput {
  customerEmail: string
  customerName: string
  items: { id: string; title: string; price: number; quantity: number }[]
  totalAmount: number
  currency: string
  status: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  authUserId?: string | null
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface Order extends OrderInput {
  id: string
  createdAt: string
  updatedAt: string
}

// Booking types
export interface BookingInput {
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
  status: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  authUserId?: string | null
  specialRequests?: string
  addons?: { id: string; name: string; price: number }[]
}

export interface Booking extends BookingInput {
  id: string
  createdAt: string
  updatedAt: string
}

// Client types
export interface ClientInput {
  name: string
  email: string
  phone: string
  totalSpent: number
  currency: string
  ordersCount: number
  reservationsCount: number
  lastOrderDate: string
  joinedDate: string
  status: string
  source: string
  notes: string
  tags: string[]
}

export interface Client extends ClientInput {
  id: string
  createdAt: string
  updatedAt: string
}

// Generate unique IDs
async function generateOrderId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  return `ORD-${String((count || 0) + 1).padStart(3, '0')}`
}

async function generateBookingId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
  return `BKG-${String((count || 0) + 1).padStart(3, '0')}`
}

async function generateClientId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true })
  return `CLI-${String((count || 0) + 1).padStart(3, '0')}`
}

// Order functions
export async function addOrder(order: OrderInput): Promise<Order> {
  const supabase = await createClient()
  const id = await generateOrderId(supabase)
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      id,
      customer_email: order.customerEmail,
      customer_name: order.customerName,
      items: order.items,
      total_amount: order.totalAmount,
      currency: order.currency,
      status: order.status,
      stripe_session_id: order.stripeSessionId,
      stripe_payment_intent_id: order.stripePaymentIntentId,
      shipping_address: order.shippingAddress,
      auth_user_id: order.authUserId || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error adding order:', error)
    throw error
  }

  console.log('[v0] Added order to Supabase:', id)
  
  return {
    id: data.id,
    customerEmail: data.customer_email,
    customerName: data.customer_name,
    items: data.items,
    totalAmount: data.total_amount,
    currency: data.currency,
    status: data.status,
    stripeSessionId: data.stripe_session_id,
    stripePaymentIntentId: data.stripe_payment_intent_id,
    shippingAddress: data.shipping_address,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Booking functions
export async function addBooking(booking: BookingInput): Promise<Booking> {
  const supabase = await createClient()
  const id = await generateBookingId(supabase)
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      id,
      experience_id: booking.experienceId,
      experience_title: booking.experienceTitle,
      customer_email: booking.customerEmail,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      total_amount: booking.totalAmount,
      currency: booking.currency,
      status: booking.status,
      stripe_session_id: booking.stripeSessionId,
      stripe_payment_intent_id: booking.stripePaymentIntentId,
      auth_user_id: booking.authUserId || null,
      special_requests: booking.specialRequests,
      addons: booking.addons,
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error adding booking:', error)
    throw error
  }

  console.log('[v0] Added booking to Supabase:', id)
  
  return {
    id: data.id,
    customerEmail: data.customer_email,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    experienceId: data.experience_id,
    experienceTitle: data.experience_title,
    date: data.date,
    time: data.time,
    guests: data.guests,
    totalAmount: data.total_amount,
    currency: data.currency,
    status: data.status,
    stripeSessionId: data.stripe_session_id,
    stripePaymentIntentId: data.stripe_payment_intent_id,
    specialRequests: data.special_requests,
    addons: data.addons,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Client functions
export async function addClient(client: ClientInput): Promise<Client> {
  const supabase = await createClient()
  const id = await generateClientId(supabase)
  
  const { data, error } = await supabase
    .from('clients')
    .insert({
      id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      total_spent: client.totalSpent,
      currency: client.currency,
      orders_count: client.ordersCount,
      reservations_count: client.reservationsCount,
      last_order_date: client.lastOrderDate,
      joined_date: client.joinedDate,
      status: client.status,
      source: client.source,
      notes: client.notes,
      tags: client.tags,
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error adding client:', error)
    throw error
  }

  console.log('[v0] Added client to Supabase:', id)
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    totalSpent: data.total_spent,
    currency: data.currency,
    ordersCount: data.orders_count,
    reservationsCount: data.reservations_count,
    lastOrderDate: data.last_order_date,
    joinedDate: data.joined_date,
    status: data.status,
    source: data.source,
    notes: data.notes,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function findClientByEmail(email: string): Promise<Client | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('[v0] Error finding client:', error)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    totalSpent: data.total_spent,
    currency: data.currency,
    ordersCount: data.orders_count,
    reservationsCount: data.reservations_count,
    lastOrderDate: data.last_order_date,
    joinedDate: data.joined_date,
    status: data.status,
    source: data.source,
    notes: data.notes,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateClient(clientId: string, updates: Partial<ClientInput>): Promise<Client | null> {
  const supabase = await createClient()
  
  const dbUpdates: Record<string, any> = {}
  if (updates.totalSpent !== undefined) dbUpdates.total_spent = updates.totalSpent
  if (updates.ordersCount !== undefined) dbUpdates.orders_count = updates.ordersCount
  if (updates.reservationsCount !== undefined) dbUpdates.reservations_count = updates.reservationsCount
  if (updates.lastOrderDate !== undefined) dbUpdates.last_order_date = updates.lastOrderDate
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags
  
  const { data, error } = await supabase
    .from('clients')
    .update(dbUpdates)
    .eq('id', clientId)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating client:', error)
    return null
  }

  console.log('[v0] Updated client in Supabase:', clientId)

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    totalSpent: data.total_spent,
    currency: data.currency,
    ordersCount: data.orders_count,
    reservationsCount: data.reservations_count,
    lastOrderDate: data.last_order_date,
    joinedDate: data.joined_date,
    status: data.status,
    source: data.source,
    notes: data.notes,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
