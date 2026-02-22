"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Clock, Users, Sparkles, Bell } from "lucide-react"
import { WaitlistModal } from "@/components/waitlist-modal"
import { ChevronDown } from "lucide-react" // Declare the ChevronDown variable

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
}

const fallbackExperiences: Experience[] = [
  {
    id: "interlude-francais",
    title: "The Parisian Interlude",
    subtitle: "A Picnic Experience",
    image: "/images/experience-picnic.jpg",
    description:
      "Escape into nature with French elegance. A curated picnic featuring artisanal cheeses, fresh baguettes, and champagne, set in a dreamy location chosen just for you. Let the afternoon unfold without rush.",
    duration_hours: 2.5,
    guests: "2 people",
    highlight: "Sunset timing available",
    available: true,
    status: "available",
  },
]

const howItWorksSteps = [
  {
    number: "01",
    title: "Choose your experience",
    description: "Explore our signature universes and select the experience you wish to step into — each one designed with its own atmosphere, story, and emotion.",
  },
  {
    number: "02",
    title: "Select your date",
    description: "Choose the date and the timing that feels right.",
  },
  {
    number: "03",
    title: "Add personal touches",
    description: "Enhance the experience with curated add-ons or symbolic gifts, if you wish.",
  },
  {
    number: "04",
    title: "We tailor everything to you",
    description: "After booking, you'll receive a short personalization form to help us design a moment that feels true to you.\n\nOur team stays in touch via email or WhatsApp to refine the final details with care.",
  },
  {
    number: "05",
    title: "Arrive & enjoy",
    description: "Simply show up and be present. We orchestrate everything behind the scenes so you can fully live the moment.",
  },
]

function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const toggleStep = (index: number) => {
    setActiveStep(activeStep === index ? null : index)
  }

  return (
    <section ref={sectionRef} className="bg-[#FBF5EF] py-12 lg:py-16 border-b border-[#1E1E1E]/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header - Compact */}
        <div className="text-center mb-8">
          <h2
            className={`text-[#1E1E1E] text-2xl md:text-3xl font-light transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            How It <span className="italic text-[#800913]">Works</span>
          </h2>
        </div>

        {/* Horizontal Steps */}
        <div className="flex flex-nowrap justify-center gap-1 overflow-x-auto md:overflow-visible">
          {howItWorksSteps.map((step, index) => (
            <div
              key={step.number}
              className={`transition-all duration-500 flex-shrink-0 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${100 + index * 80}ms` }}
            >
              <button
                onClick={() => toggleStep(index)}
                className={`group flex items-center gap-1.5 px-3 py-3 md:px-4 text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  activeStep === index
                    ? "bg-[#800913] text-white"
                    : "bg-white hover:bg-[#1E1E1E] hover:text-white text-[#1E1E1E]"
                }`}
              >
                <span className={`text-xs font-medium ${activeStep === index ? "text-white/60" : "text-[#800913] group-hover:text-white/60"}`}>
                  {step.number}
                </span>
                <span>
                  {step.title}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 flex-shrink-0 ${
                    activeStep === index 
                      ? "rotate-180 text-white/60" 
                      : "text-[#1E1E1E]/30 group-hover:text-white/60"
                  }`} 
                />
              </button>
            </div>
          ))}
        </div>

        {/* Accordion Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            activeStep !== null ? "max-h-48 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          {activeStep !== null && (
            <div className="bg-white p-6 md:p-8 text-center max-w-3xl mx-auto">
              <p className="text-[#1E1E1E]/70 text-base leading-relaxed whitespace-pre-line">
                {howItWorksSteps[activeStep].description}
              </p>
            </div>
          )}
        </div>

        {/* Who it's for - No title, no border */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-[#1E1E1E]/60 text-base leading-relaxed max-w-3xl mx-auto">
            For couples who choose moments over things, value thoughtful details, and seek meaningful pauses from the everyday.<br />
            For the romantics, the unconventionals, the busy ones, and those who dare to explore something new, together.
          </p>
        </div>
      </div>
    </section>
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
          src="/images/couple-dancing.jpg"
          alt="Couple dancing"
          fill
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
          Curated for Two
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-7xl font-light mb-6 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Our <span className="italic text-[#800913]">Experiences</span>
        </h1>
        <p
          className={`text-white/70 text-lg md:text-xl max-w-2xl transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Each experience is a carefully crafted story, designed to create
          unforgettable moments between you and your partner.
        </p>
      </div>
    </section>
  )
}

function ExperienceCard({
  experience,
  index,
  isReversed,
  onJoinWaitlist,
}: {
  experience: any
  index: number
  isReversed: boolean
  onJoinWaitlist: (name: string) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center ${
        isReversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden ${
          isReversed ? "lg:order-2" : ""
        }`}
      >
        <Image
          src={experience.image || "/placeholder.svg"}
          alt={experience.title}
          fill
          className={`object-cover transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-105 opacity-0"
          } ${!experience.available ? "grayscale-[30%]" : ""}`}
        />
        <div className="absolute top-6 left-6 bg-[#800913] text-white text-xs tracking-[0.2em] uppercase px-4 py-2">
          Experience {String(index + 1).padStart(2, "0")}
        </div>
        {experience.status === 'almost_available' && (
          <div className="absolute top-6 right-6 bg-[#1E1E1E] text-white text-xs tracking-[0.2em] uppercase px-4 py-2">
            Coming Soon
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`px-6 lg:px-16 py-8 lg:py-16 bg-[#FBF5EF] ${
          isReversed ? "lg:order-1" : ""
        }`}
      >
        <p
          className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experience.subtitle}
        </p>
        <h2
          className={`text-[#1E1E1E] text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experience.title}
        </h2>
        <p
          className={`text-[#1E1E1E]/70 text-lg leading-relaxed mb-8 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experience.description}
        </p>

        {/* Details */}
        <div
          className={`flex flex-wrap gap-6 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 text-[#1E1E1E]/60">
            <Clock size={18} />
            <span className="text-sm">{experience.duration_hours} hours</span>
          </div>
          <div className="flex items-center gap-2 text-[#1E1E1E]/60">
            <Users size={18} />
            <span className="text-sm">{experience.guests}</span>
          </div>
          <div className="flex items-center gap-2 text-[#800913]">
            <Sparkles size={18} />
            <span className="text-sm">{experience.highlight}</span>
          </div>
        </div>

        {experience.status === 'available' ? (
          <Link
            href={`/experiences/${experience.id}`}
            className={`group inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Discover More
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        ) : (
          <button
            onClick={() => onJoinWaitlist(experience.title)}
            className={`group inline-flex items-center gap-3 bg-[#1E1E1E] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#333] transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Bell size={16} />
            Join the Waitlist
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        )}
      </div>
    </div>
  )
}

function ComingSoonSection({ comingSoonExperiences }: { comingSoonExperiences: Experience[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(true) // Start visible
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<string | undefined>()

  const openWaitlist = (name?: string) => {
    setSelectedExperience(name)
    setShowWaitlist(true)
  }

  // If no coming soon experiences, don't render the section
  if (comingSoonExperiences.length === 0) {
    return null
  }

  return (
    <>
      <section ref={sectionRef} className="py-16 lg:py-20 bg-[#FBF5EF]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Coming Soon
            </p>
            <h2
              className={`text-[#1E1E1E] text-3xl md:text-4xl lg:text-5xl font-light mb-4 transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              New Stories <span className="italic text-[#800913]">Await</span>
            </h2>
            <p
              className={`text-[#1E1E1E]/60 text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Be the first to experience our upcoming creations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comingSoonExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`group bg-white p-8 border border-[#1E1E1E]/5 hover:border-[#800913]/20 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-[#800913]/10 flex items-center justify-center mb-6">
                  <Bell size={20} className="text-[#800913]" />
                </div>
                <h3 className="text-[#1E1E1E] text-xl font-light mb-2">{exp.title}</h3>
                <p className="text-[#1E1E1E]/60 text-sm mb-6">{exp.subtitle}</p>
                <button
                  onClick={() => openWaitlist(exp.title)}
                  className="text-[#800913] text-sm tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Notify Me
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        experienceName={selectedExperience}
      />
    </>
  )
}

function ExclusiveAccessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className={`w-16 h-16 rounded-full bg-[#800913]/20 flex items-center justify-center mx-auto mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <Bell size={28} className="text-[#800913]" />
          </div>
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Exclusive Access
          </p>
          <h2
            className={`text-white text-3xl md:text-4xl lg:text-5xl font-light mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            New Experiences <span className="italic text-[#800913]">Coming Soon</span>
          </h2>
          <p
            className={`text-white/60 text-lg leading-relaxed mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Be among the first to discover new themed experiences,
            seasonal events, and privileges reserved for our inner circle.
          </p>
          <button
            onClick={() => setShowWaitlist(true)}
            className={`group inline-flex items-center gap-3 bg-white text-[#1E1E1E] px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Join the Waitlist
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </>
  )
}

export default function ExperiencesPage() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<string | undefined>()
  const [experiences, setExperiences] = useState<any[]>(fallbackExperiences)

  // Load experiences from Supabase
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const response = await fetch('/api/experiences')
        if (response.ok) {
          const data = await response.json()
          
          console.log("[v0] Raw experiences from API:", data.map((e: any) => ({ id: e.id, title: e.title, status: e.status, available: e.available })))
          
          // Map database fields to component interface
          const mappedExperiences: any[] = data.map((exp: any) => ({
            id: exp.id,
            title: exp.title,
            subtitle: exp.subtitle || '',
            image: exp.image || '/placeholder.jpg',
            description: exp.description || '',
            duration_hours: exp.duration_hours || 2,
            guests: exp.guests || '2 people',
            highlight: exp.highlight || '',
            available: exp.available ?? false,
            status: exp.status || (exp.available ? 'available' : 'coming_soon'),
          }))
          
          console.log("[v0] Mapped experiences:", mappedExperiences.map(e => ({ id: e.id, title: e.title, status: e.status })))
          
          const comingSoon = mappedExperiences.filter(exp => exp.status === 'coming_soon')
          console.log("[v0] Coming soon experiences:", comingSoon.length, comingSoon.map(e => e.title))
          
          if (mappedExperiences.length > 0) {
            setExperiences(mappedExperiences)
          }
        }
      } catch (error) {
        console.error("Error loading experiences:", error)
      }
    }
    
    loadExperiences()
  }, [])

  const handleJoinWaitlist = (name: string) => {
    setSelectedExperience(name)
    setShowWaitlist(true)
  }

  // Filter experiences by status for display
  // Available and Almost Available show in main list
  const displayExperiences = experiences.filter(
    exp => exp.status === 'available' || exp.status === 'almost_available'
  )
  // Coming Soon shows in the Coming Soon section
  const comingSoonExperiences = experiences.filter(exp => exp.status === 'coming_soon')
  // Unavailable experiences are not shown

  return (
    <main>
      <Navigation />
      <HeroSection />
      <HowItWorksSection />

      {/* Experiences List */}
      <section className="bg-[#FBF5EF]">
        {displayExperiences.map((experience, index) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            index={index}
            isReversed={index % 2 === 1}
            onJoinWaitlist={handleJoinWaitlist}
          />
        ))}
      </section>

      <ComingSoonSection comingSoonExperiences={comingSoonExperiences} />
      <ExclusiveAccessSection />

      {/* Need Help Section */}
      <section className="py-24 lg:py-32 bg-[#FBF5EF]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-[#800913] text-sm tracking-[0.3em] uppercase mb-4">
            Need Help Choosing?
          </p>
          <h2 className="text-[#1E1E1E] text-4xl md:text-5xl font-light mb-6">
            Our <span className="italic text-[#800913]">Experience Curator</span> is Here
          </h2>
          <p className="text-[#1E1E1E]/60 text-lg mb-10 max-w-2xl mx-auto">
            Not sure which experience is perfect? Our dedicated team will help you select
            the ideal moment for your loved one.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors duration-300"
          >
            Contact Us
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        experienceName={selectedExperience}
      />
    </main>
  )
}
