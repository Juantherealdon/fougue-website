import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all newsletter subscribers
    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching newsletter subscribers:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get all client emails to determine if subscriber is a client
    const { data: reservations } = await supabase
      .from("reservations")
      .select("customer_email")
    
    const clientEmails = new Set(reservations?.map(r => r.customer_email?.toLowerCase()).filter(Boolean) || [])

    // Add type to each subscriber
    const subscribersWithType = subscribers?.map(sub => ({
      ...sub,
      type: clientEmails.has(sub.email?.toLowerCase()) ? 'client' : 'prospect'
    })) || []

    // Calculate stats
    const totalSubscribers = subscribersWithType.length
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newThisMonth = subscribersWithType.filter(
      sub => new Date(sub.created_at) >= startOfMonth
    ).length

    // Mock average open rate (would come from email service in production)
    const avgOpenRate = 24.5

    return NextResponse.json({
      subscribers: subscribersWithType,
      stats: {
        totalSubscribers,
        newThisMonth,
        avgOpenRate
      }
    })
  } catch (error) {
    console.error("[v0] Error in newsletter GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email, source = 'footer' } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        await supabase
          .from("newsletter_subscribers")
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq("id", existing.id)
        
        return NextResponse.json({ message: "Resubscribed successfully" })
      }
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 200 }
      )
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ 
        email: email.toLowerCase(), 
        source,
        status: 'active'
      }])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error subscribing to newsletter:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in newsletter API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
