import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET - Fetch availability rules (recurring and specific)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const experienceId = searchParams.get("experienceId")
  const calendarId = searchParams.get("calendarId")
  const type = searchParams.get("type") // 'recurring' | 'specific' | 'all'
  const date = searchParams.get("date") // For specific date availability
  const month = searchParams.get("month") // For calendar view (YYYY-MM)

  try {
    const results: any = {}

    // Fetch recurring availability
    if (!type || type === "recurring" || type === "all") {
      let recurringQuery = supabase
        .from("recurring_availability")
        .select(`
          *,
          time_slots:availability_time_slots(id, start_time, end_time, order_index)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (experienceId) {
        recurringQuery = recurringQuery.eq("experience_id", experienceId)
      }
      if (calendarId) {
        recurringQuery = recurringQuery.eq("calendar_id", calendarId)
      }

      const { data: recurring, error: recurringError } = await recurringQuery

      if (recurringError) {
        console.error("[v0] Error fetching recurring availability:", recurringError)
        return NextResponse.json({ error: recurringError.message }, { status: 500 })
      }

      results.recurring = recurring || []
    }

    // Fetch specific availability (blocked dates, special hours)
    if (!type || type === "specific" || type === "all") {
      let specificQuery = supabase
        .from("specific_availability")
        .select("*")
        .order("date", { ascending: true })

      if (experienceId) {
        specificQuery = specificQuery.eq("experience_id", experienceId)
      }
      if (calendarId) {
        specificQuery = specificQuery.eq("calendar_id", calendarId)
      }
      if (date) {
        specificQuery = specificQuery.eq("date", date)
      }
      if (month) {
        const startDate = `${month}-01`
        const [year, monthNum] = month.split("-").map(Number)
        const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0]
        specificQuery = specificQuery.gte("date", startDate).lte("date", endDate)
      }

      const { data: specific, error: specificError } = await specificQuery

      if (specificError) {
        console.error("[v0] Error fetching specific availability:", specificError)
        return NextResponse.json({ error: specificError.message }, { status: 500 })
      }

      results.specific = specific || []
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error in availability API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper to check if string is valid UUID
const isValidUUID = (str: string | null | undefined): boolean => {
  if (!str) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// POST - Create availability rule
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { type, ...data } = body

  // Only include calendar_id if it's a valid UUID
  const calendarId = isValidUUID(data.calendarId) ? data.calendarId : null
  // For experience_id, accept any non-empty string (experiences use slug-based IDs, not UUIDs)
  const experienceId = data.experienceId || null

  console.log("[v0] Creating availability rule:", { type, calendarId, experienceId, data })

  try {
    if (type === "recurring") {
      // Create the recurring availability rule
      const insertData: any = {
        name: data.name,
        calendar_id: calendarId,
        days_of_week: data.daysOfWeek,
        start_time: data.slots?.[0]?.startTime || data.startTime || '09:00',
        end_time: data.slots?.[0]?.endTime || data.endTime || '18:00',
        active: true,
      }
      
      // Only add experience_id if it's provided and the column supports non-UUID types
      // For now, store it as a text reference
      if (experienceId) {
        insertData.experience_id = experienceId
      }
      
      const { data: result, error } = await supabase
        .from("recurring_availability")
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error creating recurring availability:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log("[v0] Created recurring rule:", result)

      // If multiple slots provided, insert them into availability_time_slots
      if (data.slots && data.slots.length > 0 && result) {
        const slotsToInsert = data.slots.map((slot: any, index: number) => ({
          recurring_availability_id: result.id,
          start_time: slot.startTime,
          end_time: slot.endTime,
          order_index: index,
        }))

        const { error: slotsError } = await supabase
          .from("availability_time_slots")
          .insert(slotsToInsert)

        if (slotsError) {
          console.error("[v0] Error creating time slots:", slotsError)
        }
      }

      return NextResponse.json(result, { status: 201 })
    } else if (type === "specific") {
      const insertData: any = {
        calendar_id: calendarId,
        date: data.date,
        start_time: data.startTime || null,
        end_time: data.endTime || null,
        is_blocked: data.isBlocked ?? false,
        reason: data.reason || null,
      }
      
      if (experienceId) {
        insertData.experience_id = experienceId
      }
      
      const { data: result, error } = await supabase
        .from("specific_availability")
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error creating specific availability:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json({ error: "Invalid type. Must be 'recurring' or 'specific'" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error in availability POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
