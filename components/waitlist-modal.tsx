"use client"

import React from "react"

import { useState, useEffect } from "react"
import { X, Check, Loader2, Bell, Sparkles, Heart } from "lucide-react"
import { subscribeUser } from "@/app/actions/newsletter"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  experienceName?: string
}

export function WaitlistModal({ isOpen, onClose, experienceName }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interests: [] as string[],
    notifications: true,
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      // Map interest IDs to readable labels
      const interestLabels = formData.interests.map(id => {
        const interest = interests.find(i => i.id === id)
        return interest?.label || id
      })

      const result = await subscribeUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        interests: interestLabels.length > 0 ? interestLabels : undefined,
        source: 'popup'
      })

      if (result.success) {
        setStatus("success")
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          interests: [],
          notifications: true,
        })
      } else {
        setStatus("error")
        setErrorMessage(result.message || "Something went wrong. Please try again.")
        setTimeout(() => {
          setStatus("idle")
          setErrorMessage("")
        }, 5000)
      }
    } catch (error) {
      console.error("[v0] Waitlist subscription error:", error)
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again.")
      setTimeout(() => {
        setStatus("idle")
        setErrorMessage("")
      }, 5000)
    }
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const interests = [
    { id: "romantic-dinners", label: "Romantic Dinners", icon: Heart },
    { id: "outdoor-experiences", label: "Outdoor Experiences", icon: Sparkles },
    { id: "cultural-journeys", label: "Cultural Journeys", icon: Sparkles },
    { id: "surprise-events", label: "Surprise Events", icon: Bell },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FBF5EF] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors"
        >
          <X size={24} />
        </button>

        {status === "success" ? (
          /* Success State */
          <div className="p-8 lg:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#800913] flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-white" />
            </div>
            <h3 className="text-[#1E1E1E] text-2xl lg:text-3xl font-light mb-4">
              {"You're"} on the List
            </h3>
            <p className="text-[#1E1E1E]/70 leading-relaxed mb-8">
              Thank you for joining our exclusive waitlist. {"We'll"} be in touch soon
              with early access to new experiences and special invitations.
            </p>
            <button
              onClick={onClose}
              className="bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          /* Form State */
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#800913]/10 flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-[#800913]" />
              </div>
              <h3 className="text-[#1E1E1E] text-2xl lg:text-3xl font-light mb-2">
                {experienceName
                  ? `Join the Waitlist`
                  : "Be the First to Know"}
              </h3>
              <p className="text-[#1E1E1E]/60 text-sm">
                {experienceName
                  ? `Get notified when ${experienceName} becomes available`
                  : "Exclusive access to new experiences and special offers"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1E1E]/60 text-xs tracking-[0.1em] uppercase mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] text-sm focus:border-[#800913]/40 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1E1E]/60 text-xs tracking-[0.1em] uppercase mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] text-sm focus:border-[#800913]/40 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#1E1E1E]/60 text-xs tracking-[0.1em] uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] text-sm focus:border-[#800913]/40 outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[#1E1E1E]/60 text-xs tracking-[0.1em] uppercase mb-2">
                  Phone Number <span className="text-[#1E1E1E]/40">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+971"
                  className="w-full px-4 py-3 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] text-sm placeholder:text-[#1E1E1E]/30 focus:border-[#800913]/40 outline-none transition-colors"
                />
              </div>

              {/* Interests */}
              {!experienceName && (
                <div>
                  <label className="block text-[#1E1E1E]/60 text-xs tracking-[0.1em] uppercase mb-3">
                    {"I'm"} Interested In
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs transition-all duration-300 ${
                          formData.interests.includes(interest.id)
                            ? "bg-[#800913] text-white"
                            : "bg-white border border-[#1E1E1E]/10 text-[#1E1E1E]/70 hover:border-[#800913]/30"
                        }`}
                      >
                        <interest.icon size={14} />
                        {interest.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) =>
                      setFormData({ ...formData, notifications: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border transition-all duration-300 flex items-center justify-center ${
                      formData.notifications
                        ? "bg-[#800913] border-[#800913]"
                        : "bg-white border-[#1E1E1E]/20"
                    }`}
                  >
                    {formData.notifications && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <span className="text-[#1E1E1E]/60 text-xs leading-relaxed">
                  I agree to receive exclusive updates, early access notifications,
                  and special offers from Fougue.
                </span>
              </label>

              {/* Error Message */}
              {status === "error" && errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Join the Waitlist"
                )}
              </button>

              <p className="text-[#1E1E1E]/40 text-xs text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
