import { stripe } from '@/lib/stripe'
import { buildOrderConfirmationEmail } from './order-confirmation'
import { buildAdminOrderNotificationEmail } from './admin-order-notification'
import { createOrderNotification, createBookingNotification } from '@/lib/notifications'

interface CheckoutItem {
  id: string
  title: string
  price: number
  quantity: number
  type: 'product' | 'experience'
  experienceDate?: string
  experienceTime?: string
  guests?: number
  addons?: { id: string; name: string; price: number }[]
}

interface SendConfirmationParams {
  customerName: string
  customerEmail: string
  items: CheckoutItem[]
  orderId?: string
  bookingIds?: string[]
  stripeSessionId: string
  currency?: string
}

export async function sendOrderConfirmationEmail(params: SendConfirmationParams): Promise<void> {
  const {
    customerName,
    customerEmail,
    items,
    orderId,
    bookingIds,
    stripeSessionId,
    currency = 'AED',
  } = params

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.error('[email] RESEND_API_KEY not configured — skipping order confirmation email')
    return
  }

  // Calculate total
  const totalAmount = items.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity
    if (item.type === 'experience' && item.addons) {
      itemTotal += item.addons.reduce((s, a) => s + a.price, 0)
    }
    return sum + itemTotal
  }, 0)

  const hasExperiences = items.some(i => i.type === 'experience')

  // Try to get Stripe receipt URL
  let receiptUrl: string | undefined
  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ['payment_intent.latest_charge'],
    })

    const paymentIntent = session.payment_intent as any
    if (paymentIntent?.latest_charge?.receipt_url) {
      receiptUrl = paymentIntent.latest_charge.receipt_url
    }
  } catch (err) {
    console.error('[email] Could not retrieve Stripe receipt URL:', err)
  }

  // Build the email HTML
  const html = buildOrderConfirmationEmail({
    customerName,
    customerEmail,
    orderId,
    bookingIds,
    items,
    totalAmount,
    currency,
    receiptUrl,
    hasExperiences,
  })

  // Send via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fougue <no-reply@mail.fougue.ae>',
        to: customerEmail,
        subject: orderId
          ? `Your Fougue Order ${orderId} is Confirmed`
          : 'Your Fougue Experience is Confirmed',
        html,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log('[email] Order confirmation sent:', result.id)
    } else {
      const errorText = await response.text()
      console.error('[email] Failed to send order confirmation:', errorText)
    }
  } catch (err) {
    console.error('[email] Error sending order confirmation:', err)
  }

  // Send admin notification email to hello@fougue.ae
  try {
    const adminHtml = buildAdminOrderNotificationEmail({
      customerName,
      customerEmail,
      orderId,
      bookingIds,
      items,
      totalAmount,
      currency,
      hasExperiences,
      receiptUrl,
    })

    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fougue <no-reply@mail.fougue.ae>',
        to: 'hello@fougue.ae',
        subject: `Nouvelle commande${orderId ? ` #${orderId}` : ''} \u2014 ${customerName} \u2014 ${currency} ${totalAmount.toLocaleString('en-US')}`,
        html: adminHtml,
      }),
    })

    if (adminResponse.ok) {
      const result = await adminResponse.json()
      console.log('[email] Admin order notification sent:', result.id)
    } else {
      const errorText = await adminResponse.text()
      console.error('[email] Failed to send admin notification:', errorText)
    }
  } catch (err) {
    console.error('[email] Error sending admin notification:', err)
  }

  // Create in-app notification
  await createOrderNotification({
    customerName,
    customerEmail,
    totalAmount,
    currency,
    items: items.map(i => ({ name: i.title, quantity: i.quantity })),
    orderId,
  })

  // Also create booking notifications for experiences
  for (const item of items) {
    if (item.type === 'experience' && item.experienceDate) {
      await createBookingNotification({
        customerName,
        customerEmail,
        experienceName: item.title,
        date: item.experienceDate,
        time: item.experienceTime,
        guests: item.guests,
      })
    }
  }
}
