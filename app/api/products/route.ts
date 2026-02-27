import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const showAll = searchParams.get("all") === "true"
  
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  // For front-end, only show available products
  if (!showAll) {
    query = query.eq('available', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  console.log("[v0] Fetched products:", data?.length || 0)
  return NextResponse.json(data || [], {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  
  console.log("[v0] Creating product with body:", JSON.stringify(body))
  
  // Generate slug from name
  const slug = body.name
    ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : `product-${Date.now()}`
  
  const productData = {
    name: body.name,
    slug,
    description: body.description,
    long_description: body.long_description,
    price: body.price,
    currency: body.currency || 'AED',
    category: body.category,
    subcategory: body.subcategory || null,
    subcategories: body.subcategories || [],
    stock: body.stock || 0,
    available: body.available ?? true,
    featured: body.featured ?? false,
    images: body.images || [],
    badges: body.badges || [],
    seo_title: body.seo_title,
    seo_description: body.seo_description,
  }
  
  console.log("[v0] Product data to insert:", JSON.stringify(productData))
  
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()
  
  if (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  console.log("[v0] Product created:", JSON.stringify(data))
  return NextResponse.json(data, { status: 201 })
}
