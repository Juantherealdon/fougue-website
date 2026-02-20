import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get orders for this user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('Error fetching orders:', ordersError)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  // Get bookings for this user (from checkout)
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
  }

  // Also get reservations for this user (from experience booking)
  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('*')
    .eq('auth_user_id', user.id)
    .order('created_at', { ascending: false })

  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError)
  }

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
