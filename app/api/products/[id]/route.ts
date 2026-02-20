import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  
  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()
  
  // Generate slug from name if name is updated
  const slug = body.name
    ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : undefined
  
  const productData = {
    name: body.name,
    ...(slug && { slug }),
    description: body.description,
    long_description: body.long_description,
    price: body.price,
    currency: body.currency || 'AED',
    category: body.category,
    subcategory: body.subcategory || null,
    subcategories: body.subcategories || [],
    stock: body.stock,
    available: body.available,
    featured: body.featured,
    images: body.images || [],
    badges: body.badges || [],
    seo_title: body.seo_title,
    seo_description: body.seo_description,
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
