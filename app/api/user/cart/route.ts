import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: cartItems, error } = await supabase
    .from('user_cart')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }

  return NextResponse.json(cartItems || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { items } = body

  // Clear existing cart and replace with new items
  await supabase
    .from('user_cart')
    .delete()
    .eq('user_id', user.id)

  if (items && items.length > 0) {
    const cartRows = items.map((item: any) => ({
      user_id: user.id,
      product_id: item.id,
      product_data: item,
      quantity: item.quantity || 1,
    }))

    const { error } = await supabase
      .from('user_cart')
      .insert(cartRows)

    if (error) {
      console.error('Error saving cart:', error)
      return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
