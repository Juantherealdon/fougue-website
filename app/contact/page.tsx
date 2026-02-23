"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  MessageCircle,
  Mail,
  Instagram,
  MapPin,
  Send,
  ArrowRight,
} from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"

export default function ContactPage() {
  return (
    <main className="bg-[#FBF5EF]">
      <Navigation />
      <HeroSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/letter-seal.jpg"
          alt="Fougue sealed letter"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p
          className={`text-white/80 text-sm tracking-[0.4em] uppercase mb-6 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Get in Touch
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-7xl font-light mb-6 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {"Let's create your "}
          <span className="italic text-[#800913]">Fougue.</span>
          {" story."}
        </h1>
        <p
          className={`text-white/70 text-lg md:text-xl max-w-2xl transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {"We're here to help you plan something meaningful."}
        </p>
      </div>
    </section>
  )
}

interface Experience {
  id: string
  title: string
  status: string
}

function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [loadingExperiences, setLoadingExperiences] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Load experiences when subject is "Book an Experience"
  useEffect(() => {
    if (formData.subject === "Book an Experience" && experiences.length === 0) {
      setLoadingExperiences(true)
      fetch('/api/experiences')
        .then(res => res.json())
        .then(data => {
          const filteredExperiences = data
            .filter((exp: any) => exp.status === 'available' || exp.status === 'almost_available')
            .map((exp: any) => ({
              id: exp.id,
              title: exp.title,
              status: exp.status,
            }))
          setExperiences(filteredExperiences)
        })
        .catch(err => console.error('Error loading experiences:', err))
        .finally(() => setLoadingExperiences(false))
    }
    // Clear selected experiences if subject changes away from "Book an Experience"
    if (formData.subject !== "Book an Experience") {
      setSelectedExperiences([])
    }
  }, [formData.subject, experiences.length])

  const toggleExperience = (experienceTitle: string) => {
    setSelectedExperiences(prev => 
      prev.includes(experienceTitle)
        ? prev.filter(t => t !== experienceTitle)
        : [...prev, experienceTitle]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await sendContactEmail({
        ...formData,
        selectedExperiences: formData.subject === "Book an Experience" ? selectedExperiences : [],
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error('[v0] Error submitting contact form:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+971 52 315 7273",
      href: "https://wa.me/971523157273",
      color: "#25D366",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@fougue.ae",
      href: "mailto:hello@fougue.ae",
      color: "#800913",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@lovewithfougue",
      href: "https://instagram.com/lovewithfougue",
      color: "#E4405F",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dubai, UAE",
      href: null,
      color: "#1E1E1E",
    },
  ]

  const subjects = [
    "Book an Experience",
    "Gift Inquiry",
    "Collaboration",
    "Press",
    "Other",
  ]

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column - Contact Info */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <p className="text-[#1E1E1E]/60 text-base leading-relaxed mb-10">
              Whether you're dreaming of a personalised immersive romantic
              moment for two, looking for the perfect gift, or wishing to
              collaborate with <span className="italic">Fougue.</span>, we'd
              love to hear from you.
            </p>

            {/* Contact Methods */}
            <div className="space-y-2 mb-10">
              {contactMethods.map((method, index) => (
                <div
                  key={method.label}
                  className={`transition-all duration-500`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {method.href ? (
                    <a
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 py-4 border-b border-[#1E1E1E]/5 hover:border-[#800913]/20 transition-all duration-300"
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${method.color}12` }}
                      >
                        <method.icon size={18} style={{ color: method.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#1E1E1E]/40 text-xs tracking-[0.15em] uppercase">
                          {method.label}
                        </p>
                        <p className="text-[#1E1E1E] text-lg font-light group-hover:text-[#800913] transition-colors">
                          {method.value}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-[#1E1E1E]/20 group-hover:text-[#800913] group-hover:translate-x-1 transition-all" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 py-4 border-b border-[#1E1E1E]/5">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${method.color}12` }}
                      >
                        <method.icon size={18} style={{ color: method.color }} />
                      </div>
                      <div>
                        <p className="text-[#1E1E1E]/40 text-xs tracking-[0.15em] uppercase">
                          {method.label}
                        </p>
                        <p className="text-[#1E1E1E] text-lg font-light">{method.value}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Collaboration & Press Notes */}
            <div
              className={`space-y-3 transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="p-5 bg-white/50 border border-[#1E1E1E]/5">
                <p className="text-[#1E1E1E]/50 text-sm mb-1">
                  For collaboration inquiries:
                </p>
                <a
                  href="mailto:partners@fougue.ae"
                  className="text-[#800913] text-lg font-light hover:underline"
                >
                  partners@fougue.ae
                </a>
              </div>
              <div className="p-5 bg-white/50 border border-[#1E1E1E]/5">
                <p className="text-[#1E1E1E]/50 text-sm mb-1">
                  For press inquiries:
                </p>
                <a
                  href="mailto:press@fougue.ae"
                  className="text-[#800913] text-lg font-light hover:underline"
                >
                  press@fougue.ae
                </a>
              </div>
            </div>

            {/* Quote */}
            <div
              className={`mt-12 pl-6 border-l-2 border-[#800913]/30 transition-all duration-700 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-[#1E1E1E] text-xl font-light italic mb-1">
                Love begins with intention.
              </p>
              <p className="text-[#1E1E1E]/40 text-sm">
                Your message is the first step.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {isSubmitted ? (
              <div className="bg-white p-10 lg:p-12 border border-[#1E1E1E]/5 text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#800913]/10 flex items-center justify-center mx-auto mb-6">
                  <Send size={22} className="text-[#800913]" />
                </div>
                <h3 className="text-[#1E1E1E] text-2xl font-light mb-3">
                  Message Sent
                </h3>
                <p className="text-[#1E1E1E]/60 mb-8">
                  {"Thank you for reaching out. We'll be in touch soon."}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    })
                  }}
                  className="text-[#800913] text-sm tracking-[0.15em] uppercase hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-10 border border-[#1E1E1E]/5">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
                        placeholder="+971"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Selection - Only shows when "Book an Experience" is selected */}
                  {formData.subject === "Book an Experience" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-3">
                        Which experience(s) are you interested in?
                      </label>
                      {loadingExperiences ? (
                        <div className="flex items-center gap-2 text-[#1E1E1E]/40 text-sm">
                          <div className="w-4 h-4 border-2 border-[#800913]/30 border-t-[#800913] rounded-full animate-spin" />
                          Loading experiences...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {experiences.map((exp) => (
                            <label
                              key={exp.id}
                              className="flex items-center gap-3 p-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 hover:border-[#800913]/30 cursor-pointer transition-all group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedExperiences.includes(exp.title)}
                                onChange={() => toggleExperience(exp.title)}
                                className="w-4 h-4 accent-[#800913] cursor-pointer"
                              />
                              <span className="flex-1 text-[#1E1E1E] text-sm group-hover:text-[#800913] transition-colors">
                                {exp.title}
                              </span>
                              {exp.status === 'almost_available' && (
                                <span className="text-[10px] tracking-[0.1em] uppercase bg-[#1E1E1E]/10 text-[#1E1E1E]/60 px-2 py-0.5">
                                  Coming Soon
                                </span>
                              )}
                            </label>
                          ))}
                          {experiences.length === 0 && !loadingExperiences && (
                            <p className="text-[#1E1E1E]/40 text-sm">No experiences available at the moment.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all resize-none"
                      placeholder="Tell us about your vision..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-300 disabled:opacity-70 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
