import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const supabase = await createClient()

    // If source=reservations, query the reservations table
    if (source === 'reservations') {
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error

      const mapped = (reservations || []).map(r => ({
        id: r.id,
        customer_name: r.customer_name,
        customer_email: r.customer_email,
        experience_id: r.experience_id,
        experience_title: r.experience_title,
        date: r.date,
        time: r.time,
        guests: r.guests,
        status: r.status,
      }))
      return NextResponse.json(mapped)
    }
    
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) {
      console.error('[v0] Supabase error fetching bookings:', error)
      throw error
    }

    // Map database columns to API format
    const mappedBookings = (bookings || []).map(booking => ({
      id: booking.id,
      customer_email: booking.customer_email,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      experience_id: booking.experience_id,
      experience_title: booking.experience_title,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      total_amount: booking.total_amount,
      currency: booking.currency,
      status: booking.status,
      stripe_session_id: booking.stripe_session_id,
      stripe_payment_intent_id: booking.stripe_payment_intent_id,
      special_requests: booking.special_requests,
      addons: booking.addons,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    }))

    return NextResponse.json(mappedBookings)
  } catch (error) {
    console.error('[v0] Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
