import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    const supabase = await createClient()
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) {
      console.error('[v0] Error deleting order:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error in DELETE order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[v0] Supabase error fetching orders:', error)
      throw error
    }

    // Map database columns to API format
    const mappedOrders = (orders || []).map(order => ({
      id: order.id,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      items: order.items,
      totalAmount: order.total_amount,
      currency: order.currency,
      status: order.status,
      stripeSessionId: order.stripe_session_id,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))

    return NextResponse.json(mappedOrders)
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
