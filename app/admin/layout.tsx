"use client"

import React from "react"

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
                <button className="relative p-2 text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#800913] rounded-full" />
                </button>

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
