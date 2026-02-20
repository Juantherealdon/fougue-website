"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Mail,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    name: string
    quantity: number
    price: number
  }[]
  total: number
  currency: string
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  createdAt: string
  notes: string
}

// Helper function to map API status to component status
const mapOrderStatus = (apiStatus: string): Order["status"] => {
  const statusMap: Record<string, Order["status"]> = {
    paid: 'completed',
    delivered: 'completed',
    shipped: 'processing',
    processing: 'processing',
    pending: 'pending',
    cancelled: 'cancelled',
    refunded: 'refunded',
    completed: 'completed',
  }
  return statusMap[apiStatus] || 'pending'
}

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "En cours",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  completed: {
    label: "Terminé",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  refunded: {
    label: "Remboursé",
    color: "bg-gray-100 text-gray-700",
    icon: AlertCircle,
  },
}

const paymentStatusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Payé", color: "bg-green-100 text-green-700" },
  failed: { label: "Échoué", color: "bg-red-100 text-red-700" },
  refunded: { label: "Remboursé", color: "bg-gray-100 text-gray-700" },
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "Sophie Martin",
      email: "sophie.martin@email.com",
      phone: "+971 50 123 4567",
    },
    items: [{ name: "Premium Experience Voucher", quantity: 1, price: 1000 }],
    total: 1000,
    currency: "AED",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-31T10:30:00",
    notes: "Gift wrapping requested",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+971 55 987 6543",
    },
    items: [{ name: "Mystery Experience Card", quantity: 1, price: 1500 }],
    total: 1500,
    currency: "AED",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay",
    createdAt: "2024-01-31T08:15:00",
    notes: "",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Marie Claire",
      email: "marie.claire@email.com",
      phone: "+971 52 456 7890",
    },
    items: [{ name: "The Couples Collection", quantity: 1, price: 3500 }],
    total: 3500,
    currency: "AED",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Bank Transfer",
    createdAt: "2024-01-31T06:45:00",
    notes: "Delivery to DIFC requested",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Pierre Blanc",
      email: "pierre.blanc@email.com",
      phone: "+971 54 321 0987",
    },
    items: [
      { name: "Experience Voucher", quantity: 2, price: 500 },
      { name: "Romantic Escape Box", quantity: 1, price: 2200 },
    ],
    total: 3200,
    currency: "AED",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-30T14:20:00",
    notes: "",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Emma Laurent",
      email: "emma.laurent@email.com",
      phone: "+971 56 789 0123",
    },
    items: [{ name: "Instant E-Voucher", quantity: 1, price: 500 }],
    total: 500,
    currency: "AED",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-30T11:00:00",
    notes: "Send to recipient@email.com",
  },
  {
    id: "ORD-006",
    customer: {
      name: "Lucas Bernard",
      email: "lucas.bernard@email.com",
      phone: "+971 50 567 8901",
    },
    items: [{ name: "Anniversary Special", quantity: 1, price: 4500 }],
    total: 4500,
    currency: "AED",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-29T16:30:00",
    notes: "Customer requested cancellation",
  },
]

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ordersPerPage = 10

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/orders', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes')
      }
      const data = await response.json()
      
      if (!data || !Array.isArray(data)) {
        console.error('[v0] Invalid data format:', data)
        setOrders([])
        return
      }

      // Create safe copy to avoid serialization issues
      const safeData = JSON.parse(JSON.stringify(data))

      // Map API data to component format with proper date serialization
      const mappedOrders: Order[] = safeData.map((order: any) => ({
        id: order.id || '',
        customer: {
          name: order.customerName || 'N/A',
          email: order.customerEmail || 'N/A',
          phone: order.shippingAddress?.phone || 'N/A',
        },
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          name: item.title || item.name || item.t || 'Produit',
          quantity: item.quantity || item.q || 1,
          price: item.price || item.p || 0,
        })) : [],
        total: order.totalAmount || 0,
        currency: order.currency || 'AED',
        status: mapOrderStatus(order.status),
        paymentStatus: ['paid', 'delivered', 'shipped', 'completed'].includes(order.status) ? 'paid' : 'pending',
        paymentMethod: 'Stripe',
        createdAt: typeof order.createdAt === 'string' ? order.createdAt : new Date(order.createdAt).toISOString(),
        notes: '',
      }))
      setOrders(mappedOrders)
    } catch (error) {
      console.error('[v0] Error fetching orders:', error)
      setError('Erreur de chargement des commandes. Veuillez réessayer.')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and set up auto-refresh every 30 seconds
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const filteredOrders = orders && orders.length > 0 ? orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const totalPages = filteredOrders.length > 0 ? Math.ceil(filteredOrders.length / ordersPerPage) : 1
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  )

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date invalide'
      }
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return 'Date invalide'
    }
  }

  const totalRevenue = orders && orders.length > 0
    ? orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0)
    : 0

  const pendingOrders = orders && orders.length > 0 ? orders.filter((o) => o.status === "pending").length : 0
  const processingOrders = orders && orders.length > 0 ? orders.filter((o) => o.status === "processing").length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Gestion des <span className="text-[#800913]">Commandes</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {orders.length} commande{orders.length > 1 ? "s" : ""} au total
            {isLoading && <span className="ml-2 text-[#800913]">• Actualisation...</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-[#1E1E1E]/10 bg-transparent"
            onClick={fetchOrders}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" className="border-[#1E1E1E]/10 bg-transparent">
            <Download size={18} className="mr-2" />
            Exporter CSV
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
      {isLoading && orders.length === 0 && (
        <div className="p-8 text-center text-[#1E1E1E]/60">
          Chargement des commandes...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!orders || orders.length === 0) && !error && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <Package size={48} className="mx-auto text-[#1E1E1E]/20 mb-4" />
            <p className="text-[#1E1E1E] font-medium">Aucune commande trouvée</p>
            <p className="text-[#1E1E1E]/60 text-sm mt-1">Les commandes apparaîtront ici après le premier achat</p>
          </CardContent>
        </Card>
      )}

      {/* Stats - Only show if we have data */}
      {!isLoading && orders && orders.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">Chiffre d'affaires</p>
              <p className="text-2xl font-medium text-[#1E1E1E]">
                AED {totalRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">Total commandes</p>
              <p className="text-2xl font-medium text-[#1E1E1E]">{orders.length}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">En attente</p>
              <p className="text-2xl font-medium text-yellow-600">{pendingOrders}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-[#1E1E1E]/60">En cours</p>
              <p className="text-2xl font-medium text-blue-600">{processingOrders}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {!isLoading && orders && orders.length > 0 && (
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
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="refunded">Remboursé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Orders Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F8F8] border-b border-[#1E1E1E]/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Commande
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Articles
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]/5">
              {paginatedOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <tr key={order.id} className="hover:bg-[#F8F8F8]">
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#1E1E1E]">{order.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1E1E1E]">
                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60 line-clamp-1">
                        {order.items.map((i) => i.name).join(", ")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {order.currency} {order.total.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs px-2 py-1 ${
                          paymentStatusConfig[order.paymentStatus].color
                        }`}
                      >
                        {paymentStatusConfig[order.paymentStatus].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 ${
                          statusConfig[order.status].color
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1E1E1E]/60">
                        {formatDate(order.createdAt)}
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
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye size={14} className="mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail size={14} className="mr-2" />
                            Envoyer email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "processing")}
                          >
                            Marquer en cours
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "completed")}
                          >
                            Marquer terminé
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            className="text-red-600"
                          >
                            Annuler
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E1E1E]/10">
            <p className="text-sm text-[#1E1E1E]/60">
              Affichage de {(currentPage - 1) * ordersPerPage + 1} à{" "}
              {Math.min(currentPage * ordersPerPage, filteredOrders.length)} sur{" "}
              {filteredOrders.length} commandes
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

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commande {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Créée le {selectedOrder && formatDate(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E] mb-2">Client</p>
                  <p className="text-sm">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-[#1E1E1E]/60">
                    {selectedOrder.customer.email}
                  </p>
                  <p className="text-sm text-[#1E1E1E]/60">
                    {selectedOrder.customer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E] mb-2">Paiement</p>
                  <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  <span
                    className={`inline-block text-xs px-2 py-1 mt-1 ${
                      paymentStatusConfig[selectedOrder.paymentStatus].color
                    }`}
                  >
                    {paymentStatusConfig[selectedOrder.paymentStatus].label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-medium text-[#1E1E1E] mb-2">Articles</p>
                <div className="border border-[#1E1E1E]/10 divide-y divide-[#1E1E1E]/10">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-[#1E1E1E]/60">
                          Qté: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {selectedOrder.currency} {item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-[#F8F8F8]">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-lg font-medium text-[#800913]">
                      {selectedOrder.currency} {selectedOrder.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E] mb-2">Notes</p>
                  <p className="text-sm text-[#1E1E1E]/60 p-3 bg-[#F8F8F8]">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-sm font-medium text-[#1E1E1E] mb-2">
                  Mettre à jour le statut
                </p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    updateOrderStatus(selectedOrder.id, value as Order["status"])
                  }
                >
                  <SelectTrigger className="border-[#1E1E1E]/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="refunded">Remboursé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
