import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch notifications
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const unreadOnly = searchParams.get("unread") === "true"
  const limit = parseInt(searchParams.get("limit") || "20")

  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.eq("read", false)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Also get unread count
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("read", false)

  return NextResponse.json({ notifications: data, unreadCount: count || 0 })
}

// PUT - Mark notifications as read
export async function PUT(request: Request) {
  const body = await request.json()
  const { ids, markAllRead } = body

  if (markAllRead) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq("read", false)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else if (ids && ids.length > 0) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true, updated_at: new Date().toISOString() })
      .in("id", ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
