"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Clock,
  Users,
  Check,
  X,
  GripVertical,
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

type ExperienceStatus = 'available' | 'almost_available' | 'coming_soon' | 'unavailable'

interface Experience {
  id: string
  title: string
  subtitle: string
  image: string
  description: string
  duration_hours: number
  guests: string
  highlight: string
  available: boolean
  status: ExperienceStatus
  price: number
  currency: string
  category: string
  createdAt: string
}

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
  unavailable: 'bg-gray-100 text-gray-500',
}

// Sortable Row Component
function SortableRow({ experience, children }: { experience: Experience; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-[#F8F8F8]">
      <td className="px-4 py-4 w-8">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={16} className="text-[#1E1E1E]/40" />
        </div>
      </td>
      {children}
    </tr>
  )
}

const initialExperiences: Experience[] = [
  {
    id: "interlude-francais",
    title: "The Parisian Interlude",
    subtitle: "A Picnic Experience",
    image: "/images/experience-picnic.jpg",
    description:
      "Escape into nature with French elegance. A curated picnic featuring artisanal cheeses, fresh baguettes, and champagne.",
    duration_hours: 2.5,
    guests: "2 people",
    highlight: "Sunset timing available",
    available: true,
    price: 1500,
    currency: "AED",
    category: "outdoor",
    createdAt: "2024-01-15",
  },
  {
    id: "french-rendez-vous",
    title: "French Rendez-vous",
    subtitle: "An Intimate Dinner Experience",
    image: "/images/hero-couple-dinner.jpg",
    description:
      "Transport yourselves to a candlelit Parisian evening with exquisite cuisine and vintage wines.",
    duration_hours: 3.5,
    guests: "2 people",
    highlight: "Private chef & sommelier",
    available: false,
    price: 2500,
    currency: "AED",
    category: "dining",
    createdAt: "2024-01-10",
  },
  {
    id: "sakura-hanami",
    title: "Sakura Hanami",
    subtitle: "Japanese Serenity",
    image: "/images/experience-japan.jpg",
    description:
      "An intimate journey through Japanese traditions with tea ceremony and sake tasting.",
    duration_hours: 2.5,
    guests: "2 people",
    highlight: "Traditional tea ceremony",
    available: false,
    price: 1800,
    currency: "AED",
    category: "cultural",
    createdAt: "2024-01-05",
  },
  {
    id: "love-is-art",
    title: "Love is Art",
    subtitle: "Creative Connection",
    image: "/images/experience-paint.jpg",
    description:
      "Create together, connect deeper with this artistic experience guided by a professional artist.",
    duration_hours: 2.5,
    guests: "2 people",
    highlight: "Take your art home",
    available: false,
    price: 1200,
    currency: "AED",
    category: "creative",
    createdAt: "2024-01-01",
  },
]

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteModal, setDeleteModal] = useState<Experience | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load experiences from Supabase
  useEffect(() => {
    const loadExperiences = async () => {
      console.log("[v0] Loading experiences from API...")
      try {
        const response = await fetch('/api/experiences?available=false')
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Loaded experiences:", data)
          
          // Map database fields to component interface
          const mappedExperiences: Experience[] = data.map((exp: any) => ({
            id: exp.id,
            title: exp.title,
            subtitle: exp.subtitle || '',
            image: exp.image || '/placeholder.jpg',
            description: exp.description || '',
            duration_hours: exp.duration_hours || 2,
            guests: exp.guests || '',
            highlight: exp.highlight || '',
            available: exp.available ?? false,
            status: (exp.status || (exp.available ? 'available' : 'unavailable')) as ExperienceStatus,
            price: Number(exp.price) || 0,
            currency: exp.currency || 'AED',
            category: exp.category || 'other',
            createdAt: exp.created_at || '',
          }))
          
          setExperiences(mappedExperiences)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] Error loading experiences:", error)
        setIsLoading(false)
      }
    }
    
    loadExperiences()
  }, [])

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || exp.status === statusFilter
    const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDelete = async (id: string) => {
    console.log("[v0] Deleting experience:", id)
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        console.log("[v0] Experience deleted successfully")
        setExperiences(experiences.filter((exp) => exp.id !== id))
        setDeleteModal(null)
      } else {
        console.error("[v0] Failed to delete experience")
        alert("Erreur lors de la suppression de l'expérience")
      }
    } catch (error) {
      console.error("[v0] Error deleting experience:", error)
      alert("Erreur lors de la suppression de l'expérience")
    }
  }

  const updateExperienceStatus = async (id: string, status: ExperienceStatus) => {
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        setExperiences(
          experiences.map((exp) =>
            exp.id === id ? { ...exp, status, available: status === 'available' || status === 'almost_available' } : exp
          )
        )
      }
    } catch (error) {
      console.error("[v0] Error updating status:", error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = experiences.findIndex((exp) => exp.id === active.id)
    const newIndex = experiences.findIndex((exp) => exp.id === over.id)

    const newExperiences = arrayMove(experiences, oldIndex, newIndex)
    setExperiences(newExperiences)

    // Save new order to database
    setIsSaving(true)
    try {
      const orderedIds = newExperiences.map((exp) => exp.id)
      const response = await fetch('/api/experiences/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      })

      if (!response.ok) {
        console.error('[v0] Failed to save order')
        alert('Erreur lors de la sauvegarde de l\'ordre')
        // Revert on error
        setExperiences(experiences)
      }
    } catch (error) {
      console.error('[v0] Error saving order:', error)
      alert('Erreur lors de la sauvegarde de l\'ordre')
      setExperiences(experiences)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAvailability = (id: string) => {
    const updatedExperiences = experiences.map((exp) =>
      exp.id === id ? { ...exp, available: !exp.available } : exp
    )
    setExperiences(updatedExperiences)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1E1E1E]">
            Gestion des <span className="text-[#800913]">Expériences</span>
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            {experiences.length} expérience{experiences.length > 1 ? "s" : ""} au total
            {isSaving && <span className="ml-2 text-[#800913]">• Sauvegarde en cours...</span>}
          </p>
        </div>
        <Link href="/admin/experiences/new">
          <Button className="bg-[#800913] hover:bg-[#600910] text-white">
            <Plus size={18} className="mr-2" />
            Nouvelle expérience
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
                placeholder="Rechercher une expérience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#1E1E1E]/10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="almost_available">Almost Available</SelectItem>
                <SelectItem value="coming_soon">Coming Soon</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48 border-[#1E1E1E]/10">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
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

      {/* Experiences Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <Card
              key={experience.id}
              className="border-none shadow-sm overflow-hidden group"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 ${statusColors[experience.status || 'available']}`}
                  >
                    {statusLabels[experience.status || 'available']}
                  </span>
                  <span className="bg-white/90 text-[#1E1E1E] text-xs px-2 py-1 capitalize">
                    {experience.category}
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
                        <Link href={`/experiences/${experience.id}`}>
                          <Eye size={14} className="mr-2" />
                          Voir sur le site
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/experiences/${experience.id}`}>
                          <Edit size={14} className="mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Copy size={14} className="mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteModal(experience)}
                        className="text-red-600"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white/80 text-xs tracking-wider uppercase">
                    {experience.subtitle}
                  </p>
                  <h3 className="text-white text-lg font-medium">
                    {experience.title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-[#1E1E1E]/60 text-sm line-clamp-2 mb-4">
                  {experience.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-[#1E1E1E]/60">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {experience.duration_hours} hours
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {experience.guests}
                    </span>
                  </div>
                  <span className="text-[#800913] font-medium">
                    {experience.currency} {experience.price.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <table className="w-full">
                <thead className="bg-[#F8F8F8] border-b border-[#1E1E1E]/10">
                  <tr>
                    <th className="w-8 px-4 py-3"></th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Expérience
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-[#1E1E1E]/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <SortableContext
                  items={filteredExperiences.map(exp => exp.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-[#1E1E1E]/5">
                    {filteredExperiences.map((experience) => (
                      <SortableRow key={experience.id} experience={experience}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-12">
                              <Image
                                src={experience.image || "/placeholder.svg"}
                                alt={experience.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-[#1E1E1E]">
                                {experience.title}
                              </p>
                              <p className="text-xs text-[#1E1E1E]/60">
                                {experience.subtitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="capitalize text-sm text-[#1E1E1E]/60">
                            {experience.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-[#1E1E1E]">
                            {experience.currency} {experience.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-[#1E1E1E]/60">
                            {experience.duration_hours} hours
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Select
                            value={experience.status || 'available'}
                            onValueChange={(value) => updateExperienceStatus(experience.id, value as ExperienceStatus)}
                          >
                            <SelectTrigger className={`w-[140px] text-xs h-8 ${statusColors[experience.status || 'available']}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="almost_available">Almost Available</SelectItem>
                              <SelectItem value="coming_soon">Coming Soon</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-[#1E1E1E]/5 transition-colors">
                                <MoreVertical size={16} className="text-[#1E1E1E]/60" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/experiences/${experience.id}`}>
                                  <Edit size={14} className="mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteModal(experience)}
                                className="text-red-600"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </SortableRow>
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredExperiences.length === 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-[#1E1E1E]/60 mb-4">
              Aucune expérience trouvée avec ces filtres.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setCategoryFilter("all")
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
            <DialogTitle>Supprimer cette expérience ?</DialogTitle>
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
