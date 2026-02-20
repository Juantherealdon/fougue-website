"use client"

import { useState } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  Eye,
  Package,
  Clock,
  Sparkles,
  Gift,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const stats = [
  {
    name: "Chiffre d'affaires",
    value: "AED 124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Commandes",
    value: "48",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    name: "Réservations",
    value: "32",
    change: "+15.3%",
    trend: "up",
    icon: Calendar,
  },
  {
    name: "Nouveaux clients",
    value: "18",
    change: "-2.1%",
    trend: "down",
    icon: Users,
  },
]

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 32 },
  { month: "Fév", revenue: 52000, orders: 38 },
  { month: "Mar", revenue: 48000, orders: 35 },
  { month: "Avr", revenue: 61000, orders: 42 },
  { month: "Mai", revenue: 55000, orders: 40 },
  { month: "Juin", revenue: 67000, orders: 48 },
  { month: "Juil", revenue: 72000, orders: 52 },
]

const experienceData = [
  { name: "Parisian Interlude", bookings: 45 },
  { name: "French Rendez-vous", bookings: 38 },
  { name: "Sakura Hanami", bookings: 32 },
  { name: "Love is Art", bookings: 28 },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sophie Martin",
    product: "Premium Experience Voucher",
    amount: "AED 1,000",
    status: "completed",
    date: "Il y a 2h",
  },
  {
    id: "ORD-002",
    customer: "Jean Dupont",
    product: "Mystery Experience Card",
    amount: "AED 1,500",
    status: "processing",
    date: "Il y a 4h",
  },
  {
    id: "ORD-003",
    customer: "Marie Claire",
    product: "Couples Collection",
    amount: "AED 3,500",
    status: "pending",
    date: "Il y a 6h",
  },
  {
    id: "ORD-004",
    customer: "Pierre Blanc",
    product: "Experience Voucher",
    amount: "AED 500",
    status: "completed",
    date: "Il y a 8h",
  },
]

const upcomingReservations = [
  {
    id: "RES-001",
    customer: "Emma Laurent",
    experience: "The Parisian Interlude",
    date: "25 Jan 2026",
    time: "18:00",
    guests: 2,
  },
  {
    id: "RES-002",
    customer: "Lucas Bernard",
    experience: "French Rendez-vous",
    date: "26 Jan 2026",
    time: "19:30",
    guests: 2,
  },
  {
    id: "RES-003",
    customer: "Chloé Petit",
    experience: "Sakura Hanami",
    date: "27 Jan 2026",
    time: "17:00",
    guests: 2,
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
}

const statusLabels = {
  completed: "Terminé",
  processing: "En cours",
  pending: "En attente",
  cancelled: "Annulé",
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("7d")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Bienvenue sur le <span className="text-[#800913]">Backoffice</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            Voici un aperçu de votre activité
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
              Évolution du chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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
                    formatter={(value: number) => [`AED ${value.toLocaleString()}`, "Revenus"]}
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
            </div>
          </CardContent>
        </Card>

        {/* Experiences Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Réservations par expérience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceData} layout="vertical">
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
              Commandes récentes
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
              {recentOrders.map((order) => (
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
                        statusColors[order.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Réservations à venir
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
              {upcomingReservations.map((reservation) => (
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
              ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/experiences/new"
              className="flex items-center gap-3 p-4 border border-[#1E1E1E]/10 hover:border-[#800913] hover:bg-[#800913]/5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-[#800913]/10 flex items-center justify-center">
                <Sparkles className="text-[#800913]" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  Nouvelle expérience
                </p>
                <p className="text-xs text-[#1E1E1E]/60">Créer une expérience</p>
              </div>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border border-[#1E1E1E]/10 hover:border-[#800913] hover:bg-[#800913]/5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-[#800913]/10 flex items-center justify-center">
                <Gift className="text-[#800913]" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  Nouveau produit
                </p>
                <p className="text-xs text-[#1E1E1E]/60">Ajouter un cadeau</p>
              </div>
            </Link>
            <Link
              href="/admin/reservations"
              className="flex items-center gap-3 p-4 border border-[#1E1E1E]/10 hover:border-[#800913] hover:bg-[#800913]/5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-[#800913]/10 flex items-center justify-center">
                <Calendar className="text-[#800913]" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  Calendrier
                </p>
                <p className="text-xs text-[#1E1E1E]/60">Voir les réservations</p>
              </div>
            </Link>
            <Link
              href="/admin/clients"
              className="flex items-center gap-3 p-4 border border-[#1E1E1E]/10 hover:border-[#800913] hover:bg-[#800913]/5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-[#800913]/10 flex items-center justify-center">
                <Users className="text-[#800913]" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1E1E]">Clients</p>
                <p className="text-xs text-[#1E1E1E]/60">Gérer les clients</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
