import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't crash the app
    console.warn('[Supabase] Missing environment variables, authentication features will be disabled')
    return null as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
