"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Save, X, Tag, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  experienceCount: number
  order: number
}

const defaultCategories: Category[] = [
  {
    id: "outdoor",
    name: "Outdoor",
    slug: "outdoor",
    description: "Expériences en plein air et dans la nature",
    color: "#10b981",
    icon: "🌳",
    experienceCount: 2,
    order: 1,
  },
  {
    id: "dining",
    name: "Gastronomie",
    slug: "dining",
    description: "Expériences culinaires et dîners raffinés",
    color: "#f59e0b",
    icon: "🍷",
    experienceCount: 1,
    order: 2,
  },
  {
    id: "cultural",
    name: "Culturel",
    slug: "cultural",
    description: "Découvertes culturelles et artistiques",
    color: "#8b5cf6",
    icon: "🎭",
    experienceCount: 1,
    order: 3,
  },
  {
    id: "creative",
    name: "Créatif",
    slug: "creative",
    description: "Ateliers créatifs et artistiques",
    color: "#ec4899",
    icon: "🎨",
    experienceCount: 1,
    order: 4,
  },
]

const colorOptions = [
  { name: "Rouge", value: "#ef4444" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Jaune", value: "#eab308" },
  { name: "Vert", value: "#10b981" },
  { name: "Bleu", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#ec4899" },
  { name: "Bordeaux", value: "#800913" },
]

const iconOptions = ["🌳", "🍷", "🎭", "🎨", "🎪", "🎵", "⛰️", "🌊", "🏛️", "💎", "🌹", "🕯️"]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#10b981",
    icon: "🌳",
  })

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      experienceCount: 0,
      order: categories.length + 1,
    }
    setCategories([...categories, newCategory])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              color: formData.color,
              icon: formData.icon,
            }
          : cat
      )
    )
    setEditingCategory(null)
    resetForm()
  }

  const handleDeleteCategory = () => {
    if (!deleteCategory) return
    setCategories(categories.filter((cat) => cat.id !== deleteCategory.id))
    setDeleteCategory(null)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#10b981",
      icon: "🌳",
    })
  }

  const closeModal = () => {
    setIsCreateModalOpen(false)
    setEditingCategory(null)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1E1E1E]">
            Catégories d'expériences
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            Gérez les catégories pour organiser vos expériences
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#800913] hover:bg-[#600910] text-white"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1E1E1E]/60">Total catégories</p>
                <p className="text-2xl font-bold text-[#1E1E1E] mt-1">
                  {categories.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#800913]/10 flex items-center justify-center">
                <Tag className="text-[#800913]" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1E1E1E]/60">Expériences totales</p>
                <p className="text-2xl font-bold text-[#1E1E1E] mt-1">
                  {categories.reduce((acc, cat) => acc + cat.experienceCount, 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1E1E1E]/60">Catégorie populaire</p>
                <p className="text-2xl font-bold text-[#1E1E1E] mt-1">
                  {categories.sort((a, b) => b.experienceCount - a.experienceCount)[0]?.icon}{" "}
                  {categories.sort((a, b) => b.experienceCount - a.experienceCount)[0]?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Toutes les catégories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#1E1E1E]/10 rounded-lg">
              <Tag className="mx-auto mb-4 text-[#1E1E1E]/20" size={48} />
              <p className="text-[#1E1E1E]/40 mb-4">Aucune catégorie créée</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
                className="border-[#1E1E1E]/20"
              >
                <Plus size={16} className="mr-2" />
                Créer votre première catégorie
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-4 p-4 border border-[#1E1E1E]/10 rounded-lg hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="cursor-grab">
                    <GripVertical size={18} className="text-[#1E1E1E]/30" />
                  </div>
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-[#1E1E1E]">{category.name}</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                        }}
                      >
                        {category.experienceCount} expérience
                        {category.experienceCount > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#1E1E1E]/60">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(category)}
                      className="text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/5"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteCategory(category)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={category.experienceCount > 0}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || editingCategory !== null}
        onOpenChange={closeModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifiez les informations de la catégorie"
                : "Créez une nouvelle catégorie pour vos expériences"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Outdoor, Gastronomie..."
                className="border-[#1E1E1E]/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Décrivez cette catégorie..."
                rows={3}
                className="border-[#1E1E1E]/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`h-12 rounded-lg border-2 text-2xl hover:border-[#800913] transition-colors ${
                      formData.icon === icon
                        ? "border-[#800913] bg-[#800913]/10"
                        : "border-[#1E1E1E]/10"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="grid grid-cols-9 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`h-10 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? "border-[#1E1E1E] scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              className="border-[#1E1E1E]/20 bg-transparent"
            >
              <X size={16} className="mr-2" />
              Annuler
            </Button>
            <Button
              onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
              className="bg-[#800913] hover:bg-[#600910] text-white"
              disabled={!formData.name.trim()}
            >
              <Save size={16} className="mr-2" />
              {editingCategory ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteCategory !== null}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "
              {deleteCategory?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
