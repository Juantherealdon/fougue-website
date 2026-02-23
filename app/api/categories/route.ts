import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching categories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("[v0] Error in categories API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("categories")
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating category:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in categories POST API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
