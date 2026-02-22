"use client"

import React, { useEffect, useCallback } from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Gift,
  ShoppingCart,
  Calendar,
  CalendarClock,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  Tag,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminGuard, logout } from "@/components/admin/admin-guard"

const navigation = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { name: "Expériences", href: "/admin/experiences", icon: Sparkles },
  { name: "Catégories", href: "/admin/categories", icon: Tag },
  { name: "Produits Gifts", href: "/admin/products", icon: Gift },
  { name: "Disponibilités", href: "/admin/availability", icon: CalendarClock },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Réservations", href: "/admin/reservations", icon: Calendar },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Array<{id: string; type: string; title: string; message: string; read: boolean; created_at: string; data: Record<string, unknown>}>>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications?limit=10")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch { /* silent */ }
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8F8F8]">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-[#1E1E1E] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/images/fougue-logo-white-transparent.png"
                  alt="Fougue"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#800913] text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <LogOut size={18} />
              Retour au site
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={18} />
              Se déconnecter
            </button>
          </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-[#1E1E1E]/10">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-[#1E1E1E]"
              >
                <Menu size={24} />
              </button>

              {/* Page title */}
              <h1 className="text-lg font-medium text-[#1E1E1E] hidden lg:block">
                {navigation.find((item) => 
                  item.href === pathname || 
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                )?.name || "Tableau de bord"}
              </h1>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#800913] rounded-full flex items-center justify-center text-white text-[10px] font-medium px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-xl border border-[#1E1E1E]/10 z-50 max-h-[480px] flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1E]/10">
                          <h3 className="text-sm font-medium text-[#1E1E1E]">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-xs text-[#800913] hover:underline"
                            >
                              Tout marquer lu
                            </button>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                              <Bell size={24} className="mx-auto text-[#1E1E1E]/20 mb-3" />
                              <p className="text-sm text-[#1E1E1E]/40">Aucune notification</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`px-4 py-3 border-b border-[#1E1E1E]/5 last:border-0 hover:bg-[#FBF5EF]/50 transition-colors ${
                                  !notif.read ? "bg-[#800913]/3" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                    !notif.read ? "bg-[#800913]" : "bg-transparent"
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1E1E1E] truncate">{notif.title}</p>
                                    <p className="text-xs text-[#1E1E1E]/60 mt-0.5 line-clamp-2">{notif.message}</p>
                                    <p className="text-xs text-[#1E1E1E]/40 mt-1">{getTimeAgo(notif.created_at)}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors">
                      <div className="w-8 h-8 bg-[#800913] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        A
                      </div>
                      <span className="hidden md:inline text-sm">Admin</span>
                      <ChevronDown size={16} />
                    </button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/admin/settings" className="w-full">
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <span className="w-full text-[#800913]">
                      Se déconnecter
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
    </AdminGuard>
  )
}
