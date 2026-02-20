import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            )
          },
        },
      },
    )

    // Refresh the session. If the session is stale/invalid, clear cookies
    // so the browser stops sending the bad JWT on subsequent requests.
    let sessionError = false
    try {
      const { error } = await supabase.auth.getUser()
      if (error) {
        sessionError = true
      }
    } catch {
      // getUser() can throw if the fetch itself fails or times out
      sessionError = true
    }

    if (sessionError) {
      // Manually delete all Supabase auth cookies from the response.
      // We cannot use signOut() because it makes another server request
      // that would also fail with the same stale token.
      const allCookies = request.cookies.getAll()
      for (const cookie of allCookies) {
        if (cookie.name.startsWith('sb-')) {
          supabaseResponse.cookies.set(cookie.name, '', {
            maxAge: 0,
            path: '/',
          })
        }
      }
    }
  } catch (error) {
    // Silently fail if the entire Supabase operation fails (network issues, etc.)
    // The client-side auth context will handle auth state independently
    console.error('[v0] Middleware Supabase error:', error)
  }

  return supabaseResponse
}
