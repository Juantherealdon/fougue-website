import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET - Fetch single availability rule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "recurring"

  try {
    const table = type === "recurring" ? "recurring_availability" : "specific_availability"
    
    const { data, error } = await supabase
      .from(table)
      .select(`
        *,
        experience:experiences(id, title, slug),
        calendar:calendars(id, name, color)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`[v0] Error fetching ${type} availability:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in availability GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper to check if string is valid UUID
const isValidUUID = (str: string | null | undefined): boolean => {
  if (!str) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// PUT - Update availability rule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()
  const { type, ...data } = body

  // Only include calendar_id/experience_id if valid UUIDs
  const calendarId = isValidUUID(data.calendarId) ? data.calendarId : null
  const experienceId = isValidUUID(data.experienceId) ? data.experienceId : null

  try {
    if (type === "recurring") {
      const { data: result, error } = await supabase
        .from("recurring_availability")
        .update({
          name: data.name,
          calendar_id: calendarId,
          experience_id: experienceId,
          days_of_week: data.daysOfWeek,
          start_time: data.slots?.[0]?.startTime || data.startTime,
          end_time: data.slots?.[0]?.endTime || data.endTime,
          active: data.active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error updating recurring availability:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Update time slots - delete existing and insert new
      if (data.slots && data.slots.length > 0) {
        // Delete existing slots
        await supabase
          .from("availability_time_slots")
          .delete()
          .eq("recurring_availability_id", id)

        // Insert new slots
        const slotsToInsert = data.slots.map((slot: any, index: number) => ({
          recurring_availability_id: id,
          start_time: slot.startTime,
          end_time: slot.endTime,
          order_index: index,
        }))

        const { error: slotsError } = await supabase
          .from("availability_time_slots")
          .insert(slotsToInsert)

        if (slotsError) {
          console.error("[v0] Error updating time slots:", slotsError)
        }
      }

      return NextResponse.json(result)
    } else if (type === "specific") {
      const { data: result, error } = await supabase
        .from("specific_availability")
        .update({
          calendar_id: calendarId,
          experience_id: experienceId,
          date: data.date,
          start_time: data.startTime || null,
          end_time: data.endTime || null,
          is_blocked: data.isBlocked ?? false,
          reason: data.reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error updating specific availability:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error in availability PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete availability rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "recurring"

  try {
    const table = type === "recurring" ? "recurring_availability" : "specific_availability"
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)

    if (error) {
      console.error(`[v0] Error deleting ${type} availability:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in availability DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
