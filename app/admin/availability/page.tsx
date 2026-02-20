"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Repeat,
  CalendarDays,
  Users,
  Settings,
  Copy,
  MoreHorizontal,
  Check,
  X,
  Edit2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Types
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
}

interface RecurringRule {
  id: string
  name: string
  days: number[] // 0-6, Sunday-Saturday
  slots: TimeSlot[]
  experienceIds: string[] // Which experiences this rule applies to
  calendarId: string
  active: boolean
}

interface SpecificDateSlot {
  id: string
  date: string // YYYY-MM-DD
  slots: TimeSlot[]
  experienceIds: string[]
  calendarId: string
  isBlocked: boolean // True if this date is completely blocked
  note?: string
}

interface CalendarConfig {
  id: string
  name: string
  color: string
  assignedTo?: string
  active: boolean
}

interface Experience {
  id: string
  title: string
  duration: string
  duration_hours: number
}

interface BookingEntry {
  id: string
  date: string
  time: string
  experienceTitle: string
  experienceId: string
  customerName: string
  customerEmail: string
  guests: number
  status: string
  source: 'reservation' | 'booking'
}

// Sample data
const initialCalendars: CalendarConfig[] = [
  {
    id: "cal-main",
    name: "Calendrier Principal",
    color: "#800913",
    assignedTo: "Manon",
    active: true,
  },
]

const initialExperiences: Experience[] = [
  {
    id: "exp1",
    title: "Experience 1",
    duration: "1 heure",
  },
  {
    id: "exp2",
    title: "Experience 2",
    duration: "2 heures",
  },
]

const initialRecurringRules: RecurringRule[] = [
  {
    id: "rule1",
    name: "Rule 1",
    days: [1, 2, 3, 4, 5], // Monday to Friday
    slots: [
      {
        id: "slot1",
        startTime: "09:00",
        endTime: "11:00",
        available: true,
      },
    ],
    experienceIds: ["exp1"],
    calendarId: "cal-main",
    active: true,
  },
]

const initialSpecificDates: SpecificDateSlot[] = [
  {
    id: "spec1",
    date: "2023-10-01",
    slots: [
      {
        id: "slot2",
        startTime: "10:00",
        endTime: "12:00",
        available: true,
      },
    ],
    experienceIds: ["exp2"],
    calendarId: "cal-main",
    isBlocked: false,
    note: "Anniversaire de Marie",
  },
]

// Data will be loaded from Supabase

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const dayNamesFull = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
]

export default function AvailabilityPage() {
  const [calendars, setCalendars] = useState<CalendarConfig[]>(initialCalendars)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>([])
  const [specificDates, setSpecificDates] = useState<SpecificDateSlot[]>([])
  const [bookings, setBookings] = useState<BookingEntry[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<string>("cal-main")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load availability rules function (reusable)
  const loadAvailabilityRules = async () => {
    try {
      const availResponse = await fetch('/api/availability?type=all')
      if (availResponse.ok) {
        const availData = await availResponse.json()
        
        // Map recurring rules
        const mappedRecurring: RecurringRule[] = (availData.recurring || []).map((rule: any) => {
          // Use time_slots if available, otherwise fallback to start_time/end_time
          const timeSlots = rule.time_slots && rule.time_slots.length > 0
            ? rule.time_slots.map((ts: any) => ({
                id: ts.id,
                startTime: ts.start_time,
                endTime: ts.end_time,
                available: true,
              }))
            : [{
                id: `slot-${rule.id}`,
                startTime: rule.start_time,
                endTime: rule.end_time,
                available: true,
              }]
          
          return {
            id: rule.id,
            name: rule.name,
            days: rule.days_of_week || [],
            slots: timeSlots,
            experienceIds: rule.experience_id ? [rule.experience_id] : [],
            calendarId: rule.calendar_id || 'cal-main',
            active: rule.active ?? true,
          }
        })
        setRecurringRules(mappedRecurring)

        // Map specific dates
        const mappedSpecific: SpecificDateSlot[] = (availData.specific || []).map((spec: any) => ({
          id: spec.id,
          date: spec.date,
          slots: spec.start_time ? [{
            id: `slot-${spec.id}`,
            startTime: spec.start_time,
            endTime: spec.end_time,
            available: true,
          }] : [],
          experienceIds: spec.experience_id ? [spec.experience_id] : [],
          calendarId: spec.calendar_id || 'cal-main',
          isBlocked: spec.is_blocked ?? false,
          note: spec.reason || '',
        }))
        setSpecificDates(mappedSpecific)
      }
    } catch (error) {
      console.error('Error loading availability data:', error)
    }
  }

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load experiences
        const expResponse = await fetch('/api/experiences?available=false')
        if (expResponse.ok) {
          const expData = await expResponse.json()
          const mappedExperiences = expData.map((exp: any) => ({
            id: exp.id,
            title: exp.title,
            duration: exp.duration_hours ? `${exp.duration_hours} heure${exp.duration_hours > 1 ? 's' : ''}` : '2 heures',
            duration_hours: exp.duration_hours || 2,
          }))
          setExperiences(mappedExperiences)
        }

        // Load availability rules
        await loadAvailabilityRules()

        // Load bookings (reservations + bookings) to show on calendar
        const [resResponse, bookResponse] = await Promise.all([
          fetch('/api/admin/bookings?source=reservations'),
          fetch('/api/admin/bookings?source=bookings'),
        ])

        const allBookingEntries: BookingEntry[] = []

        if (resResponse.ok) {
          const resData = await resResponse.json()
          for (const r of resData) {
            if (r.date && r.status !== 'cancelled') {
              allBookingEntries.push({
                id: r.id,
                date: r.date,
                time: r.time || '',
                experienceTitle: r.experience_title || r.experience_id || '',
                experienceId: r.experience_id || '',
                customerName: r.customer_name || '',
                customerEmail: r.customer_email || '',
                guests: r.guests || 1,
                status: r.status || 'confirmed',
                source: 'reservation',
              })
            }
          }
        }

        if (bookResponse.ok) {
          const bookData = await bookResponse.json()
          for (const b of bookData) {
            if (b.date && b.status !== 'cancelled') {
              allBookingEntries.push({
                id: b.id,
                date: b.date,
                time: b.time || '',
                experienceTitle: b.experience_title || b.experience_id || '',
                experienceId: b.experience_id || '',
                customerName: b.customer_name || '',
                customerEmail: b.customer_email || '',
                guests: b.guests || 1,
                status: b.status || 'confirmed',
                source: 'booking',
              })
            }
          }
        }

        setBookings(allBookingEntries)
      } catch (error) {
        console.error('Error loading data:', error)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Modals
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [editingRule, setEditingRule] = useState<RecurringRule | null>(null)
  const [editingDateSlot, setEditingDateSlot] =
    useState<SpecificDateSlot | null>(null)
  const [editingCalendar, setEditingCalendar] = useState<CalendarConfig | null>(
    null
  )

  // Form states for recurring rule
  const [ruleForm, setRuleForm] = useState<Partial<RecurringRule>>({
    name: "",
    days: [],
    slots: [],
    experienceIds: [],
    calendarId: selectedCalendar,
    active: true,
  })

  // Form states for specific date
  const [dateForm, setDateForm] = useState<Partial<SpecificDateSlot>>({
    date: "",
    slots: [],
    experienceIds: [],
    calendarId: selectedCalendar,
    isBlocked: false,
    note: "",
  })

  // Form states for calendar
  const [calendarForm, setCalendarForm] = useState<Partial<CalendarConfig>>({
    name: "",
    color: "#800913",
    assignedTo: "",
    active: true,
  })

  // Calendar navigation
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  }

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const getDayOfWeek = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    return date.getDay()
  }

  // Get bookings for a specific date
  const getBookingsForDate = (dateStr: string): BookingEntry[] => {
    return bookings.filter((b) => b.date === dateStr)
  }

  // Check if a date has specific slots or is blocked
  const getDateStatus = (day: number) => {
    const dateStr = getDateString(day)

    // Check if the date has confirmed bookings
    const dayBookings = getBookingsForDate(dateStr)
    if (dayBookings.length > 0) {
      return "booked"
    }

    const specific = specificDates.find(
      (s) => s.date === dateStr && s.calendarId === selectedCalendar
    )
    if (specific) {
      return specific.isBlocked ? "blocked" : "custom"
    }
    // Check recurring rules
    const dayOfWeek = getDayOfWeek(day)
    const hasRecurring = recurringRules.some(
      (r) =>
        r.calendarId === selectedCalendar &&
        r.active &&
        r.days.includes(dayOfWeek)
    )
    return hasRecurring ? "recurring" : "none"
  }

  // Get slots for a specific day
  const getSlotsForDay = (day: number): TimeSlot[] => {
    const dateStr = getDateString(day)
    const specific = specificDates.find(
      (s) => s.date === dateStr && s.calendarId === selectedCalendar
    )
    if (specific) {
      return specific.slots
    }
    const dayOfWeek = getDayOfWeek(day)
    const rule = recurringRules.find(
      (r) =>
        r.calendarId === selectedCalendar &&
        r.active &&
        r.days.includes(dayOfWeek)
    )
    return rule?.slots || []
  }

  // Open modal to add/edit recurring rule
  const openRecurringModal = (rule?: RecurringRule) => {
    if (rule) {
      setEditingRule(rule)
      setRuleForm({ ...rule })
    } else {
      setEditingRule(null)
      setRuleForm({
        name: "",
        days: [],
        slots: [],
        experienceIds: [],
        calendarId: selectedCalendar,
        active: true,
      })
    }
    setShowRecurringModal(true)
  }

  // Save recurring rule
  const saveRecurringRule = async () => {
    if (!ruleForm.name || !ruleForm.days?.length) {
      alert("Veuillez remplir le nom et sélectionner au moins un jour")
      return
    }
    
    setIsSaving(true)
    try {
      // Format slots for API
      const formattedSlots = (ruleForm.slots || []).filter(s => s.startTime && s.endTime).map(s => ({
        startTime: s.startTime,
        endTime: s.endTime,
      }))
      
      const apiData = {
        type: 'recurring',
        name: ruleForm.name,
        calendarId: ruleForm.calendarId || selectedCalendar,
        experienceId: ruleForm.experienceIds?.[0] || null,
        daysOfWeek: ruleForm.days,
        slots: formattedSlots.length > 0 ? formattedSlots : [{ startTime: '09:00', endTime: '18:00' }],
        active: ruleForm.active ?? true,
      }
      
      if (editingRule) {
        const response = await fetch(`/api/availability/${editingRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        })
        
        if (response.ok) {
          await loadAvailabilityRules()
        } else {
          const errorText = await response.text()
          alert('Erreur lors de la mise à jour de la règle: ' + errorText)
        }
      } else {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        })
        
        if (response.ok) {
          await loadAvailabilityRules()
        } else {
          const errorText = await response.text()
          alert('Erreur lors de la création de la règle: ' + errorText)
        }
      }
    } catch (error) {
      console.error('Error saving rule:', error)
      alert('Erreur lors de la sauvegarde: ' + String(error))
    }
    setIsSaving(false)
    setShowRecurringModal(false)
  }

  // Delete recurring rule
  const deleteRecurringRule = async (id: string) => {
    try {
      const response = await fetch(`/api/availability/${id}?type=recurring`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setRecurringRules((prev) => prev.filter((r) => r.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Open modal to add/edit specific date
  const openDateModal = (dateStr?: string, slot?: SpecificDateSlot) => {
    if (slot) {
      setEditingDateSlot(slot)
      setDateForm({ ...slot })
    } else {
      setEditingDateSlot(null)
      setDateForm({
        date: dateStr || "",
        slots: [],
        experienceIds: [],
        calendarId: selectedCalendar,
        isBlocked: false,
        note: "",
      })
    }
    setShowDateModal(true)
  }

  // Save specific date slot
  const saveSpecificDate = async () => {
    if (!dateForm.date) return
    
    setIsSaving(true)
    try {
      const slot = dateForm.slots?.[0]
      const apiData = {
        type: 'specific',
        calendarId: dateForm.calendarId || selectedCalendar,
        experienceId: dateForm.experienceIds?.[0] || null,
        date: dateForm.date,
        startTime: slot?.startTime || null,
        endTime: slot?.endTime || null,
        isBlocked: dateForm.isBlocked ?? false,
        reason: dateForm.note || null,
      }

      if (editingDateSlot) {
        const response = await fetch(`/api/availability/${editingDateSlot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        })
        
        if (response.ok) {
          await loadAvailabilityRules()
        } else {
          alert('Erreur lors de la mise à jour')
        }
      } else {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        })
        
        if (response.ok) {
          await loadAvailabilityRules()
        } else {
          alert('Erreur lors de la création')
        }
      }
    } catch (error) {
      console.error('Error saving specific date:', error)
      alert('Erreur lors de la sauvegarde')
    }
    setIsSaving(false)
    setShowDateModal(false)
  }

  // Delete specific date
  const deleteSpecificDate = async (id: string) => {
    try {
      const response = await fetch(`/api/availability/${id}?type=specific`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setSpecificDates((prev) => prev.filter((s) => s.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting specific date:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Add time slot to form
  const addTimeSlot = (
    formType: "rule" | "date",
    startTime: string = "09:00",
    endTime: string = "11:00"
  ) => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime,
      endTime,
      available: true,
    }
    if (formType === "rule") {
      setRuleForm((prev) => ({
        ...prev,
        slots: [...(prev.slots || []), newSlot],
      }))
    } else {
      setDateForm((prev) => ({
        ...prev,
        slots: [...(prev.slots || []), newSlot],
      }))
    }
  }

  // Update time slot
  const updateTimeSlot = (
    formType: "rule" | "date",
    slotId: string,
    field: keyof TimeSlot,
    value: string | boolean
  ) => {
    if (formType === "rule") {
      setRuleForm((prev) => ({
        ...prev,
        slots: prev.slots?.map((s) =>
          s.id === slotId ? { ...s, [field]: value } : s
        ),
      }))
    } else {
      setDateForm((prev) => ({
        ...prev,
        slots: prev.slots?.map((s) =>
          s.id === slotId ? { ...s, [field]: value } : s
        ),
      }))
    }
  }

  // Remove time slot
  const removeTimeSlot = (formType: "rule" | "date", slotId: string) => {
    if (formType === "rule") {
      setRuleForm((prev) => ({
        ...prev,
        slots: prev.slots?.filter((s) => s.id !== slotId),
      }))
    } else {
      setDateForm((prev) => ({
        ...prev,
        slots: prev.slots?.filter((s) => s.id !== slotId),
      }))
    }
  }

  // Toggle day selection
  const toggleDay = (day: number) => {
    setRuleForm((prev) => ({
      ...prev,
      days: prev.days?.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...(prev.days || []), day],
    }))
  }

  // Toggle experience selection
  const toggleExperience = (formType: "rule" | "date", expId: string) => {
    if (formType === "rule") {
      setRuleForm((prev) => ({
        ...prev,
        experienceIds: prev.experienceIds?.includes(expId)
          ? prev.experienceIds.filter((e) => e !== expId)
          : [...(prev.experienceIds || []), expId],
      }))
    } else {
      setDateForm((prev) => ({
        ...prev,
        experienceIds: prev.experienceIds?.includes(expId)
          ? prev.experienceIds.filter((e) => e !== expId)
          : [...(prev.experienceIds || []), expId],
      }))
    }
  }

  // Calendar management
  const openCalendarModal = (calendar?: CalendarConfig) => {
    if (calendar) {
      setEditingCalendar(calendar)
      setCalendarForm({ ...calendar })
    } else {
      setEditingCalendar(null)
      setCalendarForm({
        name: "",
        color: "#800913",
        assignedTo: "",
        active: true,
      })
    }
    setShowCalendarModal(true)
  }

  const saveCalendar = () => {
    if (!calendarForm.name) return

    if (editingCalendar) {
      setCalendars((prev) =>
        prev.map((c) =>
          c.id === editingCalendar.id
            ? ({ ...calendarForm, id: editingCalendar.id } as CalendarConfig)
            : c
        )
      )
    } else {
      const newCalendar: CalendarConfig = {
        id: `cal-${Date.now()}`,
        name: calendarForm.name || "",
        color: calendarForm.color || "#800913",
        assignedTo: calendarForm.assignedTo,
        active: calendarForm.active ?? true,
      }
      setCalendars((prev) => [...prev, newCalendar])
    }
    setShowCalendarModal(false)
  }

  const deleteCalendar = (id: string) => {
    if (calendars.length <= 1) return // Keep at least one calendar
    setCalendars((prev) => prev.filter((c) => c.id !== id))
    if (selectedCalendar === id) {
      setSelectedCalendar(calendars.find((c) => c.id !== id)?.id || "")
    }
  }

  const currentCalendar = calendars.find((c) => c.id === selectedCalendar)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E1E1E]">
            Gestion des disponibilites
          </h1>
          <p className="text-[#1E1E1E]/60 mt-1">
            Configurez vos creneaux et gerez votre calendrier
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => openCalendarModal()}
            className="border-[#1E1E1E]/20"
          >
            <Users size={16} className="mr-2" />
            Nouveau calendrier
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#800913] hover:bg-[#600910] text-white">
                <Plus size={16} className="mr-2" />
                Ajouter des creneaux
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openRecurringModal()}>
                <Repeat size={16} className="mr-2" />
                Creneaux recurrents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDateModal()}>
                <CalendarDays size={16} className="mr-2" />
                Date specifique
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Selector */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {calendars.map((cal) => (
              <button
                key={cal.id}
                onClick={() => setSelectedCalendar(cal.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                  selectedCalendar === cal.id
                    ? "border-[#800913] bg-[#800913]/5"
                    : "border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cal.color }}
                />
                <span className="font-medium text-[#1E1E1E]">{cal.name}</span>
                {cal.assignedTo && (
                  <span className="text-sm text-[#1E1E1E]/50">
                    ({cal.assignedTo})
                  </span>
                )}
                {!cal.active && (
                  <Badge variant="secondary" className="text-xs">
                    Inactif
                  </Badge>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openCalendarModal(cal)
                  }}
                  className="ml-2 p-1 hover:bg-[#1E1E1E]/10 rounded"
                >
                  <Settings size={14} className="text-[#1E1E1E]/50" />
                </button>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="bg-[#1E1E1E]/5">
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Calendar size={16} className="mr-2" />
            Vue calendrier
          </TabsTrigger>
          <TabsTrigger
            value="recurring"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <Repeat size={16} className="mr-2" />
            Regles recurrentes
          </TabsTrigger>
          <TabsTrigger
            value="specific"
            className="data-[state=active]:bg-[#800913] data-[state=active]:text-white"
          >
            <CalendarDays size={16} className="mr-2" />
            Dates specifiques
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentCalendar?.color }}
                  />
                  {currentCalendar?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft size={20} />
                  </Button>
                  <span className="text-[#1E1E1E] font-medium min-w-[160px] text-center capitalize">
                    {formatMonth(currentMonth)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-[#1E1E1E]/50 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square" />
                    }

                    const status = getDateStatus(day)
                    const dateStr = getDateString(day)
                    const slots = getSlotsForDay(day)
                    const isPast =
                      new Date(dateStr) <
                      new Date(new Date().toDateString())
                    const isSelected = selectedDate === dateStr

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(dateStr)
                          const existingSlot = specificDates.find(
                            (s) =>
                              s.date === dateStr &&
                              s.calendarId === selectedCalendar
                          )
                          if (existingSlot) {
                            openDateModal(dateStr, existingSlot)
                          }
                        }}
                        className={`aspect-square p-1 relative rounded-lg transition-all ${
                          isPast
                            ? "opacity-40 cursor-not-allowed"
                            : isSelected
                              ? "ring-2 ring-[#800913]"
                              : "hover:bg-[#1E1E1E]/5"
                        } ${
                          status === "booked"
                            ? "bg-[#800913]/10"
                            : status === "blocked"
                              ? "bg-red-50"
                              : status === "custom"
                                ? "bg-amber-50"
                                : status === "recurring"
                                  ? "bg-green-50"
                                  : ""
                        }`}
                        disabled={isPast}
                      >
                        <span
                          className={`text-sm font-medium ${
                            status === "booked"
                              ? "text-[#800913]"
                              : status === "blocked"
                                ? "text-red-600"
                                : "text-[#1E1E1E]"
                          }`}
                        >
                          {day}
                        </span>
                        {status !== "none" && !isPast && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {status === "blocked" ? (
                              <X size={10} className="text-red-500" />
                            ) : status === "booked" ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#800913]" />
                            ) : (
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  status === "custom"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                              />
                            )}
                          </div>
                        )}
                        {slots.length > 0 && !isPast && (
                          <span className="absolute top-1 right-1 text-[10px] text-[#1E1E1E]/50">
                            {slots.length}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#1E1E1E]/10 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                    <div className="w-3 h-3 rounded-full bg-[#800913]" />
                    Reserve
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Recurrent
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Personnalise
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                    <X size={12} className="text-red-500" />
                    Bloque
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day detail / Quick actions */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    : "Selectionnez une date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {(() => {
                      const day = Number.parseInt(selectedDate.split("-")[2])
                      const slots = getSlotsForDay(day)
                      const status = getDateStatus(day)
                      const specific = specificDates.find(
                        (s) =>
                          s.date === selectedDate &&
                          s.calendarId === selectedCalendar
                      )

                      if (status === "booked") {
                        const dayBookings = getBookingsForDate(selectedDate)
                        return (
                          <div className="space-y-4">
                            <Badge className="bg-[#800913]">
                              Reserve
                            </Badge>
                            {dayBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="p-4 rounded-lg bg-[#800913]/5 border border-[#800913]/15 space-y-2"
                              >
                                <p className="font-medium text-[#1E1E1E]">
                                  {booking.experienceTitle}
                                </p>
                                {booking.time && (
                                  <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/70">
                                    <Clock size={14} className="text-[#800913]" />
                                    {booking.time}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/70">
                                  <Users size={14} className="text-[#800913]" />
                                  {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                </div>
                                <div className="pt-2 border-t border-[#1E1E1E]/10">
                                  <p className="text-sm text-[#1E1E1E]/70">
                                    {booking.customerName}
                                  </p>
                                  <p className="text-xs text-[#1E1E1E]/50">
                                    {booking.customerEmail}
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-xs capitalize"
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )
                      }

                      if (status === "blocked") {
                        return (
                          <div className="text-center py-8">
                            <X
                              size={32}
                              className="mx-auto text-red-500 mb-2"
                            />
                            <p className="text-red-600 font-medium">
                              Date bloquee
                            </p>
                            {specific?.note && (
                              <p className="text-sm text-[#1E1E1E]/60 mt-1">
                                {specific.note}
                              </p>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 bg-transparent"
                              onClick={() => openDateModal(selectedDate, specific!)}
                            >
                              Modifier
                            </Button>
                          </div>
                        )
                      }

                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                status === "custom" ? "default" : "secondary"
                              }
                              className={
                                status === "custom" ? "bg-amber-500" : ""
                              }
                            >
                              {status === "custom"
                                ? "Personnalise"
                                : "Recurrent"}
                            </Badge>
                            <span className="text-sm text-[#1E1E1E]/60">
                              {slots.length} creneau(x)
                            </span>
                          </div>

                          {specific?.note && (
                            <p className="text-sm text-[#1E1E1E]/60 italic">
                              {specific.note}
                            </p>
                          )}

                          <div className="space-y-2">
                            {slots.map((slot) => (
                              <div
                                key={slot.id}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  slot.available
                                    ? "bg-green-50"
                                    : "bg-red-50"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Clock
                                    size={16}
                                    className={
                                      slot.available
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  />
                                  <span className="font-medium">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                                <Badge
                                  variant={
                                    slot.available ? "default" : "secondary"
                                  }
                                  className={
                                    slot.available
                                      ? "bg-green-600"
                                      : "bg-red-600 text-white"
                                  }
                                >
                                  {slot.available ? "Dispo" : "Reserve"}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() =>
                                openDateModal(
                                  selectedDate,
                                  specific || undefined
                                )
                              }
                            >
                              <Edit2 size={14} className="mr-2" />
                              {specific ? "Modifier" : "Personnaliser"}
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 bg-transparent"
                              onClick={() => {
                                if (specific) {
                                  setDateForm({
                                    ...specific,
                                    isBlocked: true,
                                    slots: [],
                                  })
                                } else {
                                  setDateForm({
                                    date: selectedDate,
                                    slots: [],
                                    experienceIds: [],
                                    calendarId: selectedCalendar,
                                    isBlocked: true,
                                    note: "",
                                  })
                                }
                                setShowDateModal(true)
                              }}
                            >
                              <X size={14} className="mr-2" />
                              Bloquer
                            </Button>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1E1E1E]/40">
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Cliquez sur une date pour voir les details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recurring Rules Tab */}
        <TabsContent value="recurring" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#1E1E1E]/60">
              Les regles recurrentes s'appliquent automatiquement chaque semaine
            </p>
            <Button
              onClick={() => openRecurringModal()}
              className="bg-[#800913] hover:bg-[#600910] text-white"
            >
              <Plus size={16} className="mr-2" />
              Nouvelle regle
            </Button>
          </div>

          {recurringRules
            .filter((r) => r.calendarId === selectedCalendar)
            .map((rule) => (
              <Card key={rule.id} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Switch
                          checked={rule.active}
                          onCheckedChange={(checked) => {
                            setRecurringRules((prev) =>
                              prev.map((r) =>
                                r.id === rule.id ? { ...r, active: checked } : r
                              )
                            )
                          }}
                        />
                        <h3 className="font-medium text-[#1E1E1E]">
                          {rule.name}
                        </h3>
                        {!rule.active && (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <Badge
                            key={day}
                            variant={
                              rule.days.includes(day) ? "default" : "outline"
                            }
                            className={
                              rule.days.includes(day)
                                ? "bg-[#800913]"
                                : "opacity-30"
                            }
                          >
                            {dayNames[day]}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {rule.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-2 text-sm bg-[#1E1E1E]/5 px-3 py-2 rounded"
                          >
                            <Clock size={14} className="text-[#800913]" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {rule.experienceIds.map((expId) => {
                          const exp = experiences.find((e) => e.id === expId)
                          return exp ? (
                            <Badge
                              key={expId}
                              variant="outline"
                              className="text-xs"
                            >
                              {exp.title}
                            </Badge>
                          ) : null
                        })}
                        {rule.experienceIds.length === 0 && (
                          <span className="text-sm text-[#1E1E1E]/40">
                            Toutes les experiences
                          </span>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openRecurringModal(rule)}
                        >
                          <Edit2 size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const newRule = {
                              ...rule,
                              id: `rule-${Date.now()}`,
                              name: `${rule.name} (copie)`,
                            }
                            setRecurringRules((prev) => [...prev, newRule])
                          }}
                        >
                          <Copy size={14} className="mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteRecurringRule(rule.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}

          {recurringRules.filter((r) => r.calendarId === selectedCalendar)
            .length === 0 && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-12 text-center">
                <Repeat size={40} className="mx-auto text-[#1E1E1E]/20 mb-4" />
                <p className="text-[#1E1E1E]/60 mb-4">
                  Aucune regle recurrente pour ce calendrier
                </p>
                <Button
                  onClick={() => openRecurringModal()}
                  className="bg-[#800913] hover:bg-[#600910] text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Creer une regle
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Specific Dates Tab */}
        <TabsContent value="specific" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#1E1E1E]/60">
              Les dates specifiques remplacent les regles recurrentes
            </p>
            <Button
              onClick={() => openDateModal()}
              className="bg-[#800913] hover:bg-[#600910] text-white"
            >
              <Plus size={16} className="mr-2" />
              Nouvelle date
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specificDates
              .filter((s) => s.calendarId === selectedCalendar)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((dateSlot) => (
                <Card
                  key={dateSlot.id}
                  className={`border-none shadow-sm ${
                    dateSlot.isBlocked ? "bg-red-50" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-[#1E1E1E]">
                          {new Date(dateSlot.date).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {dateSlot.note && (
                          <p className="text-sm text-[#1E1E1E]/60 mt-1">
                            {dateSlot.note}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              openDateModal(dateSlot.date, dateSlot)
                            }
                          >
                            <Edit2 size={14} className="mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteSpecificDate(dateSlot.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {dateSlot.isBlocked ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <X size={16} />
                        <span className="text-sm font-medium">
                          Journee bloquee
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dateSlot.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-2 text-sm bg-white px-2 py-1 rounded"
                          >
                            <Clock size={12} className="text-[#800913]" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                        {dateSlot.slots.length === 0 && (
                          <p className="text-sm text-[#1E1E1E]/40">
                            Aucun creneau
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>

          {specificDates.filter((s) => s.calendarId === selectedCalendar)
            .length === 0 && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-12 text-center">
                <CalendarDays
                  size={40}
                  className="mx-auto text-[#1E1E1E]/20 mb-4"
                />
                <p className="text-[#1E1E1E]/60 mb-4">
                  Aucune date specifique configuree
                </p>
                <Button
                  onClick={() => openDateModal()}
                  className="bg-[#800913] hover:bg-[#600910] text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une date
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Recurring Rule Modal */}
      <Dialog open={showRecurringModal} onOpenChange={setShowRecurringModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule
                ? "Modifier la regle recurrente"
                : "Nouvelle regle recurrente"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Nom de la regle</Label>
              <Input
                value={ruleForm.name || ""}
                onChange={(e) =>
                  setRuleForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: Horaires semaine"
              />
            </div>

            <div className="space-y-2">
              <Label>Jours de la semaine</Label>
              <div className="flex flex-wrap gap-2">
                {dayNamesFull.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(index)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      ruleForm.days?.includes(index)
                        ? "bg-[#800913] text-white border-[#800913]"
                        : "border-[#1E1E1E]/20 hover:border-[#800913]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Creneaux horaires</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot("rule")}
                >
                  <Plus size={14} className="mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {ruleForm.slots?.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-3 bg-[#1E1E1E]/5 p-3 rounded-lg"
                  >
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateTimeSlot(
                          "rule",
                          slot.id,
                          "startTime",
                          e.target.value
                        )
                      }
                      className="w-32"
                    />
                    <span className="text-[#1E1E1E]/40">a</span>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateTimeSlot(
                          "rule",
                          slot.id,
                          "endTime",
                          e.target.value
                        )
                      }
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot("rule", slot.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {ruleForm.slots?.length === 0 && (
                  <p className="text-sm text-[#1E1E1E]/40 text-center py-4">
                    Aucun creneau ajoute
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Experiences concernees (laisser vide = toutes)</Label>
              <div className="grid grid-cols-2 gap-2">
                {experiences.map((exp) => (
                  <label
                    key={exp.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      ruleForm.experienceIds?.includes(exp.id)
                        ? "border-[#800913] bg-[#800913]/5"
                        : "border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30"
                    }`}
                  >
                    <Checkbox
                      checked={ruleForm.experienceIds?.includes(exp.id)}
                      onCheckedChange={() => toggleExperience("rule", exp.id)}
                    />
                    <div>
                      <p className="font-medium text-sm">{exp.title}</p>
                      <p className="text-xs text-[#1E1E1E]/50">{exp.duration}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={ruleForm.active ?? true}
                onCheckedChange={(checked) =>
                  setRuleForm((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label>Regle active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRecurringModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={saveRecurringRule}
              className="bg-[#800913] hover:bg-[#600910] text-white"
            >
              {editingRule ? "Mettre a jour" : "Creer la regle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Specific Date Modal */}
      <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDateSlot
                ? "Modifier la date"
                : "Configurer une date specifique"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={dateForm.date || ""}
                onChange={(e) =>
                  setDateForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Note (optionnel)</Label>
              <Input
                value={dateForm.note || ""}
                onChange={(e) =>
                  setDateForm((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Ex: Saint-Valentin, Jour ferie..."
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <Switch
                checked={dateForm.isBlocked ?? false}
                onCheckedChange={(checked) =>
                  setDateForm((prev) => ({
                    ...prev,
                    isBlocked: checked,
                    slots: checked ? [] : prev.slots,
                  }))
                }
              />
              <div>
                <Label className="text-red-700">Bloquer cette journee</Label>
                <p className="text-sm text-red-600/70">
                  Aucune reservation possible ce jour
                </p>
              </div>
            </div>

            {!dateForm.isBlocked && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Creneaux horaires</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot("date")}
                    >
                      <Plus size={14} className="mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {dateForm.slots?.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-3 bg-[#1E1E1E]/5 p-3 rounded-lg"
                      >
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              "date",
                              slot.id,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                        <span className="text-[#1E1E1E]/40">a</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              "date",
                              slot.id,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimeSlot("date", slot.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    {dateForm.slots?.length === 0 && (
                      <p className="text-sm text-[#1E1E1E]/40 text-center py-4">
                        Aucun creneau ajoute
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Experiences concernees (laisser vide = toutes)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {experiences.map((exp) => (
                      <label
                        key={exp.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          dateForm.experienceIds?.includes(exp.id)
                            ? "border-[#800913] bg-[#800913]/5"
                            : "border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30"
                        }`}
                      >
                        <Checkbox
                          checked={dateForm.experienceIds?.includes(exp.id)}
                          onCheckedChange={() =>
                            toggleExperience("date", exp.id)
                          }
                        />
                        <div>
                          <p className="font-medium text-sm">{exp.title}</p>
                          <p className="text-xs text-[#1E1E1E]/50">
                            {exp.duration}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {editingDateSlot && (
              <Button
                variant="outline"
                onClick={() => {
                  deleteSpecificDate(editingDateSlot.id)
                  setShowDateModal(false)
                }}
                className="text-red-600 hover:bg-red-50 mr-auto"
              >
                <Trash2 size={14} className="mr-2" />
                Supprimer
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowDateModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={saveSpecificDate}
              className="bg-[#800913] hover:bg-[#600910] text-white"
            >
              {editingDateSlot ? "Mettre a jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Config Modal */}
      <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCalendar
                ? "Modifier le calendrier"
                : "Nouveau calendrier"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du calendrier</Label>
              <Input
                value={calendarForm.name || ""}
                onChange={(e) =>
                  setCalendarForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: Calendrier de Marie"
              />
            </div>

            <div className="space-y-2">
              <Label>Assigne a (optionnel)</Label>
              <Input
                value={calendarForm.assignedTo || ""}
                onChange={(e) =>
                  setCalendarForm((prev) => ({
                    ...prev,
                    assignedTo: e.target.value,
                  }))
                }
                placeholder="Nom de l'employe"
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex gap-2">
                {[
                  "#800913",
                  "#2563eb",
                  "#059669",
                  "#d97706",
                  "#7c3aed",
                  "#db2777",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setCalendarForm((prev) => ({ ...prev, color }))
                    }
                    className={`w-10 h-10 rounded-full transition-all ${
                      calendarForm.color === color
                        ? "ring-2 ring-offset-2 ring-[#1E1E1E]"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={calendarForm.active ?? true}
                onCheckedChange={(checked) =>
                  setCalendarForm((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label>Calendrier actif</Label>
            </div>
          </div>

          <DialogFooter>
            {editingCalendar && calendars.length > 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  deleteCalendar(editingCalendar.id)
                  setShowCalendarModal(false)
                }}
                className="text-red-600 hover:bg-red-50 mr-auto"
              >
                <Trash2 size={14} className="mr-2" />
                Supprimer
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowCalendarModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={saveCalendar}
              className="bg-[#800913] hover:bg-[#600910] text-white"
            >
              {editingCalendar ? "Mettre a jour" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
