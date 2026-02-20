import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export createClient function for API routes
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      experiences: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          slug: string
          description: string | null
          long_description: string | null
          duration: string | null
          guests: string | null
          highlight: string | null
          price: number
          currency: string
          category_id: string | null
          location: string | null
          available: boolean
          featured: boolean
          images: string[]
          includes: string[]
          requirements: string[]
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['experiences']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['experiences']['Insert']>
      }
      experience_addons: {
        Row: {
          id: string
          experience_id: string
          name: string
          description: string | null
          price: number
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['experience_addons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['experience_addons']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          long_description: string | null
          price: number
          currency: string
          category: string | null
          stock: number
          available: boolean
          featured: boolean
          images: string[]
          badges: string[]
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      calendars: {
        Row: {
          id: string
          name: string
          color: string
          employee_name: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['calendars']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['calendars']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          customer_email: string
          customer_name: string | null
          status: string
          total: number
          currency: string
          payment_status: string
          payment_method: string | null
          shipping_address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      reservations: {
        Row: {
          id: string
          reservation_number: string
          experience_id: string | null
          experience_name: string
          calendar_id: string | null
          customer_id: string | null
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          date: string
          time: string
          guests: number
          status: string
          total: number
          currency: string
          payment_status: string
          notes: string | null
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reservations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>
      }
      customers: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          postal_code: string | null
          total_spent: number
          total_orders: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
    }
  }
}
