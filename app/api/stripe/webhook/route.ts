import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { findClientByEmail, updateClient, addClient, addOrder, addBooking } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/emails/send-order-confirmation'
import { createClient } from '@/lib/supabase/server'

// Disable body parsing - we need the raw body for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('[webhook] Received event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('[webhook] Payment succeeded:', paymentIntent.id)
        // The checkout.session.completed event handles the order creation
        // This is just for logging/monitoring
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('[webhook] Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
        // Optionally update order status to 'failed'
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log('[webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook] Error processing event:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('[webhook] Processing checkout.session.completed:', session.id)

  // Check if payment is actually complete
  if (session.payment_status !== 'paid') {
    console.log('[webhook] Payment not yet paid, skipping:', session.payment_status)
    return
  }

  // Check if this session was already processed (idempotency)
  const supabase = await createClient()
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()

  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()

  if (existingOrder || existingBooking) {
    console.log('[webhook] Session already processed:', session.id)
    return
  }

  const metadata = session.metadata
  if (!metadata) {
    console.error('[webhook] Missing session metadata')
    return
  }

  // Reconstruct items from chunked metadata
  let itemsStr = ''
  for (let chunk = 0; metadata[`items_${chunk}`]; chunk++) {
    itemsStr += metadata[`items_${chunk}`]
  }

  if (!itemsStr) {
    console.error('[webhook] No items found in metadata')
    return
  }

  const compactItems = JSON.parse(itemsStr)
  const items = compactItems.map((ci: any) => ({
    id: ci.i,
    title: ci.t,
    price: ci.p,
    quantity: ci.q,
    type: ci.y === 'e' ? 'experience' : 'product',
    experienceDate: ci.d,
    experienceTime: ci.tm,
    guests: ci.g,
    addons: ci.a?.map((a: any) => ({ id: a.i, name: a.n, price: a.p })),
  }))

  const customerName = metadata.customerName || ''
  const customerEmail = metadata.customerEmail || session.customer_email || ''
  const customerPhone = metadata.customerPhone || ''
  const authUserId = metadata.authUserId && metadata.authUserId !== '' ? metadata.authUserId : null
  const specialRequests = metadata.specialRequests || ''

  // Reconstruct shipping address
  let shippingAddress = null
  if (metadata.shipping) {
    try {
      const cs = JSON.parse(metadata.shipping)
      shippingAddress = {
        line1: cs.l1,
        line2: cs.l2 || undefined,
        city: cs.c,
        state: cs.s || undefined,
        postalCode: cs.z,
        country: cs.co,
      }
    } catch {
      shippingAddress = null
    }
  }

  // Separate products and experiences
  const products = items.filter((item: any) => item.type === 'product')
  const experiences = items.filter((item: any) => item.type === 'experience')

  // Calculate totals
  const totalProducts = products.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0)
  const totalExperiences = experiences.reduce((sum: number, exp: any) => {
    let total = exp.price
    if (exp.addons) {
      total += exp.addons.reduce((s: number, a: any) => s + a.price, 0)
    }
    return sum + total
  }, 0)
  const grandTotal = totalProducts + totalExperiences

  // Create or update client
  let client = await findClientByEmail(customerEmail)

  if (client) {
    const newTotalSpent = client.totalSpent + grandTotal
    const newOrdersCount = client.ordersCount + (products.length > 0 ? 1 : 0)
    const newReservationsCount = client.reservationsCount + experiences.length

    await updateClient(client.id, {
      totalSpent: newTotalSpent,
      ordersCount: newOrdersCount,
      reservationsCount: newReservationsCount,
      lastOrderDate: new Date().toISOString().split('T')[0],
      phone: customerPhone || client.phone,
    })
  } else {
    await addClient({
      name: customerName,
      email: customerEmail,
      phone: customerPhone || 'N/A',
      totalSpent: grandTotal,
      currency: 'AED',
      ordersCount: products.length > 0 ? 1 : 0,
      reservationsCount: experiences.length,
      lastOrderDate: new Date().toISOString().split('T')[0],
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      source: 'Checkout',
      notes: '',
      tags: [],
    })
  }

  const orderIds: string[] = []
  const bookingIds: string[] = []

  // Create order for products
  if (products.length > 0) {
    const order = await addOrder({
      customerEmail,
      customerName,
      items: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        quantity: p.quantity,
      })),
      totalAmount: totalProducts,
      currency: 'AED',
      status: 'paid',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      authUserId,
      shippingAddress: shippingAddress || undefined,
    })
    orderIds.push(order.id)
  }

  // Create bookings for experiences
  for (const exp of experiences) {
    let totalExp = exp.price
    if (exp.addons) {
      totalExp += exp.addons.reduce((s: number, a: any) => s + a.price, 0)
    }

    const booking = await addBooking({
      customerEmail,
      customerName,
      customerPhone: customerPhone || 'N/A',
      experienceId: exp.id,
      experienceTitle: exp.title,
      date: exp.experienceDate || '',
      time: exp.experienceTime || '',
      guests: exp.guests || 2,
      totalAmount: totalExp,
      currency: 'AED',
      status: 'confirmed',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      authUserId,
      specialRequests: specialRequests || undefined,
      addons: exp.addons,
    })
    bookingIds.push(booking.id)
  }

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail({
      customerName,
      customerEmail,
      items,
      orderId: orderIds[0],
      bookingIds: bookingIds.length > 0 ? bookingIds : undefined,
      stripeSessionId: session.id,
      currency: 'AED',
    })
  } catch (emailErr) {
    console.error('[webhook] Email send failed:', emailErr)
  }

  console.log('[webhook] Successfully processed session:', session.id, { orderIds, bookingIds })
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('[webhook] Handling payment failure:', paymentIntent.id)
  
  // Optionally, you could update any pending orders/bookings to 'failed' status
  // For now, we just log the failure
  const supabase = await createClient()
  
  // Update any orders with this payment intent
  await supabase
    .from('orders')
    .update({ status: 'payment_failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Update any bookings with this payment intent
  await supabase
    .from('bookings')
    .update({ status: 'payment_failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}
