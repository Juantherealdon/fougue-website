import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("[v0] Error fetching experience:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in experience GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Map frontend fields to database table columns
    const experienceData: Record<string, unknown> = {
      title: body.title,
      subtitle: body.subtitle || '',
      image: body.images?.[0] || body.image || '/placeholder.jpg',
      description: body.description || '',
      long_description: body.long_description || '',
      duration_hours: Number(body.duration_hours) || 2,
      guests: body.guests || '2 people',
      highlight: body.highlight || '',
      available: body.available ?? false,
      price: Number(body.price) || 0,
      currency: body.currency || 'AED',
      category_id: body.category_id || null,
      slug: body.slug || '',
      location: body.location || '',
      featured: body.featured ?? false,
      images: body.images || [],
      included_items: body.included_items || [],
      requirements: body.requirements || [],
      addons: body.addons || [],
      seo_title: body.seo_title || '',
      seo_description: body.seo_description || '',
    }

    // Include status if provided
    if (body.status) {
      experienceData.status = body.status
      // Also update available based on status
      experienceData.available = body.status === 'available' || body.status === 'almost_available'
    }

    // Update experience
    const { data: experience, error: expError } = await supabase
      .from("experiences")
      .update(experienceData)
      .eq("id", id)
      .select()
      .single()

    if (expError) {
      console.error("[v0] Error updating experience:", expError)
      return NextResponse.json({ error: expError.message }, { status: 500 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error("[v0] Error in experience PUT API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) {
      updateData.status = body.status
      // Also update available based on status
      updateData.available = body.status === 'available' || body.status === 'almost_available'
    }

    if (body.ranking !== undefined) {
      updateData.ranking = body.ranking
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const { data: experience, error: expError } = await supabase
      .from("experiences")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (expError) {
      console.error("[v0] Error patching experience:", expError)
      return NextResponse.json({ error: expError.message }, { status: 500 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error("[v0] Error in experience PATCH API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { error } = await supabase.from("experiences").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting experience:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in experience DELETE API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
