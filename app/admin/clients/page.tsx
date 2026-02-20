"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  Star,
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Users,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  currency: string
  ordersCount: number
  reservationsCount: number
  lastOrderDate: string
  joinedDate: string
  status: "active" | "inactive" | "vip"
  notes: string
  tags: string[]
}

const statusConfig = {
  active: { label: "Actif", color: "bg-green-100 text-green-700" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-700" },
  vip: { label: "VIP", color: "bg-[#800913]/10 text-[#800913]" },
}

const initialClients: Client[] = [
  {
    id: "CLI-001",
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    phone: "+971 50 123 4567",
    totalSpent: 12500,
    currency: "AED",
    ordersCount: 5,
    reservationsCount: 3,
    lastOrderDate: "2024-01-31",
    joinedDate: "2023-06-15",
    status: "vip",
    notes: "Préfère les expériences en plein air. Allergique aux fruits de mer.",
    tags: ["VIP", "Fidèle", "Outdoor"],
  },
  {
    id: "CLI-002",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+971 55 987 6543",
    totalSpent: 8500,
    currency: "AED",
    ordersCount: 4,
    reservationsCount: 2,
    lastOrderDate: "2024-01-28",
    joinedDate: "2023-08-20",
    status: "active",
    notes: "",
    tags: ["Fidèle"],
  },
  {
    id: "CLI-003",
    name: "Marie Claire",
    email: "marie.claire@email.com",
    phone: "+971 52 456 7890",
    totalSpent: 3500,
    currency: "AED",
    ordersCount: 1,
    reservationsCount: 1,
    lastOrderDate: "2024-01-25",
    joinedDate: "2024-01-10",
    status: "active",
    notes: "Première commande",
    tags: ["Nouveau"],
  },
  {
    id: "CLI-004",
    name: "Pierre Blanc",
    email: "pierre.blanc@email.com",
    phone: "+971 54 321 0987",
    totalSpent: 15200,
    currency: "AED",
    ordersCount: 8,
    reservationsCount: 5,
    lastOrderDate: "2024-01-30",
    joinedDate: "2023-03-01",
    status: "vip",
    notes: "Client régulier. Aime surprendre sa femme.",
    tags: ["VIP", "Fidèle", "Anniversaires"],
  },
  {
    id: "CLI-005",
    name: "Emma Laurent",
    email: "emma.laurent@email.com",
    phone: "+971 56 789 0123",
    totalSpent: 2000,
    currency: "AED",
    ordersCount: 2,
    reservationsCount: 1,
    lastOrderDate: "2024-01-20",
    joinedDate: "2023-11-15",
    status: "active",
    notes: "",
    tags: [],
  },
  {
    id: "CLI-006",
    name: "Lucas Bernard",
    email: "lucas.bernard@email.com",
    phone: "+971 50 567 8901",
    totalSpent: 4500,
    currency: "AED",
    ordersCount: 2,
    reservationsCount: 2,
    lastOrderDate: "2023-12-15",
    joinedDate: "2023-09-01",
    status: "inactive",
    notes: "Pas de commande depuis plus d'un mois",
    tags: ["À relancer"],
  },
  {
    id: "CLI-007",
    name: "Chloé Petit",
    email: "chloe.petit@email.com",
    phone: "+971 52 234 5678",
    totalSpent: 6800,
    currency: "AED",
    ordersCount: 3,
    reservationsCount: 2,
    lastOrderDate: "2024-01-29",
    joinedDate: "2023-07-10",
    status: "active",
    notes: "Végétarienne",
    tags: ["Végétarien"],
  },
]

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const clientsPerPage = 10

  // Fetch clients from API
  const fetchClients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/clients', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des clients')
      }
      const data = await response.json()
      
      if (!data || !Array.isArray(data)) {
        setClients([])
        return
      }

      // Create safe copy to avoid serialization issues
      const safeData = JSON.parse(JSON.stringify(data))
      
      // Map API data to component format
      const mappedClients: Client[] = safeData.map((client: any) => ({
        id: client.id || '',
        name: client.name || 'N/A',
        email: client.email || 'N/A',
        phone: client.phone || 'N/A',
        totalSpent: client.totalSpent || 0,
        currency: client.currency || 'AED',
        ordersCount: client.ordersCount || 0,
        reservationsCount: client.reservationsCount || 0,
        lastOrderDate: client.lastOrderDate || '',
        joinedDate: client.joinedDate || '',
        status: client.status || 'active',
        notes: client.notes || '',
        tags: Array.isArray(client.tags) ? client.tags : [],
      }))
      setClients(mappedClients)
    } catch (error) {
      console.error('[v0] Error fetching clients:', error)
      setError('Erreur de chargement des clients. Veuillez réessayer.')
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and set up auto-refresh every 30 seconds
  useEffect(() => {
    fetchClients()
    const interval = setInterval(fetchClients, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredClients = clients && clients.length > 0
    ? clients.filter((client) => {
        const matchesSearch =
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.phone.includes(searchQuery)
        const matchesStatus =
          statusFilter === "all" || client.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "recent":
            return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
          case "spent":
            return b.totalSpent - a.totalSpent
          case "orders":
            return b.ordersCount - a.ordersCount
          case "name":
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
    : []

  const totalPages = filteredClients.length > 0 ? Math.ceil(filteredClients.length / clientsPerPage) : 1
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  )

  const totalClients = clients?.length || 0
  const vipClients = clients?.filter((c) => c.status === "vip").length || 0
  const totalRevenue = clients?.reduce((sum, c) => sum + c.totalSpent, 0) || 0
  const avgSpending = totalClients > 0 ? totalRevenue / totalClients : 0

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date)
    } catch {
      return 'N/A'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const updateClientStatus = (id: string, status: Client["status"]) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, status } : c)))
    if (selectedClient?.id === id) {
      setSelectedClient((prev) => prev && { ...prev, status })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Gestion des <span className="text-[#800913]">Clients</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {totalClients} client{totalClients > 1 ? "s" : ""} au total
            {isLoading && <span className="ml-2 text-[#800913]">• Actualisation...</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-[#1E1E1E]/10 bg-transparent"
            onClick={fetchClients}
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
      {isLoading && clients.length === 0 && (
        <div className="p-8 text-center text-[#1E1E1E]/60">
          Chargement des clients...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!clients || clients.length === 0) && !error && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <Users size={48} className="mx-auto text-[#1E1E1E]/20 mb-4" />
            <p className="text-[#1E1E1E] font-medium">Aucun client trouvé</p>
            <p className="text-[#1E1E1E]/60 text-sm mt-1">Les clients apparaîtront ici après le premier achat</p>
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show if we have data */}
      {!isLoading && clients && clients.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#1E1E1E]/60">Total clients</p>
            <p className="text-2xl font-medium text-[#1E1E1E]">{totalClients}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#1E1E1E]/60">Clients VIP</p>
            <p className="text-2xl font-medium text-[#800913]">{vipClients}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#1E1E1E]/60">Revenue total</p>
            <p className="text-2xl font-medium text-[#1E1E1E]">
              AED {totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#1E1E1E]/60">Panier moyen</p>
            <p className="text-2xl font-medium text-[#1E1E1E]">
              AED {Math.round(avgSpending).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Filters */}
      {!isLoading && clients && clients.length > 0 && (
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
              />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
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
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="spent">Dépenses</SelectItem>
                <SelectItem value="orders">Commandes</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Clients Table */}
      {!isLoading && clients && clients.length > 0 && (
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b border-[#1E1E1E]/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Dépenses
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]/5">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#F8F8F8]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#800913]/10 text-[#800913]">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#1E1E1E] flex items-center gap-2">
                          {client.name}
                          {client.status === "vip" && (
                            <Star size={14} className="text-[#800913] fill-[#800913]" />
                          )}
                        </p>
                        <p className="text-xs text-[#1E1E1E]/60">{client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-[#1E1E1E]">{client.email}</p>
                    <p className="text-xs text-[#1E1E1E]/60">{client.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-[#1E1E1E]">
                      {client.currency} {client.totalSpent.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-[#1E1E1E]">
                      {client.ordersCount} cmd / {client.reservationsCount} rés.
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-[#1E1E1E]/60">
                      {formatDate(client.lastOrderDate)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2 py-1 ${
                        statusConfig[client.status].color
                      }`}
                    >
                      {statusConfig[client.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-[#1E1E1E]/5 transition-colors">
                          <MoreVertical size={16} className="text-[#1E1E1E]/60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                          <Eye size={14} className="mr-2" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail size={14} className="mr-2" />
                          Envoyer email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => updateClientStatus(client.id, "vip")}
                        >
                          <Star size={14} className="mr-2" />
                          Promouvoir VIP
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateClientStatus(client.id, "inactive")}
                          className="text-red-600"
                        >
                          Désactiver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E1E1E]/10">
            <p className="text-sm text-[#1E1E1E]/60">
              Affichage de {(currentPage - 1) * clientsPerPage + 1} à{" "}
              {Math.min(currentPage * clientsPerPage, filteredClients.length)} sur{" "}
              {filteredClients.length} clients
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#1E1E1E]/10"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-[#1E1E1E]/60">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-[#1E1E1E]/10"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
      )}

      {/* Client Details Modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#800913]/10 text-[#800913] text-lg">
                  {selectedClient && getInitials(selectedClient.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="flex items-center gap-2">
                  {selectedClient?.name}
                  {selectedClient?.status === "vip" && (
                    <Star size={16} className="mr-2 text-[#800913] fill-[#800913]" />
                  )}
                </span>
                <p className="text-sm font-normal text-[#1E1E1E]/60">
                  Client depuis {selectedClient && formatDate(selectedClient.joinedDate)}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#F8F8F8]">
                  <p className="text-sm text-[#1E1E1E]/60">Total dépensé</p>
                  <p className="text-xl font-medium text-[#800913]">
                    {selectedClient.currency}{" "}
                    {selectedClient.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F8F8]">
                  <p className="text-sm text-[#1E1E1E]/60">Commandes</p>
                  <p className="text-xl font-medium text-[#1E1E1E]">
                    {selectedClient.ordersCount}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F8F8]">
                  <p className="text-sm text-[#1E1E1E]/60">Réservations</p>
                  <p className="text-xl font-medium text-[#1E1E1E]">
                    {selectedClient.reservationsCount}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#1E1E1E]">Email</Label>
                  <p className="text-sm mt-1 flex items-center gap-2">
                    <Mail size={14} className="text-[#800913]" />
                    {selectedClient.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#1E1E1E]">
                    Téléphone
                  </Label>
                  <p className="text-sm mt-1 flex items-center gap-2">
                    <Phone size={14} className="text-[#800913]" />
                    {selectedClient.phone}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedClient.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-[#1E1E1E]">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClient.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-[#800913]/10 text-[#800913]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label className="text-sm font-medium text-[#1E1E1E]">Notes</Label>
                <Textarea
                  value={selectedClient.notes}
                  placeholder="Ajouter des notes sur ce client..."
                  className="mt-2 border-[#1E1E1E]/10"
                  rows={3}
                />
              </div>

              {/* Status */}
              <div>
                <Label className="text-sm font-medium text-[#1E1E1E]">Statut</Label>
                <Select
                  value={selectedClient.status}
                  onValueChange={(value) =>
                    updateClientStatus(selectedClient.id, value as Client["status"])
                  }
                >
                  <SelectTrigger className="border-[#1E1E1E]/10 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Fermer
            </Button>
            <Button className="bg-[#800913] hover:bg-[#600910] text-white">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
