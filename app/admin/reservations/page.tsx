"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Reservation {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  experience: {
    id: string
    name: string
  }
  date: string
  time: string
  guests: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  specialRequests: string
  location: string
  createdAt: string
  totalPaid: number
  currency: string
}

const statusConfig = {
  confirmed: {
    label: "Confirmé",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  completed: {
    label: "Terminé",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
}

const experiences = [
  { id: "interlude-francais", name: "The Parisian Interlude" },
  { id: "french-rendez-vous", name: "French Rendez-vous" },
  { id: "sakura-hanami", name: "Sakura Hanami" },
  { id: "love-is-art", name: "Love is Art" },
]

const initialReservations: Reservation[] = [
  {
    id: "RES-001",
    customer: {
      name: "Emma Laurent",
      email: "emma.laurent@email.com",
      phone: "+971 50 123 4567",
    },
    experience: { id: "interlude-francais", name: "The Parisian Interlude" },
    date: "2024-02-05",
    time: "18:00",
    guests: 2,
    status: "confirmed",
    specialRequests: "Anniversary celebration - please add rose petals",
    location: "Secret Garden, Al Barsha",
    createdAt: "2024-01-28T10:30:00",
    totalPaid: 1500,
    currency: "AED",
  },
  {
    id: "RES-002",
    customer: {
      name: "Lucas Bernard",
      email: "lucas.bernard@email.com",
      phone: "+971 55 987 6543",
    },
    experience: { id: "french-rendez-vous", name: "French Rendez-vous" },
    date: "2024-02-06",
    time: "19:30",
    guests: 2,
    status: "confirmed",
    specialRequests: "Vegetarian menu required",
    location: "Private Villa, Palm Jumeirah",
    createdAt: "2024-01-27T14:15:00",
    totalPaid: 2500,
    currency: "AED",
  },
  {
    id: "RES-003",
    customer: {
      name: "Chloé Petit",
      email: "chloe.petit@email.com",
      phone: "+971 52 456 7890",
    },
    experience: { id: "sakura-hanami", name: "Sakura Hanami" },
    date: "2024-02-07",
    time: "17:00",
    guests: 2,
    status: "pending",
    specialRequests: "",
    location: "Japanese Garden, Dubai Creek",
    createdAt: "2024-01-29T09:45:00",
    totalPaid: 1800,
    currency: "AED",
  },
  {
    id: "RES-004",
    customer: {
      name: "Antoine Moreau",
      email: "antoine.moreau@email.com",
      phone: "+971 54 321 0987",
    },
    experience: { id: "love-is-art", name: "Love is Art" },
    date: "2024-02-08",
    time: "16:00",
    guests: 2,
    status: "confirmed",
    specialRequests: "Surprise proposal - need photographer",
    location: "Art Studio, Al Quoz",
    createdAt: "2024-01-26T11:20:00",
    totalPaid: 1200,
    currency: "AED",
  },
  {
    id: "RES-005",
    customer: {
      name: "Sophie Martin",
      email: "sophie.martin@email.com",
      phone: "+971 56 789 0123",
    },
    experience: { id: "interlude-francais", name: "The Parisian Interlude" },
    date: "2024-01-28",
    time: "17:30",
    guests: 2,
    status: "completed",
    specialRequests: "",
    location: "Secret Garden, Al Barsha",
    createdAt: "2024-01-20T08:00:00",
    totalPaid: 1500,
    currency: "AED",
  },
  {
    id: "RES-006",
    customer: {
      name: "Marc Dubois",
      email: "marc.dubois@email.com",
      phone: "+971 50 567 8901",
    },
    experience: { id: "french-rendez-vous", name: "French Rendez-vous" },
    date: "2024-01-25",
    time: "20:00",
    guests: 2,
    status: "cancelled",
    specialRequests: "",
    location: "Private Villa, Palm Jumeirah",
    createdAt: "2024-01-18T15:30:00",
    totalPaid: 0,
    currency: "AED",
  },
]

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ArrowUpDown size={12} className="ml-1 text-[#1E1E1E]/30" />
    return sortDirection === "asc"
      ? <ArrowUp size={12} className="ml-1 text-[#800913]" />
      : <ArrowDown size={12} className="ml-1 text-[#800913]" />
  }

  // Fetch bookings from both bookings and reservations tables
  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [bookingsRes, reservationsRes] = await Promise.all([
        fetch('/api/admin/bookings', { cache: 'no-store' }),
        fetch('/api/admin/bookings?source=reservations', { cache: 'no-store' }),
      ])

      const allEntries: any[] = []

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        if (Array.isArray(bookingsData)) allEntries.push(...bookingsData)
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json()
        if (Array.isArray(reservationsData)) allEntries.push(...reservationsData)
      }

      // Deduplicate by id
      const seen = new Set<string>()
      const deduped = allEntries.filter(entry => {
        if (seen.has(entry.id)) return false
        seen.add(entry.id)
        return true
      })

      // Map API data to component format (handle both camelCase and snake_case)
      const mappedReservations: Reservation[] = deduped.map((booking: any) => ({
        id: booking.id || '',
        customer: {
          name: booking.customer_name || booking.customerName || 'N/A',
          email: booking.customer_email || booking.customerEmail || 'N/A',
          phone: booking.customer_phone || booking.customerPhone || 'N/A',
        },
        experience: {
          id: booking.experience_id || booking.experienceId || '',
          name: booking.experience_title || booking.experienceTitle || 'Experience',
        },
        date: typeof booking.date === 'string' ? booking.date : new Date(booking.date).toISOString().split('T')[0],
        time: booking.time || '00:00',
        guests: booking.guests || 1,
        status: booking.status || 'confirmed',
        specialRequests: booking.special_requests || booking.specialRequests || '',
        location: 'To be determined',
        createdAt: typeof (booking.created_at || booking.createdAt) === 'string' ? (booking.created_at || booking.createdAt) : new Date(booking.created_at || booking.createdAt).toISOString(),
        totalPaid: booking.total_amount || booking.totalAmount || 0,
        currency: booking.currency || 'AED',
      }))
      
      // Sort by date (closest first)
      mappedReservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setReservations(mappedReservations)
    } catch (error) {
      console.error('[v0] Error fetching bookings:', error)
      setError('Erreur de chargement des réservations. Veuillez réessayer.')
      setReservations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and set up auto-refresh every 30 seconds
  useEffect(() => {
    fetchBookings()
    const interval = setInterval(fetchBookings, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const filteredReservations = reservations && reservations.length > 0 ? reservations.filter((res) => {
    const matchesSearch =
      res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || res.status === statusFilter
    const matchesExperience =
      experienceFilter === "all" || res.experience.id === experienceFilter
    return matchesSearch && matchesStatus && matchesExperience
  }).sort((a, b) => {
    const dir = sortDirection === "asc" ? 1 : -1
    switch (sortColumn) {
      case "id": return dir * a.id.localeCompare(b.id)
      case "customer": return dir * a.customer.name.localeCompare(b.customer.name)
      case "experience": return dir * a.experience.name.localeCompare(b.experience.name)
      case "date": return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
      case "guests": return dir * (a.guests - b.guests)
      case "status": return dir * a.status.localeCompare(b.status)
      case "createdAt": return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      default: return 0
    }
  }) : []

  const upcomingReservations = filteredReservations && filteredReservations.length > 0 ? filteredReservations.filter(
    (r) => new Date(r.date) >= new Date() && r.status !== "cancelled"
  ) : []

  const todayReservations = filteredReservations && filteredReservations.length > 0 ? filteredReservations.filter(
    (r) => {
      try {
        return new Date(r.date).toDateString() === new Date().toDateString() && r.status !== "cancelled"
      } catch {
        return false
      }
    }
  ) : []

  const updateReservationStatus = async (id: string, status: Reservation["status"]) => {
    // Persist status change to database
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, source: 'reservations' }),
      })
      // Also try bookings table
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch {
      // Continue updating UI even if API fails
    }
    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status } : r))
    )
    if (selectedReservation?.id === id) {
      setSelectedReservation((prev) => prev && { ...prev, status })
    }
  }

  const deleteReservation = async (reservation: Reservation) => {
    setIsDeleting(true)
    try {
      // Try deleting from both tables
      const [res1, res2] = await Promise.all([
        fetch('/api/admin/bookings', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: reservation.id, source: 'reservations' }),
        }),
        fetch('/api/admin/bookings', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: reservation.id }),
        }),
      ])
      if (res1.ok || res2.ok) {
        setReservations(reservations.filter(r => r.id !== reservation.id))
        setDeleteTarget(null)
      } else {
        alert('Erreur lors de la suppression de la reservation')
      }
    } catch {
      alert('Erreur lors de la suppression de la reservation')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date invalide'
      }
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    } catch {
      return 'Date invalide'
    }
  }

  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
      }).format(date)
    } catch {
      return 'N/A'
    }
  }

  const formatPaymentDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Gestion des <span className="text-[#800913]">Réservations</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {upcomingReservations.length} réservation
            {upcomingReservations.length > 1 ? "s" : ""} à venir
            {isLoading && <span className="ml-2 text-[#800913]">• Actualisation...</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-[#1E1E1E]/10 bg-transparent"
            onClick={fetchBookings}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" className="border-[#1E1E1E]/10 bg-transparent">
            <Download size={18} className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && reservations.length === 0 && (
        <div className="p-8 text-center text-[#1E1E1E]/60">
          Chargement des réservations...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!reservations || reservations.length === 0) && !error && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <Calendar size={48} className="mx-auto text-[#1E1E1E]/20 mb-4" />
            <p className="text-[#1E1E1E] font-medium">Aucune réservation trouvée</p>
            <p className="text-[#1E1E1E]/60 text-sm mt-1">Les réservations apparaîtront ici après le premier booking</p>
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show if we have data */}
      {!isLoading && reservations && reservations.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">{"Aujourd'hui"}</p>
              <p className="text-2xl font-medium text-[#1E1E1E]">
                {todayReservations.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">Cette semaine</p>
              <p className="text-2xl font-medium text-[#1E1E1E]">
                {upcomingReservations.filter((r) => {
                  const resDate = new Date(r.date)
                  const today = new Date()
                  const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                  return resDate >= today && resDate <= weekLater
                }).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">En attente</p>
              <p className="text-2xl font-medium text-yellow-600">
                {reservations.filter((r) => r.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">Confirmées</p>
              <p className="text-2xl font-medium text-green-600">
                {reservations.filter((r) => r.status === "confirmed").length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {!isLoading && reservations && reservations.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                />
                <Input
                  placeholder="Rechercher par ID, nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#1E1E1E]/10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full lg:w-56 border-[#1E1E1E]/10">
                  <SelectValue placeholder="Expérience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les expériences</SelectItem>
                  {experiences.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservations Table */}
      {!isLoading && reservations && reservations.length > 0 && (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#1E1E1E]/10">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("id")}>
                    <span className="inline-flex items-center">Reservation <SortIcon column="id" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("customer")}>
                    <span className="inline-flex items-center">Client <SortIcon column="customer" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("experience")}>
                    <span className="inline-flex items-center">Experience <SortIcon column="experience" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("date")}>
                    <span className="inline-flex items-center">{"Date & Heure"} <SortIcon column="date" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("guests")}>
                    <span className="inline-flex items-center">{"Invites"} <SortIcon column="guests" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center">Statut <SortIcon column="status" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider cursor-pointer select-none hover:text-[#1E1E1E]" onClick={() => handleSort("createdAt")}>
                    <span className="inline-flex items-center">Date de paiement <SortIcon column="createdAt" /></span>
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E1E]/5">
                {filteredReservations.map((reservation) => {
                  const StatusIcon = statusConfig[reservation.status].icon
                  return (
                    <tr key={reservation.id} className="hover:bg-[#F8F8F8]">
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#1E1E1E]">{reservation.id}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-[#1E1E1E]">
                          {reservation.customer.name}
                        </p>
                        <p className="text-xs text-[#1E1E1E]/60">
                          {reservation.customer.email}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1E1E1E]">
                          {reservation.experience.name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-[#1E1E1E]">
                          {formatShortDate(reservation.date)}
                        </p>
                        <p className="text-xs text-[#1E1E1E]/60">{reservation.time}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1E1E1E]">
                          {reservation.guests} pers.
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 ${
                            statusConfig[reservation.status].color
                          }`}
                        >
                          <StatusIcon size={12} />
                          {statusConfig[reservation.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1E1E1E]/60">
                          {formatPaymentDate(reservation.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-[#1E1E1E]/5 transition-colors">
                              <MoreVertical size={16} className="text-[#1E1E1E]/60" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              <Eye size={14} className="mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail size={14} className="mr-2" />
                              Envoyer email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone size={14} className="mr-2" />
                              Appeler
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                updateReservationStatus(reservation.id, "confirmed")
                              }
                            >
                              Confirmer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateReservationStatus(reservation.id, "completed")
                              }
                            >
                              Marquer terminé
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateReservationStatus(reservation.id, "cancelled")
                              }
                              className="text-red-600"
                            >
                              Annuler
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(reservation)}
                              className="text-red-600"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </div>
      </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la reservation</DialogTitle>
            <DialogDescription>
              {"Voulez-vous vraiment supprimer la reservation"} <strong>{deleteTarget?.id}</strong> ?
              Cette action est irréversible et le créneaux sera libéré dans le calendrier.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteTarget && deleteReservation(deleteTarget)}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservation Details Modal */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={() => setSelectedReservation(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Réservation {selectedReservation?.id}</DialogTitle>
            <DialogDescription>
              {selectedReservation && formatDate(selectedReservation.date)} à{" "}
              {selectedReservation?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1 text-sm px-3 py-1.5 ${
                    statusConfig[selectedReservation.status].color
                  }`}
                >
                  {statusConfig[selectedReservation.status].label}
                </span>
                <span className="text-sm text-[#1E1E1E]/60">
                  {selectedReservation.currency}{" "}
                  {selectedReservation.totalPaid.toLocaleString()} payé
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] mb-1">Client</p>
                    <p className="text-sm">{selectedReservation.customer.name}</p>
                    <p className="text-sm text-[#1E1E1E]/60">
                      {selectedReservation.customer.email}
                    </p>
                    <p className="text-sm text-[#1E1E1E]/60">
                      {selectedReservation.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] mb-1">
                      Expérience
                    </p>
                    <p className="text-sm">{selectedReservation.experience.name}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] mb-1">
                      Date & Heure
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar size={14} className="text-[#800913]" />
                      {formatDate(selectedReservation.date)}
                    </p>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-[#800913]" />
                      {selectedReservation.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] mb-1">Lieu</p>
                    <p className="text-sm flex items-center gap-2">
                      <MapPin size={14} className="text-[#800913]" />
                      {selectedReservation.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E] mb-1">Invités</p>
                    <p className="text-sm flex items-center gap-2">
                      <Users size={14} className="text-[#800913]" />
                      {selectedReservation.guests} personnes
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedReservation.specialRequests && (
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E] mb-2">
                    Demandes spéciales
                  </p>
                  <p className="text-sm text-[#1E1E1E]/60 p-3 bg-[#FBF5EF]">
                    {selectedReservation.specialRequests}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <Label className="text-sm font-medium text-[#1E1E1E] mb-2">
                  Mettre à jour le statut
                </Label>
                <Select
                  value={selectedReservation.status}
                  onValueChange={(value) =>
                    updateReservationStatus(
                      selectedReservation.id,
                      value as Reservation["status"]
                    )
                  }
                >
                  <SelectTrigger className="border-[#1E1E1E]/10 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReservation(null)}>
              Fermer
            </Button>
            <Button className="bg-[#800913] hover:bg-[#600910] text-white">
              <Mail size={16} className="mr-2" />
              Envoyer confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
