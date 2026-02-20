"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 45000, orders: 32, reservations: 28 },
  { month: "Fév", revenue: 52000, orders: 38, reservations: 32 },
  { month: "Mar", revenue: 48000, orders: 35, reservations: 30 },
  { month: "Avr", revenue: 61000, orders: 42, reservations: 38 },
  { month: "Mai", revenue: 55000, orders: 40, reservations: 35 },
  { month: "Juin", revenue: 67000, orders: 48, reservations: 42 },
  { month: "Juil", revenue: 72000, orders: 52, reservations: 45 },
  { month: "Août", revenue: 68000, orders: 49, reservations: 43 },
  { month: "Sep", revenue: 75000, orders: 54, reservations: 48 },
  { month: "Oct", revenue: 82000, orders: 58, reservations: 52 },
  { month: "Nov", revenue: 89000, orders: 62, reservations: 55 },
  { month: "Déc", revenue: 98000, orders: 68, reservations: 60 },
]

const experiencePopularity = [
  { name: "The Parisian Interlude", bookings: 145, revenue: 217500 },
  { name: "French Rendez-vous", bookings: 98, revenue: 245000 },
  { name: "Sakura Hanami", bookings: 72, revenue: 129600 },
  { name: "Love is Art", bookings: 65, revenue: 78000 },
]

const productSales = [
  { name: "Experience Voucher", sales: 89, revenue: 44500 },
  { name: "Premium Voucher", sales: 52, revenue: 52000 },
  { name: "Mystery Card", sales: 34, revenue: 51000 },
  { name: "Couples Collection", sales: 28, revenue: 98000 },
  { name: "Romantic Box", sales: 45, revenue: 99000 },
]

const categoryData = [
  { name: "Cartes cadeaux", value: 42, color: "#800913" },
  { name: "Cadeaux couple", value: 35, color: "#1E1E1E" },
  { name: "Digital", value: 23, color: "#FBF5EF" },
]

const customerAcquisition = [
  { month: "Jan", nouveaux: 18, recurrents: 14 },
  { month: "Fév", nouveaux: 22, recurrents: 16 },
  { month: "Mar", nouveaux: 19, recurrents: 16 },
  { month: "Avr", nouveaux: 25, recurrents: 17 },
  { month: "Mai", nouveaux: 21, recurrents: 19 },
  { month: "Juin", nouveaux: 28, recurrents: 20 },
]

const topCustomers = [
  { name: "Pierre Blanc", spent: 15200, orders: 8 },
  { name: "Sophie Martin", spent: 12500, orders: 5 },
  { name: "Jean Dupont", spent: 8500, orders: 4 },
  { name: "Chloé Petit", spent: 6800, orders: 3 },
  { name: "Lucas Bernard", spent: 4500, orders: 2 },
]

const stats = [
  {
    name: "Chiffre d'affaires",
    value: "AED 812,000",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    subtitle: "vs année précédente",
  },
  {
    name: "Commandes totales",
    value: "578",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
    subtitle: "vs année précédente",
  },
  {
    name: "Réservations",
    value: "458",
    change: "+22.3%",
    trend: "up",
    icon: Calendar,
    subtitle: "vs année précédente",
  },
  {
    name: "Nouveaux clients",
    value: "186",
    change: "+8.7%",
    trend: "up",
    icon: Users,
    subtitle: "vs année précédente",
  },
]

const conversionMetrics = [
  { name: "Taux de conversion", value: "4.2%", change: "+0.8%" },
  { name: "Panier moyen", value: "AED 1,405", change: "+5.2%" },
  { name: "Valeur vie client", value: "AED 3,850", change: "+12.1%" },
  { name: "Taux de rétention", value: "68%", change: "+3.5%" },
]

export default function AnalyticsAdmin() {
  const [period, setPeriod] = useState("1y")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            <span className="text-[#800913]">Analytics</span> & Rapports
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            Vue d'ensemble des performances
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["30d", "90d", "1y", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm transition-all duration-200 ${
                period === p
                  ? "bg-[#800913] text-white"
                  : "bg-white text-[#1E1E1E]/60 hover:text-[#1E1E1E] border border-[#1E1E1E]/10"
              }`}
            >
              {p === "30d"
                ? "30 jours"
                : p === "90d"
                  ? "90 jours"
                  : p === "1y"
                    ? "1 an"
                    : "Tout"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
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
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-medium text-[#1E1E1E]">{stat.value}</p>
              <p className="text-sm text-[#1E1E1E]/60 mt-1">{stat.name}</p>
              <p className="text-xs text-[#1E1E1E]/40 mt-0.5">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {conversionMetrics.map((metric) => (
          <Card key={metric.name} className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">{metric.name}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-xl font-medium text-[#1E1E1E]">{metric.value}</p>
                <span className="text-xs text-green-600">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-[#1E1E1E]">
            Évolution du chiffre d'affaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
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
                  formatter={(value: number) => [
                    `AED ${value.toLocaleString()}`,
                    "Revenus",
                  ]}
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

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Reservations */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Commandes & Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E5E5",
                      borderRadius: "0",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Commandes"
                    stroke="#800913"
                    strokeWidth={2}
                    dot={{ fill: "#800913" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reservations"
                    name="Réservations"
                    stroke="#1E1E1E"
                    strokeWidth={2}
                    dot={{ fill: "#1E1E1E" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Acquisition clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerAcquisition}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E5E5",
                      borderRadius: "0",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="nouveaux" name="Nouveaux" fill="#800913" />
                  <Bar dataKey="recurrents" name="Récurrents" fill="#1E1E1E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience & Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Popularity */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Performance des expériences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experiencePopularity.map((exp, index) => (
                <div
                  key={exp.name}
                  className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#800913]/10 text-[#800913] text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {exp.name}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60">
                        {exp.bookings} réservations
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#800913]">
                    AED {exp.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Sales */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Ventes par produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSales.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between py-3 border-b border-[#1E1E1E]/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#1E1E1E]/10 text-[#1E1E1E] text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    AED {product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Part"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E5E5",
                      borderRadius: "0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-[#1E1E1E]/60">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#1E1E1E]">
              Meilleurs clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E1E1E]/10">
                    <th className="text-left py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase">
                      Rang
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase">
                      Client
                    </th>
                    <th className="text-right py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase">
                      Commandes
                    </th>
                    <th className="text-right py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase">
                      Total dépensé
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr
                      key={customer.name}
                      className="border-b border-[#1E1E1E]/5 last:border-0"
                    >
                      <td className="py-3">
                        <span
                          className={`w-6 h-6 inline-flex items-center justify-center text-xs font-medium ${
                            index === 0
                              ? "bg-[#800913] text-white"
                              : "bg-[#1E1E1E]/10 text-[#1E1E1E]"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <p className="text-sm font-medium text-[#1E1E1E]">
                          {customer.name}
                        </p>
                      </td>
                      <td className="py-3 text-right">
                        <p className="text-sm text-[#1E1E1E]/60">
                          {customer.orders}
                        </p>
                      </td>
                      <td className="py-3 text-right">
                        <p className="text-sm font-medium text-[#800913]">
                          AED {customer.spent.toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
