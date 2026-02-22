import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type NotificationType = "new_order" | "new_booking" | "new_contact" | "new_newsletter" | "booking_cancelled" | "order_refunded"

interface NotificationData {
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export async function createNotification(notification: NotificationData) {
  try {
    const { error } = await supabase.from("notifications").insert({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data || {},
      read: false,
    })

    if (error) {
      console.error("[v0] Error creating notification:", error.message)
    }
  } catch (err) {
    console.error("[v0] Failed to create notification:", err)
  }
}

export async function createOrderNotification(orderData: {
  customerName: string
  customerEmail: string
  totalAmount: number
  currency: string
  items: Array<{ name: string; quantity: number }>
  orderId?: string
}) {
  await createNotification({
    type: "new_order",
    title: "Nouvelle commande",
    message: `${orderData.customerName} a passe une commande de ${orderData.currency} ${orderData.totalAmount.toLocaleString("en-US")}`,
    data: {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      totalAmount: orderData.totalAmount,
      currency: orderData.currency,
      items: orderData.items,
      orderId: orderData.orderId,
    },
  })
}

export async function createBookingNotification(bookingData: {
  customerName: string
  customerEmail: string
  experienceName: string
  date: string
  time?: string
  guests?: number
  bookingId?: string
}) {
  await createNotification({
    type: "new_booking",
    title: "Nouvelle reservation",
    message: `${bookingData.customerName} a reserve "${bookingData.experienceName}" pour le ${bookingData.date}`,
    data: {
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      experienceName: bookingData.experienceName,
      date: bookingData.date,
      time: bookingData.time,
      guests: bookingData.guests,
      bookingId: bookingData.bookingId,
    },
  })
}

export async function createContactNotification(contactData: {
  customerName: string
  customerEmail: string
  subject: string
  message: string
}) {
  await createNotification({
    type: "new_contact",
    title: "Nouveau message",
    message: `${contactData.customerName} - ${contactData.subject}`,
    data: {
      customerName: contactData.customerName,
      customerEmail: contactData.customerEmail,
      subject: contactData.subject,
      messagePreview: contactData.message.substring(0, 200),
    },
  })
}
