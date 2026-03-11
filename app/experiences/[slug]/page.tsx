"use client"

// Dynamic experience detail page
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ImageCarousel } from "@/components/image-carousel"
import { BookingModal } from "@/components/booking-modal"
import { useInView } from "@/hooks/use-in-view"
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
  Plus,
  Minus
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

function SplitHeroDescription({
  experience,
  onBookClick
}: {
  experience: Experience
  onBookClick: () => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealedElements, setRevealedElements] = useState<Set<number>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-reveal-index') || '0')
            setRevealedElements(prev => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const revealElements = sectionRef.current?.querySelectorAll('[data-reveal-index]')
    revealElements?.forEach(el => observer.observe(el))

    // Trigger initial reveals after mount
    setTimeout(() => {
      setRevealedElements(new Set([0, 1, 2, 3, 4, 5, 6, 7]))
    }, 100)

    return () => observer.disconnect()
  }, [])

  const heroImage = experience.image || "/images/experience-picnic.jpg"

  // Split title for styling - last word in accent color
  const titleWords = experience.title.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords.slice(-1)[0]

  const isRevealed = (index: number) => revealedElements.has(index)

  return (
    <section ref={sectionRef} className="flex flex-col md:flex-row w-full relative border-b border-[#1E1E1E]/10">
      {/* Left - Sticky Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen md:sticky top-0 relative overflow-hidden bg-[#111111]">
        <Image
          src={heroImage}
          alt={experience.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-90 hover:scale-105 transition-transform duration-[3s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <span className="px-3 py-1.5 border border-white/30 text-white text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm">
            Signature Experience
          </span>
        </div>
      </div>

      {/* Right - Scrolling Content */}
      <div className="w-full md:w-1/2 bg-[#FBF5EF] relative z-10 text-[#1E1E1E]">
        {/* First viewport - info up to CTA - uses 100dvh for mobile browser compatibility */}
        <div className="min-h-[100dvh] px-6 pt-10 pb-0 md:px-12 md:pt-12 md:pb-0 lg:px-16 lg:pt-14 lg:pb-0 flex flex-col justify-center relative">
          {/* Back link - positioned absolutely so it doesn't affect vertical centering */}
          <Link
            href="/experiences"
            className="absolute top-10 left-6 md:top-12 md:left-12 lg:top-14 lg:left-16 text-[#1E1E1E]/40 text-xs tracking-[0.2em] uppercase hover:text-[#800913] transition-colors"
          >
            ← Back to experiences
          </Link>

          {/* Main content block - centered vertically */}
          <div className="mt-16">
            <p
              data-reveal-index="0"
              className={`text-[#800913] text-sm font-medium tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isRevealed(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              {experience.subtitle}
            </p>

            <h1
              data-reveal-index="1"
              className={`text-4xl md:text-5xl font-light leading-tight mb-6 transition-all duration-700 delay-100 ${isRevealed(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              {titleMain}{' '}
              <span className="italic text-[#800913]">{titleAccent}</span>
            </h1>

            <p
              data-reveal-index="2"
              className={`text-xl italic text-[#1E1E1E]/50 mb-8 transition-all duration-700 delay-200 ${isRevealed(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              Starting from {experience.currency} {experience.price.toLocaleString('en-US')}
            </p>

            <div
              data-reveal-index="3"
              className={`w-full h-px bg-[#1E1E1E]/10 mb-8 transition-all duration-700 delay-300 ${isRevealed(3) ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Metadata */}
            <div
              data-reveal-index="4"
              className={`flex flex-wrap gap-8 md:gap-12 transition-all duration-700 delay-400 ${isRevealed(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1E1E1E]/40 mb-1">Duration</p>
                <p className="text-lg font-light">{experience.duration_hours} hours</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1E1E1E]/40 mb-1">Guests</p>
                <p className="text-lg font-light">{experience.guests}</p>
              </div>
              {experience.location && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#1E1E1E]/40 mb-1">Location</p>
                  <p className="text-lg font-light">{experience.location}</p>
                </div>
              )}
            </div>

            {/* CTA Button - fixed spacing from metadata, mb-8 for bottom breathing room */}
            <button
              data-reveal-index="5"
              onClick={onBookClick}
              className={`inline-flex items-center justify-center gap-2 w-full px-10 py-4 bg-[#800913] text-white text-xs tracking-[0.2em] uppercase hover:bg-[#1E1E1E] transition-colors duration-500 mt-16 mb-8 ${isRevealed(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              Book This Experience
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Description - below the fold */}
        <div className="px-6 pt-0 pb-8 md:px-12 md:pb-10 lg:px-16">
          <div
            data-reveal-index="6"
            className={`text-[#1E1E1E]/70 text-base leading-relaxed space-y-6 [&_strong]:font-medium [&_strong]:text-xl [&_strong]:text-[#1E1E1E] [&_strong]:block [&_strong]:mb-2 [&_strong]:mt-6 transition-all duration-700 delay-500 ${isRevealed(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            {experience.long_description ? (
              <div
                className="whitespace-pre-line"
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
          <p className={`text-[#800913] text-sm font-medium tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
              <Image src={img || "/placeholder.svg"} alt={`${experience.title} gallery ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
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
          <p className={`text-[#800913] text-sm font-medium tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
        <Image src={bgImage || "/placeholder.svg"} alt={experience.title} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className={`text-[#800913] text-sm font-medium tracking-[0.3em] uppercase mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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

// ---- LA SECTION FAQ HARDCODÉE POUR PARISIAN INTERLUDE ----
function ParisianFAQSection() {
  const { ref: sectionRef, isVisible } = useInView(0.2)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Is the experience private?",
      answer: (
        <div className="space-y-4">
          <p>Yes. Each Parisian Interlude is designed for one couple at a time to preserve intimacy and create a truly personal moment.</p>
          <p>For special occasions, the experience can be extended to accommodate up to four guests upon request.</p>
        </div>
      )
    },
    {
      question: "Where does the experience take place?",
      answer: (
        <div className="space-y-4">
          <p>The Parisian Interlude is hosted in a beautiful outdoor setting in Dubai, carefully selected for its calm and romantic atmosphere.</p>
          <p>For couples seeking additional privacy, the experience can also be arranged in a private garden or exclusive location upon request.</p>
        </div>
      )
    },
    {
      question: "How long does the experience last?",
      answer: (
        <div className="space-y-4">
          <p>The experience lasts approximately three hours.</p>
          <p>This duration is intentionally designed to allow couples to slow down, enjoy the setting, and fully immerse themselves in the moment without feeling rushed. Guests are, of course, free to leave earlier if they wish.</p>
        </div>
      )
    },
    {
      question: "Can the experience be personalised?",
      answer: (
        <div className="space-y-4">
          <p>Yes. While each Fougue experience is thoughtfully designed, we are happy to incorporate small personal touches to make the moment even more meaningful.</p>
          <p>After booking, our team will reach out to learn a few details about you as a couple - such as a special message, music preferences, meaningful memories, or dietary preferences — so we can prepare the experience accordingly.</p>
          <p>Optional enhancements such as professional photography, celebration cakes, or concierge coordination for special surprises can also be added.</p>
        </div>
      )
    },
    {
      question: "What is the cancellation or rescheduling policy?",
      answer: (
        <div className="space-y-4">
          <p>As each Fougue experience is carefully prepared in advance, we kindly ask for notice if your plans change.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Free cancellation up to 7 days before the experience (full refund).</li>
            <li>Cancellations made within 7 days are non-refundable due to preparation and supplier commitments.</li>
            <li>However, we are happy to reschedule your experience with at least 72 hours’ notice, subject to availability. Rescheduling is limited to one date change per booking.</li>
          </ul>
          <p>In case of unfavourable weather or unforeseen circumstances, we will always propose an alternative date.</p>
        </div>
      )
    },
    {
      question: "Can this experience be gifted?",
      answer: (
        <div className="space-y-4">
          <p>Yes. The Parisian Interlude can be offered as a gift voucher — a thoughtful way to surprise someone special with a beautifully curated romantic experience. The voucher remains valid for 12 months from the date of purchase.</p>
        </div>
      )
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-3xl px-6">

        {/* Titres avec la typo et les couleurs EXACTES des autres sections */}
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm font-medium tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Parisian Interlude
          </p>
          <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Frequently Asked <span className="italic text-[#800913]">Questions</span>
          </h2>
        </div>

        <div className={`flex flex-col border-t border-[#1E1E1E]/10 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="border-b border-[#1E1E1E]/10">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-8 flex items-center justify-between text-left group focus:outline-none"
                >
                  <h3 className={`font-serif text-xl md:text-2xl pr-8 transition-colors duration-300 ${isOpen ? "text-[#800913] italic" : "text-[#1E1E1E] group-hover:text-[#800913]"}`}>
                    {faq.question}
                  </h3>
                  <span className="text-[#1E1E1E]/40 group-hover:text-[#800913] transition-colors duration-300 flex-shrink-0">
                    {isOpen ? <Minus strokeWidth={1} size={24} /> : <Plus strokeWidth={1} size={24} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0 pb-0"}`}>
                  <div className="overflow-hidden">
                    <div className="font-sans text-[#1E1E1E]/70 text-base leading-relaxed pr-2 md:pr-12 space-y-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
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
      <Navigation solidNav />
      <SplitHeroDescription experience={experience} onBookClick={() => setIsBookingOpen(true)} />
      <IncludedSection experience={experience} />
      <GallerySection experience={experience} />
      <AddOnsSection experience={experience} />
      {/* 2. TA NOUVELLE SECTION FAQ JUSTE ICI */}
      {(slug === "parisian-interlude" || experience.title.toLowerCase().includes("parisian")) && (
        <ParisianFAQSection />
      )}

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
