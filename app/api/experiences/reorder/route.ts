import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { orderedIds } = await request.json()

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds array is required" },
        { status: 400 }
      )
    }

    // Update ranking for each experience
    const updates = orderedIds.map((id, index) => 
      supabase
        .from("experiences")
        .update({ ranking: index + 1 })
        .eq("id", id)
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error reordering experiences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
