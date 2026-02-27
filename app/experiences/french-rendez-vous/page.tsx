"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ImageCarousel } from "@/components/image-carousel"
import { BookingModal } from "@/components/booking-modal"
import {
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Utensils,
  Wine,
  Music,
  Heart,
} from "lucide-react"

const carouselImages = [
  { src: "/images/hero-couple-dinner.jpg", alt: "Romantic dinner setting" },
  { src: "/images/couple-dancing.jpg", alt: "Couple dancing" },
  { src: "/images/letter-seal.jpg", alt: "Elegant invitation" },
  { src: "/images/surprise-hands.jpg", alt: "Surprise moment" },
]

const addOns = [
  {
    id: "champagne",
    name: "Premium Champagne Upgrade",
    description: "Upgrade to a bottle of Dom Pérignon or Veuve Clicquot La Grande Dame",
    price: 850,
  },
  {
    id: "flowers",
    name: "Fresh Flower Arrangement",
    description: "A stunning bouquet of 50 red roses delivered to your table",
    price: 350,
  },
  {
    id: "musician",
    name: "Private Musician",
    description: "A violinist or guitarist to serenade you during dinner",
    price: 600,
  },
  {
    id: "photographer",
    name: "Private Photographer",
    description: "Capture your evening with 30 minutes of professional photography",
    price: 750,
  },
  {
    id: "dessert",
    name: "Personalized Dessert",
    description: "Custom dessert with your message written in chocolate",
    price: 200,
  },
  {
    id: "transport",
    name: "Luxury Transportation",
    description: "Private chauffeur service to and from the venue",
    price: 500,
  },
]

const relatedGifts = [
  {
    id: "mystery-experience",
    title: "Mystery Experience",
    price: "From AED 1,500",
    image: "/images/surprise-hands.jpg",
    description:
      "Let us surprise your loved one with a hand-picked experience.",
  },
  {
    id: "gift-voucher",
    title: "Gift Voucher",
    price: "From AED 500",
    image: "/images/letter-seal.jpg",
    description: "Give the freedom to choose with our elegant gift vouchers.",
  },
]

const experienceDetails = [
  {
    icon: Clock,
    label: "Duration",
    value: "3-4 hours",
  },
  {
    icon: Users,
    label: "Guests",
    value: "2 people",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Private venue in Dubai",
  },
]

const included = [
  {
    icon: Utensils,
    title: "5-Course French Menu",
    description: "Prepared by our private chef using premium ingredients",
  },
  {
    icon: Wine,
    title: "Wine Pairing",
    description: "Curated selection of French wines by our sommelier",
  },
  {
    icon: Music,
    title: "Ambient Setting",
    description: "Candlelit atmosphere with romantic French music",
  },
  {
    icon: Heart,
    title: "Personal Touches",
    description: "Customized details based on your love story",
  },
]

function HeroSection({ onBookClick }: { onBookClick: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
          Experience 01
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-8xl font-light mb-4 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          French <span className="italic text-[#800913]">Rendez-vous</span>
        </h1>
        <p
          className={`text-white/80 text-xl md:text-2xl font-light mb-8 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          An Intimate Dinner Experience
        </p>

        <div
          className={`flex flex-wrap justify-center gap-6 mb-12 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {experienceDetails.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center gap-2 text-white/70"
            >
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
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <div className="text-white text-center sm:text-left">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Starting from
            </p>
            <p className="text-2xl font-light">AED 2,500</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/40 text-xs tracking-[0.2em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}

function DescriptionSection() {
  const sectionRef = useRef<HTMLElement>(null)
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <p
              className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              The Experience
            </p>
            <h2
              className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-8 transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              A Night in <span className="italic text-[#800913]">Paris</span>
            </h2>
            <div
              className={`space-y-6 text-[#1E1E1E]/70 text-lg leading-relaxed transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p>
                Transport yourselves to a candlelit Parisian evening without
                leaving Dubai. Our French Rendez-vous recreates the intimate
                ambiance of a hidden bistro in Le Marais, complete with the
                aromas, sounds, and tastes of France.
              </p>
              <p>
                Your private chef, trained in classical French cuisine, prepares
                a five-course menu tailored to your preferences. Each dish tells
                a story of French culinary tradition, from the delicate amuse-
                bouche to the decadent finale.
              </p>
              <p>
                The evening unfolds at your pace—there are no bills to rush for,
                no neighboring tables to compete with. Just you, your partner,
                and a night designed entirely around your love story.
              </p>
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative aspect-[4/5] transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <Image
              src="/images/hero-couple-dinner.jpg"
              alt="Romantic French dinner"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute -bottom-8 -left-8 bg-[#800913] text-white p-8 max-w-[280px]">
              <p className="text-3xl font-light mb-2">{"\""}Magnifique{"\""}</p>
              <p className="text-white/70 text-sm">
                Every detail transported us to Paris. The most romantic night of
                our lives.
              </p>
              <p className="text-white/50 text-xs mt-3">— Sarah & Michael</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function IncludedSection() {
  const sectionRef = useRef<HTMLElement>(null)
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {"What's Included"}
          </p>
          <h2
            className={`text-white text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Every Detail, <span className="italic text-[#800913]">Curated</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {included.map((item, index) => (
            <div
              key={item.title}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[#800913] rounded-full flex items-center justify-center">
                <item.icon className="text-[#800913]" size={28} />
              </div>
              <h3 className="text-white text-xl font-light mb-3">
                {item.title}
              </h3>
              <p className="text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Gallery
          </p>
          <h2
            className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Moments of <span className="italic text-[#800913]">Magic</span>
          </h2>
        </div>

        {/* Masonry-style gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            className={`relative aspect-[3/4] overflow-hidden transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/hero-couple-dinner.jpg"
              alt="Romantic dinner"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div
            className={`relative aspect-square overflow-hidden transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/couple-dancing.jpg"
              alt="Couple dancing"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div
            className={`relative aspect-[3/4] row-span-2 overflow-hidden transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/surprise-hands.jpg"
              alt="Surprise moment"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div
            className={`relative aspect-square overflow-hidden transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/letter-seal.jpg"
              alt="Elegant details"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div
            className={`relative aspect-[4/3] overflow-hidden transition-all duration-700 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Image
              src="/images/gift-door.jpg"
              alt="Luxury presentation"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedGiftsSection() {
  const sectionRef = useRef<HTMLElement>(null)
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Gift This Experience
          </p>
          <h2
            className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Perfect for <span className="italic text-[#800913]">Giving</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {relatedGifts.map((gift, index) => (
            <Link
              key={gift.id}
              href="/gifts"
              className={`group bg-[#FBF5EF] transition-all duration-700 hover:shadow-xl ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={gift.image || "/placeholder.svg"}
                  alt={gift.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#800913] text-white text-xs tracking-[0.15em] uppercase px-3 py-1.5">
                  {gift.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[#1E1E1E] text-xl font-light mb-2 group-hover:text-[#800913] transition-colors">
                  {gift.title}
                </h3>
                <p className="text-[#1E1E1E]/60 text-sm">{gift.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Link
            href="/gifts"
            className="group inline-flex items-center gap-3 border border-[#1E1E1E] text-[#1E1E1E] px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#1E1E1E] hover:text-white transition-all"
          >
            View All Gifts
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CTASection({ onBookClick }: { onBookClick: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-48 overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/couple-dancing.jpg"
          alt="Couple dancing"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p
          className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Begin Your Story
        </p>
        <h2
          className={`text-white text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Ready for Your{" "}
          <span className="italic text-[#800913]">French Rendez-vous</span>?
        </h2>
        <p
          className={`text-white/70 text-lg md:text-xl leading-relaxed mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Let us craft an evening you will remember forever. Book now and step
          into a night of Parisian romance.
        </p>
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={onBookClick}
            className="group inline-flex items-center gap-3 bg-[#800913] text-white px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all"
          >
            Book This Experience
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <span className="text-white/50">or</span>
          <Link
            href="/contact"
            className="text-white border-b border-white/30 hover:border-white transition-colors"
          >
            Contact us for custom requests
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function FrenchRendezVousPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <main>
      <Navigation />
      <HeroSection onBookClick={() => setIsBookingOpen(true)} />
      <DescriptionSection />
      <IncludedSection />
      <GallerySection />
      <RelatedGiftsSection />
      <CTASection onBookClick={() => setIsBookingOpen(true)} />
      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        experienceTitle="French Rendez-vous"
        experiencePrice={2500}
        addOns={addOns}
      />
    </main>
  )
}
