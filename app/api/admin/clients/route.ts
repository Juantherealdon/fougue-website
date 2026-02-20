import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('total_spent', { ascending: false })
    
    if (error) {
      console.error('[v0] Supabase error fetching clients:', error)
      throw error
    }

    // Map database columns to API format
    const mappedClients = (clients || []).map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalSpent: client.total_spent,
      currency: client.currency,
      ordersCount: client.orders_count,
      reservationsCount: client.reservations_count,
      lastOrderDate: client.last_order_date,
      joinedDate: client.joined_date,
      status: client.status,
      source: client.source,
      notes: client.notes,
      tags: client.tags,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    }))

    return NextResponse.json(mappedClients)
  } catch (error) {
    console.error('[v0] Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
