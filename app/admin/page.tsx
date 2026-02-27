"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  Package,
  Clock,
  Sparkles,
  Gift,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  confirmed: "bg-green-100 text-green-700",
}

const statusLabels: Record<string, string> = {
  completed: "Termine",
  processing: "En cours",
  pending: "En attente",
  cancelled: "Annule",
  confirmed: "Confirme",
}

interface DashboardData {
  stats: {
    revenue: { value: number; change: string; currency: string }
    orders: { value: number; change: string }
    bookings: { value: number; change: string }
    customers: { value: number; change: string }
  }
  revenueData: Array<{ month: string; revenue: number; orders: number }>
  experienceData: Array<{ name: string; bookings: number }>
  recentOrders: Array<{
    id: string
    customer: string
    product: string
    amount: string
    status: string
    date: string
  }>
  upcomingBookings: Array<{
    id: string
    customer: string
    experience: string
    date: string
    time: string
    guests: number
    status: string
  }>
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("30d")
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/dashboard?period=${period}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
  }

  const stats = data
    ? [
        {
          name: "Chiffre d'affaires",
          value: `${data.stats.revenue.currency} ${data.stats.revenue.value.toLocaleString("en-US")}`,
          change: `${parseFloat(data.stats.revenue.change) >= 0 ? "+" : ""}${data.stats.revenue.change}%`,
          trend: parseFloat(data.stats.revenue.change) >= 0 ? "up" : "down",
          icon: DollarSign,
        },
        {
          name: "Commandes",
          value: data.stats.orders.value.toString(),
          change: `${parseFloat(data.stats.orders.change) >= 0 ? "+" : ""}${data.stats.orders.change}%`,
          trend: parseFloat(data.stats.orders.change) >= 0 ? "up" : "down",
          icon: ShoppingCart,
        },
        {
          name: "Reservations",
          value: data.stats.bookings.value.toString(),
          change: `${parseFloat(data.stats.bookings.change) >= 0 ? "+" : ""}${data.stats.bookings.change}%`,
          trend: parseFloat(data.stats.bookings.change) >= 0 ? "up" : "down",
          icon: Calendar,
        },
        {
          name: "Nouveaux clients",
          value: data.stats.customers.value.toString(),
          change: `${parseFloat(data.stats.customers.change) >= 0 ? "+" : ""}${data.stats.customers.change}%`,
          trend: parseFloat(data.stats.customers.change) >= 0 ? "up" : "down",
          icon: Users,
        },
      ]
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Bienvenue sur le <span className="text-[#800913]">Backoffice</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {"Voici un apercu de votre activite"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm transition-all duration-200 ${
                period === p
                  ? "bg-[#800913] text-white"
                  : "bg-white text-[#1E1E1E]/60 hover:text-[#1E1E1E] border border-[#1E1E1E]/10"
              }`}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : p === "90d" ? "90 jours" : "1 an"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-[#800913]" size={32} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.name} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#800913]/10 flex items-center justify-center">
                      <stat.icon className="text-[#800913]" size={20} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-medium text-[#1E1E1E]">{stat.value}</p>
                  <p className="text-sm text-[#1E1E1E]/60 mt-1">{stat.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#1E1E1E]">
                  {"Evolution du chiffre d'affaires"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {data && data.revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#800913" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#800913" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E5E5",
                            borderRadius: "0",
                          }}
                          formatter={(value: number) => [`AED ${value.toLocaleString("en-US")}`, "Revenus"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#800913"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#1E1E1E]/40 text-sm">
                      Aucune donnee pour cette periode
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experiences Chart */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-[#1E1E1E]">
                  {"Reservations par experience"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {data && data.experienceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.experienceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                        <XAxis type="number" stroke="#666" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="#666"
                          fontSize={12}
                          width={120}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E5E5",
                            borderRadius: "0",
                          }}
                        />
                        <Bar dataKey="bookings" fill="#800913" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#1E1E1E]/40 text-sm">
                      Aucune reservation pour cette periode
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders & Reservations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-[#1E1E1E]">
                  Commandes recentes
                </CardTitle>
                <Link
                  href="/admin/orders"
                  className="text-sm text-[#800913] hover:underline flex items-center gap-1"
                >
                  Voir tout <ArrowRight size={14} />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data && data.recentOrders.length > 0 ? (
                    data.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#FBF5EF] flex items-center justify-center">
                            <Package size={18} className="text-[#800913]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]">
                              {order.customer}
                            </p>
                            <p className="text-xs text-[#1E1E1E]/60">{order.product}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#1E1E1E]">
                            {order.amount}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 ${
                              statusColors[order.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[#1E1E1E]/40 text-sm">
                      Aucune commande recente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reservations */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-[#1E1E1E]">
                  {"Reservations a venir"}
                </CardTitle>
                <Link
                  href="/admin/reservations"
                  className="text-sm text-[#800913] hover:underline flex items-center gap-1"
                >
                  Voir tout <ArrowRight size={14} />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data && data.upcomingBookings.length > 0 ? (
                    data.upcomingBookings.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#FBF5EF] flex items-center justify-center">
                            <Calendar size={18} className="text-[#800913]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]">
                              {reservation.customer}
                            </p>
                            <p className="text-xs text-[#1E1E1E]/60">
                              {reservation.experience}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#1E1E1E]">
                            {reservation.date}
                          </p>
                          <p className="text-xs text-[#1E1E1E]/60 flex items-center justify-end gap-1">
                            <Clock size={12} />
                            {reservation.time} - {reservation.guests} pers.
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[#1E1E1E]/40 text-sm">
                      Aucune reservation a venir
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-[#1E1E1E]">
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Experiences", href: "/admin/experiences", icon: Sparkles },
                  { label: "Produits", href: "/admin/products", icon: Gift },
                  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
                  { label: "Reservations", href: "/admin/reservations", icon: Calendar },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-3 p-6 bg-[#FBF5EF] hover:bg-[#800913]/10 transition-colors group"
                  >
                    <action.icon
                      size={24}
                      className="text-[#800913] group-hover:scale-110 transition-transform"
                    />
                    <span className="text-sm text-[#1E1E1E] font-medium">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
