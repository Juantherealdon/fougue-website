'use server'

import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { findClientByEmail, updateClient, addClient, addOrder, addBooking } from '@/lib/db'

export interface CheckoutItem {
  id: string
  title: string
  price: number
  quantity: number
  type: 'product' | 'experience'
  // Experience-specific fields
  experienceDate?: string
  experienceTime?: string
  guests?: number
  addons?: { id: string; name: string; price: number }[]
}

export interface CheckoutData {
  items: CheckoutItem[]
  customerEmail: string
  customerName: string
  customerPhone?: string
  authUserId?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  specialRequests?: string
}

export async function startCheckoutSession(data: CheckoutData) {
  const { items, customerEmail, customerName } = data

  if (!items || items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Build line items for Stripe
  const lineItems = items.map(item => {
    let unitAmount = Math.round(item.price * 100) // Convert to fils/cents
    
    // Add addon prices for experiences
    if (item.type === 'experience' && item.addons) {
      const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0)
      unitAmount += Math.round(addonTotal * 100)
    }

    return {
      price_data: {
        currency: 'aed',
        product_data: {
          name: item.title,
          description: item.type === 'experience' 
            ? `Experience for ${item.guests || 2} guests` 
            : undefined,
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    }
  })

  // Calculate total
  const totalAmount = items.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity
    if (item.type === 'experience' && item.addons) {
      const addonTotal = item.addons.reduce((s, addon) => s + addon.price, 0)
      itemTotal += addonTotal
    }
    return sum + itemTotal
  }, 0)

  // Build compact items summary for metadata (max 500 chars per value)
  const compactItems = items.map(item => ({
    i: item.id,
    t: item.title.substring(0, 40),
    p: item.price,
    q: item.quantity,
    y: item.type === 'experience' ? 'e' : 'p',
    ...(item.experienceDate ? { d: item.experienceDate } : {}),
    ...(item.experienceTime ? { tm: item.experienceTime } : {}),
    ...(item.guests ? { g: item.guests } : {}),
    ...(item.addons?.length ? { a: item.addons.map(a => ({ i: a.id, n: a.name.substring(0, 20), p: a.price })) } : {}),
  }))

  // Split items into chunks if needed (Stripe metadata max 500 chars per value)
  const itemsStr = JSON.stringify(compactItems)
  const metadataItems: Record<string, string> = {}
  if (itemsStr.length <= 500) {
    metadataItems.items_0 = itemsStr
  } else {
    // Split into multiple metadata keys
    for (let idx = 0, chunk = 0; idx < itemsStr.length; idx += 490, chunk++) {
      metadataItems[`items_${chunk}`] = itemsStr.substring(idx, idx + 490)
    }
  }

  // Compact shipping (if present)
  const shippingStr = data.shippingAddress
    ? JSON.stringify({
        l1: data.shippingAddress.line1,
        l2: data.shippingAddress.line2 || '',
        c: data.shippingAddress.city,
        s: data.shippingAddress.state || '',
        z: data.shippingAddress.postalCode,
        co: data.shippingAddress.country,
      })
    : ''

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: customerEmail,
    line_items: lineItems,
    mode: 'payment',
    metadata: {
      customerName: customerName.substring(0, 500),
      customerEmail: customerEmail.substring(0, 500),
      customerPhone: (data.customerPhone || '').substring(0, 500),
      authUserId: data.authUserId || '',
      ...metadataItems,
      shipping: shippingStr.substring(0, 500),
      specialRequests: (data.specialRequests || '').substring(0, 500),
    },
  })

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
    totalAmount,
  }
}

export async function processCheckoutComplete(sessionId: string) {
  // Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  // For embedded checkout with redirect_on_completion: 'never', the onComplete callback 
  // is triggered when the customer completes the checkout flow. In test mode,
  // the payment_status might still be 'unpaid' but the session status will be 'complete'.
  // We accept the checkout if the session status is 'complete' OR payment_status is 'paid'.
  const isComplete = session.status === 'complete' || session.payment_status === 'paid'
  
  if (!isComplete) {
    throw new Error('Payment not completed')
  }

  const metadata = session.metadata
  if (!metadata) {
    throw new Error('Missing session metadata')
  }

  // Reconstruct items from chunked metadata
  let itemsStr = ''
  for (let chunk = 0; metadata[`items_${chunk}`]; chunk++) {
    itemsStr += metadata[`items_${chunk}`]
  }
  const compactItems = JSON.parse(itemsStr || '[]')
  const items: CheckoutItem[] = compactItems.map((ci: any) => ({
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
  const products = items.filter(item => item.type === 'product')
  const experiences = items.filter(item => item.type === 'experience')

  const results: { orders: string[]; bookings: string[]; clientId: string } = {
    orders: [],
    bookings: [],
    clientId: '',
  }

  // Calculate totals
  const totalProducts = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const totalExperiences = experiences.reduce((sum, exp) => {
    let total = exp.price
    if (exp.addons) {
      total += exp.addons.reduce((s, a) => s + a.price, 0)
    }
    return sum + total
  }, 0)
  const grandTotal = totalProducts + totalExperiences

  // Create or update client
  let client = await findClientByEmail(customerEmail)
  
  if (client) {
    // Update existing client
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
    results.clientId = client.id
  } else {
    // Create new client
    const newClient = await addClient({
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
    results.clientId = newClient.id
  }

  // Create order for products
  if (products.length > 0) {
    const order = await addOrder({
      customerEmail,
      customerName,
      items: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        quantity: p.quantity,
      })),
      totalAmount: totalProducts,
      currency: 'AED',
      status: 'paid',
      stripeSessionId: sessionId,
      stripePaymentIntentId: session.payment_intent as string,
      authUserId,
      shippingAddress: shippingAddress || undefined,
    })
    results.orders.push(order.id)
  }

  // Create bookings for experiences
  for (const exp of experiences) {
    let totalExp = exp.price
    if (exp.addons) {
      totalExp += exp.addons.reduce((s, a) => s + a.price, 0)
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
      stripeSessionId: sessionId,
      stripePaymentIntentId: session.payment_intent as string,
      authUserId,
      specialRequests: specialRequests || undefined,
      addons: exp.addons,
    })
    results.bookings.push(booking.id)
  }

  // Revalidate admin pages to show new data
  revalidatePath('/admin/orders')
  revalidatePath('/admin/reservations')
  revalidatePath('/admin/clients')

  return results
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_email,
  }
}
