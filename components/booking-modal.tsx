"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Check, Calendar, Clock } from "lucide-react"
import { useCart } from "./cart-context"
import { useRouter } from "next/navigation"

interface AddOn {
  id: string
  name: string
  description: string
  price: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  experienceId: string
  experienceTitle: string
  experiencePrice: number
  experienceImage?: string
  experienceDuration?: string
  addOns: AddOn[]
}

const occasions = [
  "Anniversary",
  "Birthday",
  "Valentine's Day",
  "Proposal",
  "Just Because",
  "Honeymoon",
  "Reconciliation",
  "Other",
]

export function BookingModal({
  isOpen,
  onClose,
  experienceId,
  experienceTitle,
  experiencePrice,
  experienceImage = "/placeholder.svg",
  experienceDuration,
  addOns,
}: BookingModalProps) {
  const { addItem, setIsCartOpen } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [guests, setGuests] = useState(2)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    occasion: "",
    forWhom: "",
    specialRequests: "",
  })

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedAddOns([])
      setSelectedDate(null)
      setSelectedTime(null)
      setCurrentMonth(new Date())
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        occasion: "",
        forWhom: "",
        specialRequests: "",
      })
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Fetch available slots for the current month
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!isOpen || !experienceId) return
      
      setIsLoadingSlots(true)
      try {
        // Calculate date range for current month view
        const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        
        const response = await fetch(
          `/api/availability/slots?experienceId=${experienceId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Availability data received:", data)
          
          // API returns array: [{ date: "2026-02-01", times: [...] }, ...]
          const slotsArray = data.slots || []
          const datesWithSlots = slotsArray
            .filter((dayData: { date: string; times: TimeSlot[] }) => 
              dayData.times && dayData.times.some(t => t.available)
            )
            .map((dayData: { date: string }) => dayData.date)
          
          console.log("[v0] Dates with available slots:", datesWithSlots)
          setAvailableDates(datesWithSlots)
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
      setIsLoadingSlots(false)
    }
    
    fetchAvailability()
  }, [isOpen, experienceId, currentMonth])

  // Fetch time slots when a date is selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !experienceId) {
        setTimeSlots([])
        return
      }
      
      setIsLoadingSlots(true)
      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        const response = await fetch(
          `/api/availability/slots?experienceId=${experienceId}&startDate=${dateStr}&endDate=${dateStr}`
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Time slots data for", dateStr, ":", data)
          
          // API returns array: [{ date: "2026-02-01", times: [...] }] and durationHours
          const slotsArray = data.slots || []
          const dayData = slotsArray.find((d: { date: string }) => d.date === dateStr)
          const daySlots = dayData?.times || []
          const duration = data.durationHours || 2
          
          // Add end time to each slot based on duration
          const slotsWithEndTime = daySlots.map((slot: { time: string; available: boolean }) => {
            const [hours, minutes] = slot.time.split(':').map(Number)
            const endHours = hours + duration
            const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            return {
              ...slot,
              endTime,
              duration,
            }
          })
          
          console.log("[v0] Day slots with end time:", slotsWithEndTime)
          setTimeSlots(slotsWithEndTime)
        }
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setTimeSlots([])
      }
      setIsLoadingSlots(false)
    }
    
    fetchTimeSlots()
  }, [selectedDate, experienceId])

  if (!isOpen) return null

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const calculateTotal = () => {
    const addOnsTotal = addOns
      .filter((a) => selectedAddOns.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0)
    return experiencePrice + addOnsTotal
  }

  // Calendar helpers
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

  const isDateSelectable = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if date is in the past
    if (date < today) return false
    
    // Check if date has available slots
    const dateStr = date.toISOString().split('T')[0]
    return availableDates.includes(dateStr)
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

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

  const selectDate = (day: number) => {
    if (isDateSelectable(day)) {
      setSelectedDate(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      )
      setSelectedTime(null)
    }
  }

  const canProceed = () => {
    if (step === 1) return true
    if (step === 2) return selectedDate !== null && selectedTime !== null
    if (step === 3) {
      return true
    }
    return false
  }

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) return

    // Get selected add-ons with their details
    const selectedAddOnsDetails = addOns
      .filter((a) => selectedAddOns.includes(a.id))
      .map(addon => ({ id: addon.id, name: addon.name, price: addon.price }))

    // Calculate total price including add-ons
    const addOnsTotal = selectedAddOnsDetails.reduce((sum, a) => sum + a.price, 0)
    const totalPrice = experiencePrice + addOnsTotal

    // Add experience to cart
    addItem({
      type: 'experience',
      id: `exp-${experienceId}-${Date.now()}`,
      experienceId,
      title: experienceTitle,
      price: totalPrice,
      currency: 'AED',
      image: experienceImage,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      guests,
      duration: experienceDuration,
      addOns: selectedAddOnsDetails.length > 0 ? selectedAddOnsDetails : undefined,
    })

    // Close modal and open cart
    onClose()
    setIsCartOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] mx-4 bg-[#FBF5EF] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1E1E1E] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[#800913] text-xs tracking-[0.2em] uppercase">
              Book Experience
            </p>
            <h2 className="text-white text-xl font-light">{experienceTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-[#FBF5EF] px-6 py-4 border-b border-[#1E1E1E]/10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    step >= s
                      ? "bg-[#800913] text-white"
                      : "bg-[#1E1E1E]/10 text-[#1E1E1E]/40"
                  }`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 md:w-24 h-px mx-2 transition-colors ${
                      step > s ? "bg-[#800913]" : "bg-[#1E1E1E]/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-[#1E1E1E]/60">
            <span>Add-ons</span>
            <span>Date & Time</span>
            <span>Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          {/* Step 1: Add-ons */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h3 className="text-[#1E1E1E] text-2xl font-light mb-2">
                  Enhance Your Experience
                </h3>
                <p className="text-[#1E1E1E]/60">
                  Select optional add-ons to make your experience even more
                  special
                </p>
              </div>

              <div className="space-y-3">
                {addOns.map((addOn) => (
                  <label
                    key={addOn.id}
                    className={`flex items-start gap-4 p-4 cursor-pointer transition-all border ${
                      selectedAddOns.includes(addOn.id)
                        ? "border-[#800913] bg-[#800913]/5"
                        : "border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                        selectedAddOns.includes(addOn.id)
                          ? "border-[#800913] bg-[#800913]"
                          : "border-[#1E1E1E]/30"
                      }`}
                    >
                      {selectedAddOns.includes(addOn.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="sr-only"
                    />
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <h4 className="text-[#1E1E1E] font-medium">
                          {addOn.name}
                        </h4>
                        <span className="text-[#800913] font-medium ml-4">
                          +AED {addOn.price}
                        </span>
                      </div>
                      <p className="text-[#1E1E1E]/60 text-sm mt-1">
                        {addOn.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Calendar */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Calendar Section */}
              <div className="flex-1">
                <div className="text-center lg:text-left mb-6">
                  <h3 className="text-[#1E1E1E] text-xl font-light mb-1">
                    Select Date
                  </h3>
                  <p className="text-[#1E1E1E]/50 text-sm">
                    Available dates are highlighted
                  </p>
                </div>

                <div className="bg-white border border-[#1E1E1E]/10 p-4 lg:p-5">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#800913]/10 transition-colors rounded-full"
                    >
                      <ChevronLeft size={18} className="text-[#1E1E1E]" />
                    </button>
                    <span className="text-[#1E1E1E] font-medium tracking-wide uppercase text-sm">
                      {formatMonth(currentMonth)}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#800913]/10 transition-colors rounded-full"
                    >
                      <ChevronRight size={18} className="text-[#1E1E1E]" />
                    </button>
                  </div>

                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-0 mb-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div
                        key={i}
                        className="text-center text-[10px] text-[#1E1E1E]/40 font-medium py-2 uppercase tracking-widest"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid - Compact */}
                  <div className="grid grid-cols-7 gap-0">
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const isSelected = selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth.getMonth()
                      const isSelectable = day && isDateSelectable(day)
                      const isToday = day === new Date().getDate() && 
                        currentMonth.getMonth() === new Date().getMonth() &&
                        currentMonth.getFullYear() === new Date().getFullYear()
                      
                      return (
                        <button
                          key={index}
                          onClick={() => day && selectDate(day)}
                          disabled={!day || !isSelectable}
                          className={`
                            aspect-square flex items-center justify-center text-sm relative transition-all
                            ${!day ? "invisible" : ""}
                            ${!isSelectable && day ? "text-[#1E1E1E]/20 cursor-not-allowed" : ""}
                            ${isSelected ? "bg-[#800913] text-white" : ""}
                            ${isSelectable && !isSelected ? "bg-green-50 text-green-700 hover:bg-green-100" : ""}
                            ${isToday && !isSelected ? "font-bold ring-1 ring-inset ring-[#1E1E1E]/20" : ""}
                          `}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#1E1E1E]/5">
                    <div className="flex items-center gap-1.5 text-[10px] text-green-600 uppercase tracking-wider">
                      <span className="w-2 h-2 bg-green-100 border border-green-300 rounded-sm" />
                      Available
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#1E1E1E]/30 uppercase tracking-wider">
                      <span className="w-2 h-2 bg-[#1E1E1E]/5 rounded-sm" />
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="flex-1">
                <div className="text-center lg:text-left mb-6">
                  <h3 className="text-[#1E1E1E] text-xl font-light mb-1">
                    Select Time
                  </h3>
                  <p className="text-[#1E1E1E]/50 text-sm">
                    {selectedDate 
                      ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                      : 'Please select a date first'
                    }
                  </p>
                </div>

                <div className={`bg-white border border-[#1E1E1E]/10 p-4 lg:p-5 ${!selectedDate ? 'opacity-50' : ''}`}>
                  {selectedDate ? (
                    timeSlots.filter(s => s.available).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.filter(slot => slot.available).map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`
                              py-3 px-4 text-sm font-medium transition-all relative
                              ${selectedTime === slot.time
                                ? "bg-[#800913] text-white border border-[#800913]"
                                : "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 hover:border-green-400"
                              }
                            `}
                          >
                            <span className="block">{slot.time} - {slot.endTime}</span>
                            {selectedTime === slot.time && (
                              <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-[#1E1E1E]/40">
                        <Clock size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No available times for this date</p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-[#1E1E1E]/30">
                      <Clock size={32} className="mb-3 opacity-50" />
                      <p className="text-sm">Select a date to view available times</p>
                    </div>
                  )}
                </div>

                {/* Selection Summary */}
                {selectedDate && selectedTime && (
                  <div className="mt-4 p-4 bg-[#800913]/5 border border-[#800913]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#800913] flex items-center justify-center">
                        <Check size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[#1E1E1E] font-medium text-sm">Your Selection</p>
                        <p className="text-[#1E1E1E]/60 text-sm">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                          {timeSlots.find(s => s.time === selectedTime)?.endTime && (
                            <span> - {timeSlots.find(s => s.time === selectedTime)?.endTime}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Curation & Personalisation */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-8 px-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#800913"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-6"
              >
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                <path d="M5 3v4" />
                <path d="M3 5h4" />
                <path d="M19 17v4" />
                <path d="M17 19h4" />
              </svg>
              <h3 className="text-[#1E1E1E] text-2xl font-light mb-5 text-balance text-center">
                Let Us Curate <span className="italic font-serif text-[#800913]">Your</span> Moment
              </h3>
              <p className="text-[#1E1E1E]/50 text-sm leading-relaxed max-w-sm text-center">
                Once your experience is confirmed, we will personally connect with you to refine the intimate details: from dietary preferences, to subtle touches and the little things that only you would know — so the moment feels unmistakably yours.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#1E1E1E]/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1E1E1E]/60 text-sm">Total</p>
              <p className="text-[#1E1E1E] text-2xl font-light">
                AED {calculateTotal().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-[#1E1E1E]/20 text-[#1E1E1E] text-sm tracking-[0.15em] uppercase hover:border-[#1E1E1E] transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-[#800913] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-[#800913] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
