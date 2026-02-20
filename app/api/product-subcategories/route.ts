"use server"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("product_subcategories")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching subcategories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error in subcategories GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("product_subcategories")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("product_subcategories")
      .insert({ name: body.name.trim() })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating subcategory:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in subcategories POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
