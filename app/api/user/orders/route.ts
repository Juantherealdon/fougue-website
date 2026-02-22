import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userEmail = user.email

  // Get orders by auth_user_id OR customer_email
  const { data: ordersByAuth } = await supabase
    .from('orders')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: ordersByEmail } = userEmail ? await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', userEmail)
    .order('created_at', { ascending: false }) : { data: [] }

  // Merge and deduplicate by id
  const allOrdersMap = new Map<string, any>()
  for (const o of [...(ordersByAuth || []), ...(ordersByEmail || [])]) {
    allOrdersMap.set(o.id, o)
  }
  const orders = Array.from(allOrdersMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Get bookings by auth_user_id OR customer_email
  const { data: bookingsByAuth } = await supabase
    .from('bookings')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: bookingsByEmail } = userEmail ? await supabase
    .from('bookings')
    .select('*')
    .eq('customer_email', userEmail)
    .order('created_at', { ascending: false }) : { data: [] }

  const allBookingsMap = new Map<string, any>()
  for (const b of [...(bookingsByAuth || []), ...(bookingsByEmail || [])]) {
    allBookingsMap.set(b.id, b)
  }
  const bookings = Array.from(allBookingsMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Get reservations by auth_user_id OR customer_email
  const { data: resByAuth } = await supabase
    .from('reservations')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: resByEmail } = userEmail ? await supabase
    .from('reservations')
    .select('*')
    .eq('customer_email', userEmail)
    .order('created_at', { ascending: false }) : { data: [] }

  const allResMap = new Map<string, any>()
  for (const r of [...(resByAuth || []), ...(resByEmail || [])]) {
    allResMap.set(r.id, r)
  }
  const reservations = Array.from(allResMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  // Merge bookings and reservations into a single list
  const allBookings = [
    ...(bookings || []),
    ...(reservations || []).map((r: any) => ({
      id: r.id,
      experience_id: r.experience_id,
      experience_title: r.experience_title || r.experience_name || 'Experience',
      date: r.date,
      time: r.time || r.time_slot,
      guests: r.guests || r.number_of_guests || 2,
      total_amount: r.total_amount || r.total_price || 0,
      currency: r.currency || 'AED',
      status: r.status,
      special_requests: r.special_requests,
      addons: r.addons || [],
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({
    orders: orders || [],
    bookings: allBookings,
  })
}
