import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Helper to check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// GET - Get available time slots for a specific experience and date range
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const experienceId = searchParams.get("experienceId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!experienceId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "experienceId, startDate, and endDate are required" },
      { status: 400 }
    )
  }

  try {
    // 0. Get experience duration (now stored as a decimal number)
    const { data: experience, error: expError } = await supabase
      .from("experiences")
      .select("duration_hours")
      .eq("id", experienceId)
      .single()
    
    if (expError) {
      console.error("[v0] Error fetching experience:", expError)
    }
    
    // Use duration_hours directly (it's a decimal number now)
    const durationHours = Number(experience?.duration_hours) || 2

    // 1. Get recurring availability for this experience with time slots
    const { data: recurring, error: recurringError } = await supabase
      .from("recurring_availability")
      .select(`
        *,
        time_slots:availability_time_slots(id, start_time, end_time, order_index)
      `)
      .eq("experience_id", experienceId)
      .eq("active", true)

    if (recurringError) {
      console.error("[v0] Error fetching recurring:", recurringError)
      return NextResponse.json({ error: recurringError.message }, { status: 500 })
    }

    // 2. Get specific availability/blocks for this experience in date range
    const { data: specific, error: specificError } = await supabase
      .from("specific_availability")
      .select("*")
      .eq("experience_id", experienceId)
      .gte("date", startDate)
      .lte("date", endDate)

    if (specificError) {
      console.error("[v0] Error fetching specific:", specificError)
      return NextResponse.json({ error: specificError.message }, { status: 500 })
    }

    // 3. Get ALL existing reservations across all experiences in date range
    // When any experience is booked on a date, that entire day is blocked
    const { data: allReservations, error: reservationsError } = await supabase
      .from("reservations")
      .select("date, time, experience_id")
      .gte("date", startDate)
      .lte("date", endDate)
      .neq("status", "cancelled")

    if (reservationsError) {
      console.error("[v0] Error fetching reservations:", reservationsError)
      return NextResponse.json({ error: reservationsError.message }, { status: 500 })
    }

    // Also check the bookings table (from checkout flow)
    const { data: allBookings } = await supabase
      .from("bookings")
      .select("date, time, experience_id")
      .gte("date", startDate)
      .lte("date", endDate)
      .not("status", "eq", "cancelled")

    // Build a set of dates that have ANY booking (from any experience)
    const bookedDates = new Set<string>()
    for (const r of [...(allReservations || []), ...(allBookings || [])]) {
      if (r.date) {
        bookedDates.add(r.date)
      }
    }

    const reservations = allReservations || []

    // 4. Generate available slots
    const slots: { date: string; times: { time: string; available: boolean }[] }[] = []
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const dayOfWeek = d.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      // Check if date is specifically blocked
      const blockedDate = specific?.find(s => s.date === dateStr && s.is_blocked)
      if (blockedDate) {
        slots.push({ date: dateStr, times: [] })
        continue
      }

      // Check if this day already has ANY booking from any experience — block entire day
      if (bookedDates.has(dateStr)) {
        slots.push({ date: dateStr, times: [] })
        continue
      }
      
      // Get recurring rules for this day of week
      const dayRules = recurring?.filter(r => r.days_of_week?.includes(dayOfWeek)) || []
      
      // Get specific availability for this date (overrides recurring)
      const specificDay = specific?.filter(s => s.date === dateStr && !s.is_blocked) || []
      
      // Get reservations for this date
      const dayReservations = reservations?.filter(r => r.date === dateStr) || []
      
      const times: { time: string; available: boolean }[] = []
      
      // Helper to check if a start time fits within a slot considering duration
      const canFitInSlot = (startHour: number, slotEndHour: number): boolean => {
        return (startHour + durationHours) <= slotEndHour
      }

      // Generate time slots from rules
      if (specificDay.length > 0) {
        // Use specific day slots
        for (const spec of specificDay) {
          if (spec.start_time && spec.end_time) {
            const [startHour] = spec.start_time.split(":").map(Number)
            const [endHour] = spec.end_time.split(":").map(Number)
            
            // Only show slots where the experience duration fits
            for (let h = startHour; h < endHour; h++) {
              const timeStr = `${h.toString().padStart(2, "0")}:00`
              const isBooked = dayReservations.some(r => r.time === timeStr)
              const fitsDuration = canFitInSlot(h, endHour)
              
              if (!times.some(t => t.time === timeStr)) {
                times.push({ 
                  time: timeStr, 
                  available: !isBooked && fitsDuration 
                })
              }
            }
          }
        }
      } else {
        // Use recurring rules with their time slots
        for (const rule of dayRules) {
          // Check if rule has multiple time slots
          const timeSlots = rule.time_slots && rule.time_slots.length > 0
            ? rule.time_slots
            : [{ start_time: rule.start_time, end_time: rule.end_time }]
          
          for (const slot of timeSlots) {
            if (slot.start_time && slot.end_time) {
              const [startHour] = slot.start_time.split(":").map(Number)
              const [endHour] = slot.end_time.split(":").map(Number)
              
              // Only show slots where the experience duration fits
              for (let h = startHour; h < endHour; h++) {
                const timeStr = `${h.toString().padStart(2, "0")}:00`
                const isBooked = dayReservations.some(r => r.time === timeStr)
                const fitsDuration = canFitInSlot(h, endHour)
                
                if (!times.some(t => t.time === timeStr)) {
                  times.push({ 
                    time: timeStr, 
                    available: !isBooked && fitsDuration 
                  })
                }
              }
            }
          }
        }
      }
      
      // Sort times chronologically
      times.sort((a, b) => a.time.localeCompare(b.time))
      
      slots.push({ date: dateStr, times })
    }

    return NextResponse.json({ slots, durationHours })
  } catch (error) {
    console.error("[v0] Error in slots API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
