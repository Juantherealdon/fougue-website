"use client"

import { useState } from "react"
import {
  X,
  Calendar,
  Clock,
  Plus,
  Minus,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth, type UserBooking } from "./auth-context"

interface EditBookingModalProps {
  booking: UserBooking
  onClose: () => void
}

const AVAILABLE_ADDONS = [
  {
    id: "rose-petals",
    name: "Rose Petal Decoration",
    price: 150,
    description: "Romantic rose petal arrangement",
  },
  {
    id: "champagne",
    name: "Premium Champagne",
    price: 350,
    description: "Moët & Chandon Imperial",
  },
  {
    id: "live-music",
    name: "Live Musician",
    price: 400,
    description: "Private violinist or guitarist",
  },
  {
    id: "photographer",
    name: "Professional Photographer",
    price: 500,
    description: "30-minute photo session",
  },
  {
    id: "chocolates",
    name: "Luxury Chocolate Box",
    price: 120,
    description: "Handcrafted artisan chocolates",
  },
  {
    id: "spa-package",
    name: "Couples Spa Add-on",
    price: 600,
    description: "30-minute massage for two",
  },
]

const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
]

export function EditBookingModal({ booking, onClose }: EditBookingModalProps) {
  const { updateBooking, cancelBooking } = useAuth()
  const [activeTab, setActiveTab] = useState<"details" | "addons" | "cancel">(
    "details"
  )
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)

  // Date and time state
  const [selectedDate, setSelectedDate] = useState(booking.date)
  const [selectedTime, setSelectedTime] = useState(booking.time)
  const [currentMonth, setCurrentMonth] = useState(new Date(booking.date))

  // Add-ons state
  const existingAddonIds = booking.addOns.map((a) =>
    a.name.toLowerCase().replace(/\s+/g, "-")
  )
  const [selectedAddons, setSelectedAddons] =
    useState<string[]>(existingAddonIds)

  // Special requests
  const [specialRequests, setSpecialRequests] = useState(
    booking.specialRequests || ""
  )

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    )
  }

  const calculateNewTotal = () => {
    const basePrice = 2500 // Base experience price
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = AVAILABLE_ADDONS.find((a) => a.id === id)
      return sum + (addon?.price || 0)
    }, 0)
    return basePrice + addonsTotal
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAddons = selectedAddons.map((id) => {
      const addon = AVAILABLE_ADDONS.find((a) => a.id === id)
      return { name: addon?.name || "", price: addon?.price || 0 }
    })

    updateBooking(booking.id, {
      date: selectedDate,
      time: selectedTime,
      addOns: newAddons,
      specialRequests,
      totalPrice: calculateNewTotal(),
    })

    setIsSaving(false)
    onClose()
  }

  const handleCancel = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    cancelBooking(booking.id)
    setIsSaving(false)
    onClose()
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add padding for days before first of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateSelectable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-[#FBF5EF] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-[#1E1E1E] px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl text-white font-light">Modify Booking</h2>
            <p className="text-white/50 text-sm mt-1">
              {booking.experienceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1E1E1E]/10 shrink-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 text-sm tracking-wide transition-colors ${
              activeTab === "details"
                ? "text-[#800913] border-b-2 border-[#800913]"
                : "text-[#1E1E1E]/50 hover:text-[#1E1E1E]"
            }`}
          >
            Date & Time
          </button>
          <button
            onClick={() => setActiveTab("addons")}
            className={`flex-1 py-4 text-sm tracking-wide transition-colors ${
              activeTab === "addons"
                ? "text-[#800913] border-b-2 border-[#800913]"
                : "text-[#1E1E1E]/50 hover:text-[#1E1E1E]"
            }`}
          >
            Add-ons
          </button>
          <button
            onClick={() => setActiveTab("cancel")}
            className={`flex-1 py-4 text-sm tracking-wide transition-colors ${
              activeTab === "cancel"
                ? "text-[#800913] border-b-2 border-[#800913]"
                : "text-[#1E1E1E]/50 hover:text-[#1E1E1E]"
            }`}
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Date & Time Tab */}
          {activeTab === "details" && (
            <div className="space-y-6 animate-fade-in">
              {/* Calendar */}
              <div>
                <label className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-4">
                  <Calendar size={14} />
                  Select New Date
                </label>

                <div className="bg-white p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-2 hover:bg-[#FBF5EF] transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-lg font-light text-[#1E1E1E]">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-2 hover:bg-[#FBF5EF] transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-xs text-[#1E1E1E]/40 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        disabled={!day || !isDateSelectable(day)}
                        onClick={() =>
                          day && setSelectedDate(formatDateForComparison(day))
                        }
                        className={`aspect-square flex items-center justify-center text-sm transition-all ${
                          !day
                            ? "invisible"
                            : !isDateSelectable(day)
                              ? "text-[#1E1E1E]/20 cursor-not-allowed"
                              : selectedDate === formatDateForComparison(day)
                                ? "bg-[#800913] text-white"
                                : "hover:bg-[#FBF5EF]"
                        }`}
                      >
                        {day?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-4">
                  <Clock size={14} />
                  Select Time
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 text-sm transition-all ${
                        selectedTime === time
                          ? "bg-[#800913] text-white"
                          : "bg-white hover:bg-[#1E1E1E] hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2 block">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-transparent focus:border-[#800913] outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Add-ons Tab */}
          {activeTab === "addons" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-[#1E1E1E]/60 mb-4">
                Enhance your experience with additional services
              </p>

              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-center justify-between p-4 transition-all ${
                      isSelected
                        ? "bg-[#800913]/5 border border-[#800913]"
                        : "bg-white hover:bg-[#FBF5EF] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#800913] text-white"
                            : "border border-[#1E1E1E]/20"
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                      </div>
                      <div className="text-left">
                        <p className="text-[#1E1E1E]">{addon.name}</p>
                        <p className="text-sm text-[#1E1E1E]/50">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg ${
                          isSelected ? "text-[#800913]" : "text-[#1E1E1E]"
                        }`}
                      >
                        +AED {addon.price}
                      </span>
                    </div>
                  </button>
                )
              })}

              {/* Summary */}
              <div className="mt-6 p-4 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1E1E1E]/60">Base Experience</span>
                  <span>AED 2,500</span>
                </div>
                {selectedAddons.map((id) => {
                  const addon = AVAILABLE_ADDONS.find((a) => a.id === id)
                  return (
                    <div
                      key={id}
                      className="flex justify-between items-center mb-2 text-sm"
                    >
                      <span className="text-[#1E1E1E]/60">{addon?.name}</span>
                      <span>+AED {addon?.price}</span>
                    </div>
                  )
                })}
                <div className="flex justify-between items-center pt-3 border-t border-[#1E1E1E]/10 mt-3">
                  <span className="font-medium">New Total</span>
                  <span className="text-xl text-[#800913]">
                    AED {calculateNewTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Tab */}
          {activeTab === "cancel" && (
            <div className="animate-fade-in">
              {!showConfirmCancel ? (
                <div className="text-center py-8">
                  <AlertCircle
                    size={48}
                    className="mx-auto text-amber-500 mb-4"
                  />
                  <h3 className="text-xl text-[#1E1E1E] mb-2">
                    Cancel this booking?
                  </h3>
                  <p className="text-[#1E1E1E]/60 mb-6 max-w-sm mx-auto">
                    Please review our cancellation policy before proceeding.
                    Cancellations made less than 48 hours before the experience
                    may incur a fee.
                  </p>

                  <div className="bg-white p-4 mb-6 text-left">
                    <h4 className="font-medium text-[#1E1E1E] mb-2">
                      Cancellation Policy:
                    </h4>
                    <ul className="text-sm text-[#1E1E1E]/60 space-y-2">
                      <li>
                        - More than 7 days before: Full refund
                      </li>
                      <li>
                        - 3-7 days before: 50% refund
                      </li>
                      <li>
                        - Less than 3 days: No refund
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowConfirmCancel(true)}
                    className="bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
                  >
                    Proceed to Cancel
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle
                    size={48}
                    className="mx-auto text-red-500 mb-4"
                  />
                  <h3 className="text-xl text-[#1E1E1E] mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-[#1E1E1E]/60 mb-6">
                    This action cannot be undone.
                  </p>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowConfirmCancel(false)}
                      className="px-8 py-3 text-sm tracking-[0.2em] uppercase border border-[#1E1E1E]/20 hover:border-[#1E1E1E] transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-red-600 text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Confirm Cancel"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab !== "cancel" && (
          <div className="border-t border-[#1E1E1E]/10 p-6 flex justify-between items-center shrink-0 bg-white">
            <div>
              <p className="text-sm text-[#1E1E1E]/50">Updated Total</p>
              <p className="text-2xl text-[#800913]">
                AED {calculateNewTotal().toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
