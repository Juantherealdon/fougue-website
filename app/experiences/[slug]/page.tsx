"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ImageCarousel } from "@/components/image-carousel"
import { BookingModal } from "@/components/booking-modal"
import {
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Wine,
  Sun,
  Music,
  Camera,
  Palette,
  Sparkles,
  Utensils,
  Gift,
  Radio,
  Coffee,
  Loader2,
  Star,
  Heart,
} from "lucide-react"

interface IncludedItem {
  title: string
  description?: string
  icon?: string
}

interface Addon {
  id: string
  name: string
  description: string
  price: number
  available: boolean
}

interface Experience {
  id: string
  title: string
  subtitle: string
  description: string
  long_description?: string
  duration_hours: number
  guests: string
  highlight: string
  price: number
  currency: string
  image: string
  images?: string[]
  location?: string
  available: boolean
  ranking: number
  included_items?: IncludedItem[]
  addons?: Addon[]
}

const defaultIcons = [Sun, Utensils, Wine, Radio, Palette, Camera, Sparkles, Music, Gift]

// Icon mapping for included items
const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  utensils: Utensils,
  wine: Wine,
  music: Music,
  guitar: Music,
  camera: Camera,
  video: Camera,
  flower: Sparkles,
  cake: Coffee,
  gift: Gift,
  car: MapPin,
  plane: MapPin,
  boat: MapPin,
  helicopter: MapPin,
  tent: MapPin,
  bed: MapPin,
  spa: Sparkles,
  dumbbell: Sparkles,
  palette: Palette,
  shirt: Sparkles,
  crown: Sparkles,
  star: Star,
  heart: Heart,
  sun: Sun,
  moon: Clock,
  chef: Utensils,
  cocktail: Wine,
  candle: Sparkles,
  map: MapPin,
  clock: Clock,
}

function HeroSection({ 
  experience, 
  onBookClick 
}: { 
  experience: Experience
  onBookClick: () => void 
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const carouselImages = experience.images && experience.images.length > 0
    ? experience.images.map((src, i) => ({ src, alt: `${experience.title} ${i + 1}` }))
    : [{ src: experience.image || "/images/experience-picnic.jpg", alt: experience.title }]

  const experienceDetails = [
    { icon: Clock, label: "Duration", value: `${experience.duration_hours} hours` },
    { icon: Users, label: "Guests", value: experience.guests },
    ...(experience.location ? [{ icon: MapPin, label: "Location", value: experience.location }] : []),
  ]

  // Split title for styling - last word in accent color
  const titleWords = experience.title.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords.slice(-1)[0]

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <ImageCarousel images={carouselImages} autoPlay interval={6000} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <Link
          href="/experiences"
          className={`text-white/60 text-sm tracking-[0.3em] uppercase mb-6 hover:text-white transition-colors flex items-center gap-2 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-all duration-700`}
        >
          <span>{"<"}</span> Back to Experiences
        </Link>
        <p
          className={`text-[#800913] text-sm tracking-[0.4em] uppercase mb-4 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Experience
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-8xl font-light mb-4 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {titleMain}{' '}
          <span className="italic text-[#800913]">{titleAccent}</span>
        </h1>
        <p
          className={`text-white/80 text-xl md:text-2xl font-light mb-8 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experience.subtitle}
        </p>

        <div
          className={`flex flex-wrap justify-center gap-6 mb-12 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experienceDetails.map((detail) => (
            <div key={detail.label} className="flex items-center gap-2 text-white/70">
              <detail.icon size={18} className="text-[#800913]" />
              <span className="text-sm">{detail.value}</span>
            </div>
          ))}
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={onBookClick}
            className="group inline-flex items-center gap-3 bg-[#800913] text-white px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all"
          >
            Book This Experience
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="text-white text-center sm:text-left">
            <p className="text-white/60 text-xs uppercase tracking-wider">Starting from</p>
            <p className="text-2xl font-light">{experience.currency} {experience.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}

function DescriptionSection({ experience }: { experience: Experience }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const mainImage = experience.image || "/images/experience-picnic.jpg"

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              The Experience
            </p>
            <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-8 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {experience.title}
            </h2>
  <div className={`space-y-6 text-[#1E1E1E]/70 text-lg leading-relaxed text-justify transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
  {experience.long_description ? (
    <div
      className="whitespace-pre-line [&_strong]:font-semibold [&_strong]:text-[#1E1E1E]"
      dangerouslySetInnerHTML={{
        __html: experience.long_description
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      }}
    />
  ) : (
    <p>{experience.description}</p>
  )}
  </div>
          </div>

          <div className={`relative aspect-[4/5] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <Image src={mainImage || "/placeholder.svg"} alt={experience.title} fill className="object-cover" />
            {experience.highlight && (
              <div className="absolute -bottom-8 -left-8 bg-[#800913] text-white p-8 max-w-[280px]">
                <p className="text-xl font-light mb-2">{experience.highlight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function IncludedSection({ experience }: { experience: Experience }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!experience.included_items || experience.included_items.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-white/60 text-sm tracking-[0.4em] uppercase mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {"What's Included"}
          </p>
          <h2 className={`text-white text-3xl md:text-4xl lg:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Everything for <span className="italic text-[#800913]">Your Perfect Day</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experience.included_items.map((item, index) => {
            const IconComponent = iconMap[item.icon || ''] || defaultIcons[index % defaultIcons.length]
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${200 + index * 80}ms` }}
              >
                <div className="w-12 h-12 border border-[#800913] rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="text-[#800913]" size={20} />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function GallerySection({ experience }: { experience: Experience }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!experience.images || experience.images.length < 2) {
    return null
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Gallery
          </p>
          <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Captures of <span className="italic text-[#800913]">Bliss</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {experience.images.slice(0, 9).map((img, index) => (
            <div
              key={index}
              className={`relative aspect-[3/4] overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Image src={img || "/placeholder.svg"} alt={`${experience.title} gallery ${index + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AddOnsSection({ experience }: { experience: Experience }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const availableAddons = experience.addons?.filter(a => a.available) || []
  
  if (availableAddons.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Enhance Your Experience
          </p>
          <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Optional <span className="italic text-[#800913]">Add-Ons</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {availableAddons.map((addon, index) => (
            <div
              key={addon.id || `addon-${index}`}
              className={`bg-[#FBF5EF] p-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <h3 className="text-[#1E1E1E] text-lg font-medium mb-2">{addon.name}</h3>
              <p className="text-[#1E1E1E]/60 text-sm mb-4">{addon.description}</p>
              <p className="text-[#800913] font-medium">+{experience.currency || 'AED'} {addon.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ experience, onBookClick }: { experience: Experience; onBookClick: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const bgImage = experience.image || "/images/experience-picnic.jpg"

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={bgImage || "/placeholder.svg"} alt={experience.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Your Experience Awaits
        </p>
        <h2 className={`text-white text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Ready for Your <span className="italic text-[#800913]">Perfect Moment</span>?
        </h2>
        <p className={`text-white/70 text-lg md:text-xl leading-relaxed mb-10 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Book now and let us create an unforgettable escape for you.
        </p>
        <button
          onClick={onBookClick}
          className={`group inline-flex items-center gap-3 bg-[#800913] text-white px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Book This Experience
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#800913] mx-auto mb-4" />
          <p className="text-[#1E1E1E]/60">Loading experience...</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}

function NotFoundState() {
  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />
      <div className="pt-24 pb-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl font-serif text-[#1E1E1E] mb-4">
            Experience introuvable
          </h1>
          <p className="text-[#1E1E1E]/60 mb-8">
            Cette experience n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 bg-[#800913] text-white px-6 py-3 text-sm tracking-wider uppercase hover:bg-[#600910] transition-colors"
          >
            Voir toutes les experiences
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default function ExperienceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [experience, setExperience] = useState<Experience | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const response = await fetch(`/api/experiences?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setExperience(data[0])
          }
        }
      } catch (error) {
        console.error("Error loading experience:", error)
      }
      setIsLoading(false)
    }

    if (slug) {
      loadExperience()
    }
  }, [slug])

  if (isLoading) {
    return <LoadingState />
  }

  if (!experience) {
    return <NotFoundState />
  }

  return (
    <main>
      <Navigation />
      <HeroSection experience={experience} onBookClick={() => setIsBookingOpen(true)} />
      <DescriptionSection experience={experience} />
      <IncludedSection experience={experience} />
      <GallerySection experience={experience} />
      <AddOnsSection experience={experience} />

      <CTASection experience={experience} onBookClick={() => setIsBookingOpen(true)} />
      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        experienceId={experience.id}
        experienceTitle={experience.title}
        experiencePrice={experience.price}
        addOns={experience.addons?.filter(a => a.available).map((addon, index) => ({
          id: addon.id || `addon-${index}`,
          name: addon.name,
          description: addon.description,
          price: addon.price,
        })) || []}
      />
    </main>
  )
}
