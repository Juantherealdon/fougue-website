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
  Palette,
  Frame,
  Sparkles,
  Heart,
} from "lucide-react"

const carouselImages = [
  { src: "/images/experience-paint.jpg", alt: "Painting together" },
  { src: "/images/couple-dancing.jpg", alt: "Creative connection" },
  { src: "/images/surprise-hands.jpg", alt: "Artistic moment" },
  { src: "/images/letter-seal.jpg", alt: "Beautiful details" },
]

const addOns = [
  {
    id: "champagne",
    name: "Champagne & Strawberries",
    description: "Moët & Chandon with chocolate-dipped strawberries",
    price: 350,
  },
  {
    id: "framing",
    name: "Premium Framing",
    description: "Professional framing of your artwork with museum-quality glass",
    price: 450,
  },
  {
    id: "extra-canvas",
    name: "Extra Canvas",
    description: "Create two separate artworks to take home",
    price: 200,
  },
  {
    id: "photographer",
    name: "Photography Session",
    description: "Capture the creative process with 30 minutes of photography",
    price: 650,
  },
  {
    id: "aprons",
    name: "Keepsake Aprons",
    description: "Keep your paint-splattered aprons as a memory",
    price: 150,
  },
]

const relatedGifts = [
  {
    id: "mystery-experience",
    title: "Mystery Experience",
    price: "From AED 1,500",
    image: "/images/surprise-hands.jpg",
    description: "Let us surprise your loved one with a hand-picked experience.",
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
  { icon: Clock, label: "Duration", value: "2-3 hours" },
  { icon: Users, label: "Guests", value: "2 people" },
  { icon: MapPin, label: "Location", value: "Private art studio" },
]

const included = [
  {
    icon: Palette,
    title: "All Materials",
    description: "Premium paints, brushes, canvases, and everything you need",
  },
  {
    icon: Sparkles,
    title: "Artist Guidance",
    description: "Professional artist to guide your creative journey",
  },
  {
    icon: Frame,
    title: "Your Masterpiece",
    description: "Take home your artwork as a lasting memory",
  },
  {
    icon: Heart,
    title: "Creative Connection",
    description: "An experience designed to spark joy and bonding",
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
          Experience 04
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-8xl font-light mb-4 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Love is <span className="italic text-[#800913]">Art</span>
        </h1>
        <p
          className={`text-white/80 text-xl md:text-2xl font-light mb-8 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Creative Connection
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
            <p className="text-2xl font-light">AED 1,600</p>
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

function DescriptionSection() {
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

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              The Experience
            </p>
            <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-8 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              Create <span className="italic text-[#800913]">Together</span>
            </h2>
            <div className={`space-y-6 text-[#1E1E1E]/70 text-lg leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p>
                They say that to truly know someone, you must create something together. Love is Art invites you to step into a private studio where paint, canvas, and imagination await—and where the only rule is to enjoy the process.
              </p>
              <p>
                No experience necessary. A professional artist guides you through the journey, helping you discover your creative voice while encouraging play, laughter, and connection. Whether you{"'"}re painting side by side or collaborating on a single canvas, the experience is about expression, not perfection.
              </p>
              <p>
                At the end of the session, you{"'"}ll have a unique piece of art—a tangible memory of your time together that you can hang on your wall and remember forever. The paint may dry, but the connection you{"'"}ve built will last a lifetime.
              </p>
            </div>
          </div>

          <div className={`relative aspect-[4/5] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <Image src="/images/experience-paint.jpg" alt="Painting experience" fill className="object-cover" />
            <div className="absolute -bottom-8 -left-8 bg-[#800913] text-white p-8 max-w-[280px]">
              <p className="text-3xl font-light mb-2">{"\""}Liberating{"\""}</p>
              <p className="text-white/70 text-sm">We laughed, we made a mess, and we created something beautiful. Best date ever.</p>
              <p className="text-white/50 text-xs mt-3">— Lisa & Mark</p>
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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {"What's Included"}
          </p>
          <h2 className={`text-white text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Everything to <span className="italic text-[#800913]">Create</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {included.map((item, index) => (
            <div
              key={item.title}
              className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[#800913] rounded-full flex items-center justify-center">
                <item.icon className="text-[#800913]" size={28} />
              </div>
              <h3 className="text-white text-xl font-light mb-3">{item.title}</h3>
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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Gallery
          </p>
          <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Art in <span className="italic text-[#800913]">Action</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: "/images/experience-paint.jpg", aspect: "aspect-[3/4]" },
            { src: "/images/couple-dancing.jpg", aspect: "aspect-square" },
            { src: "/images/surprise-hands.jpg", aspect: "aspect-[3/4] row-span-2" },
            { src: "/images/letter-seal.jpg", aspect: "aspect-square" },
            { src: "/images/hero-couple-dinner.jpg", aspect: "aspect-[4/3]" },
          ].map((img, index) => (
            <div
              key={index}
              className={`relative ${img.aspect} overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Image src={img.src || "/placeholder.svg"} alt="Gallery image" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Gift This Experience
          </p>
          <h2 className={`text-[#1E1E1E] text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Gift of <span className="italic text-[#800913]">Creativity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {relatedGifts.map((gift, index) => (
            <Link
              key={gift.id}
              href="/gifts"
              className={`group bg-[#FBF5EF] transition-all duration-700 hover:shadow-xl ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={gift.image || "/placeholder.svg"} alt={gift.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-[#800913] text-white text-xs tracking-[0.15em] uppercase px-3 py-1.5">{gift.price}</div>
              </div>
              <div className="p-6">
                <h3 className="text-[#1E1E1E] text-xl font-light mb-2 group-hover:text-[#800913] transition-colors">{gift.title}</h3>
                <p className="text-[#1E1E1E]/60 text-sm">{gift.description}</p>
              </div>
            </Link>
          ))}
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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/experience-paint.jpg" alt="Art studio" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Unleash Your Creativity
        </p>
        <h2 className={`text-white text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Ready to Create <span className="italic text-[#800913]">Together</span>?
        </h2>
        <p className={`text-white/70 text-lg md:text-xl leading-relaxed mb-10 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Book your Love is Art experience and take home a masterpiece.
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

export default function LoveIsArtPage() {
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
        experienceTitle="Love is Art"
        experiencePrice={1600}
        addOns={addOns}
      />
    </main>
  )
}
