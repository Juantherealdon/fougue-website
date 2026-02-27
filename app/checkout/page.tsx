"use client"

import React from "react"
import AccountStep from "@/components/AccountStep" // Import AccountStep component

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Check, Loader2, X } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { startCheckoutSession, processCheckoutComplete, type CheckoutItem } from "@/app/actions/checkout"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CheckoutStep = "account" | "details" | "payment" | "confirmation"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, removeItem } = useCart()
  const { user, supabaseUser, login, register } = useAuth()
  const [step, setStep] = useState<CheckoutStep>("account")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const [orderIds, setOrderIds] = useState<{ orders: string[]; bookings: string[] } | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+971",
    phone: "",
    address: "",
    city: "",
    country: "UAE",
    specialRequests: "",
  })

  // If user is already logged in, skip the account step and pre-fill form
  useEffect(() => {
    if (user && step === "account") {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
      setStep("details")
    }
  }, [user, step])

  // Check if cart has physical products (need shipping)
  const hasPhysicalProducts = items.some(item => !item.id.startsWith('exp-'))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProceedToPayment = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
    // Convert cart items to checkout items with full experience details
    const checkoutItems: CheckoutItem[] = items.map(item => {
      const isExperience = item.type === 'experience'
      const baseItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        type: isExperience ? 'experience' as const : 'product' as const,
      }
      
      if (isExperience) {
        return {
          ...baseItem,
          experienceDate: item.date,
          experienceTime: item.time,
          guests: item.guests,
          addons: item.addOns,
        }
      }
      return baseItem
    })

      const result = await startCheckoutSession({
        items: checkoutItems,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: `${formData.phoneCountryCode}${formData.phone}`.replace(/\s/g, ''),
        authUserId: supabaseUser?.id,
        shippingAddress: hasPhysicalProducts ? {
          line1: formData.address,
          city: formData.city,
          postalCode: "00000",
          country: formData.country,
        } : undefined,
        specialRequests: formData.specialRequests,
      })

      setSessionId(result.sessionId)
      sessionIdRef.current = result.sessionId
      setStep("payment")
    } catch (error: any) {
      console.error("[v0] Error starting checkout:", error)
      const msg = error?.message || "An error occurred. Please try again."
      alert(`Checkout error: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClientSecret = useCallback(async () => {
    // Convert cart items to checkout items with full experience details
    const checkoutItems: CheckoutItem[] = items.map(item => {
      const isExperience = item.type === 'experience'
      const baseItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        type: isExperience ? 'experience' as const : 'product' as const,
      }
      
      if (isExperience) {
        return {
          ...baseItem,
          experienceDate: item.date,
          experienceTime: item.time,
          guests: item.guests,
          addons: item.addOns,
        }
      }
      return baseItem
    })

    const result = await startCheckoutSession({
      items: checkoutItems,
      customerEmail: formData.email,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: `${formData.phoneCountryCode}${formData.phone}`.replace(/\s/g, ''),
      shippingAddress: hasPhysicalProducts ? {
        line1: formData.address,
        city: formData.city,
        postalCode: "00000",
        country: formData.country,
      } : undefined,
      specialRequests: formData.specialRequests,
    })

    setSessionId(result.sessionId)
    sessionIdRef.current = result.sessionId
    return result.clientSecret!
  }, [items, formData, hasPhysicalProducts])

  const handleCheckoutComplete = useCallback(async () => {
    const currentSessionId = sessionIdRef.current
    console.log('[v0] handleCheckoutComplete called with sessionId:', currentSessionId)
    
    if (!currentSessionId) {
      console.error('[v0] No sessionId available')
      return
    }

    try {
      const results = await processCheckoutComplete(currentSessionId)
      console.log('[v0] Checkout processed successfully:', results)
      setOrderIds(results)
      clearCart()
      setStep("confirmation")
    } catch (error) {
      console.error("[v0] Error processing checkout:", error)
    }
  }, [clearCart])

  // Empty cart state
  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#FBF5EF] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-[#800913]/50" />
          </div>
          <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">Your cart is empty</h1>
          <p className="text-[#1E1E1E]/60 mb-8">Add some items to proceed with checkout</p>
          <Link
            href="/gifts"
            className="inline-flex items-center gap-2 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <header className="border-b border-[#1E1E1E]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-[#1E1E1E] hover:text-[#800913] transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm tracking-[0.1em] uppercase">Back to Shop</span>
            </Link>
            <Link href="/" className="text-[#800913] text-xl tracking-[0.3em] font-light">
              <Image
                src="/images/fougue-logo-red-transparent.png"
                alt="Fougue Logo"
                width={80}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-[#1E1E1E]/10 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            {[
              { key: "account", label: "Account" },
              { key: "details", label: "Details" },
              { key: "payment", label: "Payment" },
              { key: "confirmation", label: "Confirmation" },
            ].map((s, index) => {
              const allSteps = ["account", "details", "payment", "confirmation"]
              const currentIndex = allSteps.indexOf(step)
              return (
              <div key={s.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === s.key
                      ? "bg-[#800913] text-white"
                      : currentIndex > index
                      ? "bg-green-500 text-white"
                      : "bg-[#1E1E1E]/10 text-[#1E1E1E]/50"
                  }`}
                >
                  {currentIndex > index ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm hidden sm:block ${
                  step === s.key ? "text-[#1E1E1E]" : "text-[#1E1E1E]/50"
                }`}>
                  {s.label}
                </span>
                {index < 3 && (
                  <div className="w-8 sm:w-16 h-px bg-[#1E1E1E]/20 ml-4" />
                )}
              </div>
              )
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "account" ? (
          <AccountStep
            onContinueAsGuest={() => {
              setIsGuest(true)
              setStep("details")
            }}
            onLogin={async (email, password) => {
              const success = await login(email, password)
              if (success) {
                setStep("details")
              }
              return success
            }}
            onRegister={async (data) => {
              const success = await register(data)
              if (success) {
                setStep("details")
              }
              return success
            }}
          />
        ) : step === "confirmation" ? (
          /* Confirmation Step */
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-light text-[#1E1E1E] mb-4">Thank You!</h1>
            <p className="text-[#1E1E1E]/70 mb-8">
              Your order has been confirmed. We've sent a confirmation email to{" "}
              <span className="text-[#1E1E1E] font-medium">{formData.email}</span>
            </p>
            
            {orderIds && (
              <div className="bg-[#FBF5EF] p-6 rounded-lg mb-8">
                {orderIds.orders.length > 0 && (
                  <p className="text-sm text-[#1E1E1E]/70">
                    Order ID: <span className="font-medium text-[#1E1E1E]">{orderIds.orders.join(", ")}</span>
                  </p>
                )}
                {orderIds.bookings.length > 0 && (
                  <p className="text-sm text-[#1E1E1E]/70 mt-2">
                    Booking ID: <span className="font-medium text-[#1E1E1E]">{orderIds.bookings.join(", ")}</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
              >
                Continue Shopping
              </Link>
              {user && !isGuest && (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 border border-[#1E1E1E]/20 text-[#1E1E1E] px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#1E1E1E] hover:text-white transition-colors"
                >
                  View My Orders
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Form or Payment */}
            <div>
              {step === "details" ? (
                /* Details Form */
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-light text-[#1E1E1E] mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#1E1E1E]/70 mb-2">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#1E1E1E]/70 mb-2">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#1E1E1E]/70 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#1E1E1E]/70 mb-2">Phone</label>
                        <div className="flex gap-3">
                          <select
                            name="phoneCountryCode"
                            value={formData.phoneCountryCode}
                            onChange={handleInputChange}
                            className="w-24 px-3 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors bg-white text-sm"
                          >
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+974">🇶🇦 +974</option>
                            <option value="+965">🇰🇼 +965</option>
                            <option value="+973">🇧🇭 +973</option>
                            <option value="+968">🇴🇲 +968</option>
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="50 123 4567"
                            className="flex-1 px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasPhysicalProducts && (
                    <div>
                      <h2 className="text-xl font-light text-[#1E1E1E] mb-6">Shipping Address</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#1E1E1E]/70 mb-2">Address *</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#1E1E1E]/70 mb-2">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[#1E1E1E]/70 mb-2">Country</label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors bg-white"
                            >
                              <option value="UAE">United Arab Emirates</option>
                              <option value="SA">Saudi Arabia</option>
                              <option value="QA">Qatar</option>
                              <option value="KW">Kuwait</option>
                              <option value="BH">Bahrain</option>
                              <option value="OM">Oman</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-[#1E1E1E]/70 mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special instructions or requests..."
                      className="w-full px-4 py-3 border border-[#1E1E1E]/20 focus:border-[#800913] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={isLoading}
                    className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                </div>
              ) : (
                /* Payment Step */
                <div>
                  <h2 className="text-xl font-light text-[#1E1E1E] mb-6">Payment</h2>
                  <div className="bg-white border border-[#1E1E1E]/10 p-1">
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{
                        fetchClientSecret,
                        onComplete: handleCheckoutComplete,
                      }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-[#FBF5EF] p-8 sticky top-8">
                <h2 className="text-xl font-light text-[#1E1E1E] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 relative group">
                      <div className="relative w-20 h-20 bg-white flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        {item.type === 'product' && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#800913] text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium text-[#1E1E1E]">{item.title}</h3>
                          {step === "details" && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-2 p-1 text-[#1E1E1E]/40 hover:text-[#800913] transition-colors"
                              title="Remove item"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        
                        {item.type === 'experience' ? (
                          <div className="text-xs text-[#1E1E1E]/60 mt-1 space-y-0.5">
                            <p>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                              {item.time}
                              {item.duration && ` (${item.duration})`}
                            </p>
                            <p>{item.guests} {item.guests === 1 ? 'guest' : 'guests'}</p>
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="mt-1 pt-1 border-t border-[#1E1E1E]/10">
                                <p className="text-[#800913] font-medium">Add-ons:</p>
                                {item.addOns.map((addon) => (
                                  <p key={addon.id} className="text-[#1E1E1E]/60">
                                    • {addon.name} (+AED {addon.price})
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-[#1E1E1E]/60 mt-1">
                            {item.currency} {item.price.toLocaleString()} x {item.quantity}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {item.currency} {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#1E1E1E]/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1E1E1E]/60">Subtotal</span>
                    <span className="text-[#1E1E1E]">AED {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1E1E1E]/60">Shipping</span>
                    <span className="text-[#1E1E1E]">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1E1E1E]/60">Tax</span>
                    <span className="text-[#1E1E1E]">AED 0</span>
                  </div>
                </div>

                <div className="border-t border-[#1E1E1E]/10 mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-[#1E1E1E]">Total</span>
                    <span className="text-lg font-medium text-[#800913]">
                      AED {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#1E1E1E]/50 mt-4">
                  No taxes applied (UAE). Prices displayed in AED.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
