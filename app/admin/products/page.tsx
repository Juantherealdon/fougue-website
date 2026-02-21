"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Check,
  X,
  CreditCard,
  Users,
  Smartphone,
  Gift,
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

interface Product {
  id: string
  title: string
  price: number
  currency: string
  category: string
  images: string[]
  description: string
  details: string[]
  includes: string[]
  stock: number
  active: boolean
  createdAt: string
}

const categories = [
  { id: "all", label: "Toutes les catégories", icon: Gift },
  { id: "gift-cards", label: "Cartes cadeaux", icon: CreditCard },
  { id: "couple-gifts", label: "Cadeaux couple", icon: Users },
  { id: "digital-gifts", label: "Cadeaux digitaux", icon: Smartphone },
]

const initialProducts: Product[] = [
  {
    id: "experience-voucher-500",
    title: "Experience Voucher",
    price: 500,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/letter-seal.jpg", "/images/gift-door.jpg"],
    description:
      "An elegant voucher redeemable for any Fougue. experience.",
    details: ["Valid for 12 months from purchase", "Redeemable for any experience"],
    includes: [
      "Wax-sealed presentation envelope",
      "Personalized message card",
      "Digital confirmation",
    ],
    stock: 999,
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "experience-voucher-1000",
    title: "Premium Experience Voucher",
    price: 1000,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/letter-seal.jpg"],
    description: "A premium voucher with priority booking and complimentary add-ons.",
    details: ["Valid for 18 months", "Priority booking privileges"],
    includes: ["Luxury gift box presentation", "Priority booking access"],
    stock: 999,
    active: true,
    createdAt: "2024-01-12",
  },
  {
    id: "mystery-experience-card",
    title: "Mystery Experience Card",
    price: 1500,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/surprise-hands.jpg"],
    description: "The ultimate surprise. We select the perfect experience.",
    details: ["Experience selected by our curators", "Sealed mystery invitation"],
    includes: ["Curator-selected experience", "Premium gift packaging"],
    stock: 50,
    active: true,
    createdAt: "2024-01-10",
  },
  {
    id: "couples-collection-classic",
    title: "The Couples Collection",
    price: 3500,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/gift-door.jpg", "/images/hero-couple-dinner.jpg"],
    description: "Two complete experiences for couples who deserve it all.",
    details: ["Valid for 12 months", "Flexible scheduling"],
    includes: ["French Rendez-vous experience", "L'Interlude Français experience"],
    stock: 25,
    active: true,
    createdAt: "2024-01-08",
  },
  {
    id: "romantic-escape-box",
    title: "Romantic Escape Box",
    price: 2200,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/gift-door.jpg"],
    description: "A curated box of romantic essentials paired with a picnic experience.",
    details: ["L'Interlude Français experience included"],
    includes: ["L'Interlude Français experience", "Premium French wine"],
    stock: 15,
    active: true,
    createdAt: "2024-01-05",
  },
  {
    id: "e-voucher-instant",
    title: "Instant E-Voucher",
    price: 500,
    currency: "AED",
    category: "digital-gifts",
    images: ["/images/letter-seal.jpg"],
    description: "Send love instantly with a digital voucher delivered to inbox.",
    details: ["Instant email delivery", "Valid for 12 months"],
    includes: ["Animated email presentation", "Digital gift card"],
    stock: 999,
    active: true,
    createdAt: "2024-01-01",
  },
]

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteModal, setDeleteModal] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products?all=true')
        if (response.ok) {
          const data = await response.json()
          
          // Map database fields to component interface
          const mappedProducts: Product[] = data.map((prod: any) => ({
            id: prod.id,
            title: prod.name,
            price: Number(prod.price) || 0,
            currency: prod.currency || 'AED',
            category: prod.category || 'other',
            images: prod.images || [],
            description: prod.description || '',
            details: prod.badges || [],
            includes: [],
            stock: prod.stock || 0,
            active: prod.available ?? true,
            createdAt: prod.created_at || '',
          }))
          
          if (mappedProducts.length > 0) {
            setProducts(mappedProducts)
          }
        }
      } catch (error) {
        console.error("Error loading products:", error)
      }
      setIsLoading(false)
    }
    
    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.active) ||
      (statusFilter === "inactive" && !product.active)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch {
      // silently fail
    }
    setDeleteModal(null)
  }

  const toggleActive = async (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    const newActive = !product.active
    // Optimistic update
    setProducts(
      products.map((p) => (p.id === id ? { ...p, active: newActive } : p))
    )
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: newActive, name: product.title, price: product.price, currency: product.currency, category: product.category, description: product.description, stock: product.stock, images: product.images, badges: product.details }),
      })
      if (!response.ok) {
        // Revert on error
        setProducts(
          products.map((p) => (p.id === id ? { ...p, active: !newActive } : p))
        )
      }
    } catch {
      setProducts(
        products.map((p) => (p.id === id ? { ...p, active: !newActive } : p))
      )
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.icon || Gift
  }

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.label || categoryId
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Gestion des <span className="text-[#800913]">Produits</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {products.length} produit{products.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#800913] hover:bg-[#600910] text-white">
            <Plus size={18} className="mr-2" />
            Nouveau produit
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
              />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#1E1E1E]/10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-[#1E1E1E]/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${
                  viewMode === "grid"
                    ? "bg-[#800913] text-white"
                    : "text-[#1E1E1E]/60 hover:text-[#1E1E1E]"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${
                  viewMode === "list"
                    ? "bg-[#800913] text-white"
                    : "text-[#1E1E1E]/60 hover:text-[#1E1E1E]"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const CategoryIcon = getCategoryIcon(product.category)
            return (
              <Card
                key={product.id}
                className="border-none shadow-sm overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    {...(index < 4 ? { priority: true } : { loading: "lazy" as const })}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 ${
                        product.active
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {product.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 bg-white/90 hover:bg-white transition-colors">
                          <MoreVertical size={16} className="text-[#1E1E1E]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/gifts`}>
                            <Eye size={14} className="mr-2" />
                            Voir sur le site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit size={14} className="mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(product.id)}>
                          {product.active ? (
                            <>
                              <X size={14} className="mr-2" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <Check size={14} className="mr-2" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy size={14} className="mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteModal(product)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryIcon size={14} className="text-white/80" />
                      <p className="text-white/80 text-xs">
                        {getCategoryLabel(product.category)}
                      </p>
                    </div>
                    <h3 className="text-white text-lg font-medium">
                      {product.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-[#1E1E1E]/60 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#800913] font-medium">
                      {product.currency} {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#1E1E1E]/60">
                      Stock: {product.stock === 999 ? "Illimité" : product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-[#1E1E1E]/10">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                    Stock
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8F8F8]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#1E1E1E]">
                            {product.title}
                          </p>
                          <p className="text-xs text-[#1E1E1E]/60 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#1E1E1E]/60">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#1E1E1E]">
                        {product.currency} {product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#1E1E1E]/60">
                        {product.stock === 999 ? "Illimité" : product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(product.id)}
                        className={`text-xs px-3 py-1 ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.active ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-[#1E1E1E]/5 transition-colors">
                            <MoreVertical
                              size={16}
                              className="text-[#1E1E1E]/60"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit size={14} className="mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteModal(product)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-[#1E1E1E]/60 mb-4">
              Aucun produit trouvé avec ces filtres.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce produit ?</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteModal?.title}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteModal && handleDelete(deleteModal.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
