import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const experienceId = searchParams.get("experience_id")
    const date = searchParams.get("date")

    let query = supabase
      .from("reservations")
      .select(`
        *,
        experience:experiences(*),
        customer:customers(*),
        addons:reservation_addons(*)
      `)
      .order("date", { ascending: false })
      .order("time", { ascending: false })

    if (experienceId) {
      query = query.eq("experience_id", experienceId)
    }

    if (date) {
      query = query.eq("date", date)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching reservations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in reservations API:", error)
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

    // Extract addons separately
    const { addons, ...reservationData } = body

    // Generate reservation number
    const reservationNumber = `RES-${Date.now()}`

    // Create or get customer
    let customerId = reservationData.customer_id
    if (!customerId && reservationData.customer_email) {
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", reservationData.customer_email)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer } = await supabase
          .from("customers")
          .insert([
            {
              email: reservationData.customer_email,
              first_name: reservationData.customer_name?.split(" ")[0],
              last_name: reservationData.customer_name?.split(" ").slice(1).join(" "),
              phone: reservationData.customer_phone,
            },
          ])
          .select()
          .single()

        if (newCustomer) {
          customerId = newCustomer.id
        }
      }
    }

    // Insert reservation
    const { data: reservation, error: resError } = await supabase
      .from("reservations")
      .insert([
        {
          ...reservationData,
          reservation_number: reservationNumber,
          customer_id: customerId,
        },
      ])
      .select()
      .single()

    if (resError) {
      console.error("[v0] Error creating reservation:", resError)
      return NextResponse.json({ error: resError.message }, { status: 500 })
    }

    // Insert addons if provided
    if (addons && addons.length > 0) {
      const addonsWithResId = addons.map((addon: any) => ({
        ...addon,
        reservation_id: reservation.id,
      }))

      const { error: addonsError } = await supabase
        .from("reservation_addons")
        .insert(addonsWithResId)

      if (addonsError) {
        console.error("[v0] Error creating reservation addons:", addonsError)
      }
    }

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in reservations POST API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
