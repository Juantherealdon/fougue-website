"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface UserBooking {
  id: string
  experienceId: string
  experienceName: string
  experienceImage: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  totalPrice: number
  addOns: { name: string; price: number }[]
  occasion: string
  forWhom: string
  specialRequests?: string
  createdAt: string
}

export interface UserOrder {
  id: string
  items: {
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
  }[]
  totalPrice: number
  status: "processing" | "shipped" | "delivered"
  shippingAddress: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  favorites: string[]
  bookings: UserBooking[]
  orders: UserOrder[]
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  authModalView: "login" | "register" | "forgot"
  setAuthModalView: (view: "login" | "register" | "forgot") => void
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  addBooking: (booking: Omit<UserBooking, "id" | "createdAt">) => void
  updateBooking: (bookingId: string, updates: Partial<UserBooking>) => void
  cancelBooking: (bookingId: string) => void
  resetPassword: (email: string) => Promise<boolean>
  refreshUserData: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState<
    "login" | "register" | "forgot"
  >("login")

  // Load profile data from Supabase
  const loadProfile = async (authUser: SupabaseUser) => {
    try {
      // Load profile and favorites only (orders/bookings are loaded on demand by account page)
      const [profileResult, favoritesResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle(),
        supabase
          .from("user_favorites")
          .select("product_id")
          .eq("user_id", authUser.id),
      ])

      const profile = profileResult.data
      const favorites = favoritesResult.data

      const appUser: User = {
        id: authUser.id,
        email: authUser.email || "",
        firstName: profile?.first_name || authUser.user_metadata?.firstName || "",
        lastName: profile?.last_name || authUser.user_metadata?.lastName || "",
        phone: profile?.phone || "",
        createdAt: authUser.created_at || new Date().toISOString(),
        favorites: (favorites || []).map((f: any) => f.product_id),
        bookings: [],
        orders: [],
      }

      setUser(appUser)
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    // If supabase client failed to initialize, skip auth
    if (!supabase) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    const initSession = async () => {
      // Use getSession() which reads from local storage only (no server call).
      // The middleware handles server-side session validation and cookie cleanup.
      const { data: { session } } = await supabase.auth.getSession()

      if (!isMounted) return

      if (session?.user) {
        setSupabaseUser(session.user)
        loadProfile(session.user).finally(() => {
          if (isMounted) setIsLoading(false)
        })
      } else {
        setIsLoading(false)
      }
    }

    initSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      if (session?.user) {
        setSupabaseUser(session.user)
        loadProfile(session.user).finally(() => {
          if (isMounted) setIsLoading(false)
        })
      } else {
        setSupabaseUser(null)
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      // Provide a more specific error message for email not confirmed
      if (error.message.includes("Email not confirmed")) {
        throw new Error("EMAIL_NOT_CONFIRMED")
      }
      return false
    }

    setIsAuthModalOpen(false)
    return true
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      console.error("Register error:", error.message)
      return false
    }

    // Check if email confirmation is required
    // When identities is empty, it means the email already exists
    if (signUpData?.user?.identities?.length === 0) {
      throw new Error("EMAIL_EXISTS")
    }

    // If user got a session immediately, email confirmation is disabled
    if (signUpData?.session) {
      // Update profile with additional data
      await supabase
        .from("profiles")
        .upsert({
          id: signUpData.user!.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        })

      setIsAuthModalOpen(false)
      return true
    }

    // If no session, email confirmation is required
    // Still update profile data for when they confirm
    if (signUpData?.user) {
      await supabase
        .from("profiles")
        .upsert({
          id: signUpData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        })
    }

    // Signal that confirmation is needed
    throw new Error("EMAIL_CONFIRMATION_REQUIRED")
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/account`,
    })
    return !error
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !supabaseUser) return

    // Update in Supabase
    await supabase
      .from("profiles")
      .update({
        first_name: data.firstName ?? user.firstName,
        last_name: data.lastName ?? user.lastName,
        phone: data.phone ?? user.phone,
      })
      .eq("id", supabaseUser.id)

    setUser({ ...user, ...data })
  }

  const addToFavorites = async (productId: string) => {
    if (!user || !supabaseUser) return
    if (user.favorites.includes(productId)) return

    await supabase
      .from("user_favorites")
      .insert({ user_id: supabaseUser.id, product_id: productId })

    // Optimistically update the UI
    setUser({ ...user, favorites: [...user.favorites, productId] })
    
    // Refresh from server to ensure consistency
    await refreshUserData()
  }

  const removeFromFavorites = async (productId: string) => {
    if (!user || !supabaseUser) return

    await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", supabaseUser.id)
      .eq("product_id", productId)

    // Optimistically update the UI
    setUser({
      ...user,
      favorites: user.favorites.filter((id) => id !== productId),
    })
    
    // Refresh from server to ensure consistency
    await refreshUserData()
  }

  const isFavorite = (productId: string): boolean => {
    return user?.favorites.includes(productId) ?? false
  }

  const addBooking = (booking: Omit<UserBooking, "id" | "createdAt">) => {
    if (user) {
      const newBooking: UserBooking = {
        ...booking,
        id: "booking_" + Date.now(),
        createdAt: new Date().toISOString(),
      }
      setUser({ ...user, bookings: [...user.bookings, newBooking] })
    }
  }

  const updateBooking = (bookingId: string, updates: Partial<UserBooking>) => {
    if (user) {
      setUser({
        ...user,
        bookings: user.bookings.map((b) =>
          b.id === bookingId ? { ...b, ...updates } : b
        ),
      })
    }
  }

  const cancelBooking = async (bookingId: string) => {
    if (!user) return

    // Update in Supabase
    await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", bookingId)

    setUser({
      ...user,
      bookings: user.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      ),
    })
  }

  const refreshUserData = async () => {
    if (supabaseUser) {
      await loadProfile(supabaseUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalView,
        setAuthModalView,
        login,
        register,
        logout,
        updateProfile,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addBooking,
        updateBooking,
        cancelBooking,
        resetPassword,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
