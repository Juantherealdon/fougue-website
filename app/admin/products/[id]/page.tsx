"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Eye,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  id: string
  title: string
  price: number
  currency: string
  category: string
  subcategories: string[]
  images: string[]
  description: string
  longDescription: string
  details: string[]
  includes: string[]
  stock: number
  active: boolean
  seoTitle: string
  seoDescription: string
}

interface Subcategory {
  id: string
  name: string
}

const defaultProduct: Product = {
  id: "",
  title: "",
  price: 0,
  currency: "AED",
  category: "gift-cards",
  subcategories: [],
  images: [],
  description: "",
  longDescription: "",
  details: [""],
  includes: [""],
  stock: 999,
  active: true,
  seoTitle: "",
  seoDescription: "",
}

const existingProducts: Record<string, Product> = {
  "experience-voucher-500": {
    id: "experience-voucher-500",
    title: "Experience Voucher",
    price: 500,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/letter-seal.jpg", "/images/gift-door.jpg"],
    description:
      "An elegant voucher redeemable for any Fougue. experience.",
    longDescription:
      "An elegant voucher redeemable for any Fougue. experience. Presented in our signature wax-sealed envelope with a personalized message card. The perfect gift for someone who appreciates thoughtful gestures and unforgettable experiences.",
    details: [
      "Valid for 12 months from purchase",
      "Redeemable for any experience",
      "Non-refundable",
    ],
    includes: [
      "Wax-sealed presentation envelope",
      "Personalized message card",
      "Digital confirmation",
      "Concierge booking assistance",
    ],
    stock: 999,
    active: true,
    seoTitle: "Experience Voucher AED 500 | Fougue Gift Collection",
    seoDescription:
      "Gift an unforgettable experience with our elegant voucher. Valid for any Fougue experience in Dubai.",
  },
  "couples-collection-classic": {
    id: "couples-collection-classic",
    title: "The Couples Collection",
    price: 3500,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/gift-door.jpg", "/images/hero-couple-dinner.jpg"],
    description:
      "Two complete experiences for couples who deserve it all.",
    longDescription:
      "Two complete experiences for couples who deserve it all. Includes French Rendez-vous and L'Interlude Français with complimentary champagne. Perfect for anniversaries, birthdays, or just because.",
    details: [
      "Valid for 12 months",
      "Flexible scheduling",
      "Experiences can be booked separately",
      "Premium upgrades available",
    ],
    includes: [
      "French Rendez-vous experience",
      "L'Interlude Français experience",
      "Complimentary Moët & Chandon",
      "Luxury presentation box",
      "Priority booking",
    ],
    stock: 25,
    active: true,
    seoTitle: "The Couples Collection | Fougue Gift Collection",
    seoDescription:
      "Two complete romantic experiences for couples. French Rendez-vous and L'Interlude Français with complimentary champagne.",
  },
}

export default function ProductEditor() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === "new"

  const [product, setProduct] = useState<Product>(defaultProduct)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [newSubcategory, setNewSubcategory] = useState("")
  const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (!isNew && params.id) {
        try {
          const response = await fetch(`/api/products/${params.id}`)
          if (response.ok) {
            const data = await response.json()
            
            // Map database fields to form fields
            setProduct({
              id: data.id,
              title: data.name || '',
              price: Number(data.price) || 0,
              currency: data.currency || 'AED',
              category: data.category || 'gift-cards',
              subcategories: data.subcategories || (data.subcategory ? [data.subcategory] : []),
              images: data.images || [],
              description: data.description || '',
              longDescription: data.long_description || '',
              details: data.badges || [''],
              includes: [],
              stock: data.stock || 0,
              active: data.available ?? false,
              seoTitle: data.seo_title || '',
              seoDescription: data.seo_description || '',
            })
          } else {
            // Fallback to existing data
            const existing = existingProducts[params.id as string]
            if (existing) {
              setProduct(existing)
            }
          }
        } catch (error) {
          console.error("Error loading product:", error)
          // Fallback to existing data
          const existing = existingProducts[params.id as string]
          if (existing) {
            setProduct(existing)
          }
        }
      }
    }
    
    loadProduct()
    
    // Load subcategories
    const loadSubcategories = async () => {
      try {
        const response = await fetch('/api/product-subcategories')
        if (response.ok) {
          const data = await response.json()
          setSubcategories(data)
        }
      } catch (error) {
        console.error('Error loading subcategories:', error)
      }
    }
    loadSubcategories()
  }, [isNew, params.id])

  const handleCreateSubcategory = async () => {
    if (!newSubcategory.trim()) return
    
    try {
      const response = await fetch('/api/product-subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubcategory.trim() }),
      })
      
      if (response.ok) {
        const created = await response.json()
        setSubcategories(prev => [...prev, created])
        setProduct(prev => ({
          ...prev,
          subcategories: prev.subcategories.includes(created.name)
            ? prev.subcategories
            : [...prev.subcategories, created.name]
        }))
        setNewSubcategory('')
        setShowNewSubcategoryInput(false)
      }
    } catch (error) {
      console.error('Error creating subcategory:', error)
    }
  }

  const [showManageSubcategories, setShowManageSubcategories] = useState(false)

  const handleDeleteSubcategory = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/product-subcategories?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSubcategories(prev => prev.filter(s => s.id !== id))
        // Also remove from current product if it was selected
        setProduct(prev => ({
          ...prev,
          subcategories: prev.subcategories.filter(s => s !== name),
        }))
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Map form fields to database fields
      const dbData = {
        name: product.title,
        description: product.description,
        long_description: product.longDescription,
        price: Number(product.price),
        currency: product.currency,
        category: product.category,
        subcategory: product.subcategories[0] || null,
        subcategories: product.subcategories,
        stock: Number(product.stock),
        available: product.active,
        images: product.images,
        badges: product.details.filter(d => d.trim() !== ''),
        seo_title: product.seoTitle,
        seo_description: product.seoDescription,
      }
      
      const method = isNew ? "POST" : "PUT"
      const url = isNew ? "/api/products" : `/api/products/${params.id}`
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Erreur: ${error.error || "Erreur inconnue"}`)
        setIsSaving(false)
        return
      }
      
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Erreur lors de l'enregistrement")
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }))
        } else {
          const error = await response.json()
          alert(`Erreur d'upload: ${error.error}`)
        }
      } catch (error) {
        console.error("Upload error:", error)
        alert("Erreur lors de l'upload de l'image")
      }
    }
    
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addListItem = (field: "details" | "includes") => {
    setProduct((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateListItem = (
    field: "details" | "includes",
    index: number,
    value: string
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeListItem = (field: "details" | "includes", index: number) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-[#1E1E1E]/5 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#1E1E1E]" />
          </Link>
          <div>
            <h1 className="text-2xl font-light text-[#1E1E1E]">
              {isNew ? "Nouveau produit" : "Modifier le produit"}
            </h1>
            <p className="text-[#1E1E1E]/60 mt-1">
              {isNew ? "Créez un nouveau produit" : product.title || "Sans titre"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Link href="/gifts" target="_blank">
              <Button variant="outline" className="border-[#1E1E1E]/10 bg-transparent">
                <Eye size={18} className="mr-2" />
                Voir sur le site
              </Button>
            </Link>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#800913] hover:bg-[#600910] text-white"
          >
            <Save size={18} className="mr-2" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-[#1E1E1E]/10 p-1">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            Général
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            Contenu
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            Médias
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            SEO
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nom du produit</Label>
                  <Input
                    id="title"
                    value={product.title}
                    onChange={(e) =>
                      setProduct((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Ex: Experience Voucher"
                    className="border-[#1E1E1E]/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description courte</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description brève du produit..."
                    rows={3}
                    className="border-[#1E1E1E]/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={product.category}
                    onValueChange={(value) =>
                      setProduct((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="border-[#1E1E1E]/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gift-cards">
                        Cartes cadeaux & Vouchers
                      </SelectItem>
                      <SelectItem value="couple-gifts">Cadeaux couple</SelectItem>
                      <SelectItem value="digital-gifts">
                        Cadeaux digitaux
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Sous-catégories</Label>
                  
                  {/* Selected subcategories as chips */}
                  {product.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2">
                      {product.subcategories.map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF5EF] text-[#1E1E1E] text-sm rounded-md border border-[#1E1E1E]/10"
                        >
                          {sub}
                          <button
                            type="button"
                            onClick={() =>
                              setProduct((prev) => ({
                                ...prev,
                                subcategories: prev.subcategories.filter((s) => s !== sub),
                              }))
                            }
                            className="p-0.5 hover:text-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add subcategory */}
                  {showNewSubcategoryInput ? (
                    <div className="flex gap-2">
                      <Input
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="Nom de la sous-catégorie..."
                        className="border-[#1E1E1E]/10"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleCreateSubcategory()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateSubcategory}
                        className="bg-[#800913] hover:bg-[#600910]"
                      >
                        <Plus size={16} />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowNewSubcategoryInput(false)
                          setNewSubcategory('')
                        }}
                        className="bg-transparent"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !product.subcategories.includes(value)) {
                            setProduct((prev) => ({
                              ...prev,
                              subcategories: [...prev.subcategories, value],
                            }))
                          }
                        }}
                      >
                        <SelectTrigger className="border-[#1E1E1E]/10">
                          <SelectValue placeholder="Ajouter une sous-catégorie..." />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories
                            .filter((sub) => !product.subcategories.includes(sub.name))
                            .map((sub) => (
                              <SelectItem key={sub.id} value={sub.name}>
                                {sub.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNewSubcategoryInput(true)}
                        className="bg-transparent shrink-0"
                        title="Créer une nouvelle sous-catégorie"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}

                  {/* Manage existing subcategories */}
                  <button
                    type="button"
                    onClick={() => setShowManageSubcategories(!showManageSubcategories)}
                    className="text-xs text-[#1E1E1E]/40 hover:text-[#1E1E1E]/70 transition-colors underline underline-offset-2"
                  >
                    {showManageSubcategories ? 'Masquer la gestion' : 'Gérer les sous-catégories'}
                  </button>

                  {showManageSubcategories && (
                    <div className="border border-[#1E1E1E]/10 rounded-lg p-3 space-y-1.5 bg-[#FBF5EF]/30">
                      <p className="text-xs text-[#1E1E1E]/40 mb-2">
                        {"Supprimer une sous-catégorie la retire définitivement de la liste et du filtre sur le site."}
                      </p>
                      {subcategories.length === 0 ? (
                        <p className="text-xs text-[#1E1E1E]/30 italic">Aucune sous-catégorie</p>
                      ) : (
                        subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1E1E1E]/5 group"
                          >
                            <span className="text-sm text-[#1E1E1E]/70">{sub.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                              className="p-1 text-[#1E1E1E]/20 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              title={`Supprimer "${sub.name}"`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Prix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="price">Montant</Label>
                      <Input
                        id="price"
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          setProduct((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        className="border-[#1E1E1E]/10"
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select
                        value={product.currency}
                        onValueChange={(value) =>
                          setProduct((prev) => ({ ...prev, currency: value }))
                        }
                      >
                        <SelectTrigger className="border-[#1E1E1E]/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantité disponible</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          stock: Number(e.target.value),
                        }))
                      }
                      className="border-[#1E1E1E]/10"
                    />
                    <p className="text-xs text-[#1E1E1E]/60">
                      Utilisez 999 pour un stock illimité
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">Actif</p>
                      <p className="text-xs text-[#1E1E1E]/60">
                        Rendre visible sur le site
                      </p>
                    </div>
                    <Switch
                      checked={product.active}
                      onCheckedChange={(checked) =>
                        setProduct((prev) => ({ ...prev, active: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Description détaillée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={product.longDescription}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    longDescription: e.target.value,
                  }))
                }
                placeholder="Description complète du produit..."
                rows={6}
                className="border-[#1E1E1E]/10"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Détails</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem("details")}
                  className="border-[#1E1E1E]/10"
                >
                  <Plus size={14} className="mr-1" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.details.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[#1E1E1E]/30 cursor-grab"
                    />
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateListItem("details", index, e.target.value)
                      }
                      placeholder="Détail..."
                      className="flex-1 border-[#1E1E1E]/10"
                    />
                    <button
                      onClick={() => removeListItem("details", index)}
                      className="p-2 text-[#1E1E1E]/40 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Includes */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Inclus</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem("includes")}
                  className="border-[#1E1E1E]/10"
                >
                  <Plus size={14} className="mr-1" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[#1E1E1E]/30 cursor-grab"
                    />
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateListItem("includes", index, e.target.value)
                      }
                      placeholder="Élément inclus..."
                      className="flex-1 border-[#1E1E1E]/10"
                    />
                    <button
                      onClick={() => removeListItem("includes", index)}
                      className="p-2 text-[#1E1E1E]/40 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Images du produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-[#800913] text-white text-xs px-2 py-1">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="aspect-square border-2 border-dashed border-[#1E1E1E]/20 hover:border-[#800913] flex flex-col items-center justify-center gap-2 text-[#1E1E1E]/40 hover:text-[#800913] transition-colors disabled:opacity-50"
                >
                  <Upload size={24} />
                  <span className="text-xs">{isUploading ? 'Upload...' : 'Ajouter'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-[#1E1E1E]/60 mt-2">
                Formats: JPG, PNG, WebP, GIF (max 5MB)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Optimisation SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Titre SEO</Label>
                <Input
                  id="seoTitle"
                  value={product.seoTitle}
                  onChange={(e) =>
                    setProduct((prev) => ({ ...prev, seoTitle: e.target.value }))
                  }
                  placeholder="Titre pour les moteurs de recherche"
                  className="border-[#1E1E1E]/10"
                />
                <p className="text-xs text-[#1E1E1E]/60">
                  {product.seoTitle.length}/60 caractères
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta description</Label>
                <Textarea
                  id="seoDescription"
                  value={product.seoDescription}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      seoDescription: e.target.value,
                    }))
                  }
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                  className="border-[#1E1E1E]/10"
                />
                <p className="text-xs text-[#1E1E1E]/60">
                  {product.seoDescription.length}/160 caractères
                </p>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-[#F8F8F8] border border-[#1E1E1E]/10">
                <p className="text-xs text-[#1E1E1E]/60 mb-2">Aperçu Google:</p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {product.seoTitle || product.title || "Titre de la page"}
                  </p>
                  <p className="text-green-700 text-sm">
                    fougue.ae/gifts/{product.id || "url-de-page"}
                  </p>
                  <p className="text-[#1E1E1E]/70 text-sm">
                    {product.seoDescription ||
                      product.description ||
                      "Description de la page."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
