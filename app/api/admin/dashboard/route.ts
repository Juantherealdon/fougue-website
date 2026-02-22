import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"

  // Calculate date range
  const now = new Date()
  let startDate: Date
  let prevStartDate: Date

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      prevStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      prevStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
      break
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      prevStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      break
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      prevStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      prevStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  }

  const startISO = startDate.toISOString()
  const prevStartISO = prevStartDate.toISOString()

  try {
    // 1. Current period orders
    const { data: currentOrders } = await supabase
      .from("orders")
      .select("id, total_amount, currency, created_at, status, customer_name, customer_email, items")
      .gte("created_at", startISO)
      .order("created_at", { ascending: false })

    // 2. Previous period orders (for comparison)
    const { data: prevOrders } = await supabase
      .from("orders")
      .select("id, total_amount")
      .gte("created_at", prevStartISO)
      .lt("created_at", startISO)

    // 3. Current period bookings
    const { data: currentBookings } = await supabase
      .from("bookings")
      .select("id, experience_id, experience_name, booking_date, booking_time, customer_name, customer_email, guests, status, created_at, total_amount")
      .gte("created_at", startISO)
      .order("created_at", { ascending: false })

    // 4. Previous period bookings
    const { data: prevBookings } = await supabase
      .from("bookings")
      .select("id")
      .gte("created_at", prevStartISO)
      .lt("created_at", startISO)

    // 5. Upcoming bookings (future dates)
    const todayISO = now.toISOString().split("T")[0]
    const { data: upcomingBookings } = await supabase
      .from("bookings")
      .select("id, experience_name, booking_date, booking_time, customer_name, guests, status")
      .gte("booking_date", todayISO)
      .neq("status", "cancelled")
      .order("booking_date", { ascending: true })
      .limit(5)

    // 6. Unique customers in current period
    const currentCustomerEmails = new Set([
      ...(currentOrders || []).map(o => o.customer_email),
      ...(currentBookings || []).map(b => b.customer_email),
    ].filter(Boolean))

    const prevCustomerEmails = new Set([
      ...(prevOrders || []).map(() => "prev"),
      ...(prevBookings || []).map(() => "prev"),
    ])

    // 7. Bookings per experience (for chart)
    const experienceBookings: Record<string, number> = {}
    for (const b of currentBookings || []) {
      const name = b.experience_name || "Unknown"
      experienceBookings[name] = (experienceBookings[name] || 0) + 1
    }
    const experienceData = Object.entries(experienceBookings)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6)

    // 8. Revenue by month (for chart)
    const revenueByMonth: Record<string, { revenue: number; orders: number }> = {}
    const allOrders = [...(currentOrders || [])]
    for (const order of allOrders) {
      const date = new Date(order.created_at)
      const monthKey = date.toLocaleString("fr-FR", { month: "short", year: "2-digit" })
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = { revenue: 0, orders: 0 }
      }
      revenueByMonth[monthKey].revenue += order.total_amount || 0
      revenueByMonth[monthKey].orders += 1
    }
    // Also add bookings revenue
    for (const booking of currentBookings || []) {
      if (booking.total_amount) {
        const date = new Date(booking.created_at)
        const monthKey = date.toLocaleString("fr-FR", { month: "short", year: "2-digit" })
        if (!revenueByMonth[monthKey]) {
          revenueByMonth[monthKey] = { revenue: 0, orders: 0 }
        }
        revenueByMonth[monthKey].revenue += booking.total_amount
      }
    }
    const revenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }))

    // Calculate stats
    const currentRevenue = (currentOrders || []).reduce((s, o) => s + (o.total_amount || 0), 0)
      + (currentBookings || []).reduce((s, b) => s + (b.total_amount || 0), 0)
    const prevRevenue = (prevOrders || []).reduce((s, o) => s + (o.total_amount || 0), 0)
    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : "0"

    const currentOrderCount = (currentOrders || []).length
    const prevOrderCount = (prevOrders || []).length
    const orderChange = prevOrderCount > 0 ? ((currentOrderCount - prevOrderCount) / prevOrderCount * 100).toFixed(1) : "0"

    const currentBookingCount = (currentBookings || []).length
    const prevBookingCount = (prevBookings || []).length
    const bookingChange = prevBookingCount > 0 ? ((currentBookingCount - prevBookingCount) / prevBookingCount * 100).toFixed(1) : "0"

    const currentCustomerCount = currentCustomerEmails.size
    const prevCustomerCount = prevCustomerEmails.size
    const customerChange = prevCustomerCount > 0 ? ((currentCustomerCount - prevCustomerCount) / prevCustomerCount * 100).toFixed(1) : "0"

    // Recent orders (last 5)
    const recentOrders = (currentOrders || []).slice(0, 5).map(o => ({
      id: o.id,
      customer: o.customer_name || "Unknown",
      product: o.items?.[0]?.title || "Order",
      amount: `${o.currency || "AED"} ${(o.total_amount || 0).toLocaleString("en-US")}`,
      status: o.status || "pending",
      date: o.created_at,
    }))

    return NextResponse.json({
      stats: {
        revenue: { value: currentRevenue, change: revenueChange, currency: "AED" },
        orders: { value: currentOrderCount, change: orderChange },
        bookings: { value: currentBookingCount, change: bookingChange },
        customers: { value: currentCustomerCount, change: customerChange },
      },
      revenueData,
      experienceData,
      recentOrders,
      upcomingBookings: (upcomingBookings || []).map(b => ({
        id: b.id,
        customer: b.customer_name || "Unknown",
        experience: b.experience_name || "Experience",
        date: b.booking_date,
        time: b.booking_time || "",
        guests: b.guests || 2,
        status: b.status,
      })),
    })
  } catch (error) {
    console.error("[v0] Dashboard API error:", error)
    return NextResponse.json({
      stats: {
        revenue: { value: 0, change: "0", currency: "AED" },
        orders: { value: 0, change: "0" },
        bookings: { value: 0, change: "0" },
        customers: { value: 0, change: "0" },
      },
      revenueData: [],
      experienceData: [],
      recentOrders: [],
      upcomingBookings: [],
    })
  }
}
