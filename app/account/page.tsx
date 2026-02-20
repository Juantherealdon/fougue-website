"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  User,
  Heart,
  ShoppingBag,
  Calendar,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Edit3,
  Plus,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth, type UserBooking } from "@/components/auth-context"
import { EditBookingModal } from "@/components/edit-booking-modal"

// Sample products for favorites display
const allProducts = [
  {
    id: "mystery-box",
    title: "Mystery Experience Box",
    price: 500,
    image: "/images/gift-door.jpg",
  },
  {
    id: "experience-voucher-500",
    title: "Experience Voucher - 500 AED",
    price: 500,
    image: "/images/letter-seal.jpg",
  },
  {
    id: "couples-massage-kit",
    title: "Couples Massage Kit",
    price: 350,
    image: "/images/surprise-hands.jpg",
  },
  {
    id: "love-letter-set",
    title: "Love Letter Writing Set",
    price: 180,
    image: "/images/letter-seal.jpg",
  },
  {
    id: "romantic-playlist",
    title: "Curated Romantic Playlist",
    price: 25,
    image: "/images/couple-dancing.jpg",
  },
]

type TabType = "profile" | "favorites" | "orders" | "bookings"

interface DbOrder {
  id: string
  customer_name: string
  customer_email: string
  items: { id: string; title: string; price: number; quantity: number }[]
  total_amount: number
  currency: string
  status: string
  shipping_address: any
  created_at: string
}

interface DbBooking {
  id: string
  experience_id: string
  experience_title: string
  date: string
  time: string
  guests: number
  total_amount: number
  currency: string
  status: string
  special_requests: string
  addons: { id: string; name: string; price: number }[]
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, logout, updateProfile, removeFromFavorites, refreshUserData } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editBooking, setEditBooking] = useState<UserBooking | null>(null)

  // Profile edit state
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editPhone, setEditPhone] = useState("")

  // Orders and bookings from Supabase
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([])
  const [dbBookings, setDbBookings] = useState<DbBooking[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Load orders and bookings from Supabase (only when user ID changes)
  const userId = user?.id
  const refreshOrders = () => {
    if (userId) {
      setOrdersLoading(true)
      Promise.all([
        fetch('/api/user/orders').then(res => res.ok ? res.json() : { orders: [], bookings: [] }),
        refreshUserData()
      ])
        .then(([data]) => {
          setDbOrders(data.orders || [])
          setDbBookings(data.bookings || [])
        })
        .catch(() => {})
        .finally(() => setOrdersLoading(false))
    }
  }

  useEffect(() => {
    refreshOrders()
  }, [userId])

  // Refresh data when page becomes visible (e.g., after completing checkout)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        refreshOrders()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [userId])

  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName)
      setEditLastName(user.lastName)
      setEditPhone(user.phone || "")
    }
  }, [user])

  const handleSaveProfile = () => {
    updateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const favoriteProducts = allProducts.filter((p) =>
    user?.favorites.includes(p.id)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF5EF] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#800913]/30 border-t-[#800913] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "orders" as const, label: "Orders", icon: ShoppingBag },
    { id: "bookings" as const, label: "Bookings", icon: Calendar },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
      case "processing":
        return <Clock size={16} className="text-amber-600" />
      case "completed":
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />
      case "shipped":
        return <Package size={16} className="text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
      case "processing":
        return "bg-amber-100 text-amber-800"
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1E1E1E]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="relative z-10 text-center px-6">
          <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in">
            Welcome back
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide animate-fade-in-up">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-white/60 mt-4 animate-fade-in-delay">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Account Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-white p-6 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-[#800913] text-white"
                          : "text-[#1E1E1E]/70 hover:bg-[#FBF5EF]"
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="text-sm tracking-wide">{tab.label}</span>
                      {tab.id === "favorites" && user.favorites.length > 0 && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? "bg-white/20"
                              : "bg-[#800913]/10 text-[#800913]"
                          }`}
                        >
                          {user.favorites.length}
                        </span>
                      )}
                      {tab.id === "bookings" &&
                        dbBookings.filter((b) => b.status === "upcoming")
                          .length > 0 && (
                          <span
                            className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                              activeTab === tab.id
                                ? "bg-white/20"
                                : "bg-[#800913]/10 text-[#800913]"
                            }`}
                          >
                            {
                              dbBookings.filter((b) => b.status === "upcoming")
                                .length
                            }
                          </span>
                        )}
                    </button>
                  ))}
                </nav>

                <div className="border-t border-[#1E1E1E]/10 mt-6 pt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#800913] hover:bg-[#800913]/5 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="text-sm tracking-wide">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-light text-[#1E1E1E]">
                      Profile Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-[#800913] hover:underline text-sm"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="bg-white p-8">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              className="w-full px-4 py-3 bg-[#FBF5EF] border border-transparent focus:border-[#800913] outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="w-full px-4 py-3 bg-[#FBF5EF] border border-transparent focus:border-[#800913] outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 bg-[#FBF5EF]/50 text-[#1E1E1E]/50 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FBF5EF] border border-transparent focus:border-[#800913] outline-none transition-colors"
                            placeholder="+971 XX XXX XXXX"
                          />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={handleSaveProfile}
                            className="bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-3 text-sm tracking-[0.2em] uppercase border border-[#1E1E1E]/20 hover:border-[#1E1E1E] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/40 mb-1">
                              First Name
                            </p>
                            <p className="text-lg text-[#1E1E1E]">
                              {user.firstName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/40 mb-1">
                              Last Name
                            </p>
                            <p className="text-lg text-[#1E1E1E]">
                              {user.lastName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/40 mb-1">
                            Email Address
                          </p>
                          <p className="text-lg text-[#1E1E1E]">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/40 mb-1">
                            Phone Number
                          </p>
                          <p className="text-lg text-[#1E1E1E]">
                            {user.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Settings */}
                  <div className="mt-8">
                    <h3 className="text-lg font-light text-[#1E1E1E] mb-4">
                      Account Settings
                    </h3>
                    <div className="bg-white divide-y divide-[#1E1E1E]/5">
                      <button className="w-full flex items-center justify-between p-5 hover:bg-[#FBF5EF] transition-colors text-left">
                        <div className="flex items-center gap-4">
                          <Settings size={20} className="text-[#1E1E1E]/40" />
                          <div>
                            <p className="text-[#1E1E1E]">Email Notifications</p>
                            <p className="text-sm text-[#1E1E1E]/50">
                              Manage your email preferences
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-[#1E1E1E]/40" />
                      </button>
                      <button className="w-full flex items-center justify-between p-5 hover:bg-[#FBF5EF] transition-colors text-left">
                        <div className="flex items-center gap-4">
                          <Settings size={20} className="text-[#1E1E1E]/40" />
                          <div>
                            <p className="text-[#1E1E1E]">Change Password</p>
                            <p className="text-sm text-[#1E1E1E]/50">
                              Update your password
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-[#1E1E1E]/40" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-light text-[#1E1E1E] mb-8">
                    My Favorites
                  </h2>

                  {favoriteProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteProducts.map((product) => (
                        <div key={product.id} className="bg-white group">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <button
                              onClick={() => removeFromFavorites(product.id)}
                              className="absolute top-4 right-4 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-[#800913] hover:text-white transition-colors"
                            >
                              <Heart size={18} fill="currentColor" />
                            </button>
                          </div>
                          <div className="p-5">
                            <h3 className="text-[#1E1E1E] mb-2">
                              {product.title}
                            </h3>
                            <p className="text-[#800913] font-medium">
                              AED {product.price}
                            </p>
                            <Link
                              href="/gifts"
                              className="mt-4 block text-center py-2 border border-[#1E1E1E]/20 text-sm tracking-wide hover:bg-[#1E1E1E] hover:text-white transition-colors"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center">
                      <Heart
                        size={48}
                        className="mx-auto text-[#1E1E1E]/20 mb-4"
                      />
                      <h3 className="text-xl text-[#1E1E1E] mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-[#1E1E1E]/60 mb-6">
                        Start adding products you love to your favorites list
                      </p>
                      <Link
                        href="/gifts"
                        className="inline-block bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
                      >
                        Explore Gifts
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-light text-[#1E1E1E] mb-8">
                    Order History
                  </h2>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-[#800913]/30 border-t-[#800913] rounded-full animate-spin" />
                    </div>
                  ) : dbOrders.length > 0 ? (
                    <div className="space-y-4">
                      {dbOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-[#1E1E1E]/50">
                                Order #{order.id}
                              </p>
                              <p className="text-xs text-[#1E1E1E]/40 mt-1">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <span
                              className={`flex items-center gap-1.5 px-3 py-1 text-xs tracking-wide uppercase ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>

                          <div className="divide-y divide-[#1E1E1E]/5">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 py-4"
                              >
                                <div className="w-12 h-12 bg-[#FBF5EF] flex items-center justify-center shrink-0">
                                  <Package size={20} className="text-[#1E1E1E]/30" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[#1E1E1E]">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-[#1E1E1E]/50">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-[#800913] font-medium">
                                  AED {item.price * item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#1E1E1E]/10 mt-4 pt-4 flex justify-end items-center">
                            <p className="text-lg text-[#1E1E1E]">
                              Total:{" "}
                              <span className="text-[#800913]">
                                AED {order.total_amount}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center">
                      <ShoppingBag
                        size={48}
                        className="mx-auto text-[#1E1E1E]/20 mb-4"
                      />
                      <h3 className="text-xl text-[#1E1E1E] mb-2">
                        No orders yet
                      </h3>
                      <p className="text-[#1E1E1E]/60 mb-6">
                        Your order history will appear here
                      </p>
                      <Link
                        href="/gifts"
                        className="inline-block bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-light text-[#1E1E1E]">
                      My Bookings
                    </h2>
                    <Link
                      href="/experiences"
                      className="flex items-center gap-2 text-[#800913] hover:underline text-sm"
                    >
                      <Plus size={16} />
                      Book New Experience
                    </Link>
                  </div>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-[#800913]/30 border-t-[#800913] rounded-full animate-spin" />
                    </div>
                  ) : dbBookings.length > 0 ? (
                    <div className="space-y-4">
                      {dbBookings.map((booking) => (
                        <div key={booking.id} className="bg-white overflow-hidden">
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl text-[#1E1E1E]">
                                  {booking.experience_title}
                                </h3>
                                <p className="text-sm text-[#1E1E1E]/50 mt-1">
                                  Booking #{booking.id}
                                </p>
                              </div>
                              <span
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs tracking-wide uppercase ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-[#1E1E1E]/40 uppercase tracking-wide">
                                  Date
                                </p>
                                <p className="text-[#1E1E1E]">
                                  {new Date(booking.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#1E1E1E]/40 uppercase tracking-wide">
                                  Time
                                </p>
                                <p className="text-[#1E1E1E]">{booking.time}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#1E1E1E]/40 uppercase tracking-wide">
                                  Guests
                                </p>
                                <p className="text-[#1E1E1E]">
                                  {booking.guests}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#1E1E1E]/40 uppercase tracking-wide">
                                  Status
                                </p>
                                <p className="text-[#1E1E1E] capitalize">
                                  {booking.status}
                                </p>
                              </div>
                            </div>

                            {booking.addons && booking.addons.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs text-[#1E1E1E]/40 uppercase tracking-wide mb-2">
                                  Add-ons
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {booking.addons.map((addon) => (
                                    <span
                                      key={addon.name}
                                      className="text-xs bg-[#FBF5EF] px-3 py-1"
                                    >
                                      {addon.name} (+AED {addon.price})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-end pt-4 border-t border-[#1E1E1E]/10">
                              <p className="text-lg text-[#1E1E1E]">
                                Total:{" "}
                                <span className="text-[#800913]">
                                  AED {booking.total_amount}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center">
                      <Calendar
                        size={48}
                        className="mx-auto text-[#1E1E1E]/20 mb-4"
                      />
                      <h3 className="text-xl text-[#1E1E1E] mb-2">
                        No bookings yet
                      </h3>
                      <p className="text-[#1E1E1E]/60 mb-6">
                        Book your first romantic experience
                      </p>
                      <Link
                        href="/experiences"
                        className="inline-block bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
                      >
                        Explore Experiences
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Booking Modal */}
      {editBooking && (
        <EditBookingModal
          booking={editBooking}
          onClose={() => setEditBooking(null)}
        />
      )}

      <Footer />
    </main>
  )
}
