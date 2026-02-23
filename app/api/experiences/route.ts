import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get("featured")
    const categoryId = searchParams.get("category")
    const slug = searchParams.get("slug")

    const includeAll = searchParams.get("available") === "false"
    
    let query = supabase
      .from("experiences")
      .select("*")
      .order("ranking", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })

    // If searching by slug (which is actually the ID), don't filter by status - we want to show the page
    if (slug) {
      // Search by ID (the URL parameter is called slug but maps to id)
      const { data: byId } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", slug)
      
      if (byId && byId.length > 0) {
        return NextResponse.json(byId)
      }
      
      // Not found
      return NextResponse.json([])
    } else {
      // For listing pages, exclude unavailable experiences (unless includeAll is true for admin)
      if (!includeAll) {
        // Include available, almost_available, and coming_soon (exclude only unavailable)
        query = query.neq("status", "unavailable")
      }

      if (featured === "true") {
        query = query.eq("featured", true)
      }

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching experiences:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Experiences found:", data?.length || 0, slug ? `for slug: ${slug}` : '')
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error("[v0] Error in experiences API:", error)
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

    // Generate a unique ID based on title
    const id = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Map frontend fields to database table columns
    const experienceData = {
      id,
      title: body.title,
      subtitle: body.subtitle || '',
      image: body.images?.[0] || '/placeholder.jpg',
      description: body.description || '',
      long_description: body.long_description || '',
      duration_hours: Number(body.duration_hours) || 2,
      guests: body.guests || '2 people',
      highlight: body.highlight || '',
      available: body.available ?? false,
      ranking: 999,
      price: Number(body.price) || 0,
      currency: body.currency || 'AED',
      category_id: body.category_id || null,
      slug: body.slug || id,
      location: body.location || '',
      featured: body.featured ?? false,
      images: body.images || [],
      included_items: body.included_items || [],
      requirements: body.requirements || [],
      addons: body.addons || [],
      seo_title: body.seo_title || '',
      seo_description: body.seo_description || '',
    }

    console.log("[v0] Creating experience with data:", experienceData)

    // Insert experience
    const { data: experience, error: expError } = await supabase
      .from("experiences")
      .insert([experienceData])
      .select()
      .single()

    if (expError) {
      console.error("[v0] Error creating experience:", expError)
      return NextResponse.json({ error: expError.message }, { status: 500 })
    }

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in experiences POST API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
