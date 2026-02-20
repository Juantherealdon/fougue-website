import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
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
      customerEmail: booking.customer_email,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      experienceId: booking.experience_id,
      experienceTitle: booking.experience_title,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      totalAmount: booking.total_amount,
      currency: booking.currency,
      status: booking.status,
      stripeSessionId: booking.stripe_session_id,
      stripePaymentIntentId: booking.stripe_payment_intent_id,
      specialRequests: booking.special_requests,
      addons: booking.addons,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
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
