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
  ChevronUp,
  ChevronDown,
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

interface AddOn {
  id: string
  name: string
  description: string
  price: number
}

interface IncludedItem {
  id: string
  title: string
  description: string
  icon: string
}

// Available icons for included items
const INCLUDED_ICONS = [
  { value: 'sparkles', label: 'Premium Setup' },
  { value: 'utensils', label: 'Food' },
  { value: 'wine', label: 'Drinks' },
  { value: 'music', label: 'Music' },
  { value: 'guitar', label: 'Live Music' },
  { value: 'camera', label: 'Photography' },
  { value: 'video', label: 'Videography' },
  { value: 'flower', label: 'Flowers' },
  { value: 'cake', label: 'Cake/Dessert' },
  { value: 'gift', label: 'Gift' },
  { value: 'car', label: 'Transport' },
  { value: 'plane', label: 'Travel' },
  { value: 'boat', label: 'Boat/Yacht' },
  { value: 'helicopter', label: 'Helicopter' },
  { value: 'tent', label: 'Tent/Glamping' },
  { value: 'bed', label: 'Accommodation' },
  { value: 'spa', label: 'Spa/Wellness' },
  { value: 'dumbbell', label: 'Fitness' },
  { value: 'palette', label: 'Art/Decoration' },
  { value: 'shirt', label: 'Dress Code' },
  { value: 'crown', label: 'VIP Service' },
  { value: 'star', label: 'Special Feature' },
  { value: 'heart', label: 'Romance' },
  { value: 'sun', label: 'Outdoor' },
  { value: 'moon', label: 'Evening/Night' },
  { value: 'chef', label: 'Private Chef' },
  { value: 'cocktail', label: 'Cocktails' },
  { value: 'candle', label: 'Ambiance' },
  { value: 'map', label: 'Location' },
  { value: 'clock', label: 'Duration' },
]

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
}

type ExperienceStatus = 'available' | 'almost_available' | 'coming_soon' | 'unavailable'

const statusLabels: Record<ExperienceStatus, string> = {
  available: 'Available',
  almost_available: 'Almost Available',
  coming_soon: 'Coming Soon',
  unavailable: 'Unavailable',
}

const statusColors: Record<ExperienceStatus, string> = {
  available: 'bg-green-100 text-green-700',
  almost_available: 'bg-blue-100 text-blue-700',
  coming_soon: 'bg-yellow-100 text-yellow-700',
  unavailable: 'bg-red-100 text-red-700',
}

interface Experience {
  id: string
  title: string
  subtitle: string
  images: string[]
  description: string
  longDescription: string
  durationHours: number
  guests: string
  highlight: string
  available: boolean
  status: ExperienceStatus
  price: number
  currency: string
  category: string // Category UUID or empty string
  includedItems: IncludedItem[]
  requirements: string[]
  addOns: AddOn[]
  location: string
  seoTitle: string
  seoDescription: string
}

const defaultExperience: Experience = {
  id: "",
  title: "",
  subtitle: "",
  images: [],
  description: "",
  longDescription: "",
  durationHours: 2,
  guests: "2 people",
  highlight: "",
  available: true,
  status: "available" as ExperienceStatus,
  price: 0,
  currency: "AED",
  category: "", // Will be set to a category UUID
  includedItems: [],
  requirements: [""],
  addOns: [],
  location: "Dubai, UAE",
  seoTitle: "",
  seoDescription: "",
}

const existingExperiences: Record<string, Experience> = {
  "interlude-francais": {
    id: "interlude-francais",
    title: "The Parisian Interlude",
    subtitle: "A Picnic Experience",
    images: ["/images/experience-picnic.jpg", "/images/hero-couple-dinner.jpg"],
    description:
      "Escape into nature with French elegance. A curated picnic featuring artisanal cheeses, fresh baguettes, and champagne.",
    longDescription:
      "Escape into nature with French elegance. A curated picnic featuring artisanal cheeses, fresh baguettes, and champagne, set in a dreamy location chosen just for you. Let the afternoon unfold without rush. Our team will set up a beautiful picnic scene complete with vintage blankets, cushions, and elegant tableware. Enjoy a carefully curated selection of French delicacies paired with premium champagne as you create unforgettable memories together.",
    durationHours: 2.5,
    guests: "2 people",
    highlight: "Sunset timing available",
    available: true,
    price: 1500,
    currency: "AED",
    category: "outdoor",
    includedItems: [
      { id: '1', title: 'Premium French champagne', description: 'Selection of fine champagnes', icon: 'wine' },
      { id: '2', title: 'Artisanal cheese selection', description: 'Curated French cheeses', icon: 'utensils' },
      { id: '3', title: 'Fresh baguettes', description: 'Freshly baked accompaniments', icon: 'utensils' },
      { id: '4', title: 'Elegant picnic setup', description: 'Premium blankets and tableware', icon: 'sparkles' },
    ],
    requirements: [
      "Comfortable outdoor attire recommended",
      "Weather-dependent experience",
      "24-hour cancellation policy",
    ],
    addOns: [
      {
        id: "champagne-upgrade",
        name: "Champagne Premium Upgrade",
        description: "Upgrade to Dom Perignon or Veuve Clicquot La Grande Dame",
        price: 450,
        available: true,
      },
      {
        id: "flower-bouquet",
        name: "Bouquet de fleurs",
        description: "Bouquet de roses fraîches livré avec l'expérience",
        price: 200,
        available: true,
      },
      {
        id: "photographer",
        name: "Photographe professionnel",
        description: "30 minutes de shooting photo avec retouches incluses",
        price: 500,
        available: true,
      },
      {
        id: "extended-time",
        name: "Extension 1 heure",
        description: "Prolongez votre expérience d'une heure supplémentaire",
        price: 300,
        available: false,
      },
    ],
    location: "Secret garden location, Dubai",
    seoTitle: "The Parisian Interlude - Romantic Picnic Experience | Fougue",
    seoDescription:
      "Escape into nature with French elegance. Experience a curated picnic with artisanal cheeses, champagne, and romantic ambiance in Dubai.",
  },
  "french-rendez-vous": {
    id: "french-rendez-vous",
    title: "French Rendez-vous",
    subtitle: "An Intimate Dinner Experience",
    images: ["/images/hero-couple-dinner.jpg", "/images/couple-dancing.jpg"],
    description:
      "Transport yourselves to a candlelit Parisian evening with exquisite cuisine and vintage wines.",
    longDescription:
      "Transport yourselves to a candlelit Parisian evening. This intimate dinner experience recreates the romance of France with exquisite cuisine, vintage wines, and an atmosphere that whispers of love stories waiting to unfold. Our private chef will prepare a multi-course French menu while our sommelier pairs each dish with carefully selected wines.",
    durationHours: 3.5,
    guests: "2 people",
    highlight: "Private chef & sommelier",
    available: false,
    price: 2500,
    currency: "AED",
    category: "dining",
    includedItems: [
      { id: '1', title: '5-course French tasting menu', description: 'Exquisite culinary journey', icon: 'utensils' },
      { id: '2', title: 'Wine pairing by sommelier', description: 'Selected wines for each course', icon: 'wine' },
      { id: '3', title: 'Private chef experience', description: 'Personal culinary service', icon: 'chef' },
      { id: '4', title: 'Live background music', description: 'Ambient French melodies', icon: 'music' },
    ],
    requirements: [
      "Formal attire recommended",
      "Dietary restrictions must be communicated 48h in advance",
      "48-hour cancellation policy",
    ],
    addOns: [
      {
        id: "wine-upgrade",
        name: "Upgrade vins premium",
        description: "Selection de grands crus et vins de prestige",
        price: 600,
        available: true,
      },
      {
        id: "live-musician",
        name: "Musicien live",
        description: "Violoniste ou pianiste pendant le dîner",
        price: 800,
        available: true,
      },
      {
        id: "dessert-extra",
        name: "Plateau de desserts supplémentaire",
        description: "Selection de mignardises et macarons",
        price: 150,
        available: true,
      },
    ],
    location: "Private venue, Dubai",
    seoTitle: "French Rendez-vous - Intimate Dinner Experience | Fougue",
    seoDescription:
      "Experience a candlelit Parisian evening with private chef, sommelier, and romantic ambiance in Dubai.",
  },
}

export default function ExperienceEditor() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === "new"

  const [experience, setExperience] = useState<Experience>(defaultExperience)
  const [categories, setCategories] = useState<Category[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
          console.log("[v0] Loaded categories:", data)
        }
      } catch (error) {
        console.error("[v0] Error loading categories:", error)
      }
    }
    
    loadCategories()
  }, [])

  useEffect(() => {
    const loadExperience = async () => {
      if (!isNew && params.id) {
        console.log("[v0] Loading experience:", params.id)
        try {
          const response = await fetch(`/api/experiences/${params.id}`)
          if (response.ok) {
            const data = await response.json()
            
            // Map database fields to frontend fields
            const mappedData: Experience = {
              id: data.id,
              title: data.title || '',
              subtitle: data.subtitle || '',
              images: data.images || [],
              description: data.description || '',
              longDescription: data.long_description || '',
              durationHours: Number(data.duration_hours) || 2,
              guests: data.guests || '2 people',
              highlight: data.highlight || '',
              available: data.available ?? true,
              status: (data.status || (data.available ? 'available' : 'unavailable')) as ExperienceStatus,
              price: Number(data.price) || 0,
              currency: data.currency || 'AED',
              category: data.category_id || '',
              includedItems: Array.isArray(data.included_items) ? data.included_items.map((item: any) => ({
                id: item.id,
                title: item.title || '',
                description: item.description || '',
                icon: item.icon || 'sparkles',
              })) : [],
              requirements: Array.isArray(data.requirements) ? data.requirements : [''],
              addOns: Array.isArray(data.addons) ? data.addons.map((addon: any) => ({
                id: addon.id,
                name: addon.name || '',
                description: addon.description || '',
                price: Number(addon.price) || 0,
                available: addon.available ?? true,
              })) : [],
              location: data.location || 'Dubai, UAE',
              seoTitle: data.seo_title || '',
              seoDescription: data.seo_description || '',
            }
            
            setExperience(mappedData)
          } else {
            // Fallback to existing data if API fails
            const existing = existingExperiences[params.id as string]
            if (existing) {
              setExperience(existing)
            }
          }
        } catch {
          // Fallback to existing data if API fails
          const existing = existingExperiences[params.id as string]
          if (existing) {
            setExperience(existing)
          }
        }
      }
    }
    
    loadExperience()
  }, [isNew, params.id])

  const handleSave = async () => {
    setIsSaving(true)
    console.log("[v0] Saving experience:", experience)
    
    try {
      // Map frontend fields to database fields
      const dbData = {
        title: experience.title,
        subtitle: experience.subtitle,
        slug: experience.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: experience.description,
        long_description: experience.longDescription,
        duration_hours: experience.durationHours,
        guests: experience.guests,
        highlight: experience.highlight,
        price: Number(experience.price),
        currency: experience.currency,
        category_id: experience.category || null, // Use null if no category selected
        location: experience.location,
        available: experience.status === 'available' || experience.status === 'almost_available',
        status: experience.status,
        featured: false,
        images: experience.images,
        included_items: experience.includedItems.filter(item => item.title.trim() !== '').map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
        })),
        requirements: experience.requirements.filter(item => item.trim() !== ''),
        seo_title: experience.seoTitle,
        seo_description: experience.seoDescription,
        addons: experience.addOns.map(addon => ({
          id: addon.id,
          name: addon.name,
          description: addon.description,
          price: Number(addon.price),
          available: addon.available,
        })),
      }
      
      const method = isNew ? "POST" : "PUT"
      const url = isNew ? "/api/experiences" : `/api/experiences/${params.id}`
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dbData),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Erreur lors de l'enregistrement: ${error.error || "Erreur inconnue"}`)
        setIsSaving(false)
        return
      }

      router.push("/admin/experiences")
    } catch (error) {
      console.error("[v0] Error saving experience:", error)
      alert("Erreur lors de l'enregistrement. Vérifiez la console pour plus de détails.")
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
          setExperience((prev) => ({
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
    setExperience((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addListItem = (field: "includes" | "requirements") => {
    setExperience((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateListItem = (
    field: "includes" | "requirements",
    index: number,
    value: string
  ) => {
    setExperience((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeListItem = (field: "includes" | "requirements", index: number) => {
    setExperience((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const addAddOn = () => {
    const newAddOn: AddOn = {
      id: `addon-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      available: true,
    }
    setExperience((prev) => ({
      ...prev,
      addOns: [...prev.addOns, newAddOn],
    }))
  }

  const updateAddOn = (index: number, field: keyof AddOn, value: string | number | boolean) => {
    setExperience((prev) => ({
      ...prev,
      addOns: prev.addOns.map((addon, i) =>
        i === index ? { ...addon, [field]: value } : addon
      ),
    }))
  }

  const removeAddOn = (index: number) => {
  setExperience((prev) => ({
  ...prev,
  addOns: prev.addOns.filter((_, i) => i !== index),
  }))
  }

  const moveIncludedItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    setExperience((prev) => {
      const newItems = [...prev.includedItems]
      const temp = newItems[index]
      newItems[index] = newItems[newIndex]
      newItems[newIndex] = temp
      return { ...prev, includedItems: newItems }
    })
  }

  const moveAddOn = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    setExperience((prev) => {
      const newAddOns = [...prev.addOns]
      const temp = newAddOns[index]
      newAddOns[index] = newAddOns[newIndex]
      newAddOns[newIndex] = temp
      return { ...prev, addOns: newAddOns }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/experiences"
            className="p-2 hover:bg-[#1E1E1E]/5 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#1E1E1E]" />
          </Link>
          <div>
            <h1 className="text-2xl font-light text-[#1E1E1E]">
              {isNew ? "Nouvelle expérience" : "Modifier l'expérience"}
            </h1>
            <p className="text-[#1E1E1E]/60 mt-1">
              {isNew
                ? "Créez une nouvelle expérience"
                : experience.title || "Sans titre"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Link href={`/experiences/${experience.id}`} target="_blank">
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
            value="addons"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            Add-ons
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={experience.title}
                      onChange={(e) =>
                        setExperience((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Ex: The Parisian Interlude"
                      className="border-[#1E1E1E]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Sous-titre</Label>
                    <Input
                      id="subtitle"
                      value={experience.subtitle}
                      onChange={(e) =>
                        setExperience((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      placeholder="Ex: A Picnic Experience"
                      className="border-[#1E1E1E]/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description courte</Label>
                  <Textarea
                    id="description"
                    value={experience.description}
                    onChange={(e) =>
                      setExperience((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description brève de l'expérience..."
                    rows={3}
                    className="border-[#1E1E1E]/10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={experience.category}
                      onValueChange={(value) =>
                        setExperience((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="border-[#1E1E1E]/10">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Aucune catégorie</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationHours">Durée (heures)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="durationHours"
                        type="number"
                        min="0.5"
                        max="24"
                        step="0.5"
                        value={experience.durationHours}
                        onChange={(e) =>
                          setExperience((prev) => ({
                            ...prev,
                            durationHours: Number(e.target.value),
                          }))
                        }
                        className="border-[#1E1E1E]/10 w-24"
                      />
                      <span className="text-[#1E1E1E]/60">hours</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Invités</Label>
                    <Input
                      id="guests"
                      value={experience.guests}
                      onChange={(e) =>
                        setExperience((prev) => ({
                          ...prev,
                          guests: e.target.value,
                        }))
                      }
                      placeholder="Ex: 2 people"
                      className="border-[#1E1E1E]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="highlight">Point fort</Label>
                    <Input
                      id="highlight"
                      value={experience.highlight}
                      onChange={(e) =>
                        setExperience((prev) => ({
                          ...prev,
                          highlight: e.target.value,
                        }))
                      }
                      placeholder="Ex: Sunset timing available"
                      className="border-[#1E1E1E]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      value={experience.location}
                      onChange={(e) =>
                        setExperience((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Ex: Dubai, UAE"
                      className="border-[#1E1E1E]/10"
                    />
                  </div>
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
                        value={experience.price}
                        onChange={(e) =>
                          setExperience((prev) => ({
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
                        value={experience.currency}
                        onValueChange={(value) =>
                          setExperience((prev) => ({ ...prev, currency: value }))
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

              {/* Status */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={experience.status}
                    onValueChange={(value) =>
                      setExperience((prev) => ({
                        ...prev,
                        status: value as ExperienceStatus,
                        available: value === 'available' || value === 'almost_available',
                      }))
                    }
                  >
                    <SelectTrigger className={`w-full ${statusColors[experience.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabels) as ExperienceStatus[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[key]}`}>
                            {statusLabels[key]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1E1E1E]/10">
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('longDescription') as HTMLTextAreaElement
                    if (!textarea) return
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const text = experience.longDescription
                    const selectedText = text.substring(start, end)
                    if (selectedText) {
                      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**')
                      const newText = isBold
                        ? text.substring(0, start) + selectedText.slice(2, -2) + text.substring(end)
                        : text.substring(0, start) + `**${selectedText}**` + text.substring(end)
                      setExperience(prev => ({ ...prev, longDescription: newText }))
                      setTimeout(() => {
                        textarea.focus()
                        const offset = isBold ? -2 : 2
                        textarea.setSelectionRange(start, end + offset * 2)
                      }, 0)
                    }
                  }}
                  className="px-3 py-1.5 text-sm font-bold border border-[#1E1E1E]/10 rounded hover:bg-[#1E1E1E]/5 transition-colors"
                  title="Gras (selectionnez du texte puis cliquez)"
                >
                  B
                </button>
                <span className="text-xs text-[#1E1E1E]/40 ml-2">
                  {"Selectionnez du texte puis cliquez B pour mettre en gras. Syntaxe : **texte en gras**"}
                </span>
              </div>
              <Textarea
                id="longDescription"
                value={experience.longDescription}
                onChange={(e) =>
                  setExperience((prev) => ({
                    ...prev,
                    longDescription: e.target.value,
                  }))
                }
                placeholder="Description complète de l'expérience..."
                rows={10}
                className="border-[#1E1E1E]/10 font-mono text-sm"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Includes */}
            <Card className="border-none shadow-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Inclus</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setExperience(prev => ({
                      ...prev,
                      includedItems: [...prev.includedItems, { id: `new-${Date.now()}`, title: '', description: '', icon: 'sparkles' }]
                    }))
                  }}
                  className="border-[#1E1E1E]/10"
                >
                  <Plus size={14} className="mr-1" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.includedItems.map((item, index) => (
                  <div key={item.id || index} className="p-4 bg-[#FBF5EF]/50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveIncludedItem(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 rounded hover:bg-[#1E1E1E]/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Monter"
                        >
                          <ChevronUp size={14} className="text-[#1E1E1E]/50" />
                        </button>
                        <span className="text-[10px] text-[#1E1E1E]/30 font-medium leading-none">{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => moveIncludedItem(index, 'down')}
                          disabled={index === experience.includedItems.length - 1}
                          className="p-0.5 rounded hover:bg-[#1E1E1E]/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Descendre"
                        >
                          <ChevronDown size={14} className="text-[#1E1E1E]/50" />
                        </button>
                      </div>
                      
                      {/* Icon Selector */}
                      <select
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...experience.includedItems]
                          newItems[index] = { ...newItems[index], icon: e.target.value }
                          setExperience(prev => ({ ...prev, includedItems: newItems }))
                        }}
                        className="px-3 py-2 border border-[#1E1E1E]/10 rounded-md text-sm bg-white"
                      >
                        {INCLUDED_ICONS.map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                      
                      {/* Title */}
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...experience.includedItems]
                          newItems[index] = { ...newItems[index], title: e.target.value }
                          setExperience(prev => ({ ...prev, includedItems: newItems }))
                        }}
                        placeholder="Titre de l'élément..."
                        className="flex-1 border-[#1E1E1E]/10"
                      />
                      
                      <button
                        onClick={() => {
                          setExperience(prev => ({
                            ...prev,
                            includedItems: prev.includedItems.filter((_, i) => i !== index)
                          }))
                        }}
                        className="p-2 text-[#1E1E1E]/40 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Description */}
                    <div className="pl-9">
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...experience.includedItems]
                          newItems[index] = { ...newItems[index], description: e.target.value }
                          setExperience(prev => ({ ...prev, includedItems: newItems }))
                        }}
                        placeholder="Description courte (optionnel)..."
                        className="border-[#1E1E1E]/10 text-sm"
                      />
                    </div>
                  </div>
                ))}
                {experience.includedItems.length === 0 && (
                  <p className="text-[#1E1E1E]/40 text-sm text-center py-4">
                    Aucun élément inclus. Cliquez sur "Ajouter" pour en créer un.
                  </p>
                )}
              </CardContent>
            </Card>


          </div>
        </TabsContent>

        {/* Add-ons Tab */}
        <TabsContent value="addons" className="space-y-6 mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium">
                  Options supplémentaires (Add-ons)
                </CardTitle>
                <p className="text-sm text-[#1E1E1E]/60 mt-1">
                  Configurez les options payantes que les clients peuvent ajouter à leur réservation
                </p>
              </div>
              <Button
                onClick={addAddOn}
                className="bg-[#800913] hover:bg-[#600910] text-white"
              >
                <Plus size={16} className="mr-2" />
                Ajouter un add-on
              </Button>
            </CardHeader>
            <CardContent>
              {experience.addOns.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#1E1E1E]/10 rounded-lg">
                  <p className="text-[#1E1E1E]/40 mb-4">Aucun add-on configuré</p>
                  <Button
                    onClick={addAddOn}
                    variant="outline"
                    className="border-[#1E1E1E]/20 bg-transparent"
                  >
                    <Plus size={16} className="mr-2" />
                    Créer votre premier add-on
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.addOns.map((addon, index) => (
                    <div
                      key={addon.id}
                      className="border border-[#1E1E1E]/10 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => moveAddOn(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-[#1E1E1E]/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Monter"
                          >
                            <ChevronUp size={16} className="text-[#1E1E1E]/50" />
                          </button>
                          <span className="text-xs text-[#1E1E1E]/30 font-medium">{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => moveAddOn(index, 'down')}
                            disabled={index === experience.addOns.length - 1}
                            className="p-1 rounded hover:bg-[#1E1E1E]/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Descendre"
                          >
                            <ChevronDown size={16} className="text-[#1E1E1E]/50" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`addon-name-${index}`}>
                                Nom de l'option
                              </Label>
                              <Input
                                id={`addon-name-${index}`}
                                value={addon.name}
                                onChange={(e) =>
                                  updateAddOn(index, "name", e.target.value)
                                }
                                placeholder="Ex: Champagne Premium"
                                className="border-[#1E1E1E]/10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`addon-price-${index}`}>
                                Prix ({experience.currency})
                              </Label>
                              <Input
                                id={`addon-price-${index}`}
                                type="number"
                                value={addon.price}
                                onChange={(e) =>
                                  updateAddOn(index, "price", Number(e.target.value))
                                }
                                placeholder="0"
                                className="border-[#1E1E1E]/10"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`addon-desc-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`addon-desc-${index}`}
                              value={addon.description}
                              onChange={(e) =>
                                updateAddOn(index, "description", e.target.value)
                              }
                              placeholder="Décrivez cette option..."
                              rows={2}
                              className="border-[#1E1E1E]/10"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={addon.available}
                                onCheckedChange={(checked) =>
                                  updateAddOn(index, "available", checked)
                                }
                              />
                              <span className="text-sm text-[#1E1E1E]/70">
                                {addon.available ? "Disponible" : "Indisponible"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAddOn(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {experience.addOns.length > 0 && (
                <div className="mt-6 p-4 bg-[#F8F8F8] rounded-lg">
                  <p className="text-sm font-medium text-[#1E1E1E] mb-2">
                    Résumé des add-ons
                  </p>
                  <div className="space-y-1">
                    {experience.addOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className={addon.available ? "text-[#1E1E1E]" : "text-[#1E1E1E]/40 line-through"}>
                          {addon.name || "Sans nom"}
                        </span>
                        <span className={addon.available ? "font-medium text-[#800913]" : "text-[#1E1E1E]/40"}>
                          +{addon.price} {experience.currency}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-[#1E1E1E]/10 pt-2 mt-2">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total add-ons disponibles</span>
                        <span>
                          {experience.addOns.filter((a) => a.available).length} / {experience.addOns.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Images de l'expérience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {experience.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
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
              <p className="text-xs text-[#1E1E1E]/60 mt-4">
                Glissez pour réorganiser. La première image sera utilisée comme
                image principale. Formats: JPG, PNG, WebP, GIF (max 5MB).
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
                  value={experience.seoTitle}
                  onChange={(e) =>
                    setExperience((prev) => ({
                      ...prev,
                      seoTitle: e.target.value,
                    }))
                  }
                  placeholder="Titre pour les moteurs de recherche"
                  className="border-[#1E1E1E]/10"
                />
                <p className="text-xs text-[#1E1E1E]/60">
                  {experience.seoTitle.length}/60 caractères
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta description</Label>
                <Textarea
                  id="seoDescription"
                  value={experience.seoDescription}
                  onChange={(e) =>
                    setExperience((prev) => ({
                      ...prev,
                      seoDescription: e.target.value,
                    }))
                  }
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                  className="border-[#1E1E1E]/10"
                />
                <p className="text-xs text-[#1E1E1E]/60">
                  {experience.seoDescription.length}/160 caractères
                </p>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-[#F8F8F8] border border-[#1E1E1E]/10">
                <p className="text-xs text-[#1E1E1E]/60 mb-2">
                  Aperçu Google:
                </p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {experience.seoTitle || experience.title || "Titre de la page"}
                  </p>
                  <p className="text-green-700 text-sm">
                    fougue.ae/experiences/{experience.id || "url-de-page"}
                  </p>
                  <p className="text-[#1E1E1E]/70 text-sm">
                    {experience.seoDescription ||
                      experience.description ||
                      "Description de la page qui apparaîtra dans les résultats de recherche."}
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
