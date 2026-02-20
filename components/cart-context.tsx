"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { useAuth } from "@/components/auth-context"

export interface CartItemProduct {
  type: 'product'
  id: string
  title: string
  price: number
  currency: string
  image: string
  quantity: number
}

export interface CartItemExperience {
  type: 'experience'
  id: string
  experienceId: string
  title: string
  price: number
  currency: string
  image: string
  quantity: number
  date: string
  time: string
  guests: number
  duration?: string
  addOns?: { id: string; name: string; price: number }[]
}

export type CartItem = CartItemProduct | CartItemExperience

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, supabaseUser } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const isSyncing = useRef(false)
  const hasLoadedFromServer = useRef(false)
  const prevUserId = useRef<string | null>(null)

  const isLoggedIn = !!supabaseUser

  // Load cart from localStorage on mount (immediate, no Supabase call)
  useEffect(() => {
    const savedCart = localStorage.getItem("fougue-cart")
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)) } catch {}
    }
  }, [])

  // When user logs in/out, sync cart
  useEffect(() => {
    const currentUserId = supabaseUser?.id || null

    // Skip if user ID hasn't changed
    if (currentUserId === prevUserId.current) return
    prevUserId.current = currentUserId

    if (currentUserId) {
      // User just logged in - sync local cart to server, then load server cart
      const savedCart = localStorage.getItem("fougue-cart")
      const localItems = savedCart ? JSON.parse(savedCart) : []

      if (localItems.length > 0) {
        // Push local cart to server first
        fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: localItems }),
        }).catch(() => {})
      }

      // Load cart from server
      fetch('/api/user/cart')
        .then(res => res.ok ? res.json() : [])
        .then(cartItems => {
          if (cartItems.length > 0) {
            const mappedItems = cartItems.map((ci: any) => ci.product_data)
            setItems(mappedItems)
            hasLoadedFromServer.current = true
          }
        })
        .catch(() => {})
    } else {
      // User logged out
      hasLoadedFromServer.current = false
    }
  }, [supabaseUser?.id])

  // Save cart to localStorage and sync to Supabase on change
  const syncCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem("fougue-cart", JSON.stringify(cartItems))
    
    if (isLoggedIn && !isSyncing.current) {
      isSyncing.current = true
      fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      }).finally(() => {
        isSyncing.current = false
      })
    }
  }, [isLoggedIn])

  useEffect(() => {
    syncCart(items)
  }, [items, syncCart])

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...item, quantity }]
    })
    setIsCartOpen(true)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
